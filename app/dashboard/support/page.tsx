"use client";
import { useState, useEffect } from "react";
import { createClientComponentClient } from "@supabase/auth-helpers-nextjs";
import { useUser } from "@/hooks/use-user";

const tabs = [
  { label: "Create Ticket" },
  { label: "Tickets" },
  { label: "FAQs" },
];

type Ticket = {
  id: string;
  user_id: string;
  user_name: string;
  page: string;
  message: string;
  ip_address?: string;
  location?: string;
  device?: string;
  browser?: string;
  os?: string;
  created_at: string;
  updated_at: string;
  status: string;
};

const PAGES = [
  "Dashboard",
  "Calculator",
  "Pricing",
  "Features",
  "Signup/Login",
  "Other",
];

const faqs = [
  {
    category: "Getting Started",
    items: [
      {
        q: "What is Viking Freight?",
        a: "Viking Freight is a shipping platform that provides discounted USPS® and UPS® shipping rates for businesses of all sizes. The platform is free to use, with no monthly fees or hidden costs.",
      },
      {
        q: "How do I get started with Viking Freight?",
        a: "Simply create a free account, connect your carrier accounts (or create new ones through the platform), and you’re ready to start shipping at discounted rates.",
      },
      {
        q: "Is Viking Freight really free to use?",
        a: "Yes! There are no monthly fees, subscription costs, or markup on postage. Viking Freight earns a small portion of the discount from carriers, but users still save significantly compared to retail rates.",
      },
      {
        q: "Do I need existing carrier accounts?",
        a: "No, you don’t need existing carrier accounts. You can create new ones through the platform or connect your existing accounts.",
      },
    ],
  },
  {
    category: "Shipping Rates",
    items: [
      {
        q: "How much can I save on shipping?",
        a: "Users typically save 30–89% compared to retail rates. The exact savings depend on the service, package dimensions, weight, and destination.",
      },
      {
        q: "How do your rates compare to USPS and UPS retail prices?",
        a: "Viking Freight offers Commercial Plus Pricing for USPS (the highest tier of discounts) and negotiated rates for UPS that are significantly lower than retail prices. These discounts are usually only available to high-volume shippers, but Viking Freight makes them accessible to all businesses.",
      },
      {
        q: "Are there any hidden fees or charges?",
        a: "No. There are no hidden fees, no markup on postage, and no minimum shipping requirements.",
      },
      {
        q: "Which shipping services and carriers do you support?",
        a: "All major USPS services (Priority Mail, First Class Package, Priority Mail Express, etc.) and UPS services (Ground, 2nd Day Air, Next Day Air, etc.) are supported. More carriers and services are being added regularly.",
      },
    ],
  },
  {
    category: "Labels & Printing",
    items: [
      {
        q: "What types of printers can I use?",
        a: "All standard printers are supported, including desktop inkjet/laser printers and thermal label printers. You can print on regular paper or adhesive labels.",
      },
      {
        q: "Can I print multiple labels at once?",
        a: "Yes, batch label printing allows you to create and print multiple shipping labels at once.",
      },
      {
        q: "What label formats do you support?",
        a: "Formats include 4x6 thermal labels, 8.5x11 paper (with 1 or 2 labels per page), and more. Users can choose the format that works best for their printer and workflow.",
      },
      {
        q: "Can I customize my shipping labels?",
        a: "Yes, labels can be customized with a company logo, return address, and other information. Different label templates can be saved for different shipment types.",
      },
    ],
  },
  {
    category: "Tracking & Delivery",
    items: [
      {
        q: "How do I track my shipments?",
        a: "All shipments include tracking. Users can track shipments from their dashboard or use the carrier’s tracking page with the provided tracking number.",
      },
      {
        q: "Can I send tracking information to my customers?",
        a: "Yes, tracking information can be sent automatically via email. Email templates are customizable, and users can choose when to send notifications (e.g., when the label is created or when the package is scanned).",
      },
      {
        q: "What if a package is lost or damaged?",
        a: "Claims can be filed directly through the platform. Viking Freight assists with the claims process and works to resolve issues quickly.",
      },
      {
        q: "Do you offer shipping insurance?",
        a: "Yes, affordable shipping insurance options are available for both domestic and international shipments. Insurance can be added during label creation.",
      },
    ],
  },
];

