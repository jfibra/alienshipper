"use client"

import { useEffect, useState } from "react"
import { loadStripe } from "@stripe/stripe-js"
import { Elements, CardElement, useStripe, useElements } from "@stripe/react-stripe-js"
import { createClientComponentClient } from "@supabase/auth-helpers-nextjs"
import { useUser } from "@/hooks/use-user"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import {
  CreditCard,
  Plus,
  Trash2,
  CheckCircle,
  AlertCircle,
  Banknote,
  DollarSign,
  Calendar,
  Loader2,
} from "lucide-react"

type PaymentMethod = {
  id: string
  user_id: string
  provider: string
  provider_payment_id: string
  brand: string | null
  last4: string | null
  exp_month: number | null
  exp_year: number | null
  created_at: string
}

// Sample transactions (replace with real data if available)
const sampleTransactions = [
  { id: 1, type: "Cash In", amount: 100, date: "2025-07-30", status: "Completed" },
  { id: 2, type: "Shipment", amount: -12.5, date: "2025-07-31", status: "Completed" },
  { id: 3, type: "Cash In", amount: 50, date: "2025-08-01", status: "Pending" },
]

export default function Billing() {
  const { user } = useUser()
  const supabase = createClientComponentClient()
  const [methods, setMethods] = useState<PaymentMethod[]>([])
  const [loading, setLoading] = useState(true)
  const [adding, setAdding] = useState(false)
  // Stripe Elements does not need manual card fields
  const [error, setError] = useState("")
  const [success, setSuccess] = useState("")
  const [deleting, setDeleting] = useState<string | null>(null)

  // Fetch payment methods
  useEffect(() => {
    if (!user) return
    setLoading(true)
    supabase
      .from("payment_methods")
      .select("*")
      .eq("user_id", user.id)
      .order("created_at", { ascending: false })
      .then(({ data }) => {
        setMethods(data || [])
        setLoading(false)
      })
  }, [user])

  // Stripe Elements Add Payment Method
  function AddPaymentMethodForm({ onAdded }: { onAdded: () => void }) {
    const stripe = useStripe()
    const elements = useElements()
    const [error, setError] = useState("")
    const [success, setSuccess] = useState("")
    const [loading, setLoading] = useState(false)

    async function handleAdd(e: React.FormEvent<HTMLFormElement>) {
      e.preventDefault()
      setError("")
      setSuccess("")
      if (!user) return
      if (!stripe || !elements) {
        setError("Stripe is not loaded.")
        return
      }
      setLoading(true)
      const cardElement = elements.getElement(CardElement)
      if (!cardElement) {
        setError("Card element not found.")
        setLoading(false)
        return
      }
      // Create payment method with Stripe
      const { error: stripeError, paymentMethod } = await stripe.createPaymentMethod({
        type: "card",
        card: cardElement,
      })
      if (stripeError || !paymentMethod) {
        setError(stripeError?.message || "Failed to create payment method.")
        setLoading(false)
        return
      }
      // Extract card metadata
      const { brand, last4, exp_month, exp_year } = paymentMethod.card || {}
      // Store only id and metadata in Supabase
      const method = {
        user_id: user.id,
        provider: "stripe",
        provider_payment_id: paymentMethod.id,
        brand,
        last4,
        exp_month,
        exp_year,
      }
      const { error: insertError } = await supabase.from("payment_methods").insert([method])
      if (insertError) {
        setError(insertError.message)
      } else {
        setSuccess("Payment method added!")
        onAdded()
      }
      setLoading(false)
    }

    return (
      <form onSubmit={handleAdd} className="mb-8 grid grid-cols-1 gap-4 bg-slate-800/80 p-6 rounded-xl border border-blue-500/20">
        <div className="col-span-1">
          <CardElement options={{ style: { base: { color: '#fff', fontFamily: 'monospace', fontSize: '16px', '::placeholder': { color: '#a0aec0' } }, invalid: { color: '#fa755a' } } }} className="bg-slate-700/50 border-slate-600/50 rounded px-3 py-2" />
        </div>
        <div className="col-span-1 flex gap-4 mt-2">
          <Button type="submit" className="bg-gradient-to-r from-blue-500 to-green-500 text-white font-semibold px-6 py-2 rounded-xl shadow hover:from-blue-600 hover:to-green-600" disabled={loading}>{loading ? <Loader2 className="animate-spin w-4 h-4" /> : "Save"}</Button>
          <Button type="button" variant="secondary" onClick={onAdded} className="px-6 py-2">Cancel</Button>
        </div>
        {success && (
          <div className="mb-2 bg-gradient-to-r from-green-500/10 to-emerald-500/10 border border-green-400/20 rounded-xl p-3 flex items-center">
            <CheckCircle className="w-5 h-5 text-green-400 mr-3" />
            <span className="text-green-200 font-medium">{success}</span>
          </div>
        )}
        {error && (
          <div className="mb-2 bg-gradient-to-r from-red-500/10 to-pink-500/10 border border-red-400/20 rounded-xl p-3 flex items-center">
            <AlertCircle className="w-5 h-5 text-red-400 mr-3" />
            <span className="text-red-200 font-medium">{error}</span>
          </div>
        )}
      </form>
    )
  }

  // Delete payment method
  async function handleDelete(id: string) {
    setDeleting(id)
    setError("")
    setSuccess("")
    const { error: delError } = await supabase.from("payment_methods").delete().eq("id", id)
    if (delError) {
      setError(delError.message)
    } else {
      setSuccess("Payment method deleted.")
      setMethods((prev) => prev.filter((m) => m.id !== id))
    }
    setDeleting(null)
  }

  // Placeholder balance (replace with real balance logic)
  const balance = 137.50

  // Stripe publishable key (replace with your real key or use env var)
  const stripePromise = loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY || "pk_test_1234")

  return (
    <div className="max-w-4xl mx-auto space-y-10">
      {/* Balance Card */}
      <div className="relative">
        <div className="absolute inset-0 bg-gradient-to-r from-green-500/20 to-blue-500/20 rounded-2xl blur-xl"></div>
        <div className="relative bg-gradient-to-br from-slate-800/90 to-slate-900/90 backdrop-blur-xl rounded-2xl border border-green-500/20 p-8 flex items-center justify-between">
          <div>
            <h2 className="text-2xl font-bold text-white mb-2 flex items-center">
              <Banknote className="w-7 h-7 mr-3 text-green-400" />
              Alien Shipping Balance
            </h2>
            <p className="text-green-200 text-3xl font-mono font-bold">${balance.toFixed(2)}</p>
          </div>
          <Button className="bg-gradient-to-r from-green-500 to-blue-500 text-white font-semibold px-6 py-3 rounded-xl shadow-lg hover:from-green-600 hover:to-blue-600">
            Cash In
          </Button>
        </div>
      </div>

      {/* Transactions Table */}
      <div className="relative">
        <div className="absolute inset-0 bg-gradient-to-r from-purple-500/10 to-blue-500/10 rounded-2xl blur-xl"></div>
        <div className="relative bg-gradient-to-br from-slate-800/90 to-slate-900/90 backdrop-blur-xl rounded-2xl border border-purple-500/20 p-8">
          <h3 className="text-xl font-bold text-white mb-6 flex items-center">
            <DollarSign className="w-5 h-5 mr-3 text-green-400" />
            Recent Transactions
          </h3>
          <div className="overflow-x-auto">
            <table className="min-w-full text-left border">
              <thead>
                <tr className="bg-purple-900/30">
                  <th className="px-4 py-2 font-semibold text-purple-200">Type</th>
                  <th className="px-4 py-2 font-semibold text-purple-200">Amount</th>
                  <th className="px-4 py-2 font-semibold text-purple-200">Date</th>
                  <th className="px-4 py-2 font-semibold text-purple-200">Status</th>
                </tr>
              </thead>
              <tbody>
                {sampleTransactions.map((tx) => (
                  <tr key={tx.id} className="border-t border-purple-900/20">
                    <td className="px-4 py-2">{tx.type}</td>
                    <td className="px-4 py-2">{tx.amount > 0 ? "+" : ""}${tx.amount.toFixed(2)}</td>
                    <td className="px-4 py-2">{tx.date}</td>
                    <td className="px-4 py-2">
                      <span className={`inline-block px-3 py-1 rounded-full text-xs font-semibold ${tx.status === 'Completed' ? 'bg-green-100 text-green-700' : 'bg-yellow-100 text-yellow-700'}`}>{tx.status}</span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* Payment Methods */}
      <div className="relative">
        <div className="absolute inset-0 bg-gradient-to-r from-blue-500/10 to-green-500/10 rounded-2xl blur-xl"></div>
        <Elements stripe={stripePromise}>
          <div className="relative bg-gradient-to-br from-slate-800/90 to-slate-900/90 backdrop-blur-xl rounded-2xl border border-blue-500/20 p-8">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-xl font-bold text-white flex items-center">
                <CreditCard className="w-5 h-5 mr-3 text-blue-400" />
                Payment Methods
              </h3>
              <Button onClick={() => setAdding((v) => !v)} className="flex items-center gap-2 bg-gradient-to-r from-blue-500 to-green-500 text-white font-semibold px-5 py-2 rounded-xl shadow hover:from-blue-600 hover:to-green-600">
                <Plus className="w-4 h-4" /> Add Method
              </Button>
            </div>
            {adding && (
              <AddPaymentMethodForm onAdded={async () => {
                setAdding(false)
                // Refetch payment methods after add/cancel
                const { data } = await supabase.from("payment_methods").select("*").eq("user_id", user?.id).order("created_at", { ascending: false })
                setMethods(data || [])
              }} />
            )}
            {success && (
              <div className="mb-4 bg-gradient-to-r from-green-500/10 to-emerald-500/10 border border-green-400/20 rounded-xl p-4 flex items-center">
                <CheckCircle className="w-5 h-5 text-green-400 mr-3" />
                <span className="text-green-200 font-medium">{success}</span>
              </div>
            )}
            {error && (
              <div className="mb-4 bg-gradient-to-r from-red-500/10 to-pink-500/10 border border-red-400/20 rounded-xl p-4 flex items-center">
                <AlertCircle className="w-5 h-5 text-red-400 mr-3" />
                <span className="text-red-200 font-medium">{error}</span>
              </div>
            )}
            {loading ? (
              <div className="flex items-center gap-2 text-blue-200"><Loader2 className="animate-spin w-5 h-5" /> Loading payment methods...</div>
            ) : methods.length === 0 ? (
              <div className="text-blue-200">No payment methods added yet.</div>
            ) : (
              <div className="overflow-x-auto">
                <table className="min-w-full text-left border">
                  <thead>
                    <tr className="bg-blue-900/30">
                      <th className="px-4 py-2 font-semibold text-blue-200">Brand</th>
                      <th className="px-4 py-2 font-semibold text-blue-200">Last 4</th>
                      <th className="px-4 py-2 font-semibold text-blue-200">Exp</th>
                      <th className="px-4 py-2 font-semibold text-blue-200">Provider</th>
                      <th className="px-4 py-2 font-semibold text-blue-200">Added</th>
                      <th className="px-4 py-2 font-semibold text-blue-200">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {methods.map((m) => (
                      <tr key={m.id} className="border-t border-blue-900/20">
                        <td className="px-4 py-2">{m.brand}</td>
                        <td className="px-4 py-2">{m.last4}</td>
                        <td className="px-4 py-2">{m.exp_month}/{m.exp_year}</td>
                        <td className="px-4 py-2 capitalize">{m.provider}</td>
                        <td className="px-4 py-2 text-xs text-blue-200">{m.created_at ? new Date(m.created_at).toLocaleDateString() : ""}</td>
                        <td className="px-4 py-2">
                          <Button
                            size="icon"
                            variant="ghost"
                            onClick={() => handleDelete(m.id)}
                            disabled={deleting === m.id}
                            className="text-red-400 hover:bg-red-500/10"
                          >
                            {deleting === m.id ? <Loader2 className="animate-spin w-4 h-4" /> : <Trash2 className="w-4 h-4" />}
                          </Button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </Elements>
      </div>
    </div>
  )
}
