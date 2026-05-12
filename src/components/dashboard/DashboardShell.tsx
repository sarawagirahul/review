'use client';

import { useState, useEffect, useRef, useMemo } from 'react';
import { usePathname } from 'next/navigation';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
import {
  LayoutDashboard,
  Building2,
  ShieldAlert,
  CreditCard,
  UserCircle,
  Menu,
  X,
  LogOut,
} from 'lucide-react';

// ─── Types ───────────────────────────────────────────────────────────────────

interface OwnerDetails {
  trial_ends_at: string | null;
  subscription_status: string | null;
}

interface UserData {
  full_name: string | null;
  avatar_url: string | null;
  email: string | null;
}

interface DashboardShellProps {
  children: React.ReactNode;
  user: { id: string; email?: string };
  userData: UserData | null;
  ownerDetails: OwnerDetails | null;
  unreadFeedbackCount: number;
}

// ─── Nav config ──────────────────────────────────────────────────────────────

interface NavItem {
  label: string;
  icon: React.ElementType;
  href: string;
  badge?: number;
}

interface NavGroup {
  label: string;
  items: NavItem[];
}

// ─── Helpers ─────────────────────────────────────────────────────────────────

function getDaysUntilExpiry(trialEndsAt: string | null): number | null {
  if (!trialEndsAt) return null;
  return Math.ceil(
    (new Date(trialEndsAt).getTime() - new Date().getTime()) /
      (1000 * 60 * 60 * 24),
  );
}

function getTrialBannerMessage(
  subscriptionStatus: string | null,
  daysUntilExpiry: number | null,
): string | null {
  if (subscriptionStatus === 'past_due') {
    return 'Payment failed. Please update your payment method.';
  }
  if (subscriptionStatus !== 'trial' || daysUntilExpiry === null) return null;
  if (daysUntilExpiry === 0) return 'Your trial expires today! Upgrade now.';
  if (daysUntilExpiry < 0) return 'Your trial has expired. Upgrade now to continue.';
  if (daysUntilExpiry <= 2)
    return `Your trial expires in ${daysUntilExpiry} day${daysUntilExpiry !== 1 ? 's' : ''}. Upgrade now.`;
  if (daysUntilExpiry <= 7)
    return `${daysUntilExpiry} days left in your trial. Upgrade now.`;
  return null;
}

// ─── Trial Banner ─────────────────────────────────────────────────────────────

interface TrialBannerProps {
  ownerDetails: OwnerDetails | null;
  userEmail: string;
}

function TrialBanner({
  ownerDetails,
  userEmail,
}: TrialBannerProps) {
  const [dismissed, setDismissed] = useState(true); // start hidden to avoid flash
  const daysUntilExpiry = getDaysUntilExpiry(ownerDetails?.trial_ends_at ?? null);
  const subscriptionStatus = ownerDetails?.subscription_status ?? null;
  const message = getTrialBannerMessage(subscriptionStatus, daysUntilExpiry);
  const key = `trial_banner_dismissed_${userEmail}`;

  useEffect(() => {
    if (subscriptionStatus === 'active') {
      localStorage.removeItem(key);
      setDismissed(false);
      return;
    }
    const wasDismissed = localStorage.getItem(key) === '1';
    if (!wasDismissed) setDismissed(false);
  }, [key, subscriptionStatus]);

  if (!message || dismissed) return null;

  const handleDismiss = () => {
    localStorage.setItem(key, '1');
    setDismissed(true);
  };

  return (
    <div className="flex items-center justify-center gap-2 px-6 py-2.5 bg-accent/[0.08] border-b border-accent/20">
      <p className="text-accent font-medium text-sm">{message}</p>
      <Link
        href="/dashboard/billing"
        className="bg-accent text-white px-4 py-1.5 rounded-full text-sm font-semibold hover:bg-accent-hover transition-colors ml-2 shrink-0"
      >
        Upgrade
      </Link>
      <button
        onClick={handleDismiss}
        className="text-accent/60 hover:text-accent ml-auto transition-colors shrink-0"
        aria-label="Dismiss banner"
      >
        <X className="h-4 w-4" />
      </button>
    </div>
  );
}

// ─── Nav Item ─────────────────────────────────────────────────────────────────

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
        'flex items-center h-11 px-3 rounded-lg mx-2 my-0.5 transition-colors relative group',
        isActive
          ? 'bg-accent/[0.15] text-accent border-l-[3px] border-accent pl-[9px]'
          : 'text-white/60 hover:bg-white/[0.05] hover:text-white',
      ].join(' ')}
    >
      <Icon className="h-[18px] w-[18px] shrink-0" />
      {!collapsed && (
        <span className="ml-3 text-sm font-medium whitespace-nowrap">{item.label}</span>
      )}
      {item.badge !== undefined && item.badge > 0 && (
        <span
          className={[
            'ml-auto flex items-center justify-center rounded-full bg-red-500 text-white text-[10px] font-bold leading-none shrink-0',
            collapsed ? 'absolute top-1.5 right-1.5 h-4 w-4' : 'h-5 min-w-[20px] px-1',
          ].join(' ')}
        >
          {item.badge > 99 ? '99+' : item.badge}
        </span>
      )}
      {/* Tooltip for collapsed mode */}
      {collapsed && (
        <span className="pointer-events-none absolute left-full ml-3 whitespace-nowrap rounded-md bg-gray-900 px-2.5 py-1 text-xs text-white opacity-0 group-hover:opacity-100 transition-opacity z-50">
          {item.label}
        </span>
      )}
    </Link>
  );
}

