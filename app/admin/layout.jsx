"use client";

import ProtectedRoute from "@/components/auth/ProtectedRoute";
import AdminSidebar from "@/components/layout/AdminSidebar";
import { ROLES } from "@/config/constants";

export default function AdminLayout({ children }) {
  return (
    <ProtectedRoute allowedRoles={[ROLES.ADMIN]}>
      <div className="flex min-h-[calc(100vh-73px)]">
        <AdminSidebar />
        <div className="flex-1 bg-[#F4F0E4] p-6 pt-20 md:p-8 overflow-x-hidden">{children}</div>
      </div>
    </ProtectedRoute>
  );
}