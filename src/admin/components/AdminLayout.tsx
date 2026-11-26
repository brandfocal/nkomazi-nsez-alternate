import React, { useState, useEffect } from 'react';
import { NavLink, Link, Outlet, useNavigate, useLocation } from 'react-router-dom';
import {
  LayoutDashboard,
  Briefcase,
  FileText,
  FolderDown,
  CheckSquare,
  Users,
  LogOut,
  ExternalLink,
  ShieldCheck,
  ShieldAlert,
  Menu,
  X,
  Bell,
  Sparkles,
  ArrowRight,
  Settings,
  Newspaper,
  TrendingUp,
  Inbox,
  Search,
  Command,
  FileCheck2
} from 'lucide-react';
import { useAdminAuth } from '../context/AdminAuthContext';
import {
  loadFromStorage,
  INITIAL_APPROVALS,
  INITIAL_INQUIRIES,
  INITIAL_OPPORTUNITIES,
  INITIAL_TENDERS,
  INITIAL_NEWS,
  INITIAL_CAREERS,
  STORAGE_KEYS
} from '../mockData';
import { ApprovalRequest, InquiryItem, OpportunityItem, TenderItem, NewsArticleItem, CareerItem } from '../types';

export const AdminLayout: React.FC = () => {
  const { user, isSuperAdmin, logout, switchRole } = useAdminAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [commandOpen, setCommandOpen] = useState(false);
  const [commandQuery, setCommandQuery] = useState('');

  // Keyboard shortcut for Command Palette (Ctrl+K or Cmd+K)
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === 'k') {
        e.preventDefault();
        setCommandOpen((prev) => !prev);
      }
      if (e.key === 'Escape') {
        setCommandOpen(false);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  // Load live pending approval count and unread inquiries count
  const approvals = loadFromStorage<ApprovalRequest[]>('approvals', INITIAL_APPROVALS);
  const pendingCount = (Array.isArray(approvals) ? approvals : INITIAL_APPROVALS).filter(a => a?.status === 'PENDING').length;

  const inquiries = loadFromStorage<InquiryItem[]>('inquiries', INITIAL_INQUIRIES);
  const unreadInquiriesCount = (Array.isArray(inquiries) ? inquiries : INITIAL_INQUIRIES).filter(i => i?.status === 'NEW').length;

  const handleLogout = () => {
    logout();
    navigate('/admin/login');
  };

  const navLinks = [
    {
      to: '/admin',
      end: true,
      label: 'Executive Overview',
      icon: LayoutDashboard
    },
    {
      to: '/admin/opportunities',
      label: 'Investment Opportunities',
      icon: TrendingUp
    },
    {
      to: '/admin/tenders',
      label: 'Tenders & Procurement',
      icon: FileText
    },
    {
      to: '/admin/news',
      label: 'News & Media Releases',
      icon: Newspaper
    },
    {
      to: '/admin/careers',
      label: 'Careers & Vacancies',
      icon: Briefcase
    },
    {
      to: '/admin/resources',
      label: 'Investor Resources (PDFs)',
      icon: FolderDown
    },
    {
      to: '/admin/approvals',
      label: 'Approval Center',
      icon: CheckSquare,
      badge: pendingCount > 0 ? pendingCount : null
    },
    {
      to: '/admin/settings',
      label: 'Site Settings & Directory',
      icon: Settings
    },
    {
      to: '/admin/inquiries',
      label: 'Inquiries & Leads',
      icon: Inbox,
      badge: unreadInquiriesCount > 0 ? unreadInquiriesCount : null
    },
    {
      to: '/admin/audit-logs',
      label: 'Audit Trail & Compliance',
      icon: ShieldCheck
    },
    ...(isSuperAdmin
      ? [
        {
          to: '/admin/users',
          label: 'Admins & Permissions',
          icon: Users
        }
      ]
      : [])
  ];

  return (
    <div className="min-h-screen bg-[#F4F6F4] text-[#1A2621] flex flex-col lg:flex-row font-['Poppins',system-ui,sans-serif]">
      {/* ─── Mobile Header ─────────────────────────────────────────── */}
      <header className="lg:hidden bg-[#023A23] text-white px-4 py-3 flex items-center justify-between border-b border-[#28B674]/20 sticky top-0 z-50">
        <Link to="/admin" className="flex items-center gap-2.5 no-underline">
          <img
            src="/NSEZ-Horizontal-Logo-white.png"
            alt="Mpumalanga Nkomazi SEZ"
            className="h-7 w-auto object-contain"
          />
          <span className="text-[10px] bg-[#28B674]/20 text-[#28B674] font-semibold px-1.5 py-0.5 rounded border border-[#28B674]/30">
            Admin
          </span>
        </Link>
        <button
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          className="p-2 text-white/80 hover:text-white rounded-md hover:bg-white/10"
        >
          {mobileMenuOpen ? <X size={20} /> : <Menu size={20} />}
        </button>
      </header>

      {/* ─── Sidebar Navigation ────────────────────────────────────── */}
      <aside
        className={`fixed inset-y-0 left-0 z-40 w-72 bg-[#081B12] text-white border-r border-[#28B674]/20 flex flex-col transition-transform duration-300 ease-in-out lg:translate-x-0 lg:static lg:h-screen ${mobileMenuOpen ? 'translate-x-0' : '-translate-x-full'
          }`}
      >
        {/* Brand identity */}
        <div className="p-6 border-b border-white/10">
          <Link to="/admin" className="block no-underline">
            <img
              src="/NSEZ-Horizontal-Logo-white.png"
              alt="Mpumalanga Nkomazi SEZ"
              className="h-9 w-auto object-contain mb-2.5"
            />
            <div className="flex items-center justify-between">
              <span className="text-[11px] font-bold text-[#F2AE37] tracking-widest uppercase">
                Admin Console
              </span>
              <span className="text-[9px] uppercase tracking-wider px-1.5 py-0.5 rounded bg-white/10 text-white/70 font-semibold">
                v2.0
              </span>
            </div>
          </Link>
        </div>

        {/* Navigation list */}
        <nav className="flex-1 px-4 py-5 space-y-1.5 overflow-y-auto">
          <div className="px-3 pb-2 text-[10px] font-bold tracking-widest uppercase text-white/40">
            Content Governance
          </div>
          {navLinks.map(link => {
            const Icon = link.icon;
            return (
              <NavLink
                key={link.to}
                to={link.to}
                end={link.end}
                onClick={() => setMobileMenuOpen(false)}
                className={({ isActive }) =>
                  `flex items-center justify-between px-3.5 py-2.5 rounded-lg text-xs font-semibold transition-all duration-200 no-underline ${isActive
                    ? 'bg-[#28B674] text-[#023A23] shadow-md shadow-[#28B674]/25 font-bold'
                    : 'text-white/70 hover:text-white hover:bg-white/5'
                  }`
                }
              >
                {({ isActive }) => (
                  <>
                    <div className="flex items-center gap-3">
                      <Icon size={17} className={isActive ? 'text-[#023A23]' : 'text-[#F2AE37]'} />
                      <span>{link.label}</span>
                    </div>
                    {link.badge !== null && link.badge !== undefined && (
                      <span
                        className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${isActive
                          ? 'bg-[#023A23] text-[#F2AE37]'
                          : 'bg-[#F2AE37] text-[#023A23]'
                          }`}
                      >
                        {link.badge}
                      </span>
                    )}
                  </>
                )}
              </NavLink>
            );
          })}
        </nav>

        {/* Active User Card & Demo Role Switcher */}
        <div className="p-4 border-t border-white/10 bg-[#022A1A]/50">
          <div className="flex items-center justify-between mb-2">
            <div className="text-[10px] uppercase font-bold text-white/50 tracking-wider">
              Signed in as
            </div>
            <span
              className={`text-[10px] font-bold px-2 py-0.5 rounded ${isSuperAdmin
                ? 'bg-[#F2AE37]/20 text-[#F2AE37] border border-[#F2AE37]/40'
                : 'bg-[#28B674]/20 text-[#28B674] border border-[#28B674]/40'
                }`}
            >
              {isSuperAdmin ? 'Super Admin' : 'Standard Admin'}
            </span>
          </div>

          <div className="text-xs font-bold text-white truncate">{user?.name}</div>
          <div className="text-[11px] text-white/60 truncate mb-3">{user?.email}</div>

          {/* Quick Interactive Role Switcher for Demo */}
          <div className="mb-3 p-2 rounded-lg bg-black/40 border border-white/10">
            <div className="text-[10px] text-[#F2AE37] font-semibold flex items-center gap-1 mb-1.5">
              <Sparkles size={11} /> Test Permission Levels:
            </div>
            <div className="grid grid-cols-2 gap-1.5">
              <button
                type="button"
                onClick={() => switchRole('SUPER_ADMIN')}
                className={`text-[10px] py-1 px-1.5 rounded font-bold transition-all ${isSuperAdmin
                  ? 'bg-[#F2AE37] text-[#023A23]'
                  : 'bg-white/5 text-white/70 hover:bg-white/15'
                  }`}
              >
                Super Admin
              </button>
              <button
                type="button"
                onClick={() => switchRole('STANDARD_ADMIN')}
                className={`text-[10px] py-1 px-1.5 rounded font-bold transition-all ${!isSuperAdmin
                  ? 'bg-[#28B674] text-[#023A23]'
                  : 'bg-white/5 text-white/70 hover:bg-white/15'
                  }`}
              >
                Standard Admin
              </button>
            </div>
          </div>

          <button
            onClick={handleLogout}
            className="w-full flex items-center justify-center gap-2 py-2 px-3 rounded-lg text-xs font-medium text-red-300 hover:text-white hover:bg-red-500/20 transition-colors"
          >
            <LogOut size={14} />
            <span>Sign Out</span>
          </button>
        </div>
      </aside>

      {/* ─── Main Content Canvas ───────────────────────────────────── */}
      <div className="flex-1 flex flex-col min-w-0 overflow-y-auto">
        {/* Top Header Bar */}
        <header className="hidden lg:flex bg-white border-b border-black/10 px-8 py-3.5 items-center justify-between sticky top-0 z-30 shadow-sm">
          <div className="flex items-center gap-3">
            <span className="text-xs font-bold text-[#023A23] uppercase tracking-wider">
              Mpumalanga Nkomazi SEZ
            </span>

            {/* Quick Command Search Trigger */}
            <button
              onClick={() => {
                setCommandOpen(true);
                setCommandQuery('');
              }}
              className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-gray-100 hover:bg-gray-200 text-gray-500 hover:text-gray-900 text-xs transition-colors border border-gray-200 cursor-pointer ml-4"
              title="Search across all modules (Ctrl + K)"
            >
              <Search size={13} className="text-gray-400" />
              <span>Quick search...</span>
              <kbd className="px-1.5 py-0.5 rounded bg-white border border-gray-300 text-[10px] font-mono text-gray-500">
                Ctrl K
              </kbd>
            </button>
          </div>

          <div className="flex items-center gap-4">
            {/* Super Admin / Standard Admin banner */}
            <div
              className={`text-xs px-3 py-1 rounded-full font-bold flex items-center gap-1.5 ${isSuperAdmin
                ? 'bg-amber-50 text-amber-800 border border-amber-200'
                : 'bg-emerald-50 text-emerald-800 border border-emerald-200'
                }`}
            >
              {isSuperAdmin ? (
                <>
                  <ShieldCheck size={14} className="text-[#F2AE37]" />
                  <span>Super Admin Authority (Full Sign-off)</span>
                </>
              ) : (
                <>
                  <ShieldAlert size={14} className="text-[#28B674]" />
                  <span>Standard Admin (Edits Queue for Review)</span>
                </>
              )}
            </div>

            {/* View Live Website link */}
            <a
              href="/"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-1.5 text-xs font-semibold text-[#023A23] hover:text-[#28B674] no-underline px-3 py-1.5 rounded-md hover:bg-black/5 transition-colors border border-black/10"
            >
              <span>View Live Website</span>
              <ExternalLink size={13} />
            </a>
          </div>
        </header>

        {/* Content Outlet */}
        <main className="p-4 sm:p-6 lg:p-8 flex-1 max-w-7xl w-full mx-auto">
          <Outlet />
        </main>
      </div>

      {/* ─── Global Command Palette Modal (Ctrl + K) ────────────────── */}
      {commandOpen && (
        <div
          className="fixed inset-0 z-50 flex items-start justify-center pt-20 p-4 bg-black/50 backdrop-blur-sm"
          onClick={() => setCommandOpen(false)}
        >
          <div
            className="bg-white rounded-2xl max-w-xl w-full shadow-2xl border border-gray-100 overflow-hidden animate-in fade-in zoom-in-95 duration-150"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center gap-3 px-4 py-3.5 border-b border-gray-100 bg-gray-50/75">
              <Search size={18} className="text-gray-400" />
              <input
                type="text"
                autoFocus
                placeholder="Search across tenders, opportunities, news, careers, leads..."
                value={commandQuery}
                onChange={(e) => setCommandQuery(e.target.value)}
                className="w-full bg-transparent text-sm outline-none text-gray-800 placeholder-gray-400"
              />
              <button
                onClick={() => setCommandOpen(false)}
                className="text-xs px-2 py-1 rounded bg-gray-200 text-gray-600 hover:bg-gray-300 font-medium"
              >
                Esc
              </button>
            </div>

            <div className="max-h-96 overflow-y-auto p-2 space-y-1">
              {(() => {
                const q = commandQuery.trim().toLowerCase();
                if (!q) {
                  return (
                    <div>
                      <div className="px-3 py-1.5 text-[10px] font-bold uppercase tracking-wider text-gray-400">
                        Quick Navigation
                      </div>
                      {navLinks.map((nav) => {
                        const Icon = nav.icon;
                        return (
                          <button
                            key={nav.to}
                            onClick={() => {
                              navigate(nav.to);
                              setCommandOpen(false);
                            }}
                            className="w-full flex items-center justify-between p-2.5 rounded-lg hover:bg-gray-50 text-left transition-colors cursor-pointer group"
                          >
                            <div className="flex items-center gap-2.5">
                              <div className="p-1.5 rounded-md bg-gray-100 text-gray-600 group-hover:bg-[#023A23] group-hover:text-white transition-colors">
                                <Icon size={15} />
                              </div>
                              <span className="text-xs font-semibold text-gray-800 group-hover:text-[#023A23]">
                                {nav.label}
                              </span>
                            </div>
                            <ArrowRight size={13} className="text-gray-300 group-hover:text-[#023A23]" />
                          </button>
                        );
                      })}
                    </div>
                  );
                }

                const results: Array<{ label: string; sub: string; path: string; type: string; icon: any }> = [];

                // Tenders search
                const tenders = loadFromStorage<TenderItem[]>('tenders', INITIAL_TENDERS);
                tenders
                  .filter((t) => t.title.toLowerCase().includes(q) || t.refNo.toLowerCase().includes(q))
                  .slice(0, 2)
                  .forEach((t) =>
                    results.push({ label: t.title, sub: `Tender • ${t.refNo}`, path: '/admin/tenders', type: 'Tenders', icon: FileText })
                  );

                // Opportunities search
                const opps = loadFromStorage<OpportunityItem[]>('opportunities', INITIAL_OPPORTUNITIES);
                opps
                  .filter((o) => o.title.toLowerCase().includes(q) || o.sector.toLowerCase().includes(q))
                  .slice(0, 2)
                  .forEach((o) =>
                    results.push({ label: o.title, sub: `Opportunity • ${o.sector}`, path: '/admin/opportunities', type: 'Opportunities', icon: TrendingUp })
                  );

                // News search
                const news = loadFromStorage<NewsArticleItem[]>(STORAGE_KEYS.NEWS, INITIAL_NEWS);
                news
                  .filter((n) => n.title.toLowerCase().includes(q) || n.category.toLowerCase().includes(q))
                  .slice(0, 2)
                  .forEach((n) =>
                    results.push({ label: n.title, sub: `News • ${n.category}`, path: '/admin/news', type: 'News', icon: Newspaper })
                  );

                // Careers search
                const careers = loadFromStorage<CareerItem[]>(STORAGE_KEYS.CAREERS, INITIAL_CAREERS);
                careers
                  .filter((c) => c.title.toLowerCase().includes(q) || c.department.toLowerCase().includes(q))
                  .slice(0, 2)
                  .forEach((c) =>
                    results.push({ label: c.title, sub: `Careers • ${c.department}`, path: '/admin/careers', type: 'Careers', icon: Briefcase })
                  );

                // Inquiries search
                const inqs = loadFromStorage<InquiryItem[]>('inquiries', INITIAL_INQUIRIES);
                inqs
                  .filter((i) => i.name.toLowerCase().includes(q) || i.subject.toLowerCase().includes(q) || (i.company && i.company.toLowerCase().includes(q)))
                  .slice(0, 2)
                  .forEach((i) =>
                    results.push({ label: i.subject, sub: `Lead • ${i.name} (${i.company || i.email})`, path: '/admin/inquiries', type: 'Inquiries', icon: Inbox })
                  );

                if (results.length === 0) {
                  return (
                    <div className="p-8 text-center text-xs text-gray-500">
                      No matching records found for "{commandQuery}". Try another keyword.
                    </div>
                  );
                }

                return results.map((item, idx) => {
                  const Icon = item.icon;
                  return (
                    <button
                      key={idx}
                      onClick={() => {
                        navigate(item.path);
                        setCommandOpen(false);
                      }}
                      className="w-full flex items-center justify-between p-2.5 rounded-lg hover:bg-gray-50 text-left transition-colors cursor-pointer group"
                    >
                      <div className="flex items-center gap-3 min-w-0">
                        <div className="p-1.5 rounded-md bg-gray-100 text-gray-600 group-hover:bg-[#023A23] group-hover:text-white transition-colors shrink-0">
                          <Icon size={15} />
                        </div>
                        <div className="min-w-0">
                          <div className="text-xs font-semibold text-gray-900 truncate group-hover:text-[#023A23]">
                            {item.label}
                          </div>
                          <div className="text-[11px] text-gray-400 truncate">
                            {item.sub}
                          </div>
                        </div>
                      </div>
                      <span className="text-[10px] uppercase font-bold text-gray-400 bg-gray-100 px-2 py-0.5 rounded shrink-0">
                        {item.type}
                      </span>
                    </button>
                  );
                });
              })()}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
