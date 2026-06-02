"use client";
import { useState, useEffect, useCallback } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {
  BarChart3,
  Users,
  Building2,
  MessageSquare,
  Settings,
  FileText,
  Plus,
  Edit,
  Trash2,
  LogOut,
  Menu,
  X,
  Home,
  Mail,
  Phone,
  Calendar,
  Eye,
  ChevronDown,
  Save,
  AlertCircle,
  CheckCircle,
  Clock,
  Search,
  Image,
  Tag,
  DollarSign,
  MapPin,
} from "lucide-react";

/* ─── tiny helpers ─── */
const API = (path, opts) => fetch(path, opts).then((r) => r.json());
const parseArr = (v) => {
  if (Array.isArray(v)) return v;
  if (typeof v === "string") {
    try {
      return JSON.parse(v);
    } catch {
      return v.split("\n").filter(Boolean);
    }
  }
  return [];
};

/* ─── Modal wrapper ─── */
function Modal({ title, onClose, children }) {
  useEffect(() => {
    const esc = (e) => e.key === "Escape" && onClose();
    window.addEventListener("keydown", esc);
    return () => window.removeEventListener("keydown", esc);
  }, [onClose]);
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-2xl max-h-[90vh] flex flex-col">
        <div className="flex items-center justify-between px-6 py-4 border-b border-gray-200 flex-shrink-0">
          <h3 className="text-lg font-bold text-gray-900">{title}</h3>
          <button
            onClick={onClose}
            className="p-2 rounded-lg hover:bg-gray-100 transition-colors"
          >
            <X size={20} className="text-gray-500" />
          </button>
        </div>
        <div className="overflow-y-auto flex-1 px-6 py-4">{children}</div>
      </div>
    </div>
  );
}

/* ─── Confirm dialog ─── */
function Confirm({ message, onConfirm, onCancel }) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-sm p-6">
        <div className="flex items-center space-x-3 mb-4">
          <div className="w-10 h-10 bg-red-100 rounded-full flex items-center justify-center">
            <AlertCircle size={20} className="text-red-600" />
          </div>
          <h3 className="text-lg font-bold text-gray-900">Confirm Delete</h3>
        </div>
        <p className="text-gray-600 mb-6">{message}</p>
        <div className="flex space-x-3">
          <button
            onClick={onCancel}
            className="flex-1 px-4 py-2 border border-gray-300 rounded-xl text-gray-700 hover:bg-gray-50 transition-colors font-medium"
          >
            Cancel
          </button>
          <button
            onClick={onConfirm}
            className="flex-1 px-4 py-2 bg-red-600 text-white rounded-xl hover:bg-red-700 transition-colors font-medium"
          >
            Delete
          </button>
        </div>
      </div>
    </div>
  );
}

/* ─── Reusable form field components ─── */
function Field({ label, children, required }) {
  return (
    <div>
      <label className="block text-sm font-medium text-gray-700 mb-1">
        {label}
        {required && <span className="text-red-500 ml-1">*</span>}
      </label>
      {children}
    </div>
  );
}
const inputCls =
  "w-full border border-gray-300 rounded-xl px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors";
const textareaCls = `${inputCls} resize-none`;

function ArrayField({ label, value, onChange, placeholder }) {
  const arr = parseArr(value);
  return (
    <Field label={label}>
      <textarea
        className={textareaCls}
        rows={4}
        placeholder={placeholder || "One item per line"}
        value={arr.join("\n")}
        onChange={(e) => onChange(e.target.value.split("\n"))}
      />
      <p className="text-xs text-gray-400 mt-1">Enter one item per line</p>
    </Field>
  );
}

/* ─── STATUS BADGE ─── */
function StatusBadge({ status }) {
  const map = {
    new: "bg-red-100 text-red-700",
    contacted: "bg-yellow-100 text-yellow-700",
    responded: "bg-blue-100 text-blue-700",
    closed: "bg-green-100 text-green-700",
    completed: "bg-green-100 text-green-700",
    in_progress: "bg-blue-100 text-blue-700",
    planned: "bg-gray-100 text-gray-700",
  };
  return (
    <span
      className={`px-2 py-1 rounded-full text-xs font-semibold ${map[status] || "bg-gray-100 text-gray-700"}`}
    >
      {status?.replace("_", " ")}
    </span>
  );
}

