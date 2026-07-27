"use client";

import ProtectedRoute from "@/components/auth/ProtectedRoute";
import SellerSidebar from "@/components/layout/SellerSidebar";
import { ROLES } from "@/config/constants";

export default function SellerLayout({ children }) {
  return (
    <ProtectedRoute allowedRoles={[ROLES.SELLER, ROLES.ADMIN]}>
      <div className="flex min-h-[calc(100vh-73px)]">
        <SellerSidebar />
        <div className="flex-1 bg-[#F4F0E4] p-6 pt-20 md:p-8">{children}</div>
      </div>
    </ProtectedRoute>
  );
}