import { Link, useRouteError } from "react-router-dom";

export const RouteErrorPage = (): JSX.Element => {
  const error = useRouteError() as Error | undefined;

  return (
    <div className="grid h-screen place-items-center p-6">
      <div className="w-full max-w-lg rounded-2xl border border-white/10 bg-bg-secondary p-6">
        <h1 className="text-xl font-semibold">Something went wrong</h1>
        <p className="mt-2 text-sm text-text-secondary">{error?.message ?? "Unexpected application error"}</p>
        <div className="mt-4 flex gap-2">
          <Link to="/" className="rounded-lg bg-accent px-3 py-2 text-sm font-medium">Go home</Link>
          <button className="rounded-lg border border-white/10 px-3 py-2 text-sm" onClick={() => window.location.reload()}>
            Reload
          </button>
        </div>
      </div>
    </div>
  );
};
