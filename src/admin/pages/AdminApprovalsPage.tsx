import React, { useState } from 'react';
import { useAdminAuth } from '../context/AdminAuthContext';
import {
  ApprovalRequest,
  OpportunityItem,
  TenderItem,
  ResourceItem,
  AuditLog,
} from '../types';
import {
  STORAGE_KEYS,
  INITIAL_APPROVALS,
  INITIAL_OPPORTUNITIES,
  INITIAL_TENDERS,
  INITIAL_RESOURCES,
  loadFromStorage,
  saveToStorage,
  createAuditLog,
} from '../mockData';
import {
  CheckCircle2,
  XCircle,
  Clock,
  ShieldCheck,
  AlertCircle,
  FileText,
  User,
  Calendar,
  Layers,
  ArrowRight,
  Filter,
} from 'lucide-react';

export const AdminApprovalsPage: React.FC = () => {
  const { user, isSuperAdmin } = useAdminAuth();

  const [approvals, setApprovals] = useState<ApprovalRequest[]>(() =>
    loadFromStorage<ApprovalRequest[]>(STORAGE_KEYS.APPROVALS, INITIAL_APPROVALS)
  );

  const [filterStatus, setFilterStatus] = useState<'ALL' | 'PENDING' | 'APPROVED' | 'REJECTED'>('ALL');
  const [activeItem, setActiveItem] = useState<ApprovalRequest | null>(null);
  const [rejectReason, setRejectReason] = useState('');
  const [isRejectModalOpen, setIsRejectModalOpen] = useState(false);

  const handleApprove = (req: ApprovalRequest) => {
    if (!isSuperAdmin) {
      alert('Only Super Administrators have authority to approve state-level changes.');
      return;
    }

    // 1. Process side effects based on itemType & action
    if (req.itemType === 'OPPORTUNITY') {
      const opps = loadFromStorage<OpportunityItem[]>(STORAGE_KEYS.OPPORTUNITIES, INITIAL_OPPORTUNITIES);
      if (req.action === 'DELETE') {
        const filtered = opps.filter((o) => o.id !== req.itemId);
        saveToStorage(STORAGE_KEYS.OPPORTUNITIES, filtered);
      } else if (req.action === 'PUBLISH') {
        const updated = opps.map((o) => (o.id === req.itemId ? { ...o, status: 'ACTIVE' as const } : o));
        saveToStorage(STORAGE_KEYS.OPPORTUNITIES, updated);
      }
    } else if (req.itemType === 'TENDER') {
      const tenders = loadFromStorage<TenderItem[]>(STORAGE_KEYS.TENDERS, INITIAL_TENDERS);
      if (req.action === 'DELETE') {
        const filtered = tenders.filter((t) => t.id !== req.itemId);
        saveToStorage(STORAGE_KEYS.TENDERS, filtered);
      } else if (req.action === 'PUBLISH') {
        const updated = tenders.map((t) => (t.id === req.itemId ? { ...t, status: 'OPEN' as const } : t));
        saveToStorage(STORAGE_KEYS.TENDERS, updated);
      }
    } else if (req.itemType === 'RESOURCE') {
      const resources = loadFromStorage<ResourceItem[]>(STORAGE_KEYS.RESOURCES, INITIAL_RESOURCES);
      if (req.action === 'DELETE') {
        const filtered = resources.filter((r) => r.id !== req.itemId);
        saveToStorage(STORAGE_KEYS.RESOURCES, filtered);
      } else if (req.action === 'PUBLISH') {
        const updated = resources.map((r) => (r.id === req.itemId ? { ...r, status: 'PUBLISHED' as const } : r));
        saveToStorage(STORAGE_KEYS.RESOURCES, updated);
      }
    }

    // 2. Mark approval as approved
    const updatedApprovals = approvals.map((a) =>
      a.id === req.id
        ? {
            ...a,
            status: 'APPROVED' as const,
            reviewedBy: user?.name,
            reviewedAt: new Date().toISOString().replace('T', ' ').substring(0, 16),
          }
        : a
    );

    setApprovals(updatedApprovals);
    saveToStorage(STORAGE_KEYS.APPROVALS, updatedApprovals);

    // 3. Log audit event
    const logs = loadFromStorage<AuditLog[]>(STORAGE_KEYS.AUDIT_LOGS, []);
    const newLog = createAuditLog(
      user?.name || 'Super Admin',
      'SUPER_ADMIN',
      'APPROVE_REQUEST',
      req.itemType,
      `Approved ${req.action} request for "${req.itemTitle}" submitted by ${req.requestedBy}`
    );
    saveToStorage(STORAGE_KEYS.AUDIT_LOGS, [newLog, ...logs]);
  };

  const openRejectModal = (req: ApprovalRequest) => {
    setActiveItem(req);
    setRejectReason('');
    setIsRejectModalOpen(true);
  };

  const handleConfirmReject = () => {
    if (!activeItem) return;

    const updatedApprovals = approvals.map((a) =>
      a.id === activeItem.id
        ? {
            ...a,
            status: 'REJECTED' as const,
            reviewedBy: user?.name,
            reviewedAt: new Date().toISOString().replace('T', ' ').substring(0, 16),
            reviewNotes: rejectReason || 'Declined by Super Administrator.',
          }
        : a
    );

    setApprovals(updatedApprovals);
    saveToStorage(STORAGE_KEYS.APPROVALS, updatedApprovals);

    const logs = loadFromStorage<AuditLog[]>(STORAGE_KEYS.AUDIT_LOGS, []);
    const newLog = createAuditLog(
      user?.name || 'Super Admin',
      'SUPER_ADMIN',
      'REJECT_REQUEST',
      activeItem.itemType,
      `Rejected request "${activeItem.itemTitle}". Note: ${rejectReason || 'No notes'}`
    );
    saveToStorage(STORAGE_KEYS.AUDIT_LOGS, [newLog, ...logs]);

    setIsRejectModalOpen(false);
    setActiveItem(null);
  };

  const filteredApprovals = approvals.filter((a) => {
    if (filterStatus === 'ALL') return true;
    return a.status === filterStatus;
  });

  const pendingCount = approvals.filter((a) => a.status === 'PENDING').length;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-2xl font-bold text-[#023A23]">
              Governance & Approval Center
            </h1>
            {pendingCount > 0 && (
 <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-[#F2AE37]/25 text-[#023A23]">
                {pendingCount} Pending
              </span>
            )}
          </div>
          <p className="text-sm text-gray-600 mt-1">
            Super Administrator dual-control sign-off queue for content deletions, public notices, and sensitive records.
          </p>
        </div>

        {/* Status Filter Tabs */}
 <div className="flex items-center bg-white p-1 rounded-lg shadow-sm">
          {(['ALL', 'PENDING', 'APPROVED', 'REJECTED'] as const).map((tab) => (
            <button
              key={tab}
              onClick={() => setFilterStatus(tab)}
              className={`px-3 py-1.5 rounded-md text-xs font-medium transition-colors ${
                filterStatus === tab
 ? 'bg-[#023A23] text-white shadow-xs'
 : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50'
              }`}
            >
              {tab.charAt(0) + tab.slice(1).toLowerCase()}
              {tab === 'PENDING' && pendingCount > 0 && (
 <span className="ml-1.5 px-1.5 py-0.2 bg-amber-400 text-[#081B12] rounded-full text-[10px] font-bold">
                  {pendingCount}
                </span>
              )}
            </button>
          ))}
        </div>
      </div>

      {/* Role explanation alert */}
      <div className={`p-4 rounded-xl border flex items-start gap-3 ${
        isSuperAdmin
 ? 'bg-emerald-50 text-emerald-900'
 : 'bg-amber-50 text-amber-900'
      }`}>
        <ShieldCheck className={`w-5 h-5 shrink-0 mt-0.5 ${isSuperAdmin ? 'text-[#28B674]' : 'text-amber-600'}`} />
        <div className="text-sm">
          {isSuperAdmin ? (
            <span>
              <strong className="font-semibold">Super Administrator Controls Active:</strong> You possess executive authority to authorize or decline pending changes queued by Standard Admins. Approved deletions permanently take effect.
            </span>
          ) : (
            <span>
              <strong className="font-semibold">Standard Admin View (Read-Only Sign-off):</strong> You can monitor the lifecycle of your submissions. Approval and rejection buttons require Super Administrator privileges. (Use the sidebar switcher to simulate Super Admin actions).
            </span>
          )}
        </div>
      </div>

      {/* List of Approvals */}
      <div className="space-y-4">
        {filteredApprovals.length === 0 ? (
 <div className="bg-white rounded-xl p-12 text-center">
            <CheckCircle2 className="w-12 h-12 text-emerald-500 mx-auto mb-3 opacity-60" />
            <h3 className="font-bold text-[#023A23] text-lg">All Caught Up!</h3>
            <p className="text-sm text-gray-500 mt-1">
              There are no {filterStatus !== 'ALL' ? filterStatus.toLowerCase() : ''} requests in the queue.
            </p>
          </div>
        ) : (
          filteredApprovals.map((req) => (
            <div
              key={req.id}
 className={`bg-white rounded-xl shadow-sm p-5 transition-all ${
                req.status === 'PENDING'
                  ? 'border-amber-200 hover:border-amber-300'
                  : 'border-gray-200'
              }`}
            >
              <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
                {/* Left: Request Details */}
                <div className="space-y-2 flex-1">
                  <div className="flex items-center gap-3 flex-wrap">
                    <span
                      className={`px-2.5 py-0.5 rounded-full text-xs font-semibold ${
                        req.status === 'PENDING'
 ? 'bg-amber-100 text-amber-800 '
                          : req.status === 'APPROVED'
 ? 'bg-emerald-100 text-emerald-800 '
 : 'bg-red-100 text-red-800 '
                      }`}
                    >
                      {req.status}
                    </span>

 <span className="px-2 py-0.5 rounded text-xs font-medium bg-gray-100 text-gray-700">
                      {req.itemType}
                    </span>

 <span className="px-2 py-0.5 rounded text-xs font-medium bg-amber-50 text-amber-700">
                      ACTION: {req.action}
                    </span>

                    <span className="text-xs text-gray-400">
                      ID: {req.id}
                    </span>
                  </div>

                  <h3 className="text-base font-bold text-[#023A23]">
                    {req.itemTitle}
                  </h3>

                  {/* Justification Box */}
 <div className="p-3 bg-gray-50 rounded-lg text-xs text-gray-700">
                    <span className="font-semibold text-gray-900">Operator Justification: </span>
                    {req.reason}
                  </div>

                  {req.reviewNotes && (
 <div className="p-2.5 bg-red-50 rounded-lg text-xs text-red-700">
                      <span className="font-semibold">Reviewer Notes: </span>
                      {req.reviewNotes}
                    </div>
                  )}

                  {/* Metadata Row */}
                  <div className="flex items-center gap-4 text-xs text-gray-500 pt-1 flex-wrap">
                    <div className="flex items-center gap-1.5">
                      <User className="w-3.5 h-3.5 text-gray-400" />
                      <span>Submitted by: <strong className="text-gray-700">{req.requestedBy}</strong> ({req.requestedByEmail})</span>
                    </div>
                    <div className="flex items-center gap-1.5">
                      <Calendar className="w-3.5 h-3.5 text-gray-400" />
                      <span>{req.requestedAt}</span>
                    </div>
                    {req.reviewedBy && (
                      <div className="flex items-center gap-1.5 text-emerald-700 font-medium">
                        <ShieldCheck className="w-3.5 h-3.5" />
                        <span>Decision by: {req.reviewedBy} ({req.reviewedAt})</span>
                      </div>
                    )}
                  </div>
                </div>

                {/* Right: Actions */}
                {req.status === 'PENDING' && (
                  <div className="flex items-center gap-2 shrink-0 pt-2 lg:pt-0 border-t lg:border-t-0 border-gray-100">
                    {isSuperAdmin ? (
                      <>
                        <button
                          onClick={() => openRejectModal(req)}
 className="px-3.5 py-2 rounded-lg text-red-600 hover:bg-red-50 text-xs font-semibold transition-colors flex items-center gap-1.5"
                        >
                          <XCircle className="w-4 h-4" />
                          Decline
                        </button>
                        <button
                          onClick={() => handleApprove(req)}
 className="px-4 py-2 rounded-lg bg-[#023A23] hover:bg-[#023A23]/90 text-white text-xs font-semibold transition-colors flex items-center gap-1.5 shadow-sm"
                        >
                          <CheckCircle2 className="w-4 h-4 text-[#28B674]" />
                          Approve & Execute
                        </button>
                      </>
                    ) : (
 <div className="px-3 py-1.5 rounded-lg bg-gray-100 text-gray-500 text-xs font-medium flex items-center gap-1.5">
                        <Clock className="w-3.5 h-3.5" />
                        Awaiting Super Admin Review
                      </div>
                    )}
                  </div>
                )}
              </div>
            </div>
          ))
        )}
      </div>

      {/* Rejection Modal */}
      {isRejectModalOpen && activeItem && (
 <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
 <div className="bg-white rounded-2xl max-w-md w-full overflow-hidden shadow-2xl p-6 animate-in fade-in zoom-in duration-200">
            <h3 className="text-lg font-bold text-[#023A23]">
              Decline Request
            </h3>
            <p className="text-sm text-gray-600 mt-1">
              Provide feedback or governance reasons for declining <span className="font-semibold text-gray-900">"{activeItem.itemTitle}"</span>.
            </p>

            <div className="mt-4">
              <label className="block text-xs font-semibold uppercase tracking-wider text-gray-700 mb-1">
                Reason / Note for Operator
              </label>
              <textarea
                rows={3}
                required
                placeholder="e.g. Tender documentation is still under active audit..."
                value={rejectReason}
                onChange={(e) => setRejectReason(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#023A23]/20 focus:border-[#023A23]"
              />
            </div>

            <div className="mt-6 flex items-center justify-end gap-3">
              <button
                type="button"
                onClick={() => setIsRejectModalOpen(false)}
 className="px-4 py-2 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-50"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleConfirmReject}
 className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg text-sm font-medium transition-colors"
              >
                Confirm Decline
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