export default function Support() {
  const [activeTab, setActiveTab] = useState(0);
  const [page, setPage] = useState(PAGES[0]);
  const [message, setMessage] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [tickets, setTickets] = useState<Ticket[]>([]);
  const [loadingTickets, setLoadingTickets] = useState(false);
  const { user } = useUser();
  const supabase = createClientComponentClient();

  // Fetch tickets for the user
  useEffect(() => {
    if (activeTab === 1 && user) {
      setLoadingTickets(true);
      supabase
        .from("tickets")
        .select("*")
        .eq("user_id", user.id)
        .order("created_at", { ascending: false })
        .then(({ data, error }) => {
          setTickets(data || []);
          setLoadingTickets(false);
        });
    }
  }, [activeTab, user]);

  // Handle ticket form submit
  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setSubmitting(true);
    setError("");
    setSuccess("");
    if (!user) {
      setError("You must be signed in to submit a ticket.");
      setSubmitting(false);
      return;
    }
    if (!message.trim()) {
      setError("Message is required.");
      setSubmitting(false);
      return;
    }
    // Optionally collect device/browser/os info here
    const device = typeof window !== "undefined" ? navigator.platform : "";
    const browser = typeof window !== "undefined" ? navigator.userAgent : "";
    const os = typeof window !== "undefined" ? navigator.appVersion : "";
    // IP/location could be fetched via a geoip API if desired
    const ticket = {
      user_id: user.id,
      user_name: user.user_metadata?.full_name || user.email,
      page,
      message,
      device,
      browser,
      os,
    };
    const { error: insertError } = await supabase.from("tickets").insert([ticket]);
    if (insertError) {
      setError(insertError.message);
    } else {
      setSuccess("Ticket submitted! Our support team will respond soon.");
      setMessage("");
      setPage(PAGES[0]);
    }
    setSubmitting(false);
  }

  return (
    <div className="max-w-4xl mx-auto py-10">
      {/* Tabs */}
      <div className="flex space-x-2 mb-8">
        {tabs.map((tab, i) => (
          <button
            key={tab.label}
            className={`px-6 py-2 rounded-t-lg font-semibold text-lg border-b-2 border-transparent bg-gradient-to-r from-purple-600/10 to-blue-600/10 text-purple-700 hover:bg-purple-100 transition-colors ${i === activeTab ? 'border-purple-600 bg-white' : ''}`}
            aria-selected={i === activeTab}
            tabIndex={0}
            type="button"
            onClick={() => setActiveTab(i)}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Tab Content */}
      {activeTab === 0 && (
        <form onSubmit={handleSubmit} className="bg-white rounded-lg shadow-sm p-8 border border-gray-100 max-w-xl mx-auto">
          <h2 className="text-2xl font-bold text-purple-700 mb-6">Create Support Ticket</h2>
          <div className="mb-4">
            <label className="block font-semibold mb-1 text-gray-700">Page</label>
            <select
              className="w-full px-4 py-2 rounded border border-gray-300 focus:border-purple-500 focus:ring-2 focus:ring-purple-200 outline-none text-lg bg-white"
              value={page}
              onChange={e => setPage(e.target.value)}
              required
            >
              {PAGES.map((p) => (
                <option key={p} value={p}>{p}</option>
              ))}
            </select>
          </div>
          <div className="mb-4">
            <label className="block font-semibold mb-1 text-gray-700">Message</label>
            <textarea
              className="w-full px-4 py-2 rounded border border-gray-300 focus:border-purple-500 focus:ring-2 focus:ring-purple-200 outline-none text-lg bg-white min-h-[120px]"
              value={message}
              onChange={e => setMessage(e.target.value)}
              required
              placeholder="Describe your issue or question..."
            />
          </div>
          {error && <div className="mb-2 text-red-600 font-semibold">{error}</div>}
          {success && <div className="mb-2 text-green-600 font-semibold">{success}</div>}
          <button
            type="submit"
            className="mt-2 px-6 py-2 bg-gradient-to-r from-purple-600 to-blue-600 text-white font-semibold rounded shadow hover:from-purple-700 hover:to-blue-700 transition disabled:opacity-60"
            disabled={submitting}
          >
            {submitting ? "Submitting..." : "Submit Ticket"}
          </button>
        </form>
      )}

      {activeTab === 1 && (
        <div className="bg-white rounded-lg shadow-sm p-8 border border-gray-100">
          <h2 className="text-2xl font-bold text-purple-700 mb-6">Your Support Tickets</h2>
          {loadingTickets ? (
            <div>Loading tickets...</div>
          ) : tickets.length === 0 ? (
            <div className="text-gray-500">No tickets found.</div>
          ) : (
            <div className="overflow-x-auto">
              <table className="min-w-full text-left border">
                <thead>
                  <tr className="bg-purple-50">
                    <th className="px-4 py-2 font-semibold">Page</th>
                    <th className="px-4 py-2 font-semibold">Message</th>
                    <th className="px-4 py-2 font-semibold">Status</th>
                    <th className="px-4 py-2 font-semibold">Created</th>
                  </tr>
                </thead>
                <tbody>
                  {tickets.map((t) => (
                    <tr key={t.id} className="border-t">
                      <td className="px-4 py-2">{t.page}</td>
                      <td className="px-4 py-2 max-w-xs truncate" title={t.message}>{t.message}</td>
                      <td className="px-4 py-2">
                        <span className={`inline-block px-3 py-1 rounded-full text-xs font-semibold ${t.status === 'open' ? 'bg-green-100 text-green-700' : t.status === 'resolved' ? 'bg-blue-100 text-blue-700' : 'bg-gray-100 text-gray-700'}`}>{t.status}</span>
                      </td>
                      <td className="px-4 py-2 text-sm text-gray-500">{new Date(t.created_at).toLocaleString()}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      )}

      {activeTab === 2 && (
        <>
          {/* Search Bar */}
          <div className="mb-8 flex items-center gap-2">
            <input
              type="text"
              placeholder="Search for answers..."
              className="w-full px-4 py-2 rounded border border-gray-300 focus:border-purple-500 focus:ring-2 focus:ring-purple-200 outline-none text-lg bg-white"
              aria-label="Search FAQs"
              disabled
            />
            <span className="text-purple-400"><svg width="24" height="24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-search"><circle cx="11" cy="11" r="8"/><path d="m21 21-4.3-4.3"/></svg></span>
          </div>

          {/* FAQ Content */}
          <div className="space-y-10">
            {faqs.map((cat) => (
              <section key={cat.category} className="bg-white rounded-lg shadow-sm p-6 border border-gray-100">
                <h3 className="text-2xl font-bold text-purple-700 mb-4">{cat.category}</h3>
                <ul className="space-y-6">
                  {cat.items.map((item, idx) => (
                    <li key={item.q} className="">
                      <div className="font-semibold text-lg text-gray-900 mb-1 flex items-center gap-2">
                        <span className="inline-block w-2 h-2 rounded-full bg-gradient-to-r from-purple-500 to-blue-500 mr-2"></span>
                        {item.q}
                      </div>
                      <div className="text-gray-700 text-base pl-6">{item.a}</div>
                    </li>
                  ))}
                </ul>
              </section>
            ))}
          </div>

          {/* Still Have Questions? */}
          <div className="mt-16 text-center">
            <div className="inline-block bg-gradient-to-r from-purple-600 to-blue-600 rounded-full px-6 py-3 shadow-lg">
              <h4 className="text-xl font-bold text-white mb-1">Still Have Questions?</h4>
              <p className="text-white mb-2">Our alien support team is here to help you 24/7.</p>
              <a
                href="mailto:support@alienshipper.com"
                className="inline-block mt-2 px-6 py-2 bg-white text-purple-700 font-semibold rounded shadow hover:bg-purple-100 transition"
              >
                Contact Support
              </a>
            </div>
          </div>
        </>
      )}
    </div>
  );
}
