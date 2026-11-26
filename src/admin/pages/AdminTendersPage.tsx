import React, { useState } from 'react';
import {
  FileText,
  Plus,
  Search,
  Edit2,
  Trash2,
  CheckCircle2,
  AlertTriangle,
  Clock,
  X,
  Filter,
  Calendar,
  Download,
  ShieldAlert
} from 'lucide-react';
import { useAdminAuth } from '../context/AdminAuthContext';
import {
  loadFromStorage,
  saveToStorage,
  INITIAL_TENDERS,
  INITIAL_APPROVALS,
  INITIAL_AUDIT_LOGS
} from '../mockData';
import { TenderItem, ApprovalRequest, AuditLog } from '../types';

export const AdminTendersPage: React.FC = () => {
  const { user, isSuperAdmin } = useAdminAuth();

  const [tenders, setTenders] = useState<TenderItem[]>(() =>
    loadFromStorage('tenders', INITIAL_TENDERS)
  );
  const [approvals, setApprovals] = useState<ApprovalRequest[]>(() =>
    loadFromStorage('approvals', INITIAL_APPROVALS)
  );
  const [search, setSearch] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('ALL');

  // Modal states
  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [editingItem, setEditingItem] = useState<TenderItem | null>(null);
  const [deletionTarget, setDeletionTarget] = useState<TenderItem | null>(null);
  const [deletionReason, setDeletionReason] = useState('');
  const [feedbackNotice, setFeedbackNotice] = useState<string | null>(null);

  // Form states
  const [formRefNo, setFormRefNo] = useState('');
  const [formTitle, setFormTitle] = useState('');
  const [formCategory, setFormCategory] = useState<TenderItem['category']>('Infrastructure & Civils');
  const [formClosingDate, setFormClosingDate] = useState('');
  const [formStatus, setFormStatus] = useState<TenderItem['status']>('OPEN');

  const showNotification = (msg: string) => {
    setFeedbackNotice(msg);
    setTimeout(() => setFeedbackNotice(null), 4000);
  };

  const syncTenders = (updated: TenderItem[]) => {
    setTenders(updated);
    saveToStorage('tenders', updated);
  };

  const syncApprovals = (updated: ApprovalRequest[]) => {
    setApprovals(updated);
    saveToStorage('approvals', updated);
  };

  const addAuditLog = (action: string, target: string) => {
    const logs = loadFromStorage<AuditLog[]>('audit_logs', INITIAL_AUDIT_LOGS);
    const newLog: AuditLog = {
      id: `log-${Date.now()}`,
      userName: user?.name || 'Administrator',
      userRole: user?.role || 'STANDARD_ADMIN',
      action,
      target,
      timestamp: new Date().toISOString().replace('T', ' ').substring(0, 19),
      ipAddress: '196.25.1.42'
    };
    saveToStorage('audit_logs', [newLog, ...logs]);
  };

  const handleStartEdit = (item: TenderItem) => {
    setEditingItem(item);
    setFormRefNo(item.refNo);
    setFormTitle(item.title);
    setFormCategory(item.category);
    setFormClosingDate(item.closingDate);
    setFormStatus(item.status);
  };

  const handleSaveForm = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formTitle.trim()) return;

    if (editingItem) {
      const updated = tenders.map(t =>
        t.id === editingItem.id
          ? {
              ...t,
              refNo: formRefNo,
              title: formTitle,
              category: formCategory,
              closingDate: formClosingDate,
              status: formStatus
            }
          : t
      );
      syncTenders(updated);
      addAuditLog('EDITED_TENDER', `Tender ${formRefNo}`);
      showNotification(`Tender "${formRefNo}" updated successfully.`);
      setEditingItem(null);
    } else {
      const newItem: TenderItem = {
        id: `ten-${Date.now()}`,
        refNo: formRefNo || `NSEZ/GEN/2026/${Math.floor(100 + Math.random() * 900)}`,
        title: formTitle,
        category: formCategory,
        closingDate: formClosingDate || '30 Dec 2026',
        status: formStatus || 'OPEN',
        documentCount: 2,
        dateAdded: new Date().toISOString().split('T')[0]
      };

      showNotification(`Tender "${newItem.refNo}" published to live website.`);

      syncTenders([newItem, ...tenders]);
      addAuditLog('PUBLISHED_TENDER', `Tender ${newItem.refNo}`);
      setIsCreateOpen(false);
    }

    setFormRefNo('');
    setFormTitle('');
    setFormClosingDate('');
  };

  const handleConfirmDeletion = () => {
    if (!deletionTarget) return;

    if (isSuperAdmin) {
      const updated = tenders.filter(t => t.id !== deletionTarget.id);
      syncTenders(updated);
      addAuditLog('DELETED_TENDER_PERMANENT', `Deleted ${deletionTarget.refNo}`);
      showNotification(`Tender "${deletionTarget.refNo}" permanently deleted.`);
    } else {
      const updatedTenders = tenders.map(t =>
        t.id === deletionTarget.id ? { ...t, status: 'PENDING_APPROVAL' as const, pendingAction: 'DELETE' as const } : t
      );
      syncTenders(updatedTenders);

      const newApproval: ApprovalRequest = {
        id: `appr-${Date.now()}`,
        itemType: 'TENDER',
        action: 'DELETE',
        itemId: deletionTarget.id,
        itemTitle: `${deletionTarget.refNo} - ${deletionTarget.title}`,
        requestedBy: `${user?.name} (Standard Admin)`,
        requestedByEmail: user?.email || '',
        requestedAt: new Date().toISOString().replace('T', ' ').substring(0, 16),
        reason: deletionReason || 'Requested tender notice removal.',
        status: 'PENDING'
      };
      syncApprovals([newApproval, ...approvals]);
      addAuditLog('REQUESTED_TENDER_DELETION', `Deletion request for ${deletionTarget.refNo}`);
      showNotification(`Deletion request queued for Super Admin review.`);
    }

    setDeletionTarget(null);
  };

  const filtered = tenders.filter(t => {
    const matchesSearch =
      t.title.toLowerCase().includes(search.toLowerCase()) ||
      t.refNo.toLowerCase().includes(search.toLowerCase());
    const matchesCat = categoryFilter === 'ALL' || t.category === categoryFilter;
    return matchesSearch && matchesCat;
  });

  return (
    <div className="space-y-6">
      {feedbackNotice && (
        <div className="p-3.5 rounded-xl bg-emerald-500 text-[#023A23] font-bold text-xs flex items-center gap-2 shadow-lg">
          <CheckCircle2 size={16} />
          <span>{feedbackNotice}</span>
        </div>
      )}

      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl sm:text-2xl font-bold text-[#023A23]">
            Tenders & Procurement
          </h1>
          <p className="text-xs text-gray-500 mt-0.5">
            Manage public sector bid invitations, tender specifications, and closing dates.
          </p>
        </div>

        <button
          onClick={() => {
            setEditingItem(null);
            setFormRefNo('');
            setFormTitle('');
            setFormClosingDate('');
            setIsCreateOpen(true);
          }}
          className="inline-flex items-center gap-2 bg-[#28B674] hover:bg-[#22a166] text-[#023A23] font-bold text-xs uppercase tracking-wider py-2.5 px-4 rounded-lg shadow-sm transition-colors cursor-pointer"
        >
          <Plus size={16} />
          <span>Post New Tender</span>
        </button>
      </div>

      {/* Filters */}
      <div className="bg-white p-4 rounded-xl border border-black/10 shadow-sm flex flex-col sm:flex-row items-center gap-3">
        <div className="relative flex-1 w-full">
          <Search size={16} className="absolute left-3 top-3 text-gray-400" />
          <input
            type="text"
            placeholder="Search tenders by reference number or scope..."
            value={search}
            onChange={e => setSearch(e.target.value)}
            className="w-full pl-9 pr-4 py-2 border border-gray-200 rounded-lg text-xs focus:outline-none focus:border-[#28B674]"
          />
        </div>

        <div className="flex items-center gap-2 w-full sm:w-auto">
          <Filter size={15} className="text-gray-400" />
          <select
            value={categoryFilter}
            onChange={e => setCategoryFilter(e.target.value)}
            className="text-xs border border-gray-200 rounded-lg py-2 px-3 focus:outline-none focus:border-[#28B674] bg-white text-gray-700"
          >
            <option value="ALL">All Categories</option>
            <option value="Infrastructure & Civils">Infrastructure & Civils</option>
            <option value="Security & Facilities">Security & Facilities</option>
            <option value="Professional Services">Professional Services</option>
            <option value="ICT & Technology">ICT & Technology</option>
            <option value="Agriculture">Agriculture</option>
          </select>
        </div>
      </div>

      {/* Table */}
      <div className="bg-white rounded-xl border border-black/10 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-[#023A23] text-white uppercase text-[10px] tracking-wider font-bold">
              <tr>
                <th className="py-3 px-4">Ref Number</th>
                <th className="py-3 px-4">Tender Title & Scope</th>
                <th className="py-3 px-4">Category</th>
                <th className="py-3 px-4">Closing Date</th>
                <th className="py-3 px-4">Status</th>
                <th className="py-3 px-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {filtered.map(t => (
                <tr key={t.id} className="hover:bg-gray-50/70 transition-colors">
                  <td className="py-3.5 px-4 font-bold text-[#023A23]">{t.refNo}</td>
                  <td className="py-3.5 px-4 font-semibold text-gray-800 max-w-sm">{t.title}</td>
                  <td className="py-3.5 px-4 text-gray-600">{t.category}</td>
                  <td className="py-3.5 px-4">
                    <span className="inline-flex items-center gap-1.5 font-medium text-gray-700">
                      <Calendar size={13} className="text-gray-400" /> {t.closingDate}
                    </span>
                  </td>
                  <td className="py-3.5 px-4">
                    {t.status === 'OPEN' && (
                      <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800">
                        Open for Bids
                      </span>
                    )}
                    {t.status === 'EVALUATING' && (
                      <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-[#F2AE37]/20 text-[#023A23] border border-[#F2AE37]/40">
                        In Evaluation
                      </span>
                    )}
                    {t.status === 'PENDING_APPROVAL' && (
                      <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-amber-100 text-amber-900 border border-amber-300">
                        Awaiting Approval
                      </span>
                    )}
                    {t.status === 'CLOSED' && (
                      <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-gray-100 text-gray-700">
                        Closed
                      </span>
                    )}
                  </td>
                  <td className="py-3.5 px-4 text-right">
                    <div className="flex items-center justify-end gap-1.5">
                      <button
                        onClick={() => handleStartEdit(t)}
                        className="p-1.5 rounded text-gray-600 hover:text-[#023A23] hover:bg-black/5"
                      >
                        <Edit2 size={15} />
                      </button>
                      <button
                        onClick={() => {
                          setDeletionTarget(t);
                          setDeletionReason('');
                        }}
                        className="p-1.5 rounded text-red-500 hover:text-red-700 hover:bg-red-50"
                      >
                        <Trash2 size={15} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* ─── Modal Form ──────────────────────────────────────────────── */}
      {(isCreateOpen || editingItem) && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in">
          <div className="bg-white rounded-2xl max-w-lg w-full p-6 shadow-2xl border border-black/10">
            <div className="flex items-center justify-between pb-4 border-b border-gray-100 mb-4">
              <h3 className="text-base font-bold text-[#023A23]">
                {editingItem ? 'Edit Tender Notice' : 'Post Tender Notice'}
              </h3>
              <button
                onClick={() => {
                  setIsCreateOpen(false);
                  setEditingItem(null);
                }}
                className="text-gray-400 hover:text-gray-600"
              >
                <X size={18} />
              </button>
            </div>

            <form onSubmit={handleSaveForm} className="space-y-3.5 text-xs">
              <div>
                <label className="block font-bold text-gray-700 mb-1">Tender Reference Number *</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. NSEZ/ENG/2026/015"
                  value={formRefNo}
                  onChange={e => setFormRefNo(e.target.value)}
                  className="w-full border border-gray-300 rounded-lg p-2.5 text-xs focus:outline-none focus:border-[#28B674]"
                />
              </div>

              <div>
                <label className="block font-bold text-gray-700 mb-1">Title & Scope *</label>
                <textarea
                  rows={2}
                  required
                  placeholder="Full scope of tender, required CIDB grading or accreditation..."
                  value={formTitle}
                  onChange={e => setFormTitle(e.target.value)}
                  className="w-full border border-gray-300 rounded-lg p-2.5 text-xs focus:outline-none focus:border-[#28B674]"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-gray-700 mb-1">Category *</label>
                  <select
                    value={formCategory}
                    onChange={e => setFormCategory(e.target.value as any)}
                    className="w-full border border-gray-300 rounded-lg p-2.5 text-xs focus:outline-none focus:border-[#28B674] bg-white"
                  >
                    <option value="Infrastructure & Civils">Infrastructure & Civils</option>
                    <option value="Security & Facilities">Security & Facilities</option>
                    <option value="Professional Services">Professional Services</option>
                    <option value="ICT & Technology">ICT & Technology</option>
                    <option value="Agriculture">Agriculture</option>
                  </select>
                </div>
                <div>
                  <label className="block font-bold text-gray-700 mb-1">Closing Date *</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. 20 Dec 2026 at 11:00"
                    value={formClosingDate}
                    onChange={e => setFormClosingDate(e.target.value)}
                    className="w-full border border-gray-300 rounded-lg p-2.5 text-xs focus:outline-none focus:border-[#28B674]"
                  />
                </div>
              </div>

              <div>
                <label className="block font-bold text-gray-700 mb-1">Status</label>
                <select
                  value={formStatus}
                  onChange={e => setFormStatus(e.target.value as any)}
                  className="w-full border border-gray-300 rounded-lg p-2.5 text-xs focus:outline-none focus:border-[#28B674] bg-white"
                >
                  <option value="OPEN">Open for Bids</option>
                  <option value="EVALUATING">In Evaluation</option>
                  <option value="CLOSED">Closed</option>
                </select>
              </div>

              <div className="flex justify-end gap-2 pt-3 border-t border-gray-100">
                <button
                  type="button"
                  onClick={() => {
                    setIsCreateOpen(false);
                    setEditingItem(null);
                  }}
                  className="px-4 py-2 rounded-lg border border-gray-300 text-gray-700 font-semibold text-xs hover:bg-gray-50"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-lg bg-[#28B674] hover:bg-[#22a166] text-[#023A23] font-bold text-xs uppercase tracking-wider"
                >
                  {editingItem ? 'Save Changes' : isSuperAdmin ? 'Publish Tender' : 'Submit for Review'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ─── Deletion Confirmation Modal ─────────────────────────────── */}
      {deletionTarget && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 shadow-2xl border border-black/10">
            <div className="flex items-center gap-3 text-red-600 mb-3">
              <div className="p-2.5 rounded-full bg-red-100">
                <AlertTriangle size={24} />
              </div>
              <div>
                <h3 className="text-base font-bold text-gray-900">
                  {isSuperAdmin ? 'Confirm Permanent Deletion' : 'Submit Deletion Request'}
                </h3>
                <div className="text-[11px] text-gray-500">{deletionTarget.refNo}</div>
              </div>
            </div>

            <p className="text-xs text-gray-600 leading-relaxed mb-4">
              {isSuperAdmin
                ? `You have Super Admin authority. Deleting "${deletionTarget.refNo}" will immediately unpublish it from public procurement listings.`
                : `As a Standard Admin, tender removals require Super Admin review to adhere to public procurement transparency regulations.`}
            </p>

            {!isSuperAdmin && (
              <div className="mb-4">
                <label className="block text-xs font-bold text-gray-700 mb-1">
                  Reason for Cancellation / Removal *
                </label>
                <textarea
                  rows={2}
                  required
                  placeholder="e.g. Cancelled by accounting officer; superseded by revised spec..."
                  value={deletionReason}
                  onChange={e => setDeletionReason(e.target.value)}
                  className="w-full border border-gray-300 rounded-lg p-2.5 text-xs focus:outline-none focus:border-red-500"
                />
              </div>
            )}

            <div className="flex justify-end gap-2 pt-3 border-t border-gray-100">
              <button
                type="button"
                onClick={() => setDeletionTarget(null)}
                className="px-4 py-2 rounded-lg border border-gray-300 text-gray-700 font-semibold text-xs hover:bg-gray-50"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleConfirmDeletion}
                className="px-4 py-2 rounded-lg bg-red-600 hover:bg-red-700 text-white font-bold text-xs uppercase tracking-wider"
              >
                {isSuperAdmin ? 'Permanently Delete' : 'Submit Deletion Request'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
