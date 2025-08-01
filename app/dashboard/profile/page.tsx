"use client";
import { useEffect, useState } from "react";
import { createClientComponentClient } from "@supabase/auth-helpers-nextjs";
import { useUser } from "@/hooks/use-user";

type UserProfile = {
  id: string;
  first_name: string;
  middle_name: string | null;
  last_name: string;
  full_name: string;
  role: string;
  email: string;
  phone: string | null;
  company: string | null;
  company_bio: string | null;
  status: string | null;
  created_at: string | null;
  last_login: string | null;
  agreed_terms: boolean;
  newsletter_opt_in: boolean | null;
  business_type: string | null;
  monthly_shipping_volume: string | null;
};

export default function Profile() {
  const { user } = useUser();
  const supabase = createClientComponentClient();
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState(false);
  const [form, setForm] = useState<Partial<UserProfile>>({});
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  useEffect(() => {
    if (!user) return;
    setLoading(true);
    supabase
      .from("users")
      .select("*")
      .eq("id", user.id)
      .single()
      .then(async ({ data, error }) => {
        if (data) {
          setProfile(data);
          setForm(data);
          setLoading(false);
        } else {
          // Try to find by email in case id is mismatched
          const { data: byEmail } = await supabase.from("users").select("*").eq("email", user.email).single();
          if (byEmail) {
            // Update the id to match auth user
            await supabase.from("users").update({ id: user.id }).eq("email", user.email);
            setProfile({ ...byEmail, id: user.id });
            setForm({ ...byEmail, id: user.id });
            setLoading(false);
            return;
          }
          // Auto-create profile row if not found by id or email
          const meta = user.user_metadata || {};
          const first_name = meta.first_name || (meta.full_name ? meta.full_name.split(" ")[0] : "");
          const last_name = meta.last_name || (meta.full_name ? meta.full_name.split(" ").slice(1).join(" ") : "");
          const newProfile = {
            id: user.id,
            first_name: first_name || "",
            middle_name: null,
            last_name: last_name || "",
            role: "user",
            email: user.email,
            phone: null,
            company: null,
            company_bio: null,
            status: "active",
            agreed_terms: false,
            newsletter_opt_in: false,
            business_type: null,
            monthly_shipping_volume: null,
          };
          const { error: insertError } = await supabase.from("users").insert([newProfile]);
          if (!insertError) {
            // Refetch
            const { data: created } = await supabase.from("users").select("*").eq("id", user.id).single();
            setProfile(created);
            setForm(created);
          }
          setLoading(false);
        }
      });
  }, [user]);

  function handleChange(e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) {
    const { name, value, type } = e.target;
    let fieldValue: string | boolean = value;
    if (type === "checkbox") {
      fieldValue = (e.target as HTMLInputElement).checked;
    }
    setForm(f => ({
      ...f,
      [name]: fieldValue,
    }));
  }

  async function handleSave(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setError("");
    setSuccess("");
    if (!user) return;
    const update = { ...form };
    // Don't allow editing id, email, role, status, created_at, last_login, full_name
    delete update.id;
    delete update.email;
    delete update.role;
    delete update.status;
    delete update.created_at;
    delete update.last_login;
    delete update.full_name;
    const { error: upError } = await supabase
      .from("users")
      .update(update)
      .eq("id", user.id);
    if (upError) {
      setError(upError.message);
    } else {
      setSuccess("Profile updated!");
      setEditing(false);
      // Refetch profile
      const { data } = await supabase.from("users").select("*").eq("id", user.id).single();
      setProfile(data);
      setForm(data);
    }
  }

  if (loading) return <div className="p-8 text-lg">Loading profile...</div>;
  if (!profile) return <div className="p-8 text-red-600">Profile not found. Please contact support.</div>;

  return (
    <div className="max-w-2xl mx-auto py-10">
      <h1 className="text-3xl font-bold mb-8 text-purple-700">Profile</h1>
      {!editing ? (
        <div className="bg-white rounded-lg shadow-sm p-8 border border-gray-100">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <div className="font-semibold text-gray-700">Full Name</div>
              <div className="mb-2">{profile.full_name}</div>
              <div className="font-semibold text-gray-700">Email</div>
              <div className="mb-2">{profile.email}</div>
              <div className="font-semibold text-gray-700">Phone</div>
              <div className="mb-2">{profile.phone || <span className="text-gray-400">—</span>}</div>
              <div className="font-semibold text-gray-700">Company</div>
              <div className="mb-2">{profile.company || <span className="text-gray-400">—</span>}</div>
              <div className="font-semibold text-gray-700">Business Type</div>
              <div className="mb-2">{profile.business_type || <span className="text-gray-400">—</span>}</div>
              <div className="font-semibold text-gray-700">Monthly Shipping Volume</div>
              <div className="mb-2">{profile.monthly_shipping_volume || <span className="text-gray-400">—</span>}</div>
            </div>
            <div>
              <div className="font-semibold text-gray-700">Company Bio</div>
              <div className="mb-2">{profile.company_bio || <span className="text-gray-400">—</span>}</div>
              <div className="font-semibold text-gray-700">Role</div>
              <div className="mb-2">{profile.role}</div>
              <div className="font-semibold text-gray-700">Status</div>
              <div className="mb-2">{profile.status}</div>
              <div className="font-semibold text-gray-700">Agreed Terms</div>
              <div className="mb-2">{profile.agreed_terms ? "Yes" : "No"}</div>
              <div className="font-semibold text-gray-700">Newsletter Opt-In</div>
              <div className="mb-2">{profile.newsletter_opt_in ? "Yes" : "No"}</div>
            </div>
          </div>
          <button
            className="mt-6 px-6 py-2 bg-gradient-to-r from-purple-600 to-blue-600 text-white font-semibold rounded shadow hover:from-purple-700 hover:to-blue-700 transition"
            onClick={() => setEditing(true)}
          >
            Edit Profile
          </button>
        </div>
      ) : (
        <form onSubmit={handleSave} className="bg-white rounded-lg shadow-sm p-8 border border-gray-100">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="font-semibold text-gray-700">First Name</label>
              <input
                className="w-full px-4 py-2 rounded border border-gray-300 focus:border-purple-500 focus:ring-2 focus:ring-purple-200 outline-none text-lg bg-white mb-2"
                name="first_name"
                value={form.first_name || ""}
                onChange={handleChange}
                required
              />
              <label className="font-semibold text-gray-700">Middle Name</label>
              <input
                className="w-full px-4 py-2 rounded border border-gray-300 focus:border-purple-500 focus:ring-2 focus:ring-purple-200 outline-none text-lg bg-white mb-2"
                name="middle_name"
                value={form.middle_name || ""}
                onChange={handleChange}
              />
              <label className="font-semibold text-gray-700">Last Name</label>
              <input
                className="w-full px-4 py-2 rounded border border-gray-300 focus:border-purple-500 focus:ring-2 focus:ring-purple-200 outline-none text-lg bg-white mb-2"
                name="last_name"
                value={form.last_name || ""}
                onChange={handleChange}
                required
              />
              <label className="font-semibold text-gray-700">Phone</label>
              <input
                className="w-full px-4 py-2 rounded border border-gray-300 focus:border-purple-500 focus:ring-2 focus:ring-purple-200 outline-none text-lg bg-white mb-2"
                name="phone"
                value={form.phone || ""}
                onChange={handleChange}
                type="tel"
              />
              <label className="font-semibold text-gray-700">Company</label>
              <input
                className="w-full px-4 py-2 rounded border border-gray-300 focus:border-purple-500 focus:ring-2 focus:ring-purple-200 outline-none text-lg bg-white mb-2"
                name="company"
                value={form.company || ""}
                onChange={handleChange}
              />
              <label className="font-semibold text-gray-700">Business Type</label>
              <input
                className="w-full px-4 py-2 rounded border border-gray-300 focus:border-purple-500 focus:ring-2 focus:ring-purple-200 outline-none text-lg bg-white mb-2"
                name="business_type"
                value={form.business_type || ""}
                onChange={handleChange}
              />
              <label className="font-semibold text-gray-700">Monthly Shipping Volume</label>
              <input
                className="w-full px-4 py-2 rounded border border-gray-300 focus:border-purple-500 focus:ring-2 focus:ring-purple-200 outline-none text-lg bg-white mb-2"
                name="monthly_shipping_volume"
                value={form.monthly_shipping_volume || ""}
                onChange={handleChange}
              />
            </div>
            <div>
              <label className="font-semibold text-gray-700">Company Bio</label>
              <textarea
                className="w-full px-4 py-2 rounded border border-gray-300 focus:border-purple-500 focus:ring-2 focus:ring-purple-200 outline-none text-lg bg-white mb-2 min-h-[80px]"
                name="company_bio"
                value={form.company_bio || ""}
                onChange={handleChange}
              />
              <label className="font-semibold text-gray-700">Newsletter Opt-In</label>
              <div className="mb-2">
                <input
                  type="checkbox"
                  name="newsletter_opt_in"
                  checked={!!form.newsletter_opt_in}
                  onChange={handleChange}
                  className="mr-2"
                />
                Subscribe to newsletter
              </div>
              <label className="font-semibold text-gray-700">Agreed Terms</label>
              <div className="mb-2">
                <input
                  type="checkbox"
                  name="agreed_terms"
                  checked={!!form.agreed_terms}
                  onChange={handleChange}
                  className="mr-2"
                  disabled
                />
                I agree to the terms (required)
              </div>
            </div>
          </div>
          {error && <div className="mb-2 text-red-600 font-semibold">{error}</div>}
          {success && <div className="mb-2 text-green-600 font-semibold">{success}</div>}
          <div className="flex gap-4 mt-6">
            <button
              type="submit"
              className="px-6 py-2 bg-gradient-to-r from-purple-600 to-blue-600 text-white font-semibold rounded shadow hover:from-purple-700 hover:to-blue-700 transition"
            >
              Save Changes
            </button>
            <button
              type="button"
              className="px-6 py-2 bg-gray-200 text-gray-700 font-semibold rounded shadow hover:bg-gray-300 transition"
              onClick={() => { setEditing(false); setForm(profile); setError(""); setSuccess(""); }}
            >
              Cancel
            </button>
          </div>
        </form>
      )}
    </div>
  );
}
