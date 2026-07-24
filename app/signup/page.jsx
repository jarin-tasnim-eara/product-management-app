import { Suspense } from "react";
import SignupForm from "@/components/auth/SignupForm";

export default function SignupPage() {
  return (
    <main className="min-h-[calc(100vh-73px)] bg-[#94AC8D] flex items-center justify-center px-6 py-16">
      <div className="w-full max-w-sm bg-white rounded-2xl shadow-lg p-8">
        <h1 className="text-2xl font-bold text-[#1B2430] mb-1 text-center">
          Create your account
        </h1>
        <p className="text-sm text-[#1B2430]/50 text-center mb-8">
          Join as a shopper or start selling
        </p>
        <Suspense fallback={null}>
          <SignupForm />
        </Suspense>
      </div>
    </main>
  );
}