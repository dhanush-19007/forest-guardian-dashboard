import { useEffect, useState, type ReactNode } from "react";
import { Link, useNavigate, useRouterState } from "@tanstack/react-router";
import {
  Bell,
  Footprints,
  History,
  LayoutDashboard,
  LogOut,
  Map as MapIcon,
  Menu,
  Settings,
  ShieldCheck,
  X,
} from "lucide-react";
import { AnimatePresence, motion } from "framer-motion";
import { useApp } from "@/context/AppContext";
import { cn } from "@/lib/utils";

const navItems = [
  { to: "/dashboard", label: "Dashboard", icon: LayoutDashboard },
  { to: "/detection", label: "Footprint Detection", icon: Footprints },
  { to: "/alerts", label: "Alerts", icon: Bell },
  { to: "/tracking", label: "Tracking", icon: MapIcon },
  { to: "/history", label: "Detection History", icon: History },
  { to: "/settings", label: "Settings", icon: Settings },
] as const;

function NavList({ onNavigate }: { onNavigate?: () => void }) {
  const pathname = useRouterState({ select: (s) => s.location.pathname });
  return (
    <nav className="flex flex-col gap-1 px-3">
      {navItems.map((item) => {
        const active = pathname === item.to;
        return (
          <Link
            key={item.to}
            to={item.to}
            onClick={onNavigate}
            className={cn(
              "flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium text-sidebar-foreground/85 transition-colors hover:bg-sidebar-accent hover:text-sidebar-accent-foreground",
              active &&
                "bg-sidebar-primary text-sidebar-primary-foreground shadow-soft hover:bg-sidebar-primary hover:text-sidebar-primary-foreground",
            )}
          >
            <item.icon className="h-4.5 w-4.5 shrink-0" />
            <span className="truncate">{item.label}</span>
          </Link>
        );
      })}
    </nav>
  );
}

function Brand() {
  return (
    <div className="flex min-w-0 items-center gap-3 px-5 py-5">
      <span className="grid h-10 w-10 shrink-0 place-items-center rounded-xl bg-sidebar-primary text-sidebar-primary-foreground">
        <ShieldCheck className="h-5 w-5" />
      </span>
      <div className="min-w-0">
        <p className="truncate text-sm font-bold text-sidebar-accent-foreground">
          Smart Forest Guardian
        </p>
        <p className="truncate text-xs text-sidebar-foreground/70">
          Forest Department Portal
        </p>
      </div>
    </div>
  );
}

export function AppShell({
  title,
  subtitle,
  children,
}: {
  title: string;
  subtitle?: string;
  children: ReactNode;
}) {
  const { officer, logout, alerts } = useApp();
  const navigate = useNavigate();
  const [open, setOpen] = useState(false);
  const [checked, setChecked] = useState(false);
  const pathname = useRouterState({ select: (s) => s.location.pathname });

  useEffect(() => {
    const session = window.localStorage.getItem("sfg-officer");
    if (!session) navigate({ to: "/" });
    else setChecked(true);
  }, [navigate]);

  useEffect(() => setOpen(false), [pathname]);

  const activeAlerts = alerts.filter((a) => a.status === "New").length;

  const handleLogout = () => {
    logout();
    navigate({ to: "/" });
  };

  if (!checked) return null;

  return (
    <div className="flex min-h-screen w-full bg-background">
      {/* Desktop sidebar */}
      <aside className="sticky top-0 hidden h-screen w-64 shrink-0 flex-col bg-sidebar lg:flex">
        <Brand />
        <div className="flex-1 overflow-y-auto pb-4">
          <NavList />
        </div>
        <button
          onClick={handleLogout}
          className="m-3 flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium text-sidebar-foreground/85 transition-colors hover:bg-sidebar-accent hover:text-sidebar-accent-foreground"
        >
          <LogOut className="h-4.5 w-4.5" /> Logout
        </button>
      </aside>

      {/* Mobile drawer */}
      <AnimatePresence>
        {open ? (
          <div className="fixed inset-0 z-50 lg:hidden">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setOpen(false)}
              className="absolute inset-0 bg-foreground/50"
            />
            <motion.aside
              initial={{ x: "-100%" }}
              animate={{ x: 0 }}
              exit={{ x: "-100%" }}
              transition={{ type: "tween", duration: 0.25 }}
              className="absolute inset-y-0 left-0 flex w-72 max-w-[85vw] flex-col bg-sidebar"
            >
              <div className="flex items-center justify-between">
                <Brand />
                <button
                  aria-label="Close menu"
                  onClick={() => setOpen(false)}
                  className="mr-4 rounded-lg p-2 text-sidebar-foreground hover:bg-sidebar-accent"
                >
                  <X className="h-5 w-5" />
                </button>
              </div>
              <div className="flex-1 overflow-y-auto pb-4">
                <NavList onNavigate={() => setOpen(false)} />
              </div>
              <button
                onClick={handleLogout}
                className="m-3 flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium text-sidebar-foreground/85 hover:bg-sidebar-accent hover:text-sidebar-accent-foreground"
              >
                <LogOut className="h-4.5 w-4.5" /> Logout
              </button>
            </motion.aside>
          </div>
        ) : null}
      </AnimatePresence>

      <div className="flex min-w-0 flex-1 flex-col">
        <header className="sticky top-0 z-30 border-b border-border bg-card/90 backdrop-blur">
          <div className="grid grid-cols-[auto_minmax(0,1fr)_auto] items-center gap-3 px-4 py-3 sm:px-6">
            <button
              aria-label="Open menu"
              onClick={() => setOpen(true)}
              className="rounded-lg p-2 text-foreground hover:bg-muted lg:hidden"
            >
              <Menu className="h-5 w-5" />
            </button>
            <div className="min-w-0">
              <h1 className="truncate text-lg font-bold text-foreground sm:text-xl">
                {title}
              </h1>
              {subtitle ? (
                <p className="truncate text-xs text-muted-foreground sm:text-sm">
                  {subtitle}
                </p>
              ) : null}
            </div>
            <div className="flex items-center gap-2 sm:gap-3">
              <Link
                to="/alerts"
                className="relative rounded-lg p-2 text-foreground hover:bg-muted"
                aria-label="Alerts"
              >
                <Bell className="h-5 w-5" />
                {activeAlerts > 0 ? (
                  <span className="absolute top-0.5 right-0.5 grid h-4 min-w-4 place-items-center rounded-full bg-destructive px-1 text-[10px] font-bold text-destructive-foreground">
                    {activeAlerts}
                  </span>
                ) : null}
              </Link>
              <div className="hidden min-w-0 text-right sm:block">
                <p className="truncate text-sm font-semibold text-foreground">
                  {officer?.name ?? "Ranger"}
                </p>
                <p className="truncate text-xs text-muted-foreground">
                  {officer?.department}
                </p>
              </div>
              <span className="grid h-9 w-9 shrink-0 place-items-center rounded-full bg-primary text-sm font-bold text-primary-foreground">
                {(officer?.username ?? "R").slice(0, 1).toUpperCase()}
              </span>
            </div>
          </div>
        </header>

        <main className="min-w-0 flex-1 px-4 py-5 sm:px-6 sm:py-6">
          <div className="mx-auto w-full max-w-7xl">{children}</div>
        </main>
      </div>
    </div>
  );
}
