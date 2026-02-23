import { useState } from "react";
import { Link, Navigate, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { useAuthStore } from "@/store/auth.store";

export const LoginPage = (): JSX.Element => {
  const navigate = useNavigate();
  const login = useAuthStore((state) => state.login);
  const user = useAuthStore((state) => state.user);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);

  if (user) {
    return <Navigate to="/" replace />;
  }

  return (
    <div className="grid h-screen place-items-center p-4">
      <motion.form
        className="w-full max-w-md rounded-2xl border border-white/10 bg-bg-secondary p-6"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        onSubmit={async (event) => {
          event.preventDefault();
          setError(null);
          try {
            await login(email, password);
            navigate("/");
          } catch (err) {
            const data = (err as { response?: { data?: { message?: string; requiresEmailVerification?: boolean; email?: string } } }).response?.data;
            if (data?.requiresEmailVerification && data.email) {
              navigate(`/verify-email?email=${encodeURIComponent(data.email)}`);
              return;
            }
            setError(data?.message ?? "Не удалось войти");
          }
        }}
      >
        <h1 className="mb-4 text-2xl font-bold">С возвращением</h1>
        <div className="space-y-3">
          <input value={email} onChange={(e) => setEmail(e.target.value)} placeholder="Email" className="w-full rounded-xl border border-white/10 bg-bg-tertiary px-3 py-2" />
          <input value={password} onChange={(e) => setPassword(e.target.value)} type="password" placeholder="Пароль" className="w-full rounded-xl border border-white/10 bg-bg-tertiary px-3 py-2" />
          {error ? <p className="text-sm text-red-300">{error}</p> : null}
          <button className="w-full rounded-xl bg-accent px-3 py-2 font-semibold">Войти</button>
        </div>
        <p className="mt-3 text-sm text-text-secondary">Нет аккаунта? <Link to="/register" className="text-accent">Регистрация</Link></p>
      </motion.form>
    </div>
  );
};