/* ═══════════════════════════════
   SERVICES MANAGEMENT
══════════════════════════════════ */
function ServicesTab({ data, queryClient }) {
  const [modal, setModal] = useState(null); // null | { type:"add"|"edit", item? }
  const [form, setForm] = useState({});
  const [confirm, setConfirm] = useState(null);
  const [search, setSearch] = useState("");
  const [toast, setToast] = useState(null);

  const showToast = (msg, type = "success") => {
    setToast({ msg, type });
    setTimeout(() => setToast(null), 3000);
  };

  const openAdd = () => {
    setForm({
      title: "",
      short_description: "",
      description: "",
      category: "construction",
      image_url: "",
      price_range: "",
      duration: "",
      process: [],
      benefits: [],
      features: [],
    });
    setModal({ type: "add" });
  };
  const openEdit = (item) => {
    setForm({
      ...item,
      process: parseArr(item.process),
      benefits: parseArr(item.benefits),
      features: parseArr(item.features),
    });
    setModal({ type: "edit", item });
  };

  const saveMutation = useMutation({
    mutationFn: async () => {
      const body = {
        ...form,
        process: parseArr(form.process),
        benefits: parseArr(form.benefits),
        features: parseArr(form.features),
      };
      if (modal.type === "edit") {
        return API(`/api/services/${modal.item.id}`, {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(body),
        });
      }
      return API("/api/services", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      });
    },
    onSuccess: (res) => {
      if (!res.success) {
        showToast(res.error || "Failed", "error");
        return;
      }
      queryClient.invalidateQueries(["admin-data"]);
      setModal(null);
      showToast(modal.type === "edit" ? "Service updated!" : "Service added!");
    },
    onError: () => showToast("Something went wrong", "error"),
  });

  const deleteMutation = useMutation({
    mutationFn: (id) => API(`/api/services/${id}`, { method: "DELETE" }),
    onSuccess: (res) => {
      if (!res.success) {
        showToast(res.error || "Failed", "error");
        return;
      }
      queryClient.invalidateQueries(["admin-data"]);
      setConfirm(null);
      showToast("Service deleted!");
    },
  });

  const filtered = (data || []).filter((s) =>
    s.title?.toLowerCase().includes(search.toLowerCase()),
  );

  return (
    <div className="space-y-4">
      {toast && (
        <div
          className={`fixed top-4 right-4 z-50 px-4 py-3 rounded-xl shadow-lg text-white text-sm font-medium flex items-center space-x-2 ${toast.type === "error" ? "bg-red-500" : "bg-green-500"}`}
        >
          {toast.type === "error" ? (
            <AlertCircle size={16} />
          ) : (
            <CheckCircle size={16} />
          )}
          <span>{toast.msg}</span>
        </div>
      )}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
        <div className="relative flex-1 max-w-xs">
          <Search
            size={16}
            className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
          />
          <input
            className="pl-9 pr-4 py-2 border border-gray-300 rounded-xl text-sm w-full focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="Search services…"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
        <button
          onClick={openAdd}
          className="flex items-center space-x-2 bg-blue-600 text-white px-4 py-2 rounded-xl hover:bg-blue-700 transition-colors text-sm font-medium"
        >
          <Plus size={16} />
          <span>Add Service</span>
        </button>
      </div>

      <div className="grid gap-4">
        {filtered.length === 0 && (
          <div className="text-center py-12 text-gray-400">
            No services found.
          </div>
        )}
        {filtered.map((svc) => (
          <div
            key={svc.id}
            className="bg-white border border-gray-100 rounded-2xl p-4 flex items-center gap-4 shadow-sm hover:shadow-md transition-shadow"
          >
            <img
              src={svc.image_url || "https://placehold.co/80x80?text=No+Image"}
              alt={svc.title}
              className="w-16 h-16 rounded-xl object-cover flex-shrink-0"
              onError={(e) => {
                e.target.src = "https://placehold.co/80x80?text=No+Image";
              }}
            />
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2 flex-wrap">
                <h4 className="font-semibold text-gray-900 truncate">
                  {svc.title}
                </h4>
                <span className="px-2 py-0.5 bg-blue-50 text-blue-700 rounded-full text-xs capitalize">
                  {svc.category}
                </span>
              </div>
              <p className="text-sm text-gray-500 truncate mt-0.5">
                {svc.short_description}
              </p>
              <div className="flex items-center gap-3 mt-1 text-xs text-gray-400">
                {svc.price_range && (
                  <span className="flex items-center gap-1">
                    <DollarSign size={11} />
                    {svc.price_range}
                  </span>
                )}
                {svc.duration && (
                  <span className="flex items-center gap-1">
                    <Clock size={11} />
                    {svc.duration}
                  </span>
                )}
              </div>
            </div>
            <div className="flex items-center gap-2 flex-shrink-0">
              <button
                onClick={() => openEdit(svc)}
                className="p-2 text-gray-500 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
              >
                <Edit size={16} />
              </button>
              <button
                onClick={() => setConfirm({ id: svc.id, name: svc.title })}
                className="p-2 text-gray-500 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
              >
                <Trash2 size={16} />
              </button>
            </div>
          </div>
        ))}
      </div>

      {confirm && (
        <Confirm
          message={`Are you sure you want to delete "${confirm.name}"? This cannot be undone.`}
          onConfirm={() => deleteMutation.mutate(confirm.id)}
          onCancel={() => setConfirm(null)}
        />
      )}

      {modal && (
        <Modal
          title={modal.type === "add" ? "Add New Service" : "Edit Service"}
          onClose={() => setModal(null)}
        >
          <div className="space-y-4">
            <Field label="Title" required>
              <input
                className={inputCls}
                value={form.title || ""}
                onChange={(e) =>
                  setForm((f) => ({ ...f, title: e.target.value }))
                }
                placeholder="Service title"
              />
            </Field>
            <Field label="Category" required>
              <select
                className={inputCls}
                value={form.category || "construction"}
                onChange={(e) =>
                  setForm((f) => ({ ...f, category: e.target.value }))
                }
              >
                <option value="construction">Construction</option>
                <option value="architecture">Architecture</option>
                <option value="design">Interior Design</option>
                <option value="management">Project Management</option>
              </select>
            </Field>
            <Field label="Short Description">
              <input
                className={inputCls}
                value={form.short_description || ""}
                onChange={(e) =>
                  setForm((f) => ({ ...f, short_description: e.target.value }))
                }
                placeholder="Brief summary"
              />
            </Field>
            <Field label="Full Description">
              <textarea
                className={textareaCls}
                rows={4}
                value={form.description || ""}
                onChange={(e) =>
                  setForm((f) => ({ ...f, description: e.target.value }))
                }
                placeholder="Detailed description"
              />
            </Field>
            <Field label="Image URL">
              <input
                className={inputCls}
                value={form.image_url || ""}
                onChange={(e) =>
                  setForm((f) => ({ ...f, image_url: e.target.value }))
                }
                placeholder="https://…"
              />
              {form.image_url && (
                <img
                  src={form.image_url}
                  alt=""
                  className="mt-2 h-24 w-full object-cover rounded-xl"
                  onError={(e) => (e.target.style.display = "none")}
                />
              )}
            </Field>
            <div className="grid grid-cols-2 gap-4">
              <Field label="Price Range">
                <input
                  className={inputCls}
                  value={form.price_range || ""}
                  onChange={(e) =>
                    setForm((f) => ({ ...f, price_range: e.target.value }))
                  }
                  placeholder="$10k – $100k"
                />
              </Field>
              <Field label="Duration">
                <input
                  className={inputCls}
                  value={form.duration || ""}
                  onChange={(e) =>
                    setForm((f) => ({ ...f, duration: e.target.value }))
                  }
                  placeholder="3 – 6 months"
                />
              </Field>
            </div>
            <ArrayField
              label="Process Steps"
              value={form.process}
              onChange={(v) => setForm((f) => ({ ...f, process: v }))}
              placeholder="Consultation&#10;Design&#10;Construction"
            />
            <ArrayField
              label="Benefits"
              value={form.benefits}
              onChange={(v) => setForm((f) => ({ ...f, benefits: v }))}
              placeholder="Quality Materials&#10;Timely Delivery"
            />
            <ArrayField
              label="Features"
              value={form.features}
              onChange={(v) => setForm((f) => ({ ...f, features: v }))}
              placeholder="Smart Home Integration&#10;Landscaping"
            />
            <div className="flex justify-end gap-3 pt-2 border-t border-gray-100">
              <button
                onClick={() => setModal(null)}
                className="px-4 py-2 border border-gray-300 rounded-xl text-gray-700 hover:bg-gray-50 text-sm font-medium"
              >
                Cancel
              </button>
              <button
                onClick={() => saveMutation.mutate()}
                disabled={saveMutation.isPending || !form.title}
                className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-xl hover:bg-blue-700 text-sm font-medium disabled:opacity-50"
              >
                {saveMutation.isPending ? (
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                ) : (
                  <Save size={14} />
                )}
                {modal.type === "add" ? "Add Service" : "Save Changes"}
              </button>
            </div>
          </div>
        </Modal>
      )}
    </div>
  );
}

