import React, { useState } from 'react';
import {
  Briefcase,
  Plus,
  Search,
  Edit2,
  Trash2,
  CheckCircle2,
  AlertTriangle,
  Clock,
  X,
  Filter,
  ShieldAlert,
  ArrowRight
} from 'lucide-react';
import { useAdminAuth } from '../context/AdminAuthContext';
import {
  loadFromStorage,
  saveToStorage,
  INITIAL_OPPORTUNITIES,
  INITIAL_APPROVALS,
  INITIAL_AUDIT_LOGS
} from '../mockData';
import { OpportunityItem, ApprovalRequest, AuditLog } from '../types';

export const AdminOpportunitiesPage: React.FC = () => {
  const { user, isSuperAdmin } = useAdminAuth();

  const [opportunities, setOpportunities] = useState<OpportunityItem[]>(() =>
    loadFromStorage('opportunities', INITIAL_OPPORTUNITIES)
  );
  const [approvals, setApprovals] = useState<ApprovalRequest[]>(() =>
    loadFromStorage('approvals', INITIAL_APPROVALS)
  );
  const [search, setSearch] = useState('');
  const [sectorFilter, setSectorFilter] = useState('ALL');

  // Modal states
  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [editingItem, setEditingItem] = useState<OpportunityItem | null>(null);
  const [deletionTarget, setDeletionTarget] = useState<OpportunityItem | null>(null);
  const [deletionReason, setDeletionReason] = useState('');
  const [feedbackNotice, setFeedbackNotice] = useState<string | null>(null);

  // Form states for Create/Edit
  const [formTitle, setFormTitle] = useState('');
  const [formSector, setFormSector] = useState<OpportunityItem['sector']>('Agro-processing');
  const [formValue, setFormValue] = useState('');
  const [formHectares, setFormHectares] = useState('');
  const [formLocation, setFormLocation] = useState('');
  const [formDescription, setFormDescription] = useState('');

  const showNotification = (msg: string) => {
    setFeedbackNotice(msg);
    setTimeout(() => setFeedbackNotice(null), 4000);
  };

  const syncOpportunities = (updated: OpportunityItem[]) => {
    setOpportunities(updated);
    saveToStorage('opportunities', updated);
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

  // Open Edit modal
  const handleStartEdit = (item: OpportunityItem) => {
    setEditingItem(item);
    setFormTitle(item.title);
    setFormSector(item.sector);
    setFormValue(item.investmentValue);
    setFormHectares(item.hectares);
    setFormLocation(item.location);
    setFormDescription(item.description);
  };

  // Save Create or Edit
  const handleSaveForm = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formTitle.trim()) return;

    if (editingItem) {
      // Update existing
      const updated = opportunities.map(o =>
        o.id === editingItem.id
          ? {
              ...o,
              title: formTitle,
              sector: formSector,
              investmentValue: formValue,
              hectares: formHectares,
              location: formLocation,
              description: formDescription
            }
          : o
      );
      syncOpportunities(updated);
      addAuditLog('EDITED_OPPORTUNITY', `Opportunity ${formTitle}`);
      showNotification(`"${formTitle}" successfully updated.`);
      setEditingItem(null);
    } else {
      // Create new
      const newItem: OpportunityItem = {
        id: `opp-${Date.now()}`,
        title: formTitle,
        sector: formSector,
        investmentValue: formValue || 'TBD',
        hectares: formHectares || 'TBD',
        location: formLocation || 'Komatipoort Precinct',
        description: formDescription,
        status: isSuperAdmin ? 'ACTIVE' : 'PENDING_APPROVAL',
        dateAdded: new Date().toISOString().split('T')[0]
      };

      if (!isSuperAdmin) {
        // Standard Admin: Queue publish approval
        const newApproval: ApprovalRequest = {
          id: `appr-${Date.now()}`,
          itemType: 'OPPORTUNITY',
          action: 'PUBLISH',
          itemId: newItem.id,
          itemTitle: newItem.title,
          requestedBy: `${user?.name} (Standard Admin)`,
          requestedByEmail: user?.email || '',
          requestedAt: new Date().toISOString().replace('T', ' ').substring(0, 16),
          reason: 'New investment opportunity submitted for public portal launch.',
          status: 'PENDING'
        };
        syncApprovals([newApproval, ...approvals]);
        showNotification(`Opportunity created and submitted to Super Admin for publication approval.`);
      } else {
        showNotification(`New opportunity "${formTitle}" published directly to the live website.`);
      }

      syncOpportunities([newItem, ...opportunities]);
      addAuditLog(isSuperAdmin ? 'CREATED_OPPORTUNITY' : 'SUBMITTED_OPPORTUNITY', `Opportunity ${formTitle}`);
      setIsCreateOpen(false);
    }

    // Reset form
    setFormTitle('');
    setFormValue('');
    setFormHectares('');
    setFormLocation('');
    setFormDescription('');
  };

  // Handle Delete trigger
  const handleDeleteClick = (item: OpportunityItem) => {
    setDeletionTarget(item);
    setDeletionReason('');
  };

  // Confirm Delete
  const handleConfirmDeletion = () => {
    if (!deletionTarget) return;

    if (isSuperAdmin) {
      // Super Admin: Direct permanent deletion
      const updated = opportunities.filter(o => o.id !== deletionTarget.id);
      syncOpportunities(updated);
      addAuditLog('DELETED_OPPORTUNITY_PERMANENT', `Removed ${deletionTarget.title}`);
      showNotification(`Opportunity "${deletionTarget.title}" permanently removed from live website.`);
    } else {
      // Standard Admin: Mark as pending deletion and queue approval
      const updatedOpps = opportunities.map(o =>
        o.id === deletionTarget.id ? { ...o, status: 'PENDING_APPROVAL' as const, pendingAction: 'DELETE' as const } : o
      );
      syncOpportunities(updatedOpps);

      const newApproval: ApprovalRequest = {
        id: `appr-${Date.now()}`,
        itemType: 'OPPORTUNITY',
        action: 'DELETE',
        itemId: deletionTarget.id,
        itemTitle: deletionTarget.title,
        requestedBy: `${user?.name} (Standard Admin)`,
        requestedByEmail: user?.email || '',
        requestedAt: new Date().toISOString().replace('T', ' ').substring(0, 16),
        reason: deletionReason || 'Requested removal from public portal.',
        status: 'PENDING'
      };
      syncApprovals([newApproval, ...approvals]);
      addAuditLog('REQUESTED_DELETION', `Deletion request for ${deletionTarget.title}`);
      showNotification(`Deletion request queued. Super Admin notification dispatched for sign-off.`);
    }

    setDeletionTarget(null);
  };

  // Filtered list
  const filtered = opportunities.filter(item => {
    const matchesSearch =
      item.title.toLowerCase().includes(search.toLowerCase()) ||
      item.description.toLowerCase().includes(search.toLowerCase()) ||
      item.location.toLowerCase().includes(search.toLowerCase());
    const matchesSector = sectorFilter === 'ALL' || item.sector === sectorFilter;
    return matchesSearch && matchesSector;
  });

  return (
    <div className="space-y-6">
      {/* Feedback banner */}
      {feedbackNotice && (
        <div className="p-3.5 rounded-xl bg-emerald-500 text-[#023A23] font-bold text-xs flex items-center gap-2 shadow-lg animate-in fade-in slide-in-from-top-2">
          <CheckCircle2 size={16} />
          <span>{feedbackNotice}</span>
        </div>
      )}

      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl sm:text-2xl font-bold text-[#023A23]">
            Investment Opportunities
          </h1>
          <p className="text-xs text-gray-500 mt-0.5">
            Manage active industrial, agro-processing, and infrastructure parcels displayed on the live portal.
          </p>
        </div>

        <button
          onClick={() => {
            setEditingItem(null);
            setFormTitle('');
            setFormValue('');
            setFormHectares('');
            setFormLocation('');
            setFormDescription('');
            setIsCreateOpen(true);
          }}
          className="inline-flex items-center gap-2 bg-[#28B674] hover:bg-[#22a166] text-[#023A23] font-bold text-xs uppercase tracking-wider py-2.5 px-4 rounded-lg shadow-sm transition-colors cursor-pointer"
        >
          <Plus size={16} />
          <span>Add Opportunity</span>
        </button>
      </div>

      {/* Search & Filters */}
      <div className="bg-white p-4 rounded-xl border border-black/10 shadow-sm flex flex-col sm:flex-row items-center gap-3">
        <div className="relative flex-1 w-full">
          <Search size={16} className="absolute left-3 top-3 text-gray-400" />
          <input
            type="text"
            placeholder="Search by title, location, or keyword..."
            value={search}
            onChange={e => setSearch(e.target.value)}
            className="w-full pl-9 pr-4 py-2 border border-gray-200 rounded-lg text-xs focus:outline-none focus:border-[#28B674] focus:ring-1 focus:ring-[#28B674]"
          />
        </div>

        <div className="flex items-center gap-2 w-full sm:w-auto">
          <Filter size={15} className="text-gray-400" />
          <select
            value={sectorFilter}
            onChange={e => setSectorFilter(e.target.value)}
            className="text-xs border border-gray-200 rounded-lg py-2 px-3 focus:outline-none focus:border-[#28B674] bg-white text-gray-700"
          >
            <option value="ALL">All Sectors</option>
            <option value="Agro-processing">Agro-processing</option>
            <option value="Logistics & Warehousing">Logistics & Warehousing</option>
            <option value="Manufacturing">Manufacturing</option>
            <option value="Green Economy">Green Economy</option>
            <option value="Commercial">Commercial</option>
          </select>
        </div>
      </div>

      {/* Opportunities Data Table */}
      <div className="bg-white rounded-xl border border-black/10 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-[#023A23] text-white uppercase text-[10px] tracking-wider font-bold">
              <tr>
                <th className="py-3 px-4">Opportunity</th>
                <th className="py-3 px-4">Sector</th>
                <th className="py-3 px-4">Value / Size</th>
                <th className="py-3 px-4">Location</th>
                <th className="py-3 px-4">Status</th>
                <th className="py-3 px-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {filtered.length === 0 ? (
                <tr>
                  <td colSpan={6} className="py-8 text-center text-gray-400">
                    No investment opportunities match your criteria.
                  </td>
                </tr>
              ) : (
                filtered.map(opp => (
                  <tr key={opp.id} className="hover:bg-gray-50/70 transition-colors">
                    <td className="py-3.5 px-4 font-semibold text-[#023A23] max-w-xs">
                      <div>{opp.title}</div>
                      <div className="text-[11px] text-gray-400 line-clamp-1 mt-0.5 font-normal">
                        {opp.description}
                      </div>
                    </td>
                    <td className="py-3.5 px-4">
                      <span className="text-[11px] font-semibold text-gray-700">
                        {opp.sector}
                      </span>
                    </td>
                    <td className="py-3.5 px-4">
                      <div className="font-bold text-[#023A23]">{opp.investmentValue}</div>
                      <div className="text-[11px] text-gray-400">{opp.hectares}</div>
                    </td>
                    <td className="py-3.5 px-4 text-gray-600">{opp.location}</td>
                    <td className="py-3.5 px-4">
                      {opp.status === 'ACTIVE' && (
                        <span className="inline-flex items-center gap-1 text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800">
                          <CheckCircle2 size={11} /> Live Active
                        </span>
                      )}
                      {opp.status === 'PENDING_APPROVAL' && (
                        <span className="inline-flex items-center gap-1 text-[10px] font-bold px-2 py-0.5 rounded-full bg-amber-100 text-amber-900 border border-amber-300">
                          <Clock size={11} /> Awaiting Sign-off
                        </span>
                      )}
                      {opp.status === 'DRAFT' && (
                        <span className="inline-flex items-center gap-1 text-[10px] font-bold px-2 py-0.5 rounded-full bg-gray-100 text-gray-700">
                          Draft
                        </span>
                      )}
                    </td>
                    <td className="py-3.5 px-4 text-right whitespace-nowrap">
                      <div className="flex items-center justify-end gap-1.5">
                        <button
                          onClick={() => handleStartEdit(opp)}
                          title="Edit Opportunity"
                          className="p-1.5 rounded text-gray-600 hover:text-[#023A23] hover:bg-black/5 transition-colors"
                        >
                          <Edit2 size={15} />
                        </button>
                        <button
                          onClick={() => handleDeleteClick(opp)}
                          title={isSuperAdmin ? 'Permanently Delete' : 'Request Deletion Approval'}
                          className="p-1.5 rounded text-red-500 hover:text-red-700 hover:bg-red-50 transition-colors"
                        >
                          <Trash2 size={15} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* ─── Create / Edit Modal ────────────────────────────────────────── */}
      {(isCreateOpen || editingItem) && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in">
          <div className="bg-white rounded-2xl max-w-lg w-full p-6 shadow-2xl border border-black/10 overflow-hidden">
            <div className="flex items-center justify-between pb-4 border-b border-gray-100 mb-4">
              <h3 className="text-base font-bold text-[#023A23]">
                {editingItem ? 'Edit Opportunity' : 'New Investment Opportunity'}
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
                <label className="block font-bold text-gray-700 mb-1">Opportunity Title *</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Citrus Extraction & Processing Plant"
                  value={formTitle}
                  onChange={e => setFormTitle(e.target.value)}
                  className="w-full border border-gray-300 rounded-lg p-2.5 text-xs focus:outline-none focus:border-[#28B674]"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-gray-700 mb-1">Sector *</label>
                  <select
                    value={formSector}
                    onChange={e => setFormSector(e.target.value as any)}
                    className="w-full border border-gray-300 rounded-lg p-2.5 text-xs focus:outline-none focus:border-[#28B674] bg-white"
                  >
                    <option value="Agro-processing">Agro-processing</option>
                    <option value="Logistics & Warehousing">Logistics & Warehousing</option>
                    <option value="Manufacturing">Manufacturing</option>
                    <option value="Green Economy">Green Economy</option>
                    <option value="Commercial">Commercial</option>
                  </select>
                </div>
                <div>
                  <label className="block font-bold text-gray-700 mb-1">Projected Value</label>
                  <input
                    type="text"
                    placeholder="e.g. R 450 Million"
                    value={formValue}
                    onChange={e => setFormValue(e.target.value)}
                    className="w-full border border-gray-300 rounded-lg p-2.5 text-xs focus:outline-none focus:border-[#28B674]"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-gray-700 mb-1">Land Size / Area</label>
                  <input
                    type="text"
                    placeholder="e.g. 12.5 Ha"
                    value={formHectares}
                    onChange={e => setFormHectares(e.target.value)}
                    className="w-full border border-gray-300 rounded-lg p-2.5 text-xs focus:outline-none focus:border-[#28B674]"
                  />
                </div>
                <div>
                  <label className="block font-bold text-gray-700 mb-1">Precinct / Location</label>
                  <input
                    type="text"
                    placeholder="e.g. Zone 1A Komatipoort"
                    value={formLocation}
                    onChange={e => setFormLocation(e.target.value)}
                    className="w-full border border-gray-300 rounded-lg p-2.5 text-xs focus:outline-none focus:border-[#28B674]"
                  />
                </div>
              </div>

              <div>
                <label className="block font-bold text-gray-700 mb-1">Description & Scope</label>
                <textarea
                  rows={3}
                  placeholder="Key technical attributes, utilities, incentives and investor requirements..."
                  value={formDescription}
                  onChange={e => setFormDescription(e.target.value)}
                  className="w-full border border-gray-300 rounded-lg p-2.5 text-xs focus:outline-none focus:border-[#28B674]"
                />
              </div>

              {!isSuperAdmin && !editingItem && (
                <div className="p-2.5 rounded-lg bg-amber-50 border border-amber-200 text-amber-800 text-[11px] flex items-start gap-2">
                  <ShieldAlert size={14} className="mt-0.5 flex-shrink-0" />
                  <span>
                    As a <strong>Standard Admin</strong>, this new opportunity will be saved with status <em>Awaiting Sign-off</em> and queued for Super Admin approval before going live.
                  </span>
                </div>
              )}

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
                  {editingItem ? 'Save Changes' : isSuperAdmin ? 'Publish Opportunity' : 'Submit for Approval'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ─── Deletion Confirmation / Approval Request Modal ────────────── */}
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
                <div className="text-[11px] text-gray-500">
                  {isSuperAdmin ? 'Executive Sign-off Action' : 'Requires Super Admin Approval'}
                </div>
              </div>
            </div>

            <p className="text-xs text-gray-600 leading-relaxed mb-4">
              {isSuperAdmin
                ? `You have Super Admin authority. Deleting "${deletionTarget.title}" will permanently remove it from the live website and database immediately.`
                : `You are logged in as Standard Admin. To prevent accidental data loss or unauthorized removals, deletions must be submitted with a reason for Super Admin approval.`}
            </p>

            {!isSuperAdmin && (
              <div className="mb-4">
                <label className="block text-xs font-bold text-gray-700 mb-1">
                  Reason for Deletion *
                </label>
                <textarea
                  rows={2}
                  required
                  placeholder="e.g. Investor has withdrawn application; superseded by new parcel..."
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
