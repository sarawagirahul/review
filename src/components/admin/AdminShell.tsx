'use client';

import { useState, useEffect, useRef, useMemo } from 'react';
import { usePathname } from 'next/navigation';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
import {
  LayoutDashboard,
  Building2,
  Users,
  UserCircle,
  BarChart3,
  Settings,
  Shield,
  Menu,
  X,
  LogOut,
  AlertTriangle,
} from 'lucide-react';

interface UserData {
  full_name: string | null;
  avatar_url: string | null;
  email: string | null;
}

interface AdminShellProps {
  children: React.ReactNode;
  user: { id: string; email?: string };
  userData: UserData | null;
}

interface NavItem {
  label: string;
  icon: React.ElementType;
  href: string;
}

interface NavGroup {
  label: string;
  items: NavItem[];
}

function NavLink({
  item,
  isActive,
  collapsed,
  onClick,
}: {
  item: NavItem;
  isActive: boolean;
  collapsed: boolean;
  onClick?: () => void;
}) {
  const Icon = item.icon;
  return (
    <Link
      href={item.href}
      onClick={onClick}
      className={[
        'flex items-center h-11 px-3 rounded-lg mx-2 my-0.5 transition-colors relative group cursor-pointer',
        isActive
          ? 'bg-accent/[0.15] text-accent border-l-[3px] border-accent pl-[9px]'
          : 'text-white/60 hover:bg-[#2a1a6e] hover:text-white',
      ].join(' ')}
    >
      <Icon className="h-[18px] w-[18px] shrink-0" />
      {!collapsed && (
        <span className="ml-3 text-sm font-medium whitespace-nowrap">{item.label}</span>
      )}
      {collapsed && (
        <span className="pointer-events-none absolute left-full ml-3 whitespace-nowrap rounded-md bg-gray-900 px-2.5 py-1 text-xs text-white opacity-0 group-hover:opacity-100 transition-opacity z-50">
          {item.label}
        </span>
      )}
    </Link>
  );
}

function SidebarContent({
  navGroups,
  pathname,
  userData,
  userEmail,
  collapsed,
  onLinkClick,
}: {
  navGroups: NavGroup[];
  pathname: string;
  userData: UserData | null;
  userEmail: string | undefined;
  collapsed: boolean;
  onLinkClick?: () => void;
}) {
  const displayName = userData?.full_name ?? userEmail ?? 'Admin';
  const initial = displayName.charAt(0).toUpperCase();
  const email = userData?.email ?? userEmail ?? '';

  return (
    <div className="flex flex-col h-full bg-admin-sidebar">
      {/* Logo */}
      <div className="h-16 flex items-center px-5 border-b border-white/[0.12] shrink-0 gap-2">
        <Shield className="h-5 w-5 text-accent shrink-0" />
        {!collapsed && (
          <span className="text-white font-bold text-lg tracking-tight">JustHustle Admin</span>
        )}
      </div>

      {/* Nav */}
      <nav className="flex-1 overflow-y-auto py-3">
        {navGroups.map((group) => (
          <div key={group.label}>
            {!collapsed && (
              <p className="text-[10px] font-semibold uppercase tracking-[0.15em] text-white/30 px-5 py-2 mt-4 first:mt-0">
                {group.label}
              </p>
            )}
            {collapsed && <div className="mt-4 first:mt-0" />}
            {group.items.map((item) => {
              const isActive =
                item.href === '/admin'
                  ? pathname === '/admin'
                  : pathname.startsWith(item.href);
              return (
                <NavLink
                  key={item.href}
                  item={item}
                  isActive={isActive}
                  collapsed={collapsed}
                  onClick={onLinkClick}
                />
              );
            })}
          </div>
        ))}
      </nav>

      {/* Bottom user section */}
      <div className="border-t border-white/[0.12] pt-4 px-3 pb-4 shrink-0">
        {collapsed ? (
          <div className="flex flex-col items-center gap-3">
            <div className="h-8 w-8 rounded-full bg-accent/20 text-accent flex items-center justify-center text-sm font-semibold shrink-0">
              {initial}
            </div>
            <form action="/api/auth/logout" method="post">
              <button
                type="submit"
                className="text-white/40 hover:text-white/80 transition-colors cursor-pointer"
                aria-label="Log out"
              >
                <LogOut className="h-[18px] w-[18px]" />
              </button>
            </form>
          </div>
        ) : (
          <div className="flex items-center gap-3">
            <div className="h-8 w-8 rounded-full bg-accent/20 text-accent flex items-center justify-center text-sm font-semibold shrink-0">
              {initial}
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-white text-sm font-medium truncate leading-tight">{displayName}</p>
              <p className="text-white/50 text-xs truncate leading-tight mt-0.5">{email}</p>
            </div>
            <form action="/api/auth/logout" method="post">
              <button
                type="submit"
                className="text-white/40 hover:text-white/80 transition-colors shrink-0 cursor-pointer"
                aria-label="Log out"
              >
                <LogOut className="h-[18px] w-[18px]" />
              </button>
            </form>
          </div>
        )}
      </div>
    </div>
  );
}