/* ═══════════════════════════════
   PROJECTS MANAGEMENT
══════════════════════════════════ */
function ProjectsTab({ data, queryClient }) {
  const [modal, setModal] = useState(null);
  const [form, setForm] = useState({});
  const [confirm, setConfirm] = useState(null);
  const [search, setSearch] = useState("");
  const [filterCat, setFilterCat] = useState("");
  const [toast, setToast] = useState(null);

  const showToast = (msg, type = "success") => {
    setToast({ msg, type });
    setTimeout(() => setToast(null), 3000);
  };

  const openAdd = () => {
    setForm({
      title: "",
      short_description: "",
      description: "",
      category: "residential",
      client: "",
      location: "",
      duration: "",
      completion_date: "",
      project_value: "",
      status: "completed",
      images: [],
      features: [],
      challenges: "",
      solutions: "",
    });
    setModal({ type: "add" });
  };
  const openEdit = (item) => {
    setForm({
      ...item,
      images: parseArr(item.images),
      features: parseArr(item.features),
      completion_date: item.completion_date
        ? item.completion_date.split("T")[0]
        : "",
    });
    setModal({ type: "edit", item });
  };

  const saveMutation = useMutation({
    mutationFn: async () => {
      const body = {
        ...form,
        images: parseArr(form.images),
        features: parseArr(form.features),
      };
      if (!body.completion_date) delete body.completion_date;
      if (modal.type === "edit") {
        return API(`/api/projects/${modal.item.id}`, {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(body),
        });
      }
      return API("/api/projects", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      });
    },
    onSuccess: (res) => {
      if (!res.success) {
        showToast(res.error || "Failed", "error");
        return;
      }
      queryClient.invalidateQueries(["admin-data"]);
      setModal(null);
      showToast(modal.type === "edit" ? "Project updated!" : "Project added!");
    },
    onError: () => showToast("Something went wrong", "error"),
  });

  const deleteMutation = useMutation({
    mutationFn: (id) => API(`/api/projects/${id}`, { method: "DELETE" }),
    onSuccess: (res) => {
      if (!res.success) {
        showToast(res.error || "Failed", "error");
        return;
      }
      queryClient.invalidateQueries(["admin-data"]);
      setConfirm(null);
      showToast("Project deleted!");
    },
  });

  const filtered = (data || []).filter(
    (p) =>
      p.title?.toLowerCase().includes(search.toLowerCase()) &&
      (filterCat ? p.category === filterCat : true),
  );

  return (
    <div className="space-y-4">
      {toast && (
        <div
          className={`fixed top-4 right-4 z-50 px-4 py-3 rounded-xl shadow-lg text-white text-sm font-medium flex items-center space-x-2 ${toast.type === "error" ? "bg-red-500" : "bg-green-500"}`}
        >
          {toast.type === "error" ? (
            <AlertCircle size={16} />
          ) : (
            <CheckCircle size={16} />
          )}
          <span>{toast.msg}</span>
        </div>
      )}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
        <div className="flex items-center gap-2 flex-1 flex-wrap">
          <div className="relative">
            <Search
              size={16}
              className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
            />
            <input
              className="pl-9 pr-4 py-2 border border-gray-300 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 w-52"
              placeholder="Search projects…"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>
          <select
            className="border border-gray-300 rounded-xl px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            value={filterCat}
            onChange={(e) => setFilterCat(e.target.value)}
          >
            <option value="">All Categories</option>
            <option value="residential">Residential</option>
            <option value="commercial">Commercial</option>
            <option value="industrial">Industrial</option>
          </select>
        </div>
        <button
          onClick={openAdd}
          className="flex items-center space-x-2 bg-green-600 text-white px-4 py-2 rounded-xl hover:bg-green-700 transition-colors text-sm font-medium"
        >
          <Plus size={16} />
          <span>Add Project</span>
        </button>
      </div>

      <div className="grid gap-4">
        {filtered.length === 0 && (
          <div className="text-center py-12 text-gray-400">
            No projects found.
          </div>
        )}
        {filtered.map((proj) => (
          <div
            key={proj.id}
            className="bg-white border border-gray-100 rounded-2xl p-4 flex items-center gap-4 shadow-sm hover:shadow-md transition-shadow"
          >
            <img
              src={
                parseArr(proj.images)[0] ||
                "https://placehold.co/80x80?text=No+Image"
              }
              alt={proj.title}
              className="w-16 h-16 rounded-xl object-cover flex-shrink-0"
              onError={(e) => {
                e.target.src = "https://placehold.co/80x80?text=No+Image";
              }}
            />
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2 flex-wrap">
                <h4 className="font-semibold text-gray-900 truncate">
                  {proj.title}
                </h4>
                <span className="px-2 py-0.5 bg-green-50 text-green-700 rounded-full text-xs capitalize">
                  {proj.category}
                </span>
                <StatusBadge status={proj.status} />
              </div>
              <p className="text-sm text-gray-500 truncate mt-0.5">
                {proj.short_description}
              </p>
              <div className="flex items-center gap-3 mt-1 text-xs text-gray-400">
                {proj.client && (
                  <span className="flex items-center gap-1">
                    <Users size={11} />
                    {proj.client}
                  </span>
                )}
                {proj.location && (
                  <span className="flex items-center gap-1">
                    <MapPin size={11} />
                    {proj.location}
                  </span>
                )}
                {proj.project_value && (
                  <span className="flex items-center gap-1">
                    <DollarSign size={11} />
                    {proj.project_value}
                  </span>
                )}
              </div>
            </div>
            <div className="flex items-center gap-2 flex-shrink-0">
              <button
                onClick={() => openEdit(proj)}
                className="p-2 text-gray-500 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
              >
                <Edit size={16} />
              </button>
              <button
                onClick={() => setConfirm({ id: proj.id, name: proj.title })}
                className="p-2 text-gray-500 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
              >
                <Trash2 size={16} />
              </button>
            </div>
          </div>
        ))}
      </div>

      {confirm && (
        <Confirm
          message={`Delete "${confirm.name}"? This cannot be undone.`}
          onConfirm={() => deleteMutation.mutate(confirm.id)}
          onCancel={() => setConfirm(null)}
        />
      )}

      {modal && (
        <Modal
          title={modal.type === "add" ? "Add New Project" : "Edit Project"}
          onClose={() => setModal(null)}
        >
          <div className="space-y-4">
            <Field label="Title" required>
              <input
                className={inputCls}
                value={form.title || ""}
                onChange={(e) =>
                  setForm((f) => ({ ...f, title: e.target.value }))
                }
                placeholder="Project title"
              />
            </Field>
            <div className="grid grid-cols-2 gap-4">
              <Field label="Category" required>
                <select
                  className={inputCls}
                  value={form.category || "residential"}
                  onChange={(e) =>
                    setForm((f) => ({ ...f, category: e.target.value }))
                  }
                >
                  <option value="residential">Residential</option>
                  <option value="commercial">Commercial</option>
                  <option value="industrial">Industrial</option>
                </select>
              </Field>
              <Field label="Status">
                <select
                  className={inputCls}
                  value={form.status || "completed"}
                  onChange={(e) =>
                    setForm((f) => ({ ...f, status: e.target.value }))
                  }
                >
                  <option value="completed">Completed</option>
                  <option value="in_progress">In Progress</option>
                  <option value="planned">Planned</option>
                </select>
              </Field>
            </div>
            <Field label="Short Description">
              <input
                className={inputCls}
                value={form.short_description || ""}
                onChange={(e) =>
                  setForm((f) => ({ ...f, short_description: e.target.value }))
                }
                placeholder="Brief summary"
              />
            </Field>
            <Field label="Full Description">
              <textarea
                className={textareaCls}
                rows={3}
                value={form.description || ""}
                onChange={(e) =>
                  setForm((f) => ({ ...f, description: e.target.value }))
                }
              />
            </Field>
            <div className="grid grid-cols-2 gap-4">
              <Field label="Client">
                <input
                  className={inputCls}
                  value={form.client || ""}
                  onChange={(e) =>
                    setForm((f) => ({ ...f, client: e.target.value }))
                  }
                  placeholder="Client name"
                />
              </Field>
              <Field label="Location">
                <input
                  className={inputCls}
                  value={form.location || ""}
                  onChange={(e) =>
                    setForm((f) => ({ ...f, location: e.target.value }))
                  }
                  placeholder="City, Country"
                />
              </Field>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <Field label="Duration">
                <input
                  className={inputCls}
                  value={form.duration || ""}
                  onChange={(e) =>
                    setForm((f) => ({ ...f, duration: e.target.value }))
                  }
                  placeholder="12 months"
                />
              </Field>
              <Field label="Project Value">
                <input
                  className={inputCls}
                  value={form.project_value || ""}
                  onChange={(e) =>
                    setForm((f) => ({ ...f, project_value: e.target.value }))
                  }
                  placeholder="$500,000"
                />
              </Field>
            </div>
            <Field label="Completion Date">
              <input
                type="date"
                className={inputCls}
                value={form.completion_date || ""}
                onChange={(e) =>
                  setForm((f) => ({ ...f, completion_date: e.target.value }))
                }
              />
            </Field>
            <ArrayField
              label="Image URLs (one per line)"
              value={parseArr(form.images).join("\n")}
              onChange={(v) => setForm((f) => ({ ...f, images: v }))}
              placeholder="https://images.unsplash.com/…"
            />
            {parseArr(form.images).filter(Boolean).length > 0 && (
              <div className="flex gap-2 overflow-x-auto pb-1">
                {parseArr(form.images)
                  .filter(Boolean)
                  .map((url, i) => (
                    <img
                      key={i}
                      src={url}
                      alt=""
                      className="h-16 w-24 object-cover rounded-lg flex-shrink-0"
                      onError={(e) => (e.target.style.display = "none")}
                    />
                  ))}
              </div>
            )}
            <ArrayField
              label="Features"
              value={form.features}
              onChange={(v) => setForm((f) => ({ ...f, features: v }))}
              placeholder="Smart Home&#10;Solar Panels"
            />
            <Field label="Challenges">
              <textarea
                className={textareaCls}
                rows={2}
                value={form.challenges || ""}
                onChange={(e) =>
                  setForm((f) => ({ ...f, challenges: e.target.value }))
                }
              />
            </Field>
            <Field label="Solutions">
              <textarea
                className={textareaCls}
                rows={2}
                value={form.solutions || ""}
                onChange={(e) =>
                  setForm((f) => ({ ...f, solutions: e.target.value }))
                }
              />
            </Field>
            <div className="flex justify-end gap-3 pt-2 border-t border-gray-100">
              <button
                onClick={() => setModal(null)}
                className="px-4 py-2 border border-gray-300 rounded-xl text-gray-700 hover:bg-gray-50 text-sm font-medium"
              >
                Cancel
              </button>
              <button
                onClick={() => saveMutation.mutate()}
                disabled={saveMutation.isPending || !form.title}
                className="flex items-center gap-2 px-4 py-2 bg-green-600 text-white rounded-xl hover:bg-green-700 text-sm font-medium disabled:opacity-50"
              >
                {saveMutation.isPending ? (
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                ) : (
                  <Save size={14} />
                )}
                {modal.type === "add" ? "Add Project" : "Save Changes"}
              </button>
            </div>
          </div>
        </Modal>
      )}
    </div>
  );
}

