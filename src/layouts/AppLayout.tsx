import { useEffect, useState } from "react";
import { Outlet, useLocation } from "react-router-dom";
import { Sidebar } from "../components/Sidebar";
import { Header } from "../components/Header";
import { routeMeta } from "../config/navigation";
import { DashboardSourceProvider } from "../contexts/DashboardSourceContext";

export function AppLayout() {
  const { pathname } = useLocation();
  const [mobileNavOpen, setMobileNavOpen] = useState(false);
  const meta = routeMeta[pathname] ?? {
    title: "DAME.TIME",
    subtitle: "Creator analytics and fan engagement platform.",
  };

  useEffect(() => {
    setMobileNavOpen(false);
  }, [pathname]);

  useEffect(() => {
    document.body.style.overflow = mobileNavOpen ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [mobileNavOpen]);

  return (
    <DashboardSourceProvider>
      <div className="flex h-[100dvh] overflow-hidden bg-dt-bg">
        <Sidebar
          mobileOpen={mobileNavOpen}
          onClose={() => setMobileNavOpen(false)}
        />
        <div className="flex min-w-0 flex-1 flex-col overflow-hidden">
          <Header
            title={meta.title}
            subtitle={meta.subtitle}
            onMenuClick={() => setMobileNavOpen(true)}
          />
          <main className="dt-main-canvas flex-1 overflow-x-hidden overflow-y-auto px-3 py-3 sm:px-4 sm:py-4 lg:px-5">
            <div className="relative z-[1] mx-auto w-full min-w-0 max-w-[1600px]">
              <Outlet />
            </div>
          </main>
        </div>
      </div>
    </DashboardSourceProvider>
  );
}
