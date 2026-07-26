"use client";

import { useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { authService } from "@/services/authService";
import { setUser } from "@/redux/slices/authSlice";

export default function SellerProfilePage() {
  const dispatch = useDispatch();
  const { user, role } = useSelector((state) => state.auth);
  const [name, setName] = useState(user?.name || "");
  const [bio, setBio] = useState("");
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    if (!user?.uid) return;
    authService.getUserProfile(user.uid).then((profile) => {
      setName(profile.name || "");
      setBio(profile.bio || "");
    });
  }, [user]);

  async function handleSave() {
    setSaving(true);
    setSaved(false);
    try {
      await authService.updateProfile(user.uid, { name, bio });
      dispatch(setUser({ user: { ...user, name }, role }));
      setSaved(true);
    } finally {
      setSaving(false);
    }
  }

  return (
    <div>
      <h1 className="text-2xl font-bold text-[#1B2430] mb-6">Profile</h1>
      <div className="bg-white rounded-xl border border-[#1B2430]/10 p-6 max-w-md space-y-4">
        <div>
          <p className="text-sm text-[#1B2430]/50 mb-1">Email</p>
          <p className="text-[#1B2430] font-medium">{user?.email}</p>
        </div>
        <div>
          <p className="text-sm text-[#1B2430]/50 mb-1">Account Type</p>
          <p className="text-[#1B2430] font-medium capitalize">{role}</p>
        </div>
        <div>
          <label className="block text-sm font-medium mb-1">Name</label>
          <input
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="w-full border rounded-md px-3 py-2 text-sm outline-none focus:border-[#6E7A52]"
          />
        </div>
        <div>
          <label className="block text-sm font-medium mb-1">
            About your shop (optional)
          </label>
          <textarea
            value={bio}
            onChange={(e) => setBio(e.target.value)}
            rows={3}
            placeholder="Tell buyers a bit about what you sell..."
            className="w-full border rounded-md px-3 py-2 text-sm outline-none focus:border-[#6E7A52]"
          />
        </div>
        <button
          onClick={handleSave}
          disabled={saving}
          className="px-4 py-2 bg-[#6E7A52] text-white rounded-md text-sm hover:bg-[#5a6443] transition-colors disabled:opacity-50"
        >
          {saving ? "Saving..." : "Save Changes"}
        </button>
        {saved && <p className="text-sm text-[#6E7A52]">Saved!</p>}
      </div>
    </div>
  );
}