/* ═══════════════════════════════
   TEAM MANAGEMENT
══════════════════════════════════ */
function TeamTab({ data, queryClient }) {
  const [modal, setModal] = useState(null);
  const [form, setForm] = useState({});
  const [confirm, setConfirm] = useState(null);
  const [toast, setToast] = useState(null);

  const showToast = (msg, type = "success") => {
    setToast({ msg, type });
    setTimeout(() => setToast(null), 3000);
  };

  const openAdd = () => {
    setForm({
      name: "",
      position: "",
      bio: "",
      image_url: "",
      email: "",
      linkedin_url: "",
      years_experience: "",
      specialties: [],
    });
    setModal({ type: "add" });
  };
  const openEdit = (item) => {
    setForm({ ...item, specialties: parseArr(item.specialties) });
    setModal({ type: "edit", item });
  };

  const saveMutation = useMutation({
    mutationFn: async () => {
      const body = {
        ...form,
        specialties: parseArr(form.specialties),
        years_experience: form.years_experience
          ? parseInt(form.years_experience)
          : null,
      };
      if (modal.type === "edit") {
        return API(`/api/team/${modal.item.id}`, {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(body),
        });
      }
      return API("/api/team", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      });
    },
    onSuccess: (res) => {
      if (!res.success) {
        showToast(res.error || "Failed", "error");
        return;
      }
      queryClient.invalidateQueries(["admin-data"]);
      setModal(null);
      showToast(modal.type === "edit" ? "Member updated!" : "Member added!");
    },
    onError: () => showToast("Something went wrong", "error"),
  });

  const deleteMutation = useMutation({
    mutationFn: (id) => API(`/api/team/${id}`, { method: "DELETE" }),
    onSuccess: (res) => {
      if (!res.success) {
        showToast(res.error || "Failed", "error");
        return;
      }
      queryClient.invalidateQueries(["admin-data"]);
      setConfirm(null);
      showToast("Member deleted!");
    },
  });

  return (
    <div className="space-y-4">
      {toast && (
        <div
          className={`fixed top-4 right-4 z-50 px-4 py-3 rounded-xl shadow-lg text-white text-sm font-medium flex items-center space-x-2 ${toast.type === "error" ? "bg-red-500" : "bg-green-500"}`}
        >
          {toast.type === "error" ? (
            <AlertCircle size={16} />
          ) : (
            <CheckCircle size={16} />
          )}
          <span>{toast.msg}</span>
        </div>
      )}
      <div className="flex justify-end">
        <button
          onClick={openAdd}
          className="flex items-center space-x-2 bg-purple-600 text-white px-4 py-2 rounded-xl hover:bg-purple-700 transition-colors text-sm font-medium"
        >
          <Plus size={16} />
          <span>Add Team Member</span>
        </button>
      </div>

      <div className="grid sm:grid-cols-2 gap-4">
        {(data || []).length === 0 && (
          <div className="col-span-2 text-center py-12 text-gray-400">
            No team members yet.
          </div>
        )}
        {(data || []).map((member) => (
          <div
            key={member.id}
            className="bg-white border border-gray-100 rounded-2xl p-4 flex items-start gap-4 shadow-sm hover:shadow-md transition-shadow"
          >
            <img
              src={member.image_url || "https://placehold.co/64x64?text=?"}
              alt={member.name}
              className="w-14 h-14 rounded-xl object-cover flex-shrink-0"
              onError={(e) => {
                e.target.src = "https://placehold.co/64x64?text=?";
              }}
            />
            <div className="flex-1 min-w-0">
              <h4 className="font-semibold text-gray-900">{member.name}</h4>
              <p className="text-sm text-purple-600 font-medium">
                {member.position}
              </p>
              {member.years_experience && (
                <p className="text-xs text-gray-400 mt-0.5">
                  {member.years_experience} yrs experience
                </p>
              )}
              <div className="flex flex-wrap gap-1 mt-2">
                {parseArr(member.specialties)
                  .slice(0, 3)
                  .map((s, i) => (
                    <span
                      key={i}
                      className="px-2 py-0.5 bg-purple-50 text-purple-700 rounded-full text-xs"
                    >
                      {s}
                    </span>
                  ))}
              </div>
            </div>
            <div className="flex flex-col gap-1 flex-shrink-0">
              <button
                onClick={() => openEdit(member)}
                className="p-2 text-gray-500 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
              >
                <Edit size={15} />
              </button>
              <button
                onClick={() => setConfirm({ id: member.id, name: member.name })}
                className="p-2 text-gray-500 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
              >
                <Trash2 size={15} />
              </button>
            </div>
          </div>
        ))}
      </div>

      {confirm && (
        <Confirm
          message={`Delete "${confirm.name}" from the team? This cannot be undone.`}
          onConfirm={() => deleteMutation.mutate(confirm.id)}
          onCancel={() => setConfirm(null)}
        />
      )}

      {modal && (
        <Modal
          title={modal.type === "add" ? "Add Team Member" : "Edit Team Member"}
          onClose={() => setModal(null)}
        >
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <Field label="Full Name" required>
                <input
                  className={inputCls}
                  value={form.name || ""}
                  onChange={(e) =>
                    setForm((f) => ({ ...f, name: e.target.value }))
                  }
                  placeholder="John Doe"
                />
              </Field>
              <Field label="Position" required>
                <input
                  className={inputCls}
                  value={form.position || ""}
                  onChange={(e) =>
                    setForm((f) => ({ ...f, position: e.target.value }))
                  }
                  placeholder="Senior Architect"
                />
              </Field>
            </div>
            <Field label="Bio">
              <textarea
                className={textareaCls}
                rows={3}
                value={form.bio || ""}
                onChange={(e) =>
                  setForm((f) => ({ ...f, bio: e.target.value }))
                }
                placeholder="Short biography…"
              />
            </Field>
            <Field label="Photo URL">
              <input
                className={inputCls}
                value={form.image_url || ""}
                onChange={(e) =>
                  setForm((f) => ({ ...f, image_url: e.target.value }))
                }
                placeholder="https://…"
              />
              {form.image_url && (
                <img
                  src={form.image_url}
                  alt=""
                  className="mt-2 h-20 w-20 object-cover rounded-xl"
                  onError={(e) => (e.target.style.display = "none")}
                />
              )}
            </Field>
            <div className="grid grid-cols-2 gap-4">
              <Field label="Email">
                <input
                  type="email"
                  className={inputCls}
                  value={form.email || ""}
                  onChange={(e) =>
                    setForm((f) => ({ ...f, email: e.target.value }))
                  }
                  placeholder="email@masstech.rw"
                />
              </Field>
              <Field label="Years of Experience">
                <input
                  type="number"
                  min="0"
                  max="50"
                  className={inputCls}
                  value={form.years_experience || ""}
                  onChange={(e) =>
                    setForm((f) => ({ ...f, years_experience: e.target.value }))
                  }
                  placeholder="10"
                />
              </Field>
            </div>
            <Field label="LinkedIn URL">
              <input
                className={inputCls}
                value={form.linkedin_url || ""}
                onChange={(e) =>
                  setForm((f) => ({ ...f, linkedin_url: e.target.value }))
                }
                placeholder="https://linkedin.com/in/…"
              />
            </Field>
            <ArrayField
              label="Specialties"
              value={form.specialties}
              onChange={(v) => setForm((f) => ({ ...f, specialties: v }))}
              placeholder="Structural Engineering&#10;Project Management"
            />
            <div className="flex justify-end gap-3 pt-2 border-t border-gray-100">
              <button
                onClick={() => setModal(null)}
                className="px-4 py-2 border border-gray-300 rounded-xl text-gray-700 hover:bg-gray-50 text-sm font-medium"
              >
                Cancel
              </button>
              <button
                onClick={() => saveMutation.mutate()}
                disabled={
                  saveMutation.isPending || !form.name || !form.position
                }
                className="flex items-center gap-2 px-4 py-2 bg-purple-600 text-white rounded-xl hover:bg-purple-700 text-sm font-medium disabled:opacity-50"
              >
                {saveMutation.isPending ? (
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                ) : (
                  <Save size={14} />
                )}
                {modal.type === "add" ? "Add Member" : "Save Changes"}
              </button>
            </div>
          </div>
        </Modal>
      )}
    </div>
  );
}

