"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { createClientComponentClient } from "@supabase/auth-helpers-nextjs"
import { useUser } from "@/hooks/use-user"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import {
  HelpCircle,
  MessageSquare,
  FileText,
  Send,
  Search,
  Rocket,
  Zap,
  Globe,
  CheckCircle,
  Clock,
  AlertCircle,
  Sparkles,
  Mail,
} from "lucide-react"

const tabs = [
  { label: "Create Ticket", icon: MessageSquare },
  { label: "My Tickets", icon: FileText },
  { label: "Knowledge Base", icon: HelpCircle },
]

type Ticket = {
  id: string
  user_id: string
  user_name: string
  page: string
  message: string
  ip_address?: string
  location?: string
  device?: string
  browser?: string
  os?: string
  created_at: string
  updated_at: string
  status: string
}

const PAGES = ["Dashboard", "Calculator", "Pricing", "Features", "Signup/Login", "Other"]

const faqs = [
  {
    category: "Getting Started",
    icon: Rocket,
    items: [
      {
        q: "What is AlienShipper?",
        a: "AlienShipper is an intergalactic shipping platform that provides discounted USPS® and UPS® shipping rates using advanced alien technology. Our platform is free to use, with no monthly fees or hidden costs.",
      },
      {
        q: "How do I get started with AlienShipper?",
        a: "Simply create a free account, connect your carrier accounts (or create new ones through our platform), and you're ready to start shipping at warp speed with discounted rates.",
      },
      {
        q: "Is AlienShipper really free to use?",
        a: "Yes! There are no monthly fees, subscription costs, or markup on postage. AlienShipper earns a small portion of the discount from carriers, but users still save significantly compared to retail rates.",
      },
      {
        q: "Do I need existing carrier accounts?",
        a: "No, you don't need existing carrier accounts. You can create new ones through our platform or connect your existing accounts using our alien technology.",
      },
    ],
  },
  {
    category: "Shipping Rates",
    icon: Zap,
    items: [
      {
        q: "How much can I save on shipping?",
        a: "Users typically save 30–89% compared to retail rates using our alien technology. The exact savings depend on the service, package dimensions, weight, and destination across the galaxy.",
      },
      {
        q: "How do your rates compare to USPS and UPS retail prices?",
        a: "AlienShipper offers Commercial Plus Pricing for USPS and negotiated rates for UPS that are significantly lower than retail prices. These discounts are usually only available to high-volume shippers, but our alien technology makes them accessible to all businesses.",
      },
      {
        q: "Are there any hidden fees or charges?",
        a: "No. There are no hidden fees, no markup on postage, and no minimum shipping requirements. Our alien overlords believe in transparent pricing.",
      },
      {
        q: "Which shipping services and carriers do you support?",
        a: "All major USPS services (Priority Mail, First Class Package, Priority Mail Express, etc.) and UPS services (Ground, 2nd Day Air, Next Day Air, etc.) are supported. More carriers and services are being added regularly as we expand across the galaxy.",
      },
    ],
  },
  {
    category: "Labels & Printing",
    icon: FileText,
    items: [
      {
        q: "What types of printers can I use?",
        a: "All standard Earth printers are supported, including desktop inkjet/laser printers and thermal label printers. You can print on regular paper or adhesive labels using our alien-enhanced printing technology.",
      },
      {
        q: "Can I print multiple labels at once?",
        a: "Yes, our batch label printing allows you to create and print multiple shipping labels at warp speed.",
      },
      {
        q: "What label formats do you support?",
        a: "Formats include 4x6 thermal labels, 8.5x11 paper (with 1 or 2 labels per page), and more. Users can choose the format that works best for their printer and intergalactic workflow.",
      },
      {
        q: "Can I customize my shipping labels?",
        a: "Yes, labels can be customized with your company logo, return address, and other information. Different label templates can be saved for different shipment types across different planets.",
      },
    ],
  },
  {
    category: "Tracking & Delivery",
    icon: Globe,
    items: [
      {
        q: "How do I track my shipments?",
        a: "All shipments include real-time tracking powered by our alien satellite network. Users can track shipments from their dashboard or use the carrier's tracking page with the provided tracking number.",
      },
      {
        q: "Can I send tracking information to my customers?",
        a: "Yes, tracking information can be sent automatically via email using our alien communication systems. Email templates are customizable, and users can choose when to send notifications.",
      },
      {
        q: "What if a package is lost or damaged?",
        a: "Claims can be filed directly through our platform. AlienShipper assists with the claims process and works with our alien insurance partners to resolve issues quickly.",
      },
      {
        q: "Do you offer shipping insurance?",
        a: "Yes, affordable shipping insurance options are available for both domestic and intergalactic shipments. Insurance can be added during label creation and is backed by our alien insurance consortium.",
      },
    ],
  },
]

