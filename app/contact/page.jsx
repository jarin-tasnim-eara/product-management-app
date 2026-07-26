import { FaEnvelope, FaPhone } from "react-icons/fa";

export default function ContactPage() {
  return (
    <main className="max-w-3xl mx-auto px-6 py-16">
      <p className="text-xs uppercase tracking-wide text-[#6E7A52] font-semibold mb-2">
        Get in Touch
      </p>
      <h1 className="text-3xl font-bold text-[#1B2430] mb-6">Contact Us</h1>
      <div className="bg-white border border-[#1B2430]/10 rounded-xl p-8 space-y-4">
        <p className="text-[#1B2430]/70">
          Have a question or need help? Reach out to us anytime.
        </p>
        <div className="flex items-center gap-3 text-sm text-[#1B2430]/70">
          <FaEnvelope className="text-[#6E7A52]" />
          support@producthub.example
        </div>
        <div className="flex items-center gap-3 text-sm text-[#1B2430]/70">
          <FaPhone className="text-[#6E7A52]" />
          +880 1XXX-XXXXXX
        </div>
      </div>
    </main>
  );
}