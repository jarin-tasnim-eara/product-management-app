"use client";

import { useState, useEffect } from "react";
import { useSelector } from "react-redux";
import { authService } from "@/services/authService";

export default function SellerProfilePage() {
  const { user, role } = useSelector((state) => state.auth);
  const [name, setName] = useState("");
  const [shopBio, setShopBio] = useState("");
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    if (!user?.uid) return;
    authService.getUserProfile(user.uid).then((profile) => {
      setName(profile.name || "");
      setShopBio(profile.shopBio || "");
      setLoading(false);
    });
  }, [user]);

  async function handleSave(e) {
    e.preventDefault();
    setSaving(true);
    setSaved(false);
    try {
      await authService.updateProfile(user.uid, { name, shopBio });
      setSaved(true);
      setTimeout(() => setSaved(false), 2500);
    } catch (err) {
      alert("Could not save changes. Please try again.");
    } finally {
      setSaving(false);
    }
  }

  if (loading) return <p className="text-[#1B2430]/50">Loading profile...</p>;

  return (
    <div>
      <h1 className="text-2xl font-bold text-[#1B2430] mb-6">Profile</h1>

      <form
        onSubmit={handleSave}
        className="bg-white rounded-xl border border-[#1B2430]/10 p-6 max-w-md space-y-4"
      >
        <div>
          <p className="text-xs text-[#1B2430]/40 mb-1">Email</p>
          <p className="text-[#1B2430] font-medium">{user?.email}</p>
        </div>

        <div>
          <p className="text-xs text-[#1B2430]/40 mb-1">Account Type</p>
          <p className="text-[#1B2430] font-medium capitalize">{role}</p>
        </div>

        <div>
          <label className="block text-sm font-medium text-[#1B2430] mb-1">
            Name
          </label>
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Your full name"
            className="w-full border rounded-md px-3 py-2 text-sm outline-none focus:border-[#6E7A52]"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-[#1B2430] mb-1">
            About your shop (optional)
          </label>
          <textarea
            value={shopBio}
            onChange={(e) => setShopBio(e.target.value)}
            rows={4}
            placeholder="Tell buyers a bit about your shop..."
            className="w-full border rounded-md px-3 py-2 text-sm outline-none focus:border-[#6E7A52]"
          />
        </div>

        {saved && (
          <p className="text-sm text-[#6E7A52]">Changes saved successfully.</p>
        )}

        <button
          type="submit"
          disabled={saving}
          className="bg-[#6E7A52] text-white px-4 py-2 rounded-md text-sm hover:bg-[#5a6443] transition-colors disabled:opacity-50"
        >
          {saving ? "Saving..." : "Save Changes"}
        </button>
      </form>
    </div>
  );
}