/* ═══════════════════════════════
   CONTACTS TAB
══════════════════════════════════ */
function ContactsTab({ data, queryClient }) {
  const [view, setView] = useState(null);
  const [toast, setToast] = useState(null);
  const showToast = (msg, type = "success") => {
    setToast({ msg, type });
    setTimeout(() => setToast(null), 3000);
  };

  const updateStatus = useMutation({
    mutationFn: ({ id, status }) =>
      API("/api/contact", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id, status }),
      }),
    onSuccess: (res) => {
      if (!res.success) {
        showToast(res.error || "Failed", "error");
        return;
      }
      queryClient.invalidateQueries(["admin-data"]);
      showToast("Status updated!");
    },
  });

  const sorted = [...(data || [])].sort(
    (a, b) => new Date(b.created_at) - new Date(a.created_at),
  );

  return (
    <div className="space-y-4">
      {toast && (
        <div
          className={`fixed top-4 right-4 z-50 px-4 py-3 rounded-xl shadow-lg text-white text-sm font-medium flex items-center space-x-2 ${toast.type === "error" ? "bg-red-500" : "bg-green-500"}`}
        >
          {toast.type === "error" ? (
            <AlertCircle size={16} />
          ) : (
            <CheckCircle size={16} />
          )}
          <span>{toast.msg}</span>
        </div>
      )}
      {sorted.length === 0 && (
        <div className="text-center py-12 text-gray-400">
          No contact inquiries yet.
        </div>
      )}
      {sorted.map((contact) => (
        <div
          key={contact.id}
          className="bg-white border border-gray-100 rounded-2xl p-4 shadow-sm"
        >
          <div className="flex items-start justify-between gap-4">
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2 flex-wrap">
                <h4 className="font-semibold text-gray-900">{contact.name}</h4>
                <StatusBadge status={contact.status} />
              </div>
              <div className="flex flex-wrap gap-3 mt-1 text-sm text-gray-500">
                <span className="flex items-center gap-1">
                  <Mail size={13} />
                  {contact.email}
                </span>
                {contact.phone && (
                  <span className="flex items-center gap-1">
                    <Phone size={13} />
                    {contact.phone}
                  </span>
                )}
                <span className="flex items-center gap-1">
                  <Calendar size={13} />
                  {new Date(contact.created_at).toLocaleDateString()}
                </span>
              </div>
              {contact.subject && (
                <p className="text-sm font-medium text-gray-700 mt-1">
                  {contact.subject}
                </p>
              )}
              <p className="text-sm text-gray-500 mt-1 line-clamp-2">
                {contact.message}
              </p>
            </div>
            <div className="flex items-center gap-2 flex-shrink-0">
              <select
                value={contact.status}
                onChange={(e) =>
                  updateStatus.mutate({
                    id: contact.id,
                    status: e.target.value,
                  })
                }
                className="text-xs border border-gray-300 rounded-lg px-2 py-1 focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="new">New</option>
                <option value="contacted">Contacted</option>
                <option value="responded">Responded</option>
                <option value="closed">Closed</option>
              </select>
              <button
                onClick={() => setView(contact)}
                className="p-2 text-gray-500 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
              >
                <Eye size={15} />
              </button>
            </div>
          </div>
        </div>
      ))}

      {view && (
        <Modal title="Inquiry Details" onClose={() => setView(null)}>
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <p className="text-xs text-gray-400 uppercase tracking-wide mb-1">
                  Name
                </p>
                <p className="font-medium text-gray-900">{view.name}</p>
              </div>
              <div>
                <p className="text-xs text-gray-400 uppercase tracking-wide mb-1">
                  Email
                </p>
                <p className="font-medium text-gray-900">{view.email}</p>
              </div>
              {view.phone && (
                <div>
                  <p className="text-xs text-gray-400 uppercase tracking-wide mb-1">
                    Phone
                  </p>
                  <p className="font-medium text-gray-900">{view.phone}</p>
                </div>
              )}
              <div>
                <p className="text-xs text-gray-400 uppercase tracking-wide mb-1">
                  Date
                </p>
                <p className="font-medium text-gray-900">
                  {new Date(view.created_at).toLocaleString()}
                </p>
              </div>
              {view.service_interest && (
                <div>
                  <p className="text-xs text-gray-400 uppercase tracking-wide mb-1">
                    Service Interest
                  </p>
                  <p className="font-medium text-gray-900">
                    {view.service_interest}
                  </p>
                </div>
              )}
              {view.budget_range && (
                <div>
                  <p className="text-xs text-gray-400 uppercase tracking-wide mb-1">
                    Budget
                  </p>
                  <p className="font-medium text-gray-900">
                    {view.budget_range}
                  </p>
                </div>
              )}
              {view.timeline && (
                <div>
                  <p className="text-xs text-gray-400 uppercase tracking-wide mb-1">
                    Timeline
                  </p>
                  <p className="font-medium text-gray-900">{view.timeline}</p>
                </div>
              )}
            </div>
            {view.subject && (
              <div>
                <p className="text-xs text-gray-400 uppercase tracking-wide mb-1">
                  Subject
                </p>
                <p className="font-medium text-gray-900">{view.subject}</p>
              </div>
            )}
            <div>
              <p className="text-xs text-gray-400 uppercase tracking-wide mb-1">
                Message
              </p>
              <p className="text-gray-700 whitespace-pre-wrap bg-gray-50 p-3 rounded-xl text-sm">
                {view.message}
              </p>
            </div>
            <div className="flex justify-end">
              <button
                onClick={() => setView(null)}
                className="px-4 py-2 bg-gray-100 text-gray-700 rounded-xl hover:bg-gray-200 text-sm font-medium"
              >
                Close
              </button>
            </div>
          </div>
        </Modal>
      )}
    </div>
  );
}

