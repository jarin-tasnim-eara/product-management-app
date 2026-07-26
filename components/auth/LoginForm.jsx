"use client";

import { useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { useForm } from "react-hook-form";
import Link from "next/link";
import { authService } from "@/services/authService";
import { ROLES } from "@/config/constants";

export default function LoginForm() {
  const [serverError, setServerError] = useState(null);
  const router = useRouter();
  const searchParams = useSearchParams();
  const next = searchParams.get("next");

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm({
    defaultValues: { email: "", password: "" },
  });

  async function onSubmit(formValues) {
    setServerError(null);
    try {
      const loggedInUser = await authService.login(formValues.email, formValues.password);

      if (next === "cart") {
        router.push("/cart");
      } else if (loggedInUser.role === ROLES.SELLER || loggedInUser.role === ROLES.ADMIN) {
        router.push("/seller/dashboard");
      } else {
        router.push("/");
      }
    } catch (err) {
      setServerError("Invalid email or password.");
    }
  }

  return (
    <div className="max-w-sm mx-auto">
      {next === "cart" && (
        <div className="bg-[#6E7A52]/10 text-[#6E7A52] text-sm px-4 py-2.5 rounded-md mb-4">
          Please log in to add items to your cart.
        </div>
      )}

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        <div>
          <label className="block text-sm font-medium mb-1">Email</label>
          <input
            type="email"
            {...register("email", { required: "Email is required" })}
            className="w-full border rounded-md px-3 py-2 text-sm outline-none focus:border-[#6E7A52]"
          />
          {errors.email && (
            <p className="text-red-500 text-xs mt-1">{errors.email.message}</p>
          )}
        </div>

        <div>
          <label className="block text-sm font-medium mb-1">Password</label>
          <input
            type="password"
            {...register("password", { required: "Password is required" })}
            className="w-full border rounded-md px-3 py-2 text-sm outline-none focus:border-[#6E7A52]"
          />
          {errors.password && (
            <p className="text-red-500 text-xs mt-1">
              {errors.password.message}
            </p>
          )}
        </div>

        {serverError && <p className="text-red-500 text-sm">{serverError}</p>}

        <button
          type="submit"
          disabled={isSubmitting}
          className="w-full bg-[#1B2430] text-white py-2 rounded-md text-sm hover:bg-[#6E7A52] transition-colors disabled:opacity-50"
        >
          {isSubmitting ? "Logging in..." : "Login"}
        </button>
      </form>

      <p className="text-sm text-[#1B2430]/60 text-center mt-4">
        New here?{" "}
        <Link
          href={next ? `/signup?next=${next}` : "/signup"}
          className="text-[#6E7A52] font-medium hover:underline"
        >
          Create an account
        </Link>
      </p>
    </div>
  );
}