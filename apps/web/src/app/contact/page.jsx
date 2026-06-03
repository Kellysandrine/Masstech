import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {
  ArrowRight,
  Phone,
  Mail,
  MapPin,
  Clock,
  CheckCircle,
  AlertCircle,
  Send,
  User,
  MessageSquare,
  DollarSign,
  Calendar,
} from "lucide-react";
import Header from "../../components/Header";
import Footer from "../../components/Footer";

export default function ContactPage() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    subject: "",
    message: "",
    service_interest: "",
    budget_range: "",
    timeline: "",
  });

  const [showSuccess, setShowSuccess] = useState(false);
  const queryClient = useQueryClient();

  // Fetch company info
  const { data: companyData } = useQuery({
    queryKey: ["company"],
    queryFn: async () => {
      const response = await fetch("/api/company");
      if (!response.ok) throw new Error("Failed to fetch company info");
      return response.json();
    },
  });

  // Submit contact form mutation
const contactMutation = useMutation({
  mutationFn: async (contactData) => {
    const response = await fetch("/api/contact", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(contactData),
    });
    if (!response.ok) {
      throw new Error("Failed to submit contact form");
    }

    // Send email directly via Resend API
    try {
      await fetch("https://api.resend.com/emails", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${import.meta.env.VITE_RESEND_API_KEY}`,
        },
        body: JSON.stringify({
          from: "MASS Tech Contact <noreply@masstech1.com>",
          to: "info@masstech1.com",
          subject: `New Inquiry: ${contactData.subject || "Contact Form Submission"}`,
          html: `
            <h2>New Contact Form Inquiry</h2>
            <p><strong>Name:</strong> ${contactData.name}</p>
            <p><strong>Email:</strong> ${contactData.email}</p>
            <p><strong>Phone:</strong> ${contactData.phone || "Not provided"}</p>
            <p><strong>Subject:</strong> ${contactData.subject || "Not provided"}</p>
            <p><strong>Service Interest:</strong> ${contactData.service_interest || "Not provided"}</p>
            <p><strong>Budget Range:</strong> ${contactData.budget_range || "Not provided"}</p>
            <p><strong>Timeline:</strong> ${contactData.timeline || "Not provided"}</p>
            <h3>Message:</h3>
            <p>${contactData.message}</p>
            <hr />
            <p style="color: gray; font-size: 12px;">Submitted via MASS Tech website contact form.</p>
          `,
        }),
      });
    } catch (emailError) {
      console.error("Email sending failed:", emailError);
    }

    return response.json();
  },
    onSuccess: (data) => {
      setFormData({
        name: "",
        email: "",
        phone: "",
        subject: "",
        message: "",
        service_interest: "",
        budget_range: "",
        timeline: "",
      });
      setShowSuccess(true);
      setTimeout(() => setShowSuccess(false), 5000);
      queryClient.invalidateQueries({ queryKey: ["contact-inquiries"] });
    },
  });

  const company = companyData?.data || {};

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    contactMutation.mutate(formData);
  };

  const serviceOptions = [
    "Residential Construction",
    "Commercial Buildings",
    "Industrial Construction",
    "Architectural Design",
    "Interior Design",
    "Project Management",
    "Other",
  ];

  const budgetOptions = [
    "Under $50,000",
    "$50,000 - $100,000",
    "$100,000 - $500,000",
    "$500,000 - $1,000,000",
    "Over $1,000,000",
    "Not sure",
  ];

  const timelineOptions = [
    "As soon as possible",
    "Within 3 months",
    "3-6 months",
    "6-12 months",
    "More than a year",
    "Just planning",
  ];

  return (
    <div className="min-h-screen bg-white dark:bg-[#121212]">
      <Header />

      {/* Hero Section */}
      <section className="w-full bg-gradient-to-r from-[#006DFF] to-[#2F7BFF] py-20 md:py-28">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 text-center text-white">
          <h1 className="text-4xl sm:text-5xl md:text-6xl font-extrabold leading-tight mb-6">
            Contact <span className="text-blue-200">Us</span>
          </h1>

          <p className="text-lg md:text-xl text-blue-100 max-w-3xl mx-auto leading-relaxed mb-8">
            Ready to start your next construction project? Get in touch with our
            team for a free consultation and personalized quote.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <a
              href="tel:+250788123456"
              className="inline-flex items-center space-x-2 bg-white text-[#006DFF] font-semibold text-base px-8 py-4 rounded-full hover:bg-gray-50 active:scale-95 transition-all duration-150"
            >
              <Phone size={18} />
              <span>Call Now</span>
            </a>
            <a
              href="mailto:info@masstech.rw"
              className="inline-flex items-center space-x-2 bg-white bg-opacity-10 backdrop-blur-sm border border-white border-opacity-30 text-white font-semibold text-base px-8 py-4 rounded-full hover:bg-opacity-20 active:scale-95 transition-all duration-150"
            >
              <Mail size={18} />
              <span>Email Us</span>
            </a>
          </div>
        </div>
      </section>

      {/* Success Message */}
      {showSuccess && (
        <div className="fixed top-20 right-4 z-50 bg-green-50 border border-green-200 rounded-xl p-4 shadow-lg max-w-sm">
          <div className="flex items-center space-x-3">
            <CheckCircle size={20} className="text-green-600 flex-shrink-0" />
            <div>
              <p className="text-green-800 font-medium text-sm">
                Message sent successfully!
              </p>
              <p className="text-green-600 text-sm">
                We'll get back to you soon.
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Contact Form & Info */}
      <section className="w-full bg-white dark:bg-[#121212] py-16 md:py-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16">
            {/* Contact Form */}
            <div>
              <div className="mb-8">
                <h2 className="text-3xl md:text-4xl font-bold text-[#111] dark:text-white mb-4">
                  Get a Free Quote
                </h2>
                <p className="text-lg text-[#6B7280] dark:text-[#A3A3A3]">
                  Fill out the form below and we'll get back to you within 24
                  hours with a detailed quote for your project.
                </p>
              </div>

              <form onSubmit={handleSubmit} className="space-y-6">
                {/* Name and Email */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label
                      htmlFor="name"
                      className="block text-sm font-medium text-[#111] dark:text-white mb-2"
                    >
                      Full Name *
                    </label>
                    <div className="relative">
                      <User
                        size={20}
                        className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"
                      />
                      <input
                        type="text"
                        id="name"
                        name="name"
                        value={formData.name}
                        onChange={handleInputChange}
                        required
                        className="w-full pl-12 pr-4 py-3 border border-gray-200 dark:border-gray-700 rounded-xl bg-white dark:bg-[#1E1E1E] text-[#111] dark:text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-[#006DFF] focus:border-[#006DFF] transition-colors"
                        placeholder="Your full name"
                      />
                    </div>
                  </div>

                  <div>
                    <label
                      htmlFor="email"
                      className="block text-sm font-medium text-[#111] dark:text-white mb-2"
                    >
                      Email Address *
                    </label>
                    <div className="relative">
                      <Mail
                        size={20}
                        className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"
                      />
                      <input
                        type="email"
                        id="email"
                        name="email"
                        value={formData.email}
                        onChange={handleInputChange}
                        required
                        className="w-full pl-12 pr-4 py-3 border border-gray-200 dark:border-gray-700 rounded-xl bg-white dark:bg-[#1E1E1E] text-[#111] dark:text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-[#006DFF] focus:border-[#006DFF] transition-colors"
                        placeholder="your.email@example.com"
                      />
                    </div>
                  </div>
                </div>

                {/* Phone and Subject */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label
                      htmlFor="phone"
                      className="block text-sm font-medium text-[#111] dark:text-white mb-2"
                    >
                      Phone Number
                    </label>
                    <div className="relative">
                      <Phone
                        size={20}
                        className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"
                      />
                      <input
                        type="tel"
                        id="phone"
                        name="phone"
                        value={formData.phone}
                        onChange={handleInputChange}
                        className="w-full pl-12 pr-4 py-3 border border-gray-200 dark:border-gray-700 rounded-xl bg-white dark:bg-[#1E1E1E] text-[#111] dark:text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-[#006DFF] focus:border-[#006DFF] transition-colors"
                        placeholder="+250 788 123 456"
                      />
                    </div>
                  </div>

                  <div>
                    <label
                      htmlFor="subject"
                      className="block text-sm font-medium text-[#111] dark:text-white mb-2"
                    >
                      Subject
                    </label>
                    <input
                      type="text"
                      id="subject"
                      name="subject"
                      value={formData.subject}
                      onChange={handleInputChange}
                      className="w-full px-4 py-3 border border-gray-200 dark:border-gray-700 rounded-xl bg-white dark:bg-[#1E1E1E] text-[#111] dark:text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-[#006DFF] focus:border-[#006DFF] transition-colors"
                      placeholder="Brief subject of your inquiry"
                    />
                  </div>
                </div>

                {/* Service Interest */}
                <div>
                  <label
                    htmlFor="service_interest"
                    className="block text-sm font-medium text-[#111] dark:text-white mb-2"
                  >
                    Service of Interest
                  </label>
                  <select
                    id="service_interest"
                    name="service_interest"
                    value={formData.service_interest}
                    onChange={handleInputChange}
                    className="w-full px-4 py-3 border border-gray-200 dark:border-gray-700 rounded-xl bg-white dark:bg-[#1E1E1E] text-[#111] dark:text-white focus:outline-none focus:ring-2 focus:ring-[#006DFF] focus:border-[#006DFF] transition-colors"
                  >
                    <option value="">Select a service</option>
                    {serviceOptions.map((service) => (
                      <option key={service} value={service}>
                        {service}
                      </option>
                    ))}
                  </select>
                </div>

                {/* Budget and Timeline */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label
                      htmlFor="budget_range"
                      className="block text-sm font-medium text-[#111] dark:text-white mb-2"
                    >
                      Budget Range
                    </label>
                    <div className="relative">
                      <DollarSign
                        size={20}
                        className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"
                      />
                      <select
                        id="budget_range"
                        name="budget_range"
                        value={formData.budget_range}
                        onChange={handleInputChange}
                        className="w-full pl-12 pr-4 py-3 border border-gray-200 dark:border-gray-700 rounded-xl bg-white dark:bg-[#1E1E1E] text-[#111] dark:text-white focus:outline-none focus:ring-2 focus:ring-[#006DFF] focus:border-[#006DFF] transition-colors appearance-none"
                      >
                        <option value="">Select budget range</option>
                        {budgetOptions.map((budget) => (
                          <option key={budget} value={budget}>
                            {budget}
                          </option>
                        ))}
                      </select>
                    </div>
                  </div>

                  <div>
                    <label
                      htmlFor="timeline"
                      className="block text-sm font-medium text-[#111] dark:text-white mb-2"
                    >
                      Project Timeline
                    </label>
                    <div className="relative">
                      <Calendar
                        size={20}
                        className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"
                      />
                      <select
                        id="timeline"
                        name="timeline"
                        value={formData.timeline}
                        onChange={handleInputChange}
                        className="w-full pl-12 pr-4 py-3 border border-gray-200 dark:border-gray-700 rounded-xl bg-white dark:bg-[#1E1E1E] text-[#111] dark:text-white focus:outline-none focus:ring-2 focus:ring-[#006DFF] focus:border-[#006DFF] transition-colors appearance-none"
                      >
                        <option value="">Select timeline</option>
                        {timelineOptions.map((timeline) => (
                          <option key={timeline} value={timeline}>
                            {timeline}
                          </option>
                        ))}
                      </select>
                    </div>
                  </div>
                </div>

                {/* Message */}
                <div>
                  <label
                    htmlFor="message"
                    className="block text-sm font-medium text-[#111] dark:text-white mb-2"
                  >
                    Project Details *
                  </label>
                  <div className="relative">
                    <MessageSquare
                      size={20}
                      className="absolute left-3 top-3 text-gray-400"
                    />
                    <textarea
                      id="message"
                      name="message"
                      value={formData.message}
                      onChange={handleInputChange}
                      required
                      rows={5}
                      className="w-full pl-12 pr-4 py-3 border border-gray-200 dark:border-gray-700 rounded-xl bg-white dark:bg-[#1E1E1E] text-[#111] dark:text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-[#006DFF] focus:border-[#006DFF] transition-colors resize-vertical"
                      placeholder="Please describe your project requirements, location, and any specific needs..."
                    />
                  </div>
                </div>

                {/* Submit Button */}
                <button
                  type="submit"
                  disabled={contactMutation.isLoading}
                  className="w-full inline-flex items-center justify-center space-x-2 bg-gradient-to-r from-[#006DFF] to-[#2F7BFF] text-white font-semibold text-base px-8 py-4 rounded-full hover:brightness-105 active:scale-95 transition-all duration-150 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {contactMutation.isLoading ? (
                    <>
                      <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                      <span>Sending...</span>
                    </>
                  ) : (
                    <>
                      <Send size={18} />
                      <span>Send Message</span>
                    </>
                  )}
                </button>

                {/* Error Message */}
                {contactMutation.error && (
                  <div className="flex items-center space-x-2 text-red-600 bg-red-50 border border-red-200 rounded-xl p-4">
                    <AlertCircle size={20} />
                    <span className="text-sm">
                      {contactMutation.error.message ||
                        "Failed to send message. Please try again."}
                    </span>
                  </div>
                )}
              </form>
            </div>

            {/* Contact Information */}
            <div>
              <div className="mb-8">
                <h2 className="text-3xl md:text-4xl font-bold text-[#111] dark:text-white mb-4">
                  Get in Touch
                </h2>
                <p className="text-lg text-[#6B7280] dark:text-[#A3A3A3]">
                  Have questions? We're here to help. Contact us through any of
                  the channels below or visit our office.
                </p>
              </div>

              {/* Contact Cards */}
              <div className="space-y-6 mb-8">
                <div className="bg-white dark:bg-[#1E1E1E] border border-gray-100 dark:border-gray-800 rounded-2xl p-6">
                  <div className="flex items-center space-x-4 mb-4">
                    <div className="w-12 h-12 bg-gradient-to-br from-[#006DFF] to-[#2F7BFF] rounded-xl flex items-center justify-center">
                      <Phone size={20} className="text-white" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-[#111] dark:text-white">
                        Call Us
                      </h3>
                      <p className="text-sm text-[#6B7280] dark:text-[#A3A3A3]">
                        Mon-Fri 8AM-6PM
                      </p>
                    </div>
                  </div>
                  <a
                    href={`tel:${company.phone || "+250788123456"}`}
                    className="text-[#006DFF] font-medium hover:underline"
                  >
                    {company.phone || "+250 788 123 456"}
                  </a>
                </div>

                <div className="bg-white dark:bg-[#1E1E1E] border border-gray-100 dark:border-gray-800 rounded-2xl p-6">
                  <div className="flex items-center space-x-4 mb-4">
                    <div className="w-12 h-12 bg-gradient-to-br from-[#006DFF] to-[#2F7BFF] rounded-xl flex items-center justify-center">
                      <Mail size={20} className="text-white" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-[#111] dark:text-white">
                        Email Us
                      </h3>
                      <p className="text-sm text-[#6B7280] dark:text-[#A3A3A3]">
                        We respond within 24 hours
                      </p>
                    </div>
                  </div>
                  <a
                    href={`mailto:${company.email || "info@masstech.rw"}`}
                    className="text-[#006DFF] font-medium hover:underline"
                  >
                    {company.email || "info@masstech.rw"}
                  </a>
                </div>

                <div className="bg-white dark:bg-[#1E1E1E] border border-gray-100 dark:border-gray-800 rounded-2xl p-6">
                  <div className="flex items-center space-x-4 mb-4">
                    <div className="w-12 h-12 bg-gradient-to-br from-[#006DFF] to-[#2F7BFF] rounded-xl flex items-center justify-center">
                      <MapPin size={20} className="text-white" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-[#111] dark:text-white">
                        Visit Us
                      </h3>
                      <p className="text-sm text-[#6B7280] dark:text-[#A3A3A3]">
                        Our office location
                      </p>
                    </div>
                  </div>
                  <p className="text-[#6B7280] dark:text-[#A3A3A3]">
                    {company.address || "KG 15 Ave, Kigali, Rwanda"}
                  </p>
                </div>

                <div className="bg-white dark:bg-[#1E1E1E] border border-gray-100 dark:border-gray-800 rounded-2xl p-6">
                  <div className="flex items-center space-x-4 mb-4">
                    <div className="w-12 h-12 bg-gradient-to-br from-[#006DFF] to-[#2F7BFF] rounded-xl flex items-center justify-center">
                      <Clock size={20} className="text-white" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-[#111] dark:text-white">
                        Business Hours
                      </h3>
                      <p className="text-sm text-[#6B7280] dark:text-[#A3A3A3]">
                        Monday - Friday
                      </p>
                    </div>
                  </div>
                  <div className="space-y-1 text-sm text-[#6B7280] dark:text-[#A3A3A3]">
                    <div>Mon - Fri: 8:00 AM - 6:00 PM</div>
                    <div>Saturday: 9:00 AM - 4:00 PM</div>
                    <div>Sunday: Closed</div>
                  </div>
                </div>
              </div>

              {/* Map Placeholder */}
              <div className="bg-gray-100 dark:bg-gray-800 rounded-2xl h-64 flex items-center justify-center">
                <div className="text-center">
                  <MapPin size={48} className="text-gray-400 mx-auto mb-4" />
                  <p className="text-gray-600 dark:text-gray-400 font-medium">
                    Interactive Map
                  </p>
                  <p className="text-sm text-gray-500 dark:text-gray-500">
                    Kigali, Rwanda
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="w-full bg-[#F8FAFC] dark:bg-[#1A1A1A] py-16 md:py-24">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-[#111] dark:text-white mb-4">
              Frequently Asked Questions
            </h2>
            <p className="text-lg text-[#6B7280] dark:text-[#A3A3A3]">
              Quick answers to common questions about our services and process.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="space-y-6">
              <div className="bg-white dark:bg-[#1E1E1E] rounded-2xl p-6 border border-gray-100 dark:border-gray-800">
                <h3 className="font-semibold text-[#111] dark:text-white mb-2">
                  How long does a typical project take?
                </h3>
                <p className="text-[#6B7280] dark:text-[#A3A3A3] text-sm">
                  Project timelines vary depending on size and complexity.
                  Residential projects typically take 6-18 months, while
                  commercial projects can take 8-24 months.
                </p>
              </div>

              <div className="bg-white dark:bg-[#1E1E1E] rounded-2xl p-6 border border-gray-100 dark:border-gray-800">
                <h3 className="font-semibold text-[#111] dark:text-white mb-2">
                  Do you provide free consultations?
                </h3>
                <p className="text-[#6B7280] dark:text-[#A3A3A3] text-sm">
                  Yes! We offer free initial consultations to discuss your
                  project requirements and provide a detailed quote.
                </p>
              </div>

              <div className="bg-white dark:bg-[#1E1E1E] rounded-2xl p-6 border border-gray-100 dark:border-gray-800">
                <h3 className="font-semibold text-[#111] dark:text-white mb-2">
                  What areas do you serve?
                </h3>
                <p className="text-[#6B7280] dark:text-[#A3A3A3] text-sm">
                  We serve all provinces in Rwanda, with our headquarters based
                  in Kigali. We can handle projects nationwide.
                </p>
              </div>
            </div>

            <div className="space-y-6">
              <div className="bg-white dark:bg-[#1E1E1E] rounded-2xl p-6 border border-gray-100 dark:border-gray-800">
                <h3 className="font-semibold text-[#111] dark:text-white mb-2">
                  Are you licensed and insured?
                </h3>
                <p className="text-[#6B7280] dark:text-[#A3A3A3] text-sm">
                  Yes, we are fully licensed and insured. We meet all regulatory
                  requirements for construction in Rwanda.
                </p>
              </div>

              <div className="bg-white dark:bg-[#1E1E1E] rounded-2xl p-6 border border-gray-100 dark:border-gray-800">
                <h3 className="font-semibold text-[#111] dark:text-white mb-2">
                  Can you help with permits?
                </h3>
                <p className="text-[#6B7280] dark:text-[#A3A3A3] text-sm">
                  Absolutely! We handle all permit applications and regulatory
                  approvals as part of our comprehensive project management
                  service.
                </p>
              </div>

              <div className="bg-white dark:bg-[#1E1E1E] rounded-2xl p-6 border border-gray-100 dark:border-gray-800">
                <h3 className="font-semibold text-[#111] dark:text-white mb-2">
                  What payment options do you offer?
                </h3>
                <p className="text-[#6B7280] dark:text-[#A3A3A3] text-sm">
                  We offer flexible payment plans typically structured around
                  project milestones. Terms are discussed during the
                  consultation phase.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}
