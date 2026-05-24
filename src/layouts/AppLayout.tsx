import { Outlet, useLocation } from "react-router-dom";
import { Sidebar } from "../components/Sidebar";
import { Header } from "../components/Header";
import { routeMeta } from "../config/navigation";

export function AppLayout() {
  const { pathname } = useLocation();
  const meta = routeMeta[pathname] ?? {
    title: "DAME.TIME",
    subtitle: "Creator analytics and fan engagement platform.",
  };

  return (
    <div className="flex h-screen overflow-hidden bg-dt-bg">
      <Sidebar />
      <div className="flex min-w-0 flex-1 flex-col overflow-hidden">
        <Header title={meta.title} subtitle={meta.subtitle} />
        <main className="flex-1 overflow-x-hidden overflow-y-auto px-4 py-4 lg:px-5">
          <div className="mx-auto w-full min-w-0 max-w-[1600px]">
            <Outlet />
          </div>
        </main>
      </div>
    </div>
  );
}
