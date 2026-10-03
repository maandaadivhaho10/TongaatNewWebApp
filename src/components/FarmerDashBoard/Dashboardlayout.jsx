import React, { useState, useEffect, useRef } from 'react';
import { NavLink, Outlet, useNavigate } from 'react-router-dom';
import {
  Bell,
  Menu,
  X,
  Check,
  LayoutDashboard,
  FlaskConical,
  Briefcase,
  Users,
  CalendarCheck,
  Truck,
  FileBarChart,
  User,
  LogOut,
} from 'lucide-react';

// Brand navy (same as the login screen): #201E64, hover #2B2889

// TODO: replace with the signed-in user from your auth state
const CURRENT_USER = { name: 'Thandi Nkosi', role: 'Farmer' };

const NAV_ITEMS = [
  { to: '/dashboard', label: 'Dashboard', icon: LayoutDashboard, end: true },
  { to: '/dashboard/requests', label: 'Chemical & Fertiliser Requests', icon: FlaskConical },
  { to: '/dashboard/opportunities', label: 'Business Opportunities', icon: Briefcase },
  { to: '/dashboard/meetings', label: 'Meetings & Workshops', icon: Users },
  { to: '/dashboard/bookings', label: 'Bookings', icon: CalendarCheck },
  { to: '/dashboard/tonnage', label: 'Tonnage Submission', icon: Truck },
  { to: '/dashboard/reports', label: 'Monthly Report', icon: FileBarChart },
  { to: '/dashboard/profile', label: 'Profile', icon: User },
];

// TODO: replace with notifications from your API
const INITIAL_NOTIFICATIONS = [
  { id: 1, title: 'New opportunity: cane haulage contract', time: '10 min ago', read: false },
  { id: 2, title: 'Reminder: Grower meeting tomorrow at 09:00', time: '2 hours ago', read: false },
  { id: 3, title: 'Your fertiliser request was approved', time: 'Yesterday', read: false },
  { id: 4, title: 'Your monthly report is due in 3 days', time: '2 days ago', read: true },
];

const initialsOf = (name) =>
  name
    .split(' ')
    .map((n) => n[0])
    .slice(0, 2)
    .join('')
    .toUpperCase();

