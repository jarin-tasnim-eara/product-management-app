"use client";

import { useEffect, useState } from "react";
import { authService } from "@/services/authService";
import { showError, showSuccess } from "@/lib/alerts";

const ROLE_OPTIONS = ["user", "seller", "admin"];

function UserTable({ title, users, onRoleChange }) {
  if (users.length === 0) {
    return (
      <div className="mb-8">
        <p className="text-sm font-semibold text-[#1B2430] mb-3">{title}</p>
        <p className="text-sm text-[#1B2430]/40">None yet.</p>
      </div>
    );
  }

  return (
    <div className="mb-8">
      <p className="text-sm font-semibold text-[#1B2430] mb-3">{title}</p>
      <div className="bg-white rounded-xl border border-[#1B2430]/10 overflow-hidden">
        <table className="w-full text-[11px] sm:text-sm table-fixed">
          <thead>
            <tr className="text-left bg-[#1B2430] text-white text-[10px] sm:text-xs uppercase tracking-wide">
              <th className="px-2 sm:px-4 py-3 w-[60%]">Name / Email</th>
              <th className="px-2 py-3 w-[40%]">Role</th>
            </tr>
          </thead>
          <tbody>
            {users.map((u, i) => (
              <tr key={u.uid} className={i % 2 === 1 ? "bg-[#F4F0E4]/40" : ""}>
                <td className="px-2 sm:px-4 py-3 align-top">
                  <p className="text-[#1B2430] break-words">{u.name || "-"}</p>
                  <p className="text-[#1B2430]/50 text-[10px] sm:text-xs break-words">
                    {u.email}
                  </p>
                </td>
                <td className="px-2 py-3 align-top">
                  <select
                    value={u.role}
                    onChange={(e) => onRoleChange(u.uid, e.target.value)}
                    className="w-full text-[10px] sm:text-xs font-medium rounded-full px-1.5 py-1 border border-[#1B2430]/15 outline-none capitalize cursor-pointer bg-white"
                  >
                    {ROLE_OPTIONS.map((r) => (
                      <option key={r} value={r}>
                        {r}
                      </option>
                    ))}
                  </select>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default function AdminUsersPage() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    authService.getAllUsers().then((data) => {
      setUsers(data);
      setLoading(false);
    });
  }, []);

  async function handleRoleChange(uid, newRole) {
    setUsers((prev) => prev.map((u) => (u.uid === uid ? { ...u, role: newRole } : u)));
    try {
      await authService.updateProfile(uid, { role: newRole });
      showSuccess("Role updated.");
    } catch (err) {
      showError("Could not update role. Please try again.");
    }
  }

  if (loading) return <p className="text-[#1B2430]/50">Loading users...</p>;

  const sellers = users.filter((u) => u.role === "seller");
  const regularUsers = users.filter((u) => u.role === "user");
  const admins = users.filter((u) => u.role === "admin");

  return (
    <div>
      <h1 className="text-2xl font-bold text-[#1B2430] mb-6">Users</h1>
      <UserTable title="Sellers" users={sellers} onRoleChange={handleRoleChange} />
      <UserTable title="Users" users={regularUsers} onRoleChange={handleRoleChange} />
      <UserTable title="Admins" users={admins} onRoleChange={handleRoleChange} />
    </div>
  );
}