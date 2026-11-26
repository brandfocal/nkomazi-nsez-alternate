import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import {
  Briefcase,
  FileText,
  FolderDown,
  CheckSquare,
  AlertCircle,
  Plus,
  ArrowRight,
  ShieldCheck,
  Clock,
  ExternalLink,
  Activity,
  CheckCircle2,
  XCircle,
  Building2,
  TrendingUp,
  Inbox
} from 'lucide-react';
import { useAdminAuth } from '../context/AdminAuthContext';
import {
  loadFromStorage,
  INITIAL_OPPORTUNITIES,
  INITIAL_TENDERS,
  INITIAL_RESOURCES,
  INITIAL_APPROVALS,
  INITIAL_AUDIT_LOGS,
  INITIAL_INQUIRIES
} from '../mockData';
import { OpportunityItem, TenderItem, ResourceItem, ApprovalRequest, AuditLog, InquiryItem } from '../types';

export const AdminDashboardPage: React.FC = () => {
  const { user, isSuperAdmin } = useAdminAuth();

  const opportunities = loadFromStorage<OpportunityItem[]>('opportunities', INITIAL_OPPORTUNITIES);
  const tenders = loadFromStorage<TenderItem[]>('tenders', INITIAL_TENDERS);
  const resources = loadFromStorage<ResourceItem[]>('resources', INITIAL_RESOURCES);
  const approvals = loadFromStorage<ApprovalRequest[]>('approvals', INITIAL_APPROVALS);
  const auditLogs = loadFromStorage<AuditLog[]>('audit_logs', INITIAL_AUDIT_LOGS);
  const inquiries = loadFromStorage<InquiryItem[]>('inquiries', INITIAL_INQUIRIES);

  const pendingApprovals = (Array.isArray(approvals) ? approvals : []).filter(a => a?.status === 'PENDING');
  const activeOpportunities = (Array.isArray(opportunities) ? opportunities : []).filter(o => o?.status === 'ACTIVE');
  const openTenders = (Array.isArray(tenders) ? tenders : []).filter(t => t?.status === 'OPEN');
  const newInquiries = (Array.isArray(inquiries) ? inquiries : []).filter(i => i?.status === 'NEW');

  return (
    <div className="space-y-6">
      {/* ─── Executive Welcome Banner ─────────────────────────────────── */}
 <div className="bg-gradient-to-r from-[#023A23] via-[#08301E] to-[#0A452B] rounded-2xl p-6 sm:p-8 text-white shadow-xl relative overflow-hidden">
        <div
 className="pointer-events-none absolute -right-10 -bottom-10 w-72 h-72 rounded-full bg-[#F2AE37]/10 blur-2xl"
          aria-hidden="true"
        />

        <div className="relative z-10 max-w-3xl">
          <div className="flex items-center gap-2 mb-2">
            <span
              className={`text-[11px] font-bold uppercase tracking-wider px-2.5 py-0.5 rounded-full ${
                isSuperAdmin
 ? 'bg-[#F2AE37] text-[#023A23]'
 : 'bg-[#28B674] text-[#023A23]'
              }`}
            >
              {isSuperAdmin ? 'Super Administrator' : 'Standard Administrator'}
            </span>
            <span className="text-white/60 text-xs">• {user?.department}</span>
          </div>

          <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-white mb-2">
            Welcome, {user?.name}
          </h1>

          <p className="text-xs sm:text-sm text-white/80 leading-relaxed mb-6">
            You are managing the public portal for the Mpumalanga Nkomazi SEZ.
            {isSuperAdmin
              ? ' You have full executive authority to approve publications, modify data schemas, and execute permanent deletions.'
              : ' You can draft and update active listings. Content deletions and restricted edits will queue for Super Admin sign-off.'}
          </p>

          <div className="flex flex-wrap gap-3">
            <Link
              to="/admin/opportunities"
 className="inline-flex items-center gap-2 bg-[#28B674] hover:bg-[#22a166] text-[#023A23] font-bold text-xs uppercase tracking-wider py-2.5 px-4 rounded-lg no-underline shadow-md transition-colors"
            >
              <Plus size={15} /> Add Investment Opportunity
            </Link>
            <Link
              to="/admin/tenders"
 className="inline-flex items-center gap-2 bg-white/10 hover:bg-white/20 text-white font-semibold text-xs uppercase tracking-wider py-2.5 px-4 rounded-lg no-underline transition-colors"
            >
              <Plus size={15} /> Publish Tender
            </Link>
          </div>
        </div>
      </div>

      {/* ─── Super Admin Pending Approvals Alert ──────────────────────── */}
      {isSuperAdmin && pendingApprovals.length > 0 && (
 <div className="bg-amber-500/10 rounded-xl p-4 sm:p-5 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div className="flex items-start gap-3">
 <div className="p-2 rounded-lg bg-[#F2AE37]/20 text-[#D4911E] flex-shrink-0">
              <AlertCircle size={22} />
            </div>
            <div>
              <h3 className="text-sm font-bold text-[#023A23]">
                {pendingApprovals.length} Action{pendingApprovals.length > 1 ? 's' : ''} Awaiting Super Admin Review
              </h3>
              <p className="text-xs text-gray-600 mt-0.5">
                Standard Admins have requested changes or deletions that require your formal sign-off before taking effect on the live website.
              </p>
            </div>
          </div>
          <Link
            to="/admin/approvals"
 className="inline-flex items-center gap-1.5 bg-[#F2AE37] hover:bg-[#e09e2a] text-[#023A23] font-bold text-xs uppercase tracking-wider py-2 px-4 rounded-lg no-underline shadow-sm transition-colors whitespace-nowrap"
          >
            Review Queue <ArrowRight size={14} />
          </Link>
        </div>
      )}

      {/* ─── KPI Metrics Grid ─────────────────────────────────────────── */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Active Opportunities */}
 <div className="bg-white rounded-xl p-5 shadow-sm hover:shadow-md transition-shadow">
          <div className="flex items-center justify-between mb-3">
 <div className="p-2.5 rounded-lg bg-emerald-50 text-[#28B674]">
              <Briefcase size={20} />
            </div>
 <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-emerald-100 text-emerald-800">
              Live
            </span>
          </div>
          <div className="text-2xl font-black text-[#023A23]">{activeOpportunities.length}</div>
          <div className="text-xs font-semibold text-gray-500 mt-1">Active Opportunities</div>
          <Link
            to="/admin/opportunities"
            className="mt-3 text-[11px] font-bold text-[#28B674] hover:text-[#023A23] inline-flex items-center gap-1 no-underline"
          >
            Manage listings <ArrowRight size={12} />
          </Link>
        </div>

        {/* Open Tenders */}
 <div className="bg-white rounded-xl p-5 shadow-sm hover:shadow-md transition-shadow">
          <div className="flex items-center justify-between mb-3">
 <div className="p-2.5 rounded-lg bg-[#023A23]/10 text-[#023A23]">
              <FileText size={20} />
            </div>
 <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-[#023A23]/10 text-[#023A23]">
              Procurement
            </span>
          </div>
          <div className="text-2xl font-black text-[#023A23]">{openTenders.length}</div>
          <div className="text-xs font-semibold text-gray-500 mt-1">Open Tenders</div>
          <Link
            to="/admin/tenders"
            className="mt-3 text-[11px] font-bold text-[#023A23] hover:text-[#28B674] inline-flex items-center gap-1 no-underline"
          >
            View notices <ArrowRight size={12} />
          </Link>
        </div>

        {/* Investor Resources */}
 <div className="bg-white rounded-xl p-5 shadow-sm hover:shadow-md transition-shadow">
          <div className="flex items-center justify-between mb-3">
 <div className="p-2.5 rounded-lg bg-[#F2AE37]/15 text-[#D4911E]">
              <FolderDown size={20} />
            </div>
 <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-[#F2AE37]/20 text-[#023A23]">
              Downloads
            </span>
          </div>
          <div className="text-2xl font-black text-[#023A23]">{resources.length}</div>
          <div className="text-xs font-semibold text-gray-500 mt-1">Published Guides & Docs</div>
          <Link
            to="/admin/resources"
            className="mt-3 text-[11px] font-bold text-[#023A23] hover:text-[#F2AE37] inline-flex items-center gap-1 no-underline"
          >
            Manage files <ArrowRight size={12} />
          </Link>
        </div>

        {/* Approvals Queue */}
 <div className="bg-white rounded-xl p-5 shadow-sm hover:shadow-md transition-shadow">
          <div className="flex items-center justify-between mb-3">
 <div className="p-2.5 rounded-lg bg-[#E77227]/10 text-[#E77227]">
              <CheckSquare size={20} />
            </div>
            <span
              className={`text-[10px] font-bold px-2 py-0.5 rounded ${
                pendingApprovals.length > 0
 ? 'bg-[#F2AE37]/25 text-[#023A23] animate-pulse'
 : 'bg-gray-100 text-gray-600'
              }`}
            >
              {pendingApprovals.length} Pending
            </span>
          </div>
          <div className="text-2xl font-black text-[#023A23]">{pendingApprovals.length}</div>
          <div className="text-xs font-semibold text-gray-500 mt-1">Governance Queue</div>
          <Link
            to="/admin/approvals"
            className="mt-3 text-[11px] font-bold text-[#E77227] hover:text-[#023A23] inline-flex items-center gap-1 no-underline"
          >
            Open approval desk <ArrowRight size={12} />
          </Link>
        </div>
      </div>

      {/* ─── Two-Column Operations Layout ─────────────────────────────── */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Recent Pending Queue Preview */}
 <div className="lg:col-span-2 bg-white rounded-xl p-5 shadow-sm">
          <div className="flex items-center justify-between mb-4 pb-3 border-b border-gray-100">
            <div>
              <h2 className="text-sm font-bold text-[#023A23] uppercase tracking-wide">
                Recent Approval Requests
              </h2>
              <p className="text-xs text-gray-500">Deletions and publish requests from staff</p>
            </div>
            <Link
              to="/admin/approvals"
              className="text-xs font-bold text-[#28B674] hover:underline no-underline"
            >
              View All ({approvals.length})
            </Link>
          </div>

          {pendingApprovals.length === 0 ? (
            <div className="text-center py-10 text-gray-400">
              <CheckCircle2 size={36} className="mx-auto text-emerald-500 mb-2 opacity-80" />
              <div className="text-xs font-semibold text-gray-600">Approval Queue Clear</div>
              <div className="text-[11px] text-gray-400 mt-0.5">
                No pending deletions or restricted actions require sign-off.
              </div>
            </div>
          ) : (
            <div className="space-y-3">
              {pendingApprovals.slice(0, 3).map(appr => (
                <div
                  key={appr.id}
 className="p-3.5 rounded-lg bg-gray-50/60 flex flex-col sm:flex-row sm:items-center justify-between gap-3"
                >
                  <div>
                    <div className="flex items-center gap-2 mb-1">
                      <span
                        className={`text-[9px] font-bold uppercase px-2 py-0.5 rounded ${
                          appr.action === 'DELETE'
 ? 'bg-red-100 text-red-800'
 : 'bg-emerald-100 text-emerald-800'
                        }`}
                      >
                        Request to {appr.action}
                      </span>
                      <span className="text-[10px] text-gray-400">• {appr.itemType}</span>
                    </div>
                    <div className="text-xs font-bold text-[#023A23]">{appr.itemTitle}</div>
                    <div className="text-[11px] text-gray-500 mt-0.5">
                      Requested by <strong className="text-gray-700">{appr.requestedBy}</strong> ({appr.requestedAt})
                    </div>
                  </div>

                  <Link
                    to="/admin/approvals"
 className="self-start sm:self-center px-3 py-1.5 rounded-md text-xs font-bold bg-[#023A23] text-white hover:bg-[#28B674] hover:text-[#023A23] transition-colors no-underline whitespace-nowrap"
                  >
                    Review Action
                  </Link>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* POPIA Audit Trail Log */}
 <div className="bg-white rounded-xl p-5 shadow-sm flex flex-col">
          <div className="flex items-center justify-between mb-4 pb-3 border-b border-gray-100">
            <div>
              <h2 className="text-sm font-bold text-[#023A23] uppercase tracking-wide flex items-center gap-1.5">
                <ShieldCheck size={16} className="text-[#28B674]" /> Audit Activity Feed
              </h2>
              <p className="text-[11px] text-gray-500">Immutable admin action logs</p>
            </div>
            <Link
              to="/admin/audit-logs"
              className="text-xs font-bold text-[#28B674] hover:underline no-underline"
            >
              Full Trail
            </Link>
          </div>

          <div className="space-y-3 flex-1 overflow-y-auto max-h-[300px]">
            {auditLogs.map(log => (
              <div key={log.id} className="text-xs pb-3 border-b border-gray-100 last:border-0 last:pb-0">
                <div className="flex items-center justify-between text-[10px] text-gray-400 mb-0.5">
                  <span className="font-semibold text-gray-600">{log.userName}</span>
                  <span>{log.timestamp.split(' ')[1]}</span>
                </div>
                <div className="font-semibold text-[#023A23]">{log.action.replace('_', ' ')}</div>
                <div className="text-[11px] text-gray-500 truncate">{log.target}</div>
                <div className="text-[10px] text-gray-400 mt-0.5">IP: {log.ipAddress}</div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
