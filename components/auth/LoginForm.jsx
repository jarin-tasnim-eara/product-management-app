"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { authService } from "@/services/authService";

export default function LoginForm() {
  const [serverError, setServerError] = useState(null);
  const router = useRouter();

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
      await authService.login(formValues.email, formValues.password);
      router.push("/");
    } catch (err) {
      setServerError("Invalid email or password.");
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
          {...register("password", { required: "Password is required" })}
          className="w-full border rounded-md px-3 py-2 text-sm outline-none focus:border-gray-500"
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
        className="w-full bg-gray-900 text-white py-2 rounded-md text-sm hover:bg-gray-700 disabled:opacity-50"
      >
        {isSubmitting ? "Logging in..." : "Login"}
      </button>
    </form>
  );
}