import React, { useState } from 'react';
import { useAdminAuth } from '../context/AdminAuthContext';
import { CareerItem, ApprovalRequest, AuditLog } from '../types';
import {
  STORAGE_KEYS,
  INITIAL_CAREERS,
  loadFromStorage,
  saveToStorage,
  createAuditLog,
} from '../mockData';
import {
  Briefcase,
  Search,
  Plus,
  Trash2,
  Edit,
  ExternalLink,
  Calendar,
  AlertTriangle,
  X,
  FileCheck2,
  CheckCircle2,
  MapPin,
  Building2,
  Clock,
  FileText,
} from 'lucide-react';

const HEADING_FONT = "'Poppins', system-ui, sans-serif";
const BODY_FONT = "'Poppins', system-ui, sans-serif";

export const AdminCareersPage: React.FC = () => {
  const { user, isSuperAdmin } = useAdminAuth();

  const [careers, setCareers] = useState<CareerItem[]>(() =>
    loadFromStorage<CareerItem[]>(STORAGE_KEYS.CAREERS, INITIAL_CAREERS)
  );

  const [searchQuery, setSearchQuery] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('ALL');
  const [statusFilter, setStatusFilter] = useState('ALL');

  // Modal State
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingItem, setEditingItem] = useState<CareerItem | null>(null);

  // Form State
  const [title, setTitle] = useState('');
  const [category, setCategory] = useState<CareerItem['category']>('Vacancy');
  const [department, setDepartment] = useState('Corporate Services');
  const [location, setLocation] = useState('Mbombela & Komatipoort');
  const [closingDate, setClosingDate] = useState('15 Dec 2026');
  const [type, setType] = useState<CareerItem['type']>('Permanent');
  const [status, setStatus] = useState<CareerItem['status']>('OPEN');
  const [description, setDescription] = useState('');
  const [pdfUrl, setPdfUrl] = useState('');

  // Deletion modal
  const [deleteModalItem, setDeleteModalItem] = useState<CareerItem | null>(null);
  const [deleteJustification, setDeleteJustification] = useState('');

  const updateCareers = (newCareers: CareerItem[], auditAction: string, detail: string) => {
    setCareers(newCareers);
    saveToStorage(STORAGE_KEYS.CAREERS, newCareers);

    const logs = loadFromStorage<AuditLog[]>(STORAGE_KEYS.AUDIT_LOGS, []);
    const newLog = createAuditLog(
      user?.name || 'Administrator',
      user?.role || 'STANDARD_ADMIN',
      auditAction,
      'Careers & Vacancies',
      detail
    );
    saveToStorage(STORAGE_KEYS.AUDIT_LOGS, [newLog, ...logs]);
  };

  const openCreateModal = () => {
    setEditingItem(null);
    setTitle('');
    setCategory('Vacancy');
    setDepartment('Corporate Services');
    setLocation('Mbombela & Komatipoort');
    setClosingDate('15 Dec 2026');
    setType('Permanent');
    setStatus('OPEN');
    setDescription('');
    setPdfUrl('');
    setIsModalOpen(true);
  };

  const openEditModal = (item: CareerItem) => {
    setEditingItem(item);
    setTitle(item.title);
    setCategory(item.category);
    setDepartment(item.department);
    setLocation(item.location);
    setClosingDate(item.closingDate);
    setType(item.type);
    setStatus(item.status);
    setDescription(item.description);
    setPdfUrl(item.pdfUrl || '');
    setIsModalOpen(true);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (editingItem) {
      const updated = careers.map((c) =>
        c.id === editingItem.id
          ? {
              ...c,
              title,
              category,
              department,
              location,
              closingDate,
              type,
              status,
              description,
              pdfUrl: pdfUrl.trim() || undefined,
            }
          : c
      );
      updateCareers(updated, 'UPDATE_CAREER', `Updated career listing: ${title}`);
    } else {
      const newItem: CareerItem = {
        id: `career-${Date.now()}`,
        title,
        category,
        department,
        location,
        closingDate,
        type,
        status,
        description,
        pdfUrl: pdfUrl.trim() || undefined,
      };
      updateCareers([newItem, ...careers], 'CREATE_CAREER', `Created new career listing: ${title}`);
    }

    setIsModalOpen(false);
  };

  const handleToggleStatus = (item: CareerItem) => {
    const nextStatus: CareerItem['status'] = item.status === 'OPEN' ? 'CLOSED' : 'OPEN';
    const updated = careers.map((c) =>
      c.id === item.id ? { ...c, status: nextStatus } : c
    );
    updateCareers(
      updated,
      'TOGGLE_CAREER_STATUS',
      `Changed status of "${item.title}" to ${nextStatus}`
    );
  };

  const promptDelete = (item: CareerItem) => {
    setDeleteModalItem(item);
    setDeleteJustification('');
  };

  const confirmDelete = () => {
    if (!deleteModalItem) return;

    if (isSuperAdmin) {
      const updated = careers.filter((c) => c.id !== deleteModalItem.id);
      updateCareers(
        updated,
        'DELETE_CAREER',
        `Direct Super Admin removal of career listing: ${deleteModalItem.title}`
      );
    } else {
      // Standard Admin creates approval request
      const approvals = loadFromStorage<ApprovalRequest[]>(STORAGE_KEYS.APPROVALS, []);
      const newApproval: ApprovalRequest = {
        id: `appr-${Date.now()}`,
        itemType: 'CAREER',
        action: 'DELETE',
        itemId: deleteModalItem.id,
        itemTitle: deleteModalItem.title,
        requestedBy: user?.name || 'Standard Admin',
        requestedByEmail: user?.email || 'admin@nkomazisez.co.za',
        requestedAt: new Date().toISOString(),
        reason: deleteJustification || 'Requesting deletion of outdated/filled career listing.',
        status: 'PENDING',
      };
      saveToStorage(STORAGE_KEYS.APPROVALS, [newApproval, ...approvals]);

      const updated = careers.map((c) =>
        c.id === deleteModalItem.id ? { ...c, pendingAction: 'DELETE' as const } : c
      );
      updateCareers(
        updated,
        'REQUEST_CAREER_DELETE',
        `Submitted dual-control deletion request for "${deleteModalItem.title}". Reason: ${deleteJustification || 'No reason provided'}`
      );
    }

    setDeleteModalItem(null);
  };

  // Filtered Items
  const filtered = careers.filter((c) => {
    const matchesCategory = categoryFilter === 'ALL' || c.category === categoryFilter;
    const matchesStatus = statusFilter === 'ALL' || c.status === statusFilter;
    const matchesSearch =
      searchQuery === '' ||
      c.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      c.department.toLowerCase().includes(searchQuery.toLowerCase()) ||
      c.location.toLowerCase().includes(searchQuery.toLowerCase()) ||
      c.description.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesStatus && matchesSearch;
  });

  const totalOpen = careers.filter((c) => c.status === 'OPEN').length;
  const totalLearnerships = careers.filter((c) => c.category === 'Learnership' || c.category === 'Internship' || c.category === 'Graduate Programme').length;
  const totalPending = careers.filter((c) => c.pendingAction).length;

  return (
    <div className="space-y-6" style={{ fontFamily: BODY_FONT }}>
      {/* Header Banner */}
 <div className="bg-gradient-to-r from-[#023A23] via-[#044c2f] to-[#023A23] p-6 sm:p-8 rounded-2xl text-white shadow-xl flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
          <div className="flex items-center gap-2 text-[#F2AE37] text-xs font-semibold uppercase tracking-wider mb-2">
            <Briefcase size={16} />
            Human Capital &amp; Opportunities
          </div>
          <h1
            className="text-2xl sm:text-3xl font-bold tracking-tight text-white mb-2"
            style={{ fontFamily: HEADING_FONT }}
          >
            Careers &amp; Vacancies Manager
          </h1>
          <p className="text-emerald-100/80 text-sm max-w-2xl leading-relaxed">
            Publish employment openings, learnership programmes, and graduate development opportunities for the Mpumalanga Nkomazi SEZ.
          </p>
        </div>
        <button
          onClick={openCreateModal}
 className="flex items-center justify-center gap-2 px-5 py-3 rounded-xl bg-[#28B674] hover:bg-[#20925c] text-white font-medium text-sm transition-all duration-200 shadow-lg shadow-emerald-900/40 hover:scale-[1.02] active:scale-[0.98] self-start md:self-auto shrink-0"
        >
          <Plus size={18} />
          <span>Post New Vacancy</span>
        </button>
      </div>

      {/* KPI Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
 <div className="bg-white p-5 rounded-xl shadow-sm">
          <div className="text-xs font-medium text-gray-500 uppercase tracking-wider mb-1">
            Total Listings
          </div>
          <div className="text-2xl font-bold text-[#023A23]" style={{ fontFamily: HEADING_FONT }}>
            {careers.length}
          </div>
        </div>
 <div className="bg-white p-5 rounded-xl shadow-sm">
          <div className="text-xs font-medium text-gray-500 uppercase tracking-wider mb-1">
            Active / Open Roles
          </div>
          <div className="text-2xl font-bold text-[#28B674]" style={{ fontFamily: HEADING_FONT }}>
            {totalOpen}
          </div>
        </div>
 <div className="bg-white p-5 rounded-xl shadow-sm">
          <div className="text-xs font-medium text-gray-500 uppercase tracking-wider mb-1">
            Youth &amp; Learnerships
          </div>
          <div className="text-2xl font-bold text-[#F2AE37]" style={{ fontFamily: HEADING_FONT }}>
            {totalLearnerships}
          </div>
        </div>
 <div className="bg-white p-5 rounded-xl shadow-sm">
          <div className="text-xs font-medium text-gray-500 uppercase tracking-wider mb-1">
            Pending Approval Actions
          </div>
          <div className="text-2xl font-bold text-[#e87326]" style={{ fontFamily: HEADING_FONT }}>
            {totalPending}
          </div>
        </div>
      </div>

      {/* Filter and Search Bar */}
 <div className="bg-white p-4 sm:p-5 rounded-xl shadow-sm space-y-4">
        <div className="flex flex-col md:flex-row gap-3">
          <div className="relative flex-1">
            <Search
              size={18}
              className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400"
            />
            <input
              type="text"
              placeholder="Search by job title, department, location..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 rounded-lg border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-[#28B674] focus:border-transparent transition-all"
            />
          </div>

          <div className="flex flex-wrap gap-2">
            <select
              value={categoryFilter}
              onChange={(e) => setCategoryFilter(e.target.value)}
              aria-label="Filter by Category"
 className="px-3 py-2.5 rounded-lg text-sm bg-white focus:outline-none focus:ring-2 focus:ring-[#28B674] text-gray-700"
            >
              <option value="ALL">All Categories</option>
              <option value="Vacancy">Vacancy</option>
              <option value="Learnership">Learnership</option>
              <option value="Graduate Programme">Graduate Programme</option>
              <option value="Internship">Internship</option>
            </select>

            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              aria-label="Filter by Status"
 className="px-3 py-2.5 rounded-lg text-sm bg-white focus:outline-none focus:ring-2 focus:ring-[#28B674] text-gray-700"
            >
              <option value="ALL">All Statuses</option>
              <option value="OPEN">Open</option>
              <option value="CLOSED">Closed</option>
            </select>
          </div>
        </div>
      </div>

      {/* Career Listings Table / Cards */}
 <div className="bg-white rounded-xl shadow-sm overflow-hidden">
        {filtered.length === 0 ? (
          <div className="p-12 text-center">
            <Briefcase size={40} className="mx-auto text-gray-300 mb-3" />
            <p className="text-gray-500 font-medium">No careers or vacancies match your filters.</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm text-gray-600">
 <thead className="bg-gray-50/75 text-xs uppercase font-semibold text-gray-500 tracking-wider">
                <tr>
                  <th className="py-3.5 px-4 sm:px-6">Position Details</th>
                  <th className="py-3.5 px-4">Category &amp; Type</th>
                  <th className="py-3.5 px-4">Location &amp; Closing</th>
                  <th className="py-3.5 px-4">Status</th>
                  <th className="py-3.5 px-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {filtered.map((item) => (
 <tr key={item.id} className="hover:bg-gray-50/50 transition-colors">
                    <td className="py-4 px-4 sm:px-6 max-w-md">
                      <div className="font-semibold text-gray-900 mb-1" style={{ fontFamily: HEADING_FONT }}>
                        {item.title}
                      </div>
                      <div className="flex items-center gap-2 text-xs text-gray-500 mb-1">
                        <Building2 size={13} className="text-[#28B674]" />
                        <span>{item.department}</span>
                      </div>
                      <p className="text-xs text-gray-500 line-clamp-2 leading-relaxed">
                        {item.description}
                      </p>
                      {item.pdfUrl && (
                        <a
                          href={item.pdfUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex items-center gap-1 text-[11px] font-semibold text-[#023A23] hover:text-[#28B674] mt-2 transition-colors"
                        >
                          <FileText size={12} />
                          <span>View Job Spec / Advert</span>
                          <ExternalLink size={10} />
                        </a>
                      )}
                    </td>

                    <td className="py-4 px-4 whitespace-nowrap">
                      <div className="space-y-1.5">
 <span className="inline-block px-2.5 py-0.5 rounded-full text-xs font-medium bg-emerald-50 text-emerald-800">
                          {item.category}
                        </span>
                        <div>
 <span className="inline-block px-2 py-0.5 rounded text-[11px] font-medium bg-gray-100 text-gray-600">
                            {item.type}
                          </span>
                        </div>
                      </div>
                    </td>

                    <td className="py-4 px-4 whitespace-nowrap">
                      <div className="space-y-1 text-xs">
                        <div className="flex items-center gap-1.5 text-gray-700">
                          <MapPin size={13} className="text-gray-400" />
                          <span>{item.location}</span>
                        </div>
                        <div className="flex items-center gap-1.5 text-gray-500">
                          <Clock size={13} className="text-[#F2AE37]" />
                          <span>Closes: {item.closingDate}</span>
                        </div>
                      </div>
                    </td>

                    <td className="py-4 px-4 whitespace-nowrap">
                      {item.pendingAction ? (
 <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold bg-amber-50 text-amber-700">
                          <AlertTriangle size={12} />
                          Pending Delete
                        </span>
                      ) : (
                        <button
                          onClick={() => handleToggleStatus(item)}
                          title="Click to toggle status"
                          className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold border transition-all ${
                            item.status === 'OPEN'
 ? 'bg-emerald-50 text-emerald-700 hover:bg-emerald-100'
 : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                          }`}
                        >
                          <span
                            className={`w-1.5 h-1.5 rounded-full ${
 item.status === 'OPEN' ? 'bg-[#28B674]' : 'bg-gray-400'
                            }`}
                          />
                          {item.status}
                        </button>
                      )}
                    </td>

                    <td className="py-4 px-4 text-right whitespace-nowrap">
                      <div className="flex items-center justify-end gap-2">
                        <button
                          onClick={() => openEditModal(item)}
 className="p-1.5 rounded-lg text-gray-400 hover:text-[#023A23] hover:bg-gray-100 transition-colors"
                          title="Edit Position"
                        >
                          <Edit size={16} />
                        </button>
                        <button
                          onClick={() => promptDelete(item)}
                          disabled={!!item.pendingAction}
                          className={`p-1.5 rounded-lg transition-colors ${
                            item.pendingAction
                              ? 'text-gray-300 cursor-not-allowed'
 : 'text-gray-400 hover:text-red-600 hover:bg-red-50'
                          }`}
                          title={isSuperAdmin ? 'Delete Vacancy' : 'Request Deletion'}
                        >
                          <Trash2 size={16} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Create / Edit Modal */}
      {isModalOpen && (
 <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm overflow-y-auto">
 <div className="bg-white rounded-2xl max-w-2xl w-full p-6 shadow-2xl my-8">
            <div className="flex items-center justify-between pb-4 border-b border-gray-100 mb-5">
              <h3 className="text-lg font-bold text-[#023A23]" style={{ fontFamily: HEADING_FONT }}>
                {editingItem ? 'Edit Career Position' : 'Post New Career Opportunity'}
              </h3>
              <button
                onClick={() => setIsModalOpen(false)}
 className="text-gray-400 hover:text-gray-600 p-1 rounded-lg hover:bg-gray-100"
              >
                <X size={20} />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-gray-700 uppercase tracking-wider mb-1">
                  Position Title *
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Senior Civil & Infrastructure Project Engineer"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-lg border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-[#28B674]"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-gray-700 uppercase tracking-wider mb-1">
                    Category *
                  </label>
                  <select
                    value={category}
                    onChange={(e) => setCategory(e.target.value as CareerItem['category'])}
 className="w-full px-3.5 py-2.5 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#28B674] bg-white"
                  >
                    <option value="Vacancy">Vacancy</option>
                    <option value="Learnership">Learnership</option>
                    <option value="Graduate Programme">Graduate Programme</option>
                    <option value="Internship">Internship</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-gray-700 uppercase tracking-wider mb-1">
                    Employment Type *
                  </label>
                  <select
                    value={type}
                    onChange={(e) => setType(e.target.value as CareerItem['type'])}
 className="w-full px-3.5 py-2.5 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#28B674] bg-white"
                  >
                    <option value="Permanent">Permanent</option>
                    <option value="Contract">Contract</option>
                    <option value="Full-Time">Full-Time</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-gray-700 uppercase tracking-wider mb-1">
                    Department *
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Engineering & Zone Infrastructure"
                    value={department}
                    onChange={(e) => setDepartment(e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-lg border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-[#28B674]"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-gray-700 uppercase tracking-wider mb-1">
                    Location *
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Komatipoort On-Site"
                    value={location}
                    onChange={(e) => setLocation(e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-lg border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-[#28B674]"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-gray-700 uppercase tracking-wider mb-1">
                    Closing Date *
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. 15 Dec 2026"
                    value={closingDate}
                    onChange={(e) => setClosingDate(e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-lg border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-[#28B674]"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-gray-700 uppercase tracking-wider mb-1">
                    Status *
                  </label>
                  <select
                    value={status}
                    onChange={(e) => setStatus(e.target.value as CareerItem['status'])}
 className="w-full px-3.5 py-2.5 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#28B674] bg-white"
                  >
                    <option value="OPEN">Open (Accepting Applications)</option>
                    <option value="CLOSED">Closed</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-gray-700 uppercase tracking-wider mb-1">
                  Job Description / Role Summary *
                </label>
                <textarea
                  rows={4}
                  required
                  placeholder="Provide an overview of key deliverables, requirements, and minimum qualifications..."
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-lg border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-[#28B674]"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-gray-700 uppercase tracking-wider mb-1">
                  Document / PDF Link (Optional)
                </label>
                <input
                  type="text"
                  placeholder="/careers/vacancies/... or https://..."
                  value={pdfUrl}
                  onChange={(e) => setPdfUrl(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-lg border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-[#28B674]"
                />
                <p className="text-[11px] text-gray-400 mt-1">
                  URL or public path to the detailed PDF job advertisement or application form.
                </p>
              </div>

              <div className="flex items-center justify-end gap-3 pt-4 border-t border-gray-100">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
 className="px-4 py-2.5 rounded-lg text-gray-700 hover:bg-gray-50 text-sm font-medium transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
 className="px-5 py-2.5 rounded-lg bg-[#023A23] hover:bg-[#035232] text-white text-sm font-medium transition-colors shadow-sm"
                >
                  {editingItem ? 'Save Changes' : 'Publish Vacancy'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Delete / Dual-Control Deletion Modal */}
      {deleteModalItem && (
 <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
 <div className="bg-white rounded-2xl max-w-md w-full p-6 shadow-2xl">
            <div className="flex items-center gap-3 text-red-600 mb-4">
 <div className="p-3 bg-red-50 rounded-xl">
                <AlertTriangle size={24} />
              </div>
              <div>
                <h4 className="font-bold text-gray-900" style={{ fontFamily: HEADING_FONT }}>
                  {isSuperAdmin ? 'Confirm Vacancy Removal' : 'Dual-Control Deletion Request'}
                </h4>
                <p className="text-xs text-gray-500">
                  {isSuperAdmin ? 'Permanent action' : 'Requires Super Admin approval'}
                </p>
              </div>
            </div>

            <p className="text-sm text-gray-600 mb-4 leading-relaxed">
              {isSuperAdmin ? (
                <>
                  Are you sure you want to permanently delete{' '}
                  <span className="font-semibold text-gray-900">"{deleteModalItem.title}"</span>? This will remove it from the live website immediately.
                </>
              ) : (
                <>
                  As a Standard Admin, deleting{' '}
                  <span className="font-semibold text-gray-900">"{deleteModalItem.title}"</span>{' '}
                  requires dual-control sign-off. Please state your business reason for review by a Super Admin.
                </>
              )}
            </p>

            {!isSuperAdmin && (
              <div className="mb-4">
                <label className="block text-xs font-semibold text-gray-700 uppercase tracking-wider mb-1">
                  Reason for Deletion *
                </label>
                <textarea
                  rows={3}
                  required
                  placeholder="e.g. Candidate appointed, closing window lapsed, or position withdrawn..."
                  value={deleteJustification}
                  onChange={(e) => setDeleteJustification(e.target.value)}
                  className="w-full px-3 py-2 rounded-lg border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-red-500"
                />
              </div>
            )}

            <div className="flex items-center justify-end gap-3 pt-3 border-t border-gray-100">
              <button
                type="button"
                onClick={() => setDeleteModalItem(null)}
 className="px-4 py-2 rounded-lg text-gray-700 hover:bg-gray-50 text-sm font-medium transition-colors"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={confirmDelete}
 className="px-4 py-2 rounded-lg bg-red-600 hover:bg-red-700 text-white text-sm font-medium transition-colors shadow-sm"
              >
                {isSuperAdmin ? 'Delete Immediately' : 'Submit Deletion Request'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
