import LoginForm from "@/components/auth/LoginForm";

export default function LoginPage() {
  return (
    <main className="max-w-7xl mx-auto px-6 py-16">
      <h1 className="text-2xl font-bold text-center mb-8">Login</h1>
      <LoginForm />
    </main>
  );
}