"use client";

import Link from "next/link";
import { useSelector } from "react-redux";
import { ROLES } from "@/config/constants";

export default function CreateProductButton() {
  const { user, role } = useSelector((state) => state.auth);

  if (!user || (role !== ROLES.SELLER && role !== ROLES.ADMIN)) {
    return null;
  }

  return (
    <Link
      href="/products/create"
      className="px-4 py-2 bg-gray-900 text-white rounded-md text-sm hover:bg-gray-700"
    >
      + Add Product
    </Link>
  );
}