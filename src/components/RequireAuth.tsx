import { Navigate, Outlet, useLocation } from "react-router-dom";
import { isDashboardAuthed } from "../lib/dashboardAuth";

export function RequireAuth() {
  const location = useLocation();

  if (!isDashboardAuthed()) {
    return <Navigate to="/login" replace state={{ from: location.pathname }} />;
  }

  return <Outlet />;
}

export function PublicOnly({ children }: { children: React.ReactNode }) {
  if (isDashboardAuthed()) {
    return <Navigate to="/" replace />;
  }
  return children;
}
