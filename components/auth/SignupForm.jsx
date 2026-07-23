"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { authService } from "@/services/authService";
import { ROLES } from "@/config/constants";

export default function SignupForm() {
  const [serverError, setServerError] = useState(null);
  const router = useRouter();

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm({
    defaultValues: { email: "", password: "", role: ROLES.USER },
  });

  async function onSubmit(formValues) {
    setServerError(null);
    try {
      await authService.signup(
        formValues.email,
        formValues.password,
        formValues.role
      );
      router.push("/");
    } catch (err) {
      setServerError("Could not create account. Try a different email.");
    }
  }

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      className="max-w-sm mx-auto space-y-4"
    >
      <div>
        <label className="block text-sm font-medium mb-1">Email</label>
        <input
          type="email"
          {...register("email", { required: "Email is required" })}
          className="w-full border rounded-md px-3 py-2 text-sm outline-none focus:border-gray-500"
        />
        {errors.email && (
          <p className="text-red-500 text-xs mt-1">{errors.email.message}</p>
        )}
      </div>

      <div>
        <label className="block text-sm font-medium mb-1">Password</label>
        <input
          type="password"
          {...register("password", {
            required: "Password is required",
            minLength: {
              value: 6,
              message: "Password must be at least 6 characters",
            },
          })}
          className="w-full border rounded-md px-3 py-2 text-sm outline-none focus:border-gray-500"
        />
        {errors.password && (
          <p className="text-red-500 text-xs mt-1">
            {errors.password.message}
          </p>
        )}
      </div>

      <div>
        <label className="block text-sm font-medium mb-1">Account Type</label>
        <select
          {...register("role")}
          className="w-full border rounded-md px-3 py-2 text-sm outline-none"
        >
          <option value={ROLES.USER}>User</option>
          <option value={ROLES.SELLER}>Seller</option>
        </select>
      </div>

      {serverError && <p className="text-red-500 text-sm">{serverError}</p>}

      <button
        type="submit"
        disabled={isSubmitting}
        className="w-full bg-gray-900 text-white py-2 rounded-md text-sm hover:bg-gray-700 disabled:opacity-50"
      >
        {isSubmitting ? "Creating account..." : "Sign Up"}
      </button>
    </form>
  );
}