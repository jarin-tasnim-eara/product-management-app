"use client";

import ProtectedRoute from "@/components/auth/ProtectedRoute";
import BuyerSidebar from "@/components/layout/BuyerSidebar";
import { ROLES } from "@/config/constants";

export default function AccountLayout({ children }) {
  return (
    <ProtectedRoute allowedRoles={[ROLES.USER, ROLES.SELLER, ROLES.ADMIN]}>
      <div className="flex min-h-[calc(100vh-73px)]">
        <BuyerSidebar />
        <div className="flex-1 bg-[#F4F0E4] p-8">{children}</div>
      </div>
    </ProtectedRoute>
  );
}