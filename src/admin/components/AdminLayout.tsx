import React, { useState } from 'react';
import { NavLink, Outlet, useNavigate, useLocation } from 'react-router-dom';
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
  ArrowRight
} from 'lucide-react';
import { useAdminAuth } from '../context/AdminAuthContext';
import { loadFromStorage, INITIAL_APPROVALS } from '../mockData';
import { ApprovalRequest } from '../types';

export const AdminLayout: React.FC = () => {
  const { user, isSuperAdmin, logout, switchRole } = useAdminAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  // Load live pending approval count
  const approvals = loadFromStorage<ApprovalRequest[]>('approvals', INITIAL_APPROVALS);
  const pendingCount = (Array.isArray(approvals) ? approvals : INITIAL_APPROVALS).filter(a => a?.status === 'PENDING').length;

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
      icon: Briefcase
    },
    {
      to: '/admin/tenders',
      label: 'Tenders & Procurement',
      icon: FileText
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
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-lg bg-[#28B674] flex items-center justify-center font-bold text-[#023A23] text-sm">
            N
          </div>
          <div>
            <div className="font-bold text-xs uppercase tracking-wider text-[#F2AE37]">Nkomazi SEZ</div>
            <div className="text-[10px] text-white/70">Admin Management Portal</div>
          </div>
        </div>
        <button
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          className="p-2 text-white/80 hover:text-white rounded-md hover:bg-white/10"
        >
          {mobileMenuOpen ? <X size={20} /> : <Menu size={20} />}
        </button>
      </header>

      {/* ─── Sidebar Navigation ────────────────────────────────────── */}
      <aside
        className={`fixed inset-y-0 left-0 z-40 w-72 bg-[#081B12] text-white border-r border-[#28B674]/20 flex flex-col transition-transform duration-300 ease-in-out lg:translate-x-0 lg:static lg:h-screen ${
          mobileMenuOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        {/* Brand identity */}
        <div className="p-6 border-b border-white/10">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-[#28B674] to-[#1E8A57] flex items-center justify-center shadow-lg shadow-[#28B674]/20 font-black text-[#023A23] text-xl">
              N
            </div>
            <div>
              <div className="font-black text-sm tracking-tight text-white leading-tight">
                MPUMALANGA NKOMAZI
              </div>
              <div className="text-[11px] font-bold text-[#F2AE37] tracking-widest uppercase">
                SEZ Admin Console
              </div>
            </div>
          </div>
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
                  `flex items-center justify-between px-3.5 py-2.5 rounded-lg text-xs font-semibold transition-all duration-200 no-underline ${
                    isActive
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
                        className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                          isActive
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
              className={`text-[10px] font-bold px-2 py-0.5 rounded ${
                isSuperAdmin
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
                className={`text-[10px] py-1 px-1.5 rounded font-bold transition-all ${
                  isSuperAdmin
                    ? 'bg-[#F2AE37] text-[#023A23]'
                    : 'bg-white/5 text-white/70 hover:bg-white/15'
                }`}
              >
                Super Admin
              </button>
              <button
                type="button"
                onClick={() => switchRole('STANDARD_ADMIN')}
                className={`text-[10px] py-1 px-1.5 rounded font-bold transition-all ${
                  !isSuperAdmin
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
              Mpumalanga Nkomazi Special Economic Zone
            </span>
          </div>

          <div className="flex items-center gap-4">
            {/* Super Admin / Standard Admin banner */}
            <div
              className={`text-xs px-3 py-1 rounded-full font-bold flex items-center gap-1.5 ${
                isSuperAdmin
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
    </div>
  );
};