export default function AdminShell({ children, user, userData }: AdminShellProps) {
  const pathname = usePathname();
  const [mobileOpen, setMobileOpen] = useState(false);
  const closeButtonRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    setMobileOpen(false);
  }, [pathname]);

  useEffect(() => {
    if (mobileOpen) {
      setTimeout(() => closeButtonRef.current?.focus(), 100);
    }
  }, [mobileOpen]);

  const navGroups = useMemo<NavGroup[]>(() => [
    {
      label: 'Platform',
      items: [
        { label: 'Dashboard', icon: LayoutDashboard, href: '/admin' },
        { label: 'Business Owners', icon: Users, href: '/admin/owners' },
        { label: 'Businesses', icon: Building2, href: '/admin/businesses' },
        { label: 'Customers', icon: UserCircle, href: '/admin/customers' },
      ],
    },
    {
      label: 'Finance',
      items: [
        { label: 'Revenue', icon: BarChart3, href: '/admin/revenue' },
      ],
    },
    {
      label: 'System',
      items: [
        { label: 'Settings', icon: Settings, href: '/admin/settings' },
      ],
    },
  ], []);

  return (
    <div className="flex flex-col min-h-screen">
      <div className="flex flex-1 overflow-hidden">
        {/* Desktop full sidebar (lg+) */}
        <aside className="hidden lg:flex flex-col w-64 shrink-0 fixed inset-y-0 left-0 z-30">
          <SidebarContent
            navGroups={navGroups}
            pathname={pathname}
            userData={userData}
            userEmail={user.email}
            collapsed={false}
          />
        </aside>

        {/* Desktop icon-only sidebar (md, not lg) */}
        <aside className="hidden md:flex lg:hidden flex-col w-16 shrink-0 fixed inset-y-0 left-0 z-30">
          <SidebarContent
            navGroups={navGroups}
            pathname={pathname}
            userData={userData}
            userEmail={user.email}
            collapsed={true}
          />
        </aside>

        {/* Mobile top bar */}
        <header className="md:hidden fixed top-0 inset-x-0 z-40 h-14 flex items-center px-4 bg-admin-sidebar border-b border-white/[0.12]">
          <Shield className="h-5 w-5 text-accent mr-2 shrink-0" />
          <span className="text-white font-bold text-lg flex-1">JustHustle Admin</span>
          <span className="mr-3 text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded bg-red-500/10 text-red-400 border border-red-500/20">
            ADMIN
          </span>
          <button
            onClick={() => setMobileOpen(true)}
            className="text-white/70 hover:text-white transition-colors p-1 cursor-pointer"
            aria-label="Open menu"
          >
            <Menu className="h-6 w-6" />
          </button>
        </header>

        {/* Mobile slide-over drawer */}
        <AnimatePresence>
          {mobileOpen && (
            <>
              <motion.div
                key="backdrop"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.2 }}
                className="md:hidden fixed inset-0 z-40 bg-black/50"
                onClick={() => setMobileOpen(false)}
              />
              <motion.aside
                key="drawer"
                initial={{ x: '-100%' }}
                animate={{ x: 0 }}
                exit={{ x: '-100%' }}
                transition={{ type: 'tween', duration: 0.25, ease: 'easeInOut' }}
                className="md:hidden fixed top-0 left-0 bottom-0 z-50 w-64"
              >
                <div className="absolute top-3 right-3 z-10">
                  <button
                    ref={closeButtonRef}
                    onClick={() => setMobileOpen(false)}
                    className="text-white/60 hover:text-white transition-colors p-1 cursor-pointer"
                    aria-label="Close menu"
                  >
                    <X className="h-5 w-5" />
                  </button>
                </div>
                <SidebarContent
                  navGroups={navGroups}
                  pathname={pathname}
                  userData={userData}
                  userEmail={user.email}
                  collapsed={false}
                  onLinkClick={() => setMobileOpen(false)}
                />
              </motion.aside>
            </>
          )}
        </AnimatePresence>

        {/* Main content */}
        <main
          className="flex-1 min-h-screen overflow-y-auto md:ml-16 lg:ml-64 mt-14 md:mt-0"
          style={{ background: '#f7f5f0' }}
        >
          {/* Top bar (desktop) — ADMIN MODE badge */}
          <div className="hidden md:flex sticky top-0 z-20 h-14 items-center justify-end px-6 bg-white border-b border-hairline">
            <span className="flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider px-3 py-1 rounded-full bg-red-500/10 text-red-500 border border-red-500/20">
              <AlertTriangle className="h-3.5 w-3.5" />
              ADMIN MODE
            </span>
          </div>
          <div className="p-6">{children}</div>
        </main>
      </div>
    </div>
  );
}