export default function DashboardLayout() {
  const navigate = useNavigate();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [notifOpen, setNotifOpen] = useState(false);
  const [notifications, setNotifications] = useState(INITIAL_NOTIFICATIONS);
  const notifRef = useRef(null);

  const unread = notifications.filter((n) => !n.read).length;

  // Close the notification panel when clicking outside it
  useEffect(() => {
    const onClick = (e) => {
      if (notifRef.current && !notifRef.current.contains(e.target)) setNotifOpen(false);
    };
    document.addEventListener('mousedown', onClick);
    return () => document.removeEventListener('mousedown', onClick);
  }, []);

  // Escape closes the sidebar drawer and the notification panel
  useEffect(() => {
    const onKey = (e) => {
      if (e.key === 'Escape') {
        setSidebarOpen(false);
        setNotifOpen(false);
      }
    };
    document.addEventListener('keydown', onKey);
    return () => document.removeEventListener('keydown', onKey);
  }, []);

  const markRead = (id) =>
    setNotifications((list) => list.map((n) => (n.id === id ? { ...n, read: true } : n)));
  const markAllRead = () => setNotifications((list) => list.map((n) => ({ ...n, read: true })));

  const handleLogout = () => {
    // TODO: clear your auth token / session here
    navigate('/login');
  };

  return (
    <div className="min-h-[100dvh] bg-[#F5F6FA] text-neutral-900">
      {/* ---------- Mobile overlay ---------- */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 z-40 bg-black/40 lg:hidden"
          onClick={() => setSidebarOpen(false)}
          aria-hidden="true"
        />
      )}

      {/* ---------- Sidebar: always visible on desktop, drawer on mobile ---------- */}
      <aside
        className={`fixed inset-y-0 left-0 z-50 w-72 bg-[#201E64] flex flex-col transition-transform duration-200 lg:translate-x-0 ${
          sidebarOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
        aria-label="Main navigation"
      >
        <div className="flex items-center justify-between px-5 pt-5 pb-4">
          <div className="bg-white rounded-xl px-3 py-2">
            <img src="/Tongaat-Huletts-Logo.png" alt="Tongaat Hulett" className="h-9 w-auto" draggable="false" />
          </div>
          <button
            type="button"
            onClick={() => setSidebarOpen(false)}
            className="lg:hidden p-2 rounded-lg text-white/80 hover:bg-white/10 focus:outline-none focus-visible:ring-2 focus-visible:ring-white"
            aria-label="Close menu"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <nav className="flex-1 overflow-y-auto px-3 py-2 space-y-1">
          {NAV_ITEMS.map(({ to, label, icon: Icon, end }) => (
            <NavLink
              key={to}
              to={to}
              end={end}
              onClick={() => setSidebarOpen(false)}
              className={({ isActive }) =>
                [
                  'flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-sm leading-snug transition-colors',
                  'focus:outline-none focus-visible:ring-2 focus-visible:ring-white',
                  isActive
                    ? 'bg-white text-[#201E64] font-semibold shadow-sm'
                    : 'text-white/75 hover:bg-white/10 hover:text-white',
                ].join(' ')
              }
            >
              <Icon className="w-5 h-5 shrink-0" />
              <span>{label}</span>
            </NavLink>
          ))}
        </nav>

        {/* Log out sits last */}
        <div className="p-3 border-t border-white/10">
          <button
            type="button"
            onClick={handleLogout}
            className="w-full flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-sm text-white/75 hover:bg-red-500/15 hover:text-white transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-white"
          >
            <LogOut className="w-5 h-5 shrink-0" />
            <span>Log out</span>
          </button>
        </div>
      </aside>

      {/* ---------- Content column ---------- */}
      <div className="lg:pl-72 min-h-[100dvh] flex flex-col">
        {/* Header */}
        <header className="sticky top-0 z-30 h-16 bg-white border-b border-neutral-200">
          <div className="h-full px-4 sm:px-6 lg:px-8 flex items-center justify-between gap-3">
            <div className="flex items-center gap-2 min-w-0">
              <button
                type="button"
                onClick={() => setSidebarOpen(true)}
                className="lg:hidden p-2 -ml-2 rounded-lg text-[#201E64] hover:bg-[#201E64]/5 focus:outline-none focus-visible:ring-2 focus-visible:ring-[#201E64]"
                aria-label="Open menu"
              >
                <Menu className="w-6 h-6" />
              </button>
              <span className="hidden sm:block text-sm font-semibold text-neutral-500">Farmer Portal</span>
            </div>

            <div className="flex items-center gap-1.5 sm:gap-3 min-w-0">
              {/* Notifications */}
              <div className="relative" ref={notifRef}>
                <button
                  type="button"
                  onClick={() => setNotifOpen((o) => !o)}
                  aria-label={`Notifications${unread ? `, ${unread} unread` : ''}`}
                  aria-expanded={notifOpen}
                  className="relative p-2.5 rounded-full text-[#201E64] hover:bg-[#201E64]/5 focus:outline-none focus-visible:ring-2 focus-visible:ring-[#201E64]"
                >
                  <Bell className="w-5 h-5" />
                  {unread > 0 && (
                    <span className="absolute top-1 right-1 min-w-[18px] h-[18px] px-1 rounded-full bg-red-500 text-white text-[10px] font-bold flex items-center justify-center ring-2 ring-white">
                      {unread}
                    </span>
                  )}
                </button>

                {notifOpen && (
                  <div className="fixed left-4 right-4 top-[4.25rem] sm:absolute sm:left-auto sm:right-0 sm:top-full sm:mt-2 sm:w-96 bg-white rounded-2xl border border-neutral-200 shadow-xl overflow-hidden">
                    <div className="flex items-center justify-between px-4 py-3 border-b border-neutral-100">
                      <h2 className="text-sm font-bold text-[#201E64]">Notifications</h2>
                      <button
                        type="button"
                        onClick={markAllRead}
                        disabled={unread === 0}
                        className="inline-flex items-center gap-1 text-xs font-medium text-[#201E64] hover:underline disabled:text-neutral-400 disabled:no-underline disabled:cursor-default"
                      >
                        <Check className="w-3.5 h-3.5" />
                        Mark all as read
                      </button>
                    </div>

                    <ul className="max-h-80 overflow-y-auto divide-y divide-neutral-100">
                      {notifications.map((n) => (
                        <li key={n.id}>
                          <button
                            type="button"
                            onClick={() => markRead(n.id)}
                            className={`w-full flex items-start gap-3 px-4 py-3 text-left transition-colors hover:bg-neutral-50 ${
                              n.read ? '' : 'bg-[#201E64]/[0.04]'
                            }`}
                          >
                            <span
                              className={`mt-1.5 w-2 h-2 rounded-full shrink-0 ${
                                n.read ? 'bg-transparent' : 'bg-red-500'
                              }`}
                              aria-hidden="true"
                            />
                            <span className="min-w-0">
                              <span
                                className={`block text-sm leading-snug ${
                                  n.read ? 'text-neutral-600' : 'text-neutral-900 font-medium'
                                }`}
                              >
                                {n.title}
                              </span>
                              <span className="block mt-0.5 text-xs text-neutral-500">{n.time}</span>
                            </span>
                          </button>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>

              {/* User */}
              <button
                type="button"
                onClick={() => navigate('/dashboard/profile')}
                className="flex items-center gap-2.5 pl-1 pr-2 sm:pr-3 py-1 rounded-full hover:bg-neutral-100 transition-colors min-w-0 focus:outline-none focus-visible:ring-2 focus-visible:ring-[#201E64]"
              >
                <span className="w-9 h-9 rounded-full bg-[#201E64] text-white text-xs font-bold flex items-center justify-center shrink-0">
                  {initialsOf(CURRENT_USER.name)}
                </span>
                <span className="text-left min-w-0">
                  <span className="block text-sm font-semibold text-neutral-900 truncate max-w-[110px] sm:max-w-[200px]">
                    {CURRENT_USER.name}
                  </span>
                  <span className="hidden sm:block text-xs text-neutral-500">{CURRENT_USER.role}</span>
                </span>
              </button>
            </div>
          </div>
        </header>

        {/* Page content */}
        <main className="flex-1 p-4 sm:p-6 lg:p-8">
          <Outlet context={{ user: CURRENT_USER }} />
        </main>
      </div>
    </div>
  );
}