export default function Support() {
  const [activeTab, setActiveTab] = useState(0)
  const [page, setPage] = useState(PAGES[0])
  const [message, setMessage] = useState("")
  const [submitting, setSubmitting] = useState(false)
  const [error, setError] = useState("")
  const [success, setSuccess] = useState("")
  const [tickets, setTickets] = useState<Ticket[]>([])
  const [loadingTickets, setLoadingTickets] = useState(false)
  const [searchQuery, setSearchQuery] = useState("")
  const { user } = useUser()
  const supabase = createClientComponentClient()

  // Fetch tickets for the user
  useEffect(() => {
    if (activeTab === 1 && user) {
      setLoadingTickets(true)
      supabase
        .from("tickets")
        .select("*")
        .eq("user_id", user.id)
        .order("created_at", { ascending: false })
        .then(({ data, error }) => {
          setTickets(data || [])
          setLoadingTickets(false)
        })
    }
  }, [activeTab, user])

  // Handle ticket form submit
  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    setSubmitting(true)
    setError("")
    setSuccess("")

    if (!user) {
      setError("You must be signed in to submit a ticket.")
      setSubmitting(false)
      return
    }

    if (!message.trim()) {
      setError("Message is required.")
      setSubmitting(false)
      return
    }

    const device = typeof window !== "undefined" ? navigator.platform : ""
    const browser = typeof window !== "undefined" ? navigator.userAgent : ""
    const os = typeof window !== "undefined" ? navigator.appVersion : ""

    const ticket = {
      user_id: user.id,
      user_name: user.user_metadata?.full_name || user.email,
      page,
      message,
      device,
      browser,
      os,
    }

    const { error: insertError } = await supabase.from("tickets").insert([ticket])

    if (insertError) {
      setError(insertError.message)
    } else {
      setSuccess("Ticket transmitted to our alien support team! They will respond at warp speed.")
      setMessage("")
      setPage(PAGES[0])
      setTimeout(() => setSuccess(""), 5000)
    }
    setSubmitting(false)
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case "open":
        return "from-green-500/20 to-emerald-500/20 border-green-400/30 text-green-300"
      case "resolved":
        return "from-blue-500/20 to-cyan-500/20 border-blue-400/30 text-blue-300"
      case "closed":
        return "from-gray-500/20 to-slate-500/20 border-gray-400/30 text-gray-300"
      default:
        return "from-yellow-500/20 to-orange-500/20 border-yellow-400/30 text-yellow-300"
    }
  }

  const filteredFaqs = faqs
    .map((category) => ({
      ...category,
      items: category.items.filter(
        (item) =>
          searchQuery === "" ||
          item.q.toLowerCase().includes(searchQuery.toLowerCase()) ||
          item.a.toLowerCase().includes(searchQuery.toLowerCase()),
      ),
    }))
    .filter((category) => category.items.length > 0)

  return (
    <div className="max-w-6xl mx-auto space-y-8">
      {/* Header */}
      <div className="relative">
        <div className="absolute inset-0 bg-gradient-to-r from-purple-500/20 to-blue-500/20 rounded-2xl blur-xl"></div>
        <div className="relative bg-gradient-to-br from-slate-800/90 to-slate-900/90 backdrop-blur-xl rounded-2xl border border-purple-500/20 p-8">
          <div className="text-center">
            <div className="w-16 h-16 bg-gradient-to-br from-purple-500 to-blue-500 rounded-full flex items-center justify-center mx-auto mb-4 shadow-2xl">
              <HelpCircle className="w-8 h-8 text-white" />
            </div>
            <h1 className="text-4xl font-bold bg-gradient-to-r from-purple-400 to-blue-400 bg-clip-text text-transparent mb-2">
              Alien Support Center
            </h1>
            <p className="text-purple-200/80 text-lg">
              Our intergalactic support team is here to help you navigate the cosmos of shipping
            </p>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex space-x-2 bg-slate-800/50 p-2 rounded-2xl border border-purple-500/20">
        {tabs.map((tab, i) => {
          const Icon = tab.icon
          return (
            <button
              key={tab.label}
              className={`flex-1 flex items-center justify-center space-x-2 px-6 py-3 rounded-xl font-semibold transition-all duration-300 ${
                i === activeTab
                  ? "bg-gradient-to-r from-purple-500/80 to-blue-500/80 text-white shadow-lg border border-purple-400/30"
                  : "text-purple-200 hover:bg-gradient-to-r hover:from-purple-500/20 hover:to-blue-500/20 hover:text-white"
              }`}
              onClick={() => setActiveTab(i)}
            >
              <Icon className="w-5 h-5" />
              <span>{tab.label}</span>
            </button>
          )
        })}
      </div>

      {/* Success/Error Messages */}
      {success && (
        <div className="bg-gradient-to-r from-green-500/10 to-emerald-500/10 border border-green-400/20 rounded-xl p-4 flex items-center">
          <CheckCircle className="w-5 h-5 text-green-400 mr-3" />
          <span className="text-green-200 font-medium">{success}</span>
        </div>
      )}

      {error && (
        <div className="bg-gradient-to-r from-red-500/10 to-pink-500/10 border border-red-400/20 rounded-xl p-4 flex items-center">
          <AlertCircle className="w-5 h-5 text-red-400 mr-3" />
          <span className="text-red-200 font-medium">{error}</span>
        </div>
      )}

      {/* Tab Content */}
      {activeTab === 0 && (
        <div className="relative">
          <div className="absolute inset-0 bg-gradient-to-br from-purple-500/5 to-blue-500/5 rounded-2xl blur-xl"></div>
          <div className="relative bg-gradient-to-br from-slate-800/90 to-slate-900/90 backdrop-blur-xl rounded-2xl border border-purple-500/20 p-8 max-w-2xl mx-auto">
            <h2 className="text-2xl font-bold text-white mb-6 flex items-center">
              <MessageSquare className="w-6 h-6 mr-3 text-purple-400" />
              Create Support Ticket
            </h2>
            <form onSubmit={handleSubmit} className="space-y-6">
              <div>
                <label className="block text-sm font-medium text-purple-300 mb-2">Page/Section</label>
                <select
                  className="w-full px-4 py-3 bg-slate-700/50 border border-slate-600/50 rounded-xl text-white focus:border-purple-400 focus:ring-purple-400/20 focus:ring-2 outline-none"
                  value={page}
                  onChange={(e) => setPage(e.target.value)}
                  required
                >
                  {PAGES.map((p) => (
                    <option key={p} value={p}>
                      {p}
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-purple-300 mb-2">Message</label>
                <textarea
                  className="w-full px-4 py-3 bg-slate-700/50 border border-slate-600/50 rounded-xl text-white placeholder-slate-400 focus:border-purple-400 focus:ring-purple-400/20 focus:ring-2 outline-none resize-none"
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  required
                  rows={6}
                  placeholder="Describe your issue or question in detail..."
                />
              </div>
              <Button
                type="submit"
                disabled={submitting}
                className="w-full py-3 bg-gradient-to-r from-purple-500/80 to-blue-500/80 hover:from-purple-500 hover:to-blue-500 text-white font-semibold rounded-xl transition-all duration-300 shadow-lg hover:shadow-xl border border-purple-400/20 hover:border-purple-400/40"
              >
                {submitting ? (
                  <>
                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2"></div>
                    Transmitting...
                  </>
                ) : (
                  <>
                    <Send className="w-4 h-4 mr-2" />
                    Send to Alien Support
                  </>
                )}
              </Button>
            </form>
          </div>
        </div>
      )}

      {activeTab === 1 && (
        <div className="relative">
          <div className="absolute inset-0 bg-gradient-to-br from-blue-500/5 to-purple-500/5 rounded-2xl blur-xl"></div>
          <div className="relative bg-gradient-to-br from-slate-800/90 to-slate-900/90 backdrop-blur-xl rounded-2xl border border-blue-500/20 p-8">
            <h2 className="text-2xl font-bold text-white mb-6 flex items-center">
              <FileText className="w-6 h-6 mr-3 text-blue-400" />
              Your Support Tickets
            </h2>
            {loadingTickets ? (
              <div className="text-center py-12">
                <div className="w-12 h-12 border-4 border-blue-400 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
                <p className="text-blue-200">Loading your tickets...</p>
              </div>
            ) : tickets.length === 0 ? (
              <div className="text-center py-12">
                <MessageSquare className="w-16 h-16 text-slate-500 mx-auto mb-4" />
                <p className="text-slate-400 text-lg">No support tickets found</p>
                <p className="text-slate-500">Create your first ticket to get help from our alien support team</p>
              </div>
            ) : (
              <div className="space-y-4">
                {tickets.map((ticket) => (
                  <div key={ticket.id} className="bg-slate-700/30 rounded-xl border border-slate-600/30 p-6">
                    <div className="flex items-start justify-between mb-4">
                      <div>
                        <h3 className="font-semibold text-white mb-1">{ticket.page}</h3>
                        <p className="text-slate-300 text-sm line-clamp-2">{ticket.message}</p>
                      </div>
                      <div
                        className={`px-3 py-1 rounded-full text-xs font-semibold bg-gradient-to-r ${getStatusColor(ticket.status)} border`}
                      >
                        {ticket.status}
                      </div>
                    </div>
                    <div className="flex items-center text-xs text-slate-400">
                      <Clock className="w-4 h-4 mr-1" />
                      {new Date(ticket.created_at).toLocaleString()}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      )}

      {activeTab === 2 && (
        <div className="space-y-8">
          {/* Search Bar */}
          <div className="relative max-w-2xl mx-auto">
            <div className="absolute inset-0 bg-gradient-to-r from-purple-500/20 to-blue-500/20 rounded-2xl blur-xl"></div>
            <div className="relative bg-gradient-to-br from-slate-800/90 to-slate-900/90 backdrop-blur-xl rounded-2xl border border-purple-500/20 p-2">
              <div className="flex items-center">
                <Search className="w-5 h-5 text-purple-400 ml-4" />
                <Input
                  type="text"
                  placeholder="Search the cosmic knowledge base..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="flex-1 bg-transparent border-none text-white placeholder-slate-400 focus:ring-0 focus:border-none text-lg"
                />
              </div>
            </div>
          </div>

          {/* FAQ Content */}
          <div className="space-y-8">
            {filteredFaqs.map((category) => {
              const Icon = category.icon
              return (
                <div key={category.category} className="relative">
                  <div className="absolute inset-0 bg-gradient-to-br from-purple-500/5 to-blue-500/5 rounded-2xl blur-xl"></div>
                  <div className="relative bg-gradient-to-br from-slate-800/90 to-slate-900/90 backdrop-blur-xl rounded-2xl border border-purple-500/20 p-8">
                    <h3 className="text-2xl font-bold text-white mb-6 flex items-center">
                      <Icon className="w-6 h-6 mr-3 text-purple-400" />
                      {category.category}
                    </h3>
                    <div className="space-y-6">
                      {category.items.map((item, idx) => (
                        <div key={idx} className="bg-slate-700/30 rounded-xl border border-slate-600/30 p-6">
                          <h4 className="font-semibold text-lg text-white mb-3 flex items-start">
                            <Sparkles className="w-5 h-5 text-purple-400 mr-3 mt-0.5 flex-shrink-0" />
                            {item.q}
                          </h4>
                          <p className="text-slate-300 leading-relaxed pl-8">{item.a}</p>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              )
            })}
          </div>

          {/* Contact Section */}
          <div className="relative">
            <div className="absolute inset-0 bg-gradient-to-r from-green-500/20 to-blue-500/20 rounded-2xl blur-xl"></div>
            <div className="relative bg-gradient-to-br from-slate-800/90 to-slate-900/90 backdrop-blur-xl rounded-2xl border border-green-500/20 p-8 text-center">
              <div className="w-16 h-16 bg-gradient-to-br from-green-500 to-blue-500 rounded-full flex items-center justify-center mx-auto mb-4 shadow-2xl">
                <Mail className="w-8 h-8 text-white" />
              </div>
              <h4 className="text-2xl font-bold text-white mb-2">Still Need Help?</h4>
              <p className="text-purple-200/80 mb-6">Our alien support team is standing by across the galaxy</p>
              <Button
                asChild
                className="px-8 py-3 bg-gradient-to-r from-green-500/80 to-blue-500/80 hover:from-green-500 hover:to-blue-500 text-white font-semibold rounded-xl transition-all duration-300 shadow-lg hover:shadow-xl border border-green-400/20 hover:border-green-400/40"
              >
                <a href="mailto:support@alienshipper.com">
                  <Mail className="w-4 h-4 mr-2" />
                  Contact Alien Support
                </a>
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