/* ═══════════════════════════════
   COMPANY INFO TAB
══════════════════════════════════ */
function CompanyTab({ data, queryClient }) {
  const [form, setForm] = useState(null);
  const [toast, setToast] = useState(null);
  const showToast = (msg, type = "success") => {
    setToast({ msg, type });
    setTimeout(() => setToast(null), 3000);
  };

  useEffect(() => {
    if (data && !form) {
      setForm({ ...data, values: parseArr(data.values) });
    }
  }, [data]);

  const saveMutation = useMutation({
    mutationFn: () =>
      API("/api/company", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...form, values: parseArr(form.values) }),
      }),
    onSuccess: (res) => {
      if (!res.success) {
        showToast(res.error || "Failed", "error");
        return;
      }
      queryClient.invalidateQueries(["admin-data"]);
      showToast("Company info saved!");
    },
    onError: () => showToast("Something went wrong", "error"),
  });

  if (!form)
    return (
      <div className="flex justify-center py-12">
        <div className="w-8 h-8 border-4 border-blue-600 border-t-transparent rounded-full animate-spin" />
      </div>
    );

  return (
    <div className="space-y-6">
      {toast && (
        <div
          className={`fixed top-4 right-4 z-50 px-4 py-3 rounded-xl shadow-lg text-white text-sm font-medium flex items-center space-x-2 ${toast.type === "error" ? "bg-red-500" : "bg-green-500"}`}
        >
          {toast.type === "error" ? (
            <AlertCircle size={16} />
          ) : (
            <CheckCircle size={16} />
          )}
          <span>{toast.msg}</span>
        </div>
      )}

      <div className="bg-white border border-gray-100 rounded-2xl p-6 shadow-sm">
        <h3 className="text-base font-semibold text-gray-900 mb-4">
          Basic Info
        </h3>
        <div className="grid sm:grid-cols-2 gap-4">
          <Field label="Company Name">
            <input
              className={inputCls}
              value={form.company_name || ""}
              onChange={(e) =>
                setForm((f) => ({ ...f, company_name: e.target.value }))
              }
            />
          </Field>
          <Field label="Tagline">
            <input
              className={inputCls}
              value={form.tagline || ""}
              onChange={(e) =>
                setForm((f) => ({ ...f, tagline: e.target.value }))
              }
            />
          </Field>
          <div className="sm:col-span-2">
            <Field label="Description">
              <textarea
                className={textareaCls}
                rows={3}
                value={form.description || ""}
                onChange={(e) =>
                  setForm((f) => ({ ...f, description: e.target.value }))
                }
              />
            </Field>
          </div>
          <Field label="Established Year">
            <input
              type="number"
              className={inputCls}
              value={form.established_year || ""}
              onChange={(e) =>
                setForm((f) => ({
                  ...f,
                  established_year: parseInt(e.target.value),
                }))
              }
            />
          </Field>
          <Field label="Website">
            <input
              className={inputCls}
              value={form.website || ""}
              onChange={(e) =>
                setForm((f) => ({ ...f, website: e.target.value }))
              }
            />
          </Field>
        </div>
      </div>

      <div className="bg-white border border-gray-100 rounded-2xl p-6 shadow-sm">
        <h3 className="text-base font-semibold text-gray-900 mb-4">
          Mission, Vision & Values
        </h3>
        <div className="space-y-4">
          <Field label="Mission">
            <textarea
              className={textareaCls}
              rows={3}
              value={form.mission || ""}
              onChange={(e) =>
                setForm((f) => ({ ...f, mission: e.target.value }))
              }
            />
          </Field>
          <Field label="Vision">
            <textarea
              className={textareaCls}
              rows={3}
              value={form.vision || ""}
              onChange={(e) =>
                setForm((f) => ({ ...f, vision: e.target.value }))
              }
            />
          </Field>
          <ArrayField
            label="Core Values"
            value={form.values}
            onChange={(v) => setForm((f) => ({ ...f, values: v }))}
            placeholder="Quality&#10;Innovation&#10;Sustainability"
          />
        </div>
      </div>

      <div className="bg-white border border-gray-100 rounded-2xl p-6 shadow-sm">
        <h3 className="text-base font-semibold text-gray-900 mb-4">
          Contact Info
        </h3>
        <div className="grid sm:grid-cols-2 gap-4">
          <Field label="Phone">
            <input
              className={inputCls}
              value={form.phone || ""}
              onChange={(e) =>
                setForm((f) => ({ ...f, phone: e.target.value }))
              }
              placeholder="+250 788 123 456"
            />
          </Field>
          <Field label="Email">
            <input
              type="email"
              className={inputCls}
              value={form.email || ""}
              onChange={(e) =>
                setForm((f) => ({ ...f, email: e.target.value }))
              }
              placeholder="info@masstech.rw"
            />
          </Field>
          <div className="sm:col-span-2">
            <Field label="Address">
              <input
                className={inputCls}
                value={form.address || ""}
                onChange={(e) =>
                  setForm((f) => ({ ...f, address: e.target.value }))
                }
                placeholder="KG 15 Ave, Kigali, Rwanda"
              />
            </Field>
          </div>
        </div>
      </div>

      <div className="bg-white border border-gray-100 rounded-2xl p-6 shadow-sm">
        <h3 className="text-base font-semibold text-gray-900 mb-4">Stats</h3>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
          <Field label="Total Projects">
            <input
              type="number"
              className={inputCls}
              value={form.total_projects || ""}
              onChange={(e) =>
                setForm((f) => ({
                  ...f,
                  total_projects: parseInt(e.target.value),
                }))
              }
            />
          </Field>
          <Field label="Years Experience">
            <input
              type="number"
              className={inputCls}
              value={form.years_experience || ""}
              onChange={(e) =>
                setForm((f) => ({
                  ...f,
                  years_experience: parseInt(e.target.value),
                }))
              }
            />
          </Field>
          <Field label="Happy Clients">
            <input
              type="number"
              className={inputCls}
              value={form.happy_clients || ""}
              onChange={(e) =>
                setForm((f) => ({
                  ...f,
                  happy_clients: parseInt(e.target.value),
                }))
              }
            />
          </Field>
        </div>
      </div>

      <div className="flex justify-end">
        <button
          onClick={() => saveMutation.mutate()}
          disabled={saveMutation.isPending}
          className="flex items-center gap-2 px-6 py-3 bg-blue-600 text-white rounded-xl hover:bg-blue-700 text-sm font-semibold disabled:opacity-50 transition-colors"
        >
          {saveMutation.isPending ? (
            <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
          ) : (
            <Save size={16} />
          )}
          Save Company Info
        </button>
      </div>
    </div>
  );
}

