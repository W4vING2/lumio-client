import { useMemo, useState } from "react";
import { Link, Navigate, useNavigate, useSearchParams } from "react-router-dom";
import { motion } from "framer-motion";
import { api } from "@/lib/api";
import { useAuthStore } from "@/store/auth.store";
import type { AuthUser } from "@lumio/shared";

export const VerifyEmailPage = (): JSX.Element => {
  const [params] = useSearchParams();
  const navigate = useNavigate();
  const user = useAuthStore((state) => state.user);
  const setSession = useAuthStore((state) => state.setSession);
  const [code, setCode] = useState("");
  const [sending, setSending] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [info, setInfo] = useState<string | null>(null);

  const email = useMemo(() => params.get("email")?.trim().toLowerCase() ?? "", [params]);

  if (user) return <Navigate to="/" replace />;
  if (!email) return <Navigate to="/register" replace />;

  return (
    <div className="grid h-screen place-items-center p-4">
      <motion.form
        className="w-full max-w-md rounded-2xl border border-white/10 bg-bg-secondary p-6"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        onSubmit={async (event) => {
          event.preventDefault();
          setError(null);
          setInfo(null);
          if (code.trim().length !== 6) {
            setError("Введите 6-значный код");
            return;
          }
          try {
            const { data } = await api.post<{ user: AuthUser; accessToken: string; refreshToken: string }>("/auth/verify-email-code", {
              email,
              code: code.trim()
            });
            setSession(data);
            navigate("/");
          } catch (err) {
            const message = (err as { response?: { data?: { message?: string } } }).response?.data?.message;
            setError(message ?? "Не удалось подтвердить email");
          }
        }}
      >
        <h1 className="mb-2 text-2xl font-bold">Подтвердите email</h1>
        <p className="mb-4 text-sm text-text-secondary">Мы отправили код на {email}. Введите его ниже.</p>
        <div className="space-y-3">
          <input
            value={code}
            onChange={(event) => setCode(event.target.value.replace(/\D/g, "").slice(0, 6))}
            placeholder="6-значный код"
            className="w-full rounded-xl border border-white/10 bg-bg-tertiary px-3 py-2"
          />
          {error ? <p className="text-sm text-red-300">{error}</p> : null}
          {info ? <p className="text-sm text-emerald-300">{info}</p> : null}
          <button className="w-full rounded-xl bg-accent px-3 py-2 font-semibold" type="submit">
            Подтвердить
          </button>
          <button
            className="w-full rounded-xl border border-white/10 px-3 py-2 font-medium"
            type="button"
            disabled={sending}
            onClick={async () => {
              setError(null);
              setInfo(null);
              setSending(true);
              try {
                const { data } = await api.post<{ debugCode?: string }>("/auth/send-verification-code", { email });
                if (data.debugCode) {
                  setInfo(`Код отправлен. Тестовый код: ${data.debugCode}`);
                } else {
                  setInfo("Код отправлен повторно");
                }
              } catch (err) {
                const message = (err as { response?: { data?: { message?: string } } }).response?.data?.message;
                setError(message ?? "Не удалось отправить код");
              } finally {
                setSending(false);
              }
            }}
          >
            {sending ? "Отправка..." : "Отправить код еще раз"}
          </button>
        </div>
        <p className="mt-3 text-sm text-text-secondary">Вспомнили пароль? <Link to="/login" className="text-accent">Войти</Link></p>
      </motion.form>
    </div>
  );
};

