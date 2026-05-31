import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import {
  ArrowRight,
  Building2,
  Home as HomeIcon,
  Factory,
  CheckCircle,
  Users,
  Calendar,
  Award,
  Mail,
  Phone,
  MapPin,
} from "lucide-react";
import Header from "../components/Header";
import Footer from "../components/Footer";

export default function HomePage() {
  const [email, setEmail] = useState("");

  // Fetch company info
  const { data: companyData } = useQuery({
    queryKey: ["company"],
    queryFn: async () => {
      const response = await fetch("/api/company");
      if (!response.ok) throw new Error("Failed to fetch company info");
      return response.json();
    },
  });

  // Fetch featured services (limit to 3)
  const { data: servicesData } = useQuery({
    queryKey: ["services", "featured"],
    queryFn: async () => {
      const response = await fetch("/api/services");
      if (!response.ok) throw new Error("Failed to fetch services");
      return response.json();
    },
  });

  // Fetch featured projects (limit to 3)
  const { data: projectsData } = useQuery({
    queryKey: ["projects", "featured"],
    queryFn: async () => {
      const response = await fetch("/api/projects?limit=3");
      if (!response.ok) throw new Error("Failed to fetch projects");
      return response.json();
    },
  });

  const company = companyData?.data || {};
  const services = servicesData?.data?.slice(0, 3) || [];
  const projects = projectsData?.data?.slice(0, 3) || [];

  const handleNewsletterSubmit = async (e) => {
    e.preventDefault();
    // Here you could implement newsletter signup
    console.log("Newsletter signup:", email);
    setEmail("");
    alert("Thank you for subscribing to our newsletter!");
  };

  return (
    <div className="min-h-screen bg-white dark:bg-[#121212]">
      <Header />

      {/* Hero Section */}
      <section
        className="relative w-full min-h-[70vh] md:min-h-[80vh] flex items-center justify-center bg-cover bg-center bg-no-repeat"
        style={{
          backgroundImage: `linear-gradient(rgba(0, 0, 0, 0.5), rgba(0, 0, 0, 0.3)), url('https://images.unsplash.com/photo-1541888946425-d81bb19240f5?auto=format&fit=crop&w=1920&q=80')`,
        }}
      >
       <div className="relative z-10 max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center text-white">
          <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-extrabold leading-tight mb-6">
  Building Excellence
  <br className="hidden sm:block" />
  <span className="text-[#4D8FFF]"> in Rwanda</span>
</h1>

          <p className="text-lg md:text-xl text-gray-200 max-w-3xl mx-auto leading-relaxed mb-8">
            {company.description ||
              "MASS Tech Ltd is a premier construction company offering top-notch services in construction, architecture, interior design, and project management."}
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
            <a
              href="/projects"
              className="inline-flex items-center space-x-2 bg-gradient-to-r from-[#006DFF] to-[#2F7BFF] text-white font-semibold text-sm md:text-base px-6 md:px-8 py-3 md:py-4 rounded-full hover:brightness-105 hover:shadow-lg hover:-translate-y-0.5 active:brightness-95 active:scale-95 active:translate-y-0 transition-all duration-150"
            >
              <span>View Our Projects</span>
              <ArrowRight size={18} />
            </a>
            <a
              href="/contact"
              className="inline-flex items-center space-x-2 bg-white bg-opacity-10 backdrop-blur-sm border border-white border-opacity-30 text-white font-semibold text-sm md:text-base px-6 md:px-8 py-3 md:py-4 rounded-full hover:bg-opacity-20 active:scale-95 transition-all duration-150"
            >
              <Phone size={18} />
              <span>Get Free Quote</span>
            </a>
          </div>
        </div>
      </section>

      {/* Company Stats */}
      <section className="w-full bg-[#F8FAFC] dark:bg-[#1A1A1A] py-12 md:py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            <div className="text-center">
              <div className="text-3xl md:text-4xl font-bold text-[#006DFF] mb-2">
                {company.years_experience || "10"}+
              </div>
              <div className="text-sm md:text-base text-[#6B7280] dark:text-[#A3A3A3] font-medium">
                Years Experience
              </div>
            </div>
            <div className="text-center">
              <div className="text-3xl md:text-4xl font-bold text-[#006DFF] mb-2">
                {company.total_projects || "150"}+
              </div>
              <div className="text-sm md:text-base text-[#6B7280] dark:text-[#A3A3A3] font-medium">
                Projects Completed
              </div>
            </div>
            <div className="text-center">
              <div className="text-3xl md:text-4xl font-bold text-[#006DFF] mb-2">
                {company.happy_clients || "120"}+
              </div>
              <div className="text-sm md:text-base text-[#6B7280] dark:text-[#A3A3A3] font-medium">
                Happy Clients
              </div>
            </div>
            <div className="text-center">
              <div className="text-3xl md:text-4xl font-bold text-[#006DFF] mb-2">
                100%
              </div>
              <div className="text-sm md:text-base text-[#6B7280] dark:text-[#A3A3A3] font-medium">
                Quality Guaranteed
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Services Section */}
      <section className="w-full bg-white dark:bg-[#121212] py-16 md:py-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12 md:mb-16">
            <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-[#111] dark:text-white mb-6">
              Our Core Services
            </h2>
            <p className="text-lg text-[#6B7280] dark:text-[#A3A3A3] max-w-2xl mx-auto">
              From residential homes to commercial buildings and industrial
              facilities, we deliver excellence in every project.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {services.map((service, index) => {
              const IconComponent =
                service.icon === "Home"
                  ? HomeIcon
                  : service.icon === "Building2"
                    ? Building2
                    : service.icon === "Factory"
                      ? Factory
                      : Building2;

              return (
                <div
                  key={service.id}
                  className="bg-white dark:bg-[#1E1E1E] border border-[#E5E7EB] dark:border-[#333333] rounded-3xl p-6 md:p-8 hover:shadow-lg dark:hover:shadow-lg dark:hover:shadow-black/20 hover:-translate-y-1 transition-all duration-200 group cursor-pointer"
                  onClick={() =>
                    (window.location.href = `/services/${service.id}`)
                  }
                >
                  <div className="w-12 h-12 bg-gradient-to-br from-[#006DFF] to-[#2F7BFF] rounded-2xl flex items-center justify-center mb-6 group-hover:scale-105 transition-transform">
                    <IconComponent size={24} className="text-white" />
                  </div>

                  <h3 className="text-xl font-bold text-[#111] dark:text-white mb-4">
                    {service.title}
                  </h3>

                  <p className="text-[#6B7280] dark:text-[#A3A3A3] leading-relaxed mb-6">
                    {service.short_description}
                  </p>

                  <a
                    href={`/services/${service.id}`}
                    className="inline-flex items-center space-x-2 text-[#006DFF] font-medium hover:text-[#0056d6] transition-colors"
                  >
                    <span>Learn More</span>
                    <ArrowRight size={16} />
                  </a>
                </div>
              );
            })}
          </div>

          <div className="text-center mt-12">
            <a
              href="/services"
              className="inline-flex items-center space-x-2 bg-gradient-to-r from-[#006DFF] to-[#2F7BFF] text-white font-semibold text-base px-8 py-4 rounded-full hover:brightness-105 hover:shadow-lg hover:-translate-y-0.5 active:brightness-95 active:scale-95 active:translate-y-0 transition-all duration-150"
            >
              <span>View All Services</span>
              <ArrowRight size={18} />
            </a>
          </div>
        </div>
      </section>

      {/* Featured Projects */}
      <section className="w-full bg-[#F8FAFC] dark:bg-[#1A1A1A] py-16 md:py-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12 md:mb-16">
            <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-[#111] dark:text-white mb-6">
              Featured Projects
            </h2>
            <p className="text-lg text-[#6B7280] dark:text-[#A3A3A3] max-w-2xl mx-auto">
              Take a look at some of our recent completed projects that showcase
              our commitment to quality and innovation.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {projects.map((project, index) => (
              <div
                key={project.id}
                className="bg-white dark:bg-[#1E1E1E] rounded-3xl overflow-hidden shadow-md hover:shadow-lg dark:hover:shadow-lg dark:hover:shadow-black/20 hover:-translate-y-1 transition-all duration-200 group cursor-pointer"
                onClick={() =>
                  (window.location.href = `/projects/${project.id}`)
                }
              >
                <div className="relative h-48 md:h-56 overflow-hidden">
                  <img
                    src={
                      project.images?.[0] ||
                      `https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?auto=format&fit=crop&w=800&q=80`
                    }
                    alt={project.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                  <div className="absolute top-4 left-4">
                    <span className="bg-[#006DFF] text-white text-xs font-semibold px-3 py-1 rounded-full">
                      {project.category}
                    </span>
                  </div>
                </div>

                <div className="p-6">
                  <h3 className="text-xl font-bold text-[#111] dark:text-white mb-2">
                    {project.title}
                  </h3>

                  <p className="text-[#6B7280] dark:text-[#A3A3A3] text-sm mb-4">
                    {project.location} • {project.project_value}
                  </p>

                  <p className="text-[#6B7280] dark:text-[#A3A3A3] leading-relaxed">
                    {project.short_description}
                  </p>
                </div>
              </div>
            ))}
          </div>

          <div className="text-center mt-12">
            <a
              href="/projects"
              className="inline-flex items-center space-x-2 bg-gradient-to-r from-[#006DFF] to-[#2F7BFF] text-white font-semibold text-base px-8 py-4 rounded-full hover:brightness-105 hover:shadow-lg hover:-translate-y-0.5 active:brightness-95 active:scale-95 active:translate-y-0 transition-all duration-150"
            >
              <span>View All Projects</span>
              <ArrowRight size={18} />
            </a>
          </div>
        </div>
      </section>

      {/* Why Choose Us */}
      <section className="w-full bg-white dark:bg-[#121212] py-16 md:py-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12 md:mb-16">
            <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-[#111] dark:text-white mb-6">
              Why Choose MASS Tech?
            </h2>
            <p className="text-lg text-[#6B7280] dark:text-[#A3A3A3] max-w-2xl mx-auto">
              We combine years of experience with innovative approaches to
              deliver exceptional results for every project.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="w-16 h-16 bg-gradient-to-br from-[#006DFF] to-[#2F7BFF] rounded-2xl flex items-center justify-center mx-auto mb-6">
                <CheckCircle size={28} className="text-white" />
              </div>
              <h3 className="text-xl font-bold text-[#111] dark:text-white mb-4">
                Quality Assurance
              </h3>
              <p className="text-[#6B7280] dark:text-[#A3A3A3] leading-relaxed">
                We maintain the highest standards of quality in all our projects
                with rigorous quality control processes.
              </p>
            </div>

            <div className="text-center">
              <div className="w-16 h-16 bg-gradient-to-br from-[#006DFF] to-[#2F7BFF] rounded-2xl flex items-center justify-center mx-auto mb-6">
                <Calendar size={28} className="text-white" />
              </div>
              <h3 className="text-xl font-bold text-[#111] dark:text-white mb-4">
                On-Time Delivery
              </h3>
              <p className="text-[#6B7280] dark:text-[#A3A3A3] leading-relaxed">
                We understand the importance of deadlines and consistently
                deliver projects on time and within budget.
              </p>
            </div>

            <div className="text-center">
              <div className="w-16 h-16 bg-gradient-to-br from-[#006DFF] to-[#2F7BFF] rounded-2xl flex items-center justify-center mx-auto mb-6">
                <Users size={28} className="text-white" />
              </div>
              <h3 className="text-xl font-bold text-[#111] dark:text-white mb-4">
                Expert Team
              </h3>
              <p className="text-[#6B7280] dark:text-[#A3A3A3] leading-relaxed">
                Our team of experienced professionals brings expertise and
                innovation to every project.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Newsletter Signup */}
      <section className="w-full bg-gradient-to-r from-[#006DFF] to-[#2F7BFF] py-16 md:py-20">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
            Stay Updated with Our Latest Projects
          </h2>
          <p className="text-lg text-blue-100 mb-8">
            Subscribe to our newsletter to receive updates on our latest
            projects and industry insights.
          </p>

          <form onSubmit={handleNewsletterSubmit} className="max-w-md mx-auto">
            <div className="flex flex-col sm:flex-row gap-4">
              <input
                type="email"
                placeholder="Enter your email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="flex-1 px-4 py-3 rounded-xl border-0 focus:outline-none focus:ring-4 focus:ring-blue-300 text-gray-900"
                required
              />
              <button
                type="submit"
                className="bg-white text-[#006DFF] font-semibold px-6 py-3 rounded-xl hover:bg-gray-50 active:scale-95 transition-all duration-150"
              >
                Subscribe
              </button>
            </div>
          </form>
        </div>
      </section>

      <Footer />
    </div>
  );
}