/* ═══════════════════════════════
   MAIN ADMIN DASHBOARD
══════════════════════════════════ */
export default function AdminDashboard() {
  const [activeTab, setActiveTab] = useState("dashboard");
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [user, setUser] = useState(null);
  const [authChecked, setAuthChecked] = useState(false);
  const queryClient = useQueryClient();

  useEffect(() => {
    const token = localStorage.getItem("adminToken");
    const userData = localStorage.getItem("adminUser");
    if (!token || !userData) {
      window.location.href = "/admin/login";
    } else {
      setUser(JSON.parse(userData));
      setAuthChecked(true);
    }
  }, []);

  const { data: adminData, isLoading } = useQuery({
    queryKey: ["admin-data"],
    enabled: authChecked,
    staleTime: 0,
    queryFn: async () => {
      const [services, projects, team, contacts, company] = await Promise.all([
        API("/api/services"),
        API("/api/projects"),
        API("/api/team"),
        API("/api/contact"),
        API("/api/company"),
      ]);
      return {
        services: services.data || [],
        projects: projects.data || [],
        team: team.data || [],
        contacts: contacts.data || [],
        company: company.data || {},
      };
    },
  });

  const handleLogout = () => {
    localStorage.removeItem("adminToken");
    localStorage.removeItem("adminUser");
    window.location.href = "/admin/login";
  };

  const navItems = [
    {
      id: "dashboard",
      label: "Dashboard",
      icon: BarChart3,
      color: "text-gray-700",
    },
    {
      id: "services",
      label: "Services",
      icon: Building2,
      color: "text-blue-600",
    },
    {
      id: "projects",
      label: "Projects",
      icon: FileText,
      color: "text-green-600",
    },
    {
      id: "team",
      label: "Team Members",
      icon: Users,
      color: "text-purple-600",
    },
    {
      id: "contacts",
      label: "Inquiries",
      icon: MessageSquare,
      color: "text-orange-600",
    },
    {
      id: "company",
      label: "Company Info",
      icon: Settings,
      color: "text-gray-600",
    },
  ];

  if (!authChecked) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="w-10 h-10 border-4 border-blue-600 border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  const d = adminData || {
    services: [],
    projects: [],
    team: [],
    contacts: [],
    company: {},
  };
  const newInquiries = d.contacts.filter((c) => c.status === "new").length;

  const tabTitle =
    navItems.find((n) => n.id === activeTab)?.label || "Dashboard";

  return (
    <div className="min-h-screen bg-gray-50 flex">
      {/* Backdrop */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-40 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* ─── Sidebar ─── */}
      <aside
        className={`fixed lg:static inset-y-0 left-0 z-50 w-64 bg-white shadow-xl flex flex-col transform transition-transform duration-200 ${sidebarOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0"}`}
      >
        {/* Logo */}
        <div className="flex items-center justify-between px-5 py-5 border-b border-gray-100">
          <div className="flex items-center space-x-3">
            <div className="w-9 h-9 bg-gradient-to-br from-blue-600 to-blue-400 rounded-xl flex items-center justify-center">
              <Building2 size={18} className="text-white" />
            </div>
            <div>
              <p className="font-bold text-gray-900 text-sm leading-tight">
                MASS Tech
              </p>
              <p className="text-xs text-gray-400">Admin Panel</p>
            </div>
          </div>
          <button
            onClick={() => setSidebarOpen(false)}
            className="lg:hidden p-1 rounded-lg hover:bg-gray-100"
          >
            <X size={18} className="text-gray-500" />
          </button>
        </div>

        {/* Nav */}
        <nav className="flex-1 px-3 py-4 space-y-1 overflow-y-auto">
          {navItems.map((item) => {
            const Icon = item.icon;
            const active = activeTab === item.id;
            return (
              <button
                key={item.id}
                onClick={() => {
                  setActiveTab(item.id);
                  setSidebarOpen(false);
                }}
                className={`w-full flex items-center space-x-3 px-3 py-2.5 rounded-xl text-left transition-all text-sm font-medium ${active ? "bg-blue-600 text-white shadow-md shadow-blue-200" : "text-gray-600 hover:bg-gray-50"}`}
              >
                <Icon
                  size={18}
                  className={active ? "text-white" : item.color}
                />
                <span className="flex-1">{item.label}</span>
                {item.id === "contacts" && newInquiries > 0 && (
                  <span
                    className={`px-1.5 py-0.5 rounded-full text-xs font-bold ${active ? "bg-white text-blue-600" : "bg-red-500 text-white"}`}
                  >
                    {newInquiries}
                  </span>
                )}
              </button>
            );
          })}
        </nav>

        {/* User */}
        <div className="px-3 py-4 border-t border-gray-100">
          <div className="flex items-center gap-3 px-3 py-2 mb-2">
            <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center flex-shrink-0">
              <Users size={14} className="text-blue-600" />
            </div>
            <div className="min-w-0">
              <p className="text-sm font-semibold text-gray-900 truncate">
                {user?.name || "Admin"}
              </p>
              <p className="text-xs text-gray-400 truncate">{user?.email}</p>
            </div>
          </div>
          <button
            onClick={handleLogout}
            className="w-full flex items-center gap-2 px-3 py-2 text-sm text-red-600 hover:bg-red-50 rounded-xl transition-colors font-medium"
          >
            <LogOut size={16} />
            <span>Log Out</span>
          </button>
        </div>
      </aside>

      {/* ─── Main ─── */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* Top bar */}
        <header className="bg-white border-b border-gray-100 px-4 sm:px-6 py-4 flex items-center justify-between sticky top-0 z-30 shadow-sm">
          <div className="flex items-center gap-3">
            <button
              onClick={() => setSidebarOpen(true)}
              className="lg:hidden p-2 rounded-xl hover:bg-gray-100 transition-colors"
            >
              <Menu size={20} className="text-gray-600" />
            </button>
            <h1 className="text-lg font-bold text-gray-900">{tabTitle}</h1>
          </div>
          <a
            href="/"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-2 text-sm text-gray-500 hover:text-gray-800 px-3 py-2 rounded-xl hover:bg-gray-100 transition-colors font-medium"
          >
            <Home size={16} />
            <span className="hidden sm:inline">View Website</span>
          </a>
        </header>

        {/* Content */}
        <main className="flex-1 p-4 sm:p-6 overflow-auto">
          {isLoading ? (
            <div className="flex items-center justify-center py-24">
              <div className="w-10 h-10 border-4 border-blue-600 border-t-transparent rounded-full animate-spin" />
            </div>
          ) : (
            <>
              {/* ── Dashboard Overview ── */}
              {activeTab === "dashboard" && (
                <div className="space-y-6">
                  {/* Stats */}
                  <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                    {[
                      {
                        label: "Services",
                        count: d.services.length,
                        icon: Building2,
                        color: "blue",
                        tab: "services",
                      },
                      {
                        label: "Projects",
                        count: d.projects.length,
                        icon: FileText,
                        color: "green",
                        tab: "projects",
                      },
                      {
                        label: "Team Members",
                        count: d.team.length,
                        icon: Users,
                        color: "purple",
                        tab: "team",
                      },
                      {
                        label: "Inquiries",
                        count: d.contacts.length,
                        icon: MessageSquare,
                        color: "orange",
                        tab: "contacts",
                      },
                    ].map((stat) => {
                      const Icon = stat.icon;
                      const colorMap = {
                        blue: "bg-blue-50 text-blue-600",
                        green: "bg-green-50 text-green-600",
                        purple: "bg-purple-50 text-purple-600",
                        orange: "bg-orange-50 text-orange-600",
                      };
                      return (
                        <button
                          key={stat.label}
                          onClick={() => setActiveTab(stat.tab)}
                          className="bg-white rounded-2xl p-5 shadow-sm border border-gray-100 text-left hover:shadow-md transition-shadow"
                        >
                          <div className="flex items-center justify-between mb-3">
                            <p className="text-sm text-gray-500 font-medium">
                              {stat.label}
                            </p>
                            <div
                              className={`w-10 h-10 rounded-xl flex items-center justify-center ${colorMap[stat.color]}`}
                            >
                              <Icon size={20} />
                            </div>
                          </div>
                          <p className="text-3xl font-bold text-gray-900">
                            {stat.count}
                          </p>
                        </button>
                      );
                    })}
                  </div>

                  {/* Recent Inquiries + Quick actions */}
                  <div className="grid lg:grid-cols-2 gap-6">
                    <div className="bg-white rounded-2xl p-5 shadow-sm border border-gray-100">
                      <div className="flex items-center justify-between mb-4">
                        <h3 className="font-semibold text-gray-900">
                          Recent Inquiries
                        </h3>
                        <button
                          onClick={() => setActiveTab("contacts")}
                          className="text-sm text-blue-600 hover:text-blue-700 font-medium"
                        >
                          View all
                        </button>
                      </div>
                      {d.contacts.length === 0 && (
                        <p className="text-gray-400 text-sm text-center py-6">
                          No inquiries yet
                        </p>
                      )}
                      <div className="space-y-3">
                        {d.contacts.slice(0, 5).map((c) => (
                          <div
                            key={c.id}
                            className="flex items-center justify-between p-3 bg-gray-50 rounded-xl"
                          >
                            <div className="min-w-0">
                              <p className="font-medium text-gray-900 text-sm truncate">
                                {c.name}
                              </p>
                              <p className="text-xs text-gray-400 truncate">
                                {c.email}
                              </p>
                            </div>
                            <StatusBadge status={c.status} />
                          </div>
                        ))}
                      </div>
                    </div>

                    <div className="bg-white rounded-2xl p-5 shadow-sm border border-gray-100">
                      <h3 className="font-semibold text-gray-900 mb-4">
                        Quick Actions
                      </h3>
                      <div className="space-y-2">
                        {[
                          {
                            label: "Add New Service",
                            tab: "services",
                            color: "blue",
                          },
                          {
                            label: "Add New Project",
                            tab: "projects",
                            color: "green",
                          },
                          {
                            label: "Add Team Member",
                            tab: "team",
                            color: "purple",
                          },
                          {
                            label: "Edit Company Info",
                            tab: "company",
                            color: "gray",
                          },
                        ].map((a) => {
                          const colorMap = {
                            blue: "bg-blue-50 hover:bg-blue-100 text-blue-700",
                            green:
                              "bg-green-50 hover:bg-green-100 text-green-700",
                            purple:
                              "bg-purple-50 hover:bg-purple-100 text-purple-700",
                            gray: "bg-gray-50 hover:bg-gray-100 text-gray-700",
                          };
                          return (
                            <button
                              key={a.label}
                              onClick={() => setActiveTab(a.tab)}
                              className={`w-full flex items-center gap-3 p-3 rounded-xl text-sm font-medium transition-colors ${colorMap[a.color]}`}
                            >
                              <Plus size={16} />
                              <span>{a.label}</span>
                            </button>
                          );
                        })}
                      </div>

                      {/* Company stats snapshot */}
                      <div className="mt-4 pt-4 border-t border-gray-100">
                        <p className="text-xs text-gray-400 uppercase tracking-wide mb-3">
                          Company Snapshot
                        </p>
                        <div className="grid grid-cols-3 gap-2 text-center">
                          {[
                            { val: d.company.total_projects, lbl: "Projects" },
                            { val: d.company.years_experience, lbl: "Years" },
                            { val: d.company.happy_clients, lbl: "Clients" },
                          ].map((s) => (
                            <div
                              key={s.lbl}
                              className="bg-gray-50 rounded-xl py-2"
                            >
                              <p className="text-lg font-bold text-gray-900">
                                {s.val || "–"}
                              </p>
                              <p className="text-xs text-gray-400">{s.lbl}</p>
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {activeTab === "services" && (
                <ServicesTab data={d.services} queryClient={queryClient} />
              )}
              {activeTab === "projects" && (
                <ProjectsTab data={d.projects} queryClient={queryClient} />
              )}
              {activeTab === "team" && (
                <TeamTab data={d.team} queryClient={queryClient} />
              )}
              {activeTab === "contacts" && (
                <ContactsTab data={d.contacts} queryClient={queryClient} />
              )}
              {activeTab === "company" && (
                <CompanyTab data={d.company} queryClient={queryClient} />
              )}
            </>
          )}
        </main>
      </div>
    </div>
  );
}



