import SignupForm from "@/components/auth/SignupForm";

export default function SignupPage() {
  return (
    <main className="max-w-7xl mx-auto px-6 py-16">
      <h1 className="text-2xl font-bold text-center mb-8">Create Account</h1>
      <SignupForm />
    </main>
  );
}