"use client";

import { useSelector } from "react-redux";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { ROLES } from "@/config/constants";

export default function ProtectedRoute({ 
  children, 
  allowedRoles = [ROLES.USER, ROLES.SELLER, ROLES.ADMIN] 
}) {
  const { user, role, initialized } = useSelector((state) => state.auth);
  const router = useRouter();

  useEffect(() => {
    if (initialized && !user) {
      router.push("/login");
    }
    if (initialized && user && !allowedRoles.includes(role)) {
      router.push("/");
    }
  }, [initialized, user, role, router, allowedRoles]);

  if (!initialized || !user) {
    return (
      <div className="flex justify-center items-center min-h-[50vh]">
        <p className="text-gray-500">Loading...</p>
      </div>
    );
  }

  return children;
}