// ─── Sidebar Content ─────────────────────────────────────────────────────────

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
  const displayName = userData?.full_name ?? userEmail ?? 'User';
  const initial = displayName.charAt(0).toUpperCase();
  const email = userData?.email ?? userEmail ?? '';

  return (
    <div className="flex flex-col h-full bg-sidebar">
      {/* Logo */}
      <div className="h-16 flex items-center px-5 border-b border-white/[0.12] shrink-0">
        {collapsed ? (
          <span className="text-white font-bold text-lg">J</span>
        ) : (
          <span className="text-white font-bold text-xl tracking-tight">JustHustle</span>
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
                item.href === '/dashboard'
                  ? pathname === '/dashboard'
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
                className="text-white/40 hover:text-white/80 transition-colors"
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
                className="text-white/40 hover:text-white/80 transition-colors shrink-0"
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

// ─── Main shell ───────────────────────────────────────────────────────────────

export default function DashboardShell({
  children,
  user,
  userData,
  ownerDetails,
  unreadFeedbackCount,
}: DashboardShellProps) {
  const pathname = usePathname();
  const [mobileOpen, setMobileOpen] = useState(false);
  const closeButtonRef = useRef<HTMLButtonElement>(null);

  // Close mobile drawer on route change
  useEffect(() => {
    setMobileOpen(false);
  }, [pathname]);

  // Focus close button when mobile drawer opens (accessibility)
  useEffect(() => {
    if (mobileOpen) {
      setTimeout(() => closeButtonRef.current?.focus(), 100);
    }
  }, [mobileOpen]);

  const navGroups = useMemo<NavGroup[]>(() => [
    {
      label: 'Overview',
      items: [
        { label: 'Dashboard', icon: LayoutDashboard, href: '/dashboard' },
        { label: 'My Businesses', icon: Building2, href: '/dashboard/businesses' },
      ],
    },
    {
      label: 'Manage',
      items: [
        {
          label: 'Shield Inbox',
          icon: ShieldAlert,
          href: '/dashboard/feedback',
          badge: unreadFeedbackCount,
        },
        { label: 'Billing', icon: CreditCard, href: '/dashboard/billing' },
      ],
    },
    {
      label: 'Account',
      items: [
        { label: 'Profile Settings', icon: UserCircle, href: '/dashboard/settings' },
      ],
    },
  ], [unreadFeedbackCount]);

  return (
    <div className="flex flex-col min-h-screen">
      {/* Trial / past-due banner */}
      <TrialBanner ownerDetails={ownerDetails} userEmail={userData?.email ?? user.email ?? ''} />

      <div className="flex flex-1 overflow-hidden">
        {/* ── Desktop full sidebar (lg+) ── */}
        <aside className="hidden lg:flex flex-col w-64 shrink-0 fixed inset-y-0 left-0 z-30">
          <SidebarContent
            navGroups={navGroups}
            pathname={pathname}
            userData={userData}
            userEmail={user.email}
            collapsed={false}
          />
        </aside>

        {/* ── Desktop icon-only sidebar (md, not lg) ── */}
        <aside className="hidden md:flex lg:hidden flex-col w-16 shrink-0 fixed inset-y-0 left-0 z-30">
          <SidebarContent
            navGroups={navGroups}
            pathname={pathname}
            userData={userData}
            userEmail={user.email}
            collapsed={true}
          />
        </aside>

        {/* ── Mobile top bar ── */}
        <header className="md:hidden fixed top-0 inset-x-0 z-40 h-14 flex items-center px-4 bg-sidebar border-b border-white/[0.12]">
          <span className="text-white font-bold text-lg flex-1">JustHustle</span>
          <button
            onClick={() => setMobileOpen(true)}
            className="text-white/70 hover:text-white transition-colors p-1"
            aria-label="Open menu"
          >
            <Menu className="h-6 w-6" />
          </button>
        </header>

        {/* ── Mobile slide-over drawer ── */}
        <AnimatePresence>
          {mobileOpen && (
            <>
              {/* Backdrop */}
              <motion.div
                key="backdrop"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.2 }}
                className="md:hidden fixed inset-0 z-40 bg-black/50"
                onClick={() => setMobileOpen(false)}
              />
              {/* Drawer */}
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
                    className="text-white/60 hover:text-white transition-colors p-1"
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

        {/* ── Main content ── */}
        <main
          className="flex-1 min-h-screen overflow-y-auto md:ml-16 lg:ml-64 mt-14 md:mt-0"
          style={{ background: '#f7f5f0' }}
        >
          <div className="p-6">{children}</div>
        </main>
      </div>
    </div>
  );
}
