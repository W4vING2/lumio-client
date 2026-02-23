import { useState } from "react";
import { Link, Navigate, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { useAuthStore } from "@/store/auth.store";

export const RegisterPage = (): JSX.Element => {
  const navigate = useNavigate();
  const register = useAuthStore((state) => state.register);
  const user = useAuthStore((state) => state.user);
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [avatar, setAvatar] = useState<File | null>(null);
  const [error, setError] = useState<string | null>(null);

  if (user) {
    return <Navigate to="/" replace />;
  }

  return (
    <div className="grid h-screen place-items-center p-4">
      <motion.form className="w-full max-w-md rounded-2xl border border-white/10 bg-bg-secondary p-6" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} onSubmit={async (event) => {
        event.preventDefault();
        setError(null);
        try {
          const form = new FormData();
          form.append("username", username);
          form.append("email", email);
          form.append("password", password);
          if (avatar) form.append("avatar", avatar);
          await register(form);
          navigate("/");
        } catch (err) {
          const message = (err as { response?: { data?: { message?: string } } })?.response?.data?.message;
          setError(message ?? "Registration failed");
        }
      }}>
        <h1 className="mb-4 text-2xl font-bold">Create account</h1>
        <div className="space-y-3">
          <input value={username} onChange={(e) => setUsername(e.target.value)} placeholder="Username" className="w-full rounded-xl border border-white/10 bg-bg-tertiary px-3 py-2" />
          <input value={email} onChange={(e) => setEmail(e.target.value)} placeholder="Email" className="w-full rounded-xl border border-white/10 bg-bg-tertiary px-3 py-2" />
          <input value={password} onChange={(e) => setPassword(e.target.value)} type="password" placeholder="Password" className="w-full rounded-xl border border-white/10 bg-bg-tertiary px-3 py-2" />
          <input type="file" onChange={(e) => setAvatar(e.target.files?.[0] ?? null)} className="w-full text-sm" />
          {error ? <p className="text-sm text-red-300">{error}</p> : null}
          <button className="w-full rounded-xl bg-accent px-3 py-2 font-semibold">Register</button>
        </div>
        <p className="mt-3 text-sm text-text-secondary">Have an account? <Link to="/login" className="text-accent">Login</Link></p>
      </motion.form>
    </div>
  );
};
