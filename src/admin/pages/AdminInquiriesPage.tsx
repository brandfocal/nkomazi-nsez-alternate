import React, { useState } from 'react';
import { useAdminAuth } from '../context/AdminAuthContext';
import { InquiryItem, AuditLog } from '../types';
import {
  STORAGE_KEYS,
  INITIAL_INQUIRIES,
  loadFromStorage,
  saveToStorage,
  createAuditLog,
} from '../mockData';
import {
  Inbox,
  Search,
  Filter,
  Download,
  Mail,
  Phone,
  Building,
  Calendar,
  AlertCircle,
  CheckCircle2,
  Clock,
  Archive,
  Trash2,
  X,
  ExternalLink,
  User,
  MessageSquare,
  Send,
  Tag,
  Briefcase,
  FileText,
} from 'lucide-react';

const HEADING_FONT = "'Poppins', system-ui, sans-serif";
const BODY_FONT = "'Poppins', system-ui, sans-serif";

export const AdminInquiriesPage: React.FC = () => {
  const { user, isSuperAdmin } = useAdminAuth();

  const [inquiries, setInquiries] = useState<InquiryItem[]>(() =>
    loadFromStorage<InquiryItem[]>(STORAGE_KEYS.INQUIRIES, INITIAL_INQUIRIES)
  );

  const [searchQuery, setSearchQuery] = useState('');
  const [typeFilter, setTypeFilter] = useState('ALL');
  const [statusFilter, setStatusFilter] = useState('ALL');
  const [priorityFilter, setPriorityFilter] = useState('ALL');

  // Detail Modal / Slide-over State
  const [selectedInquiry, setSelectedInquiry] = useState<InquiryItem | null>(null);
  const [editNotes, setEditNotes] = useState('');
  const [editAssignedTo, setEditAssignedTo] = useState('');
  const [editStatus, setEditStatus] = useState<InquiryItem['status']>('NEW');
  const [editPriority, setEditPriority] = useState<InquiryItem['priority']>('MEDIUM');

  const updateInquiries = (newInquiries: InquiryItem[], auditAction: string, detail: string) => {
    setInquiries(newInquiries);
    saveToStorage(STORAGE_KEYS.INQUIRIES, newInquiries);

    const logs = loadFromStorage<AuditLog[]>(STORAGE_KEYS.AUDIT_LOGS, []);
    const newLog = createAuditLog(
      user?.name || 'Administrator',
      user?.role || 'STANDARD_ADMIN',
      auditAction,
      'Inquiries & Leads',
      detail
    );
    saveToStorage(STORAGE_KEYS.AUDIT_LOGS, [newLog, ...logs]);
  };

  const handleOpenDetail = (item: InquiryItem) => {
    setSelectedInquiry(item);
    setEditNotes(item.internalNotes || '');
    setEditAssignedTo(item.assignedTo || '');
    setEditStatus(item.status);
    setEditPriority(item.priority);

    // If it was NEW, auto-mark to IN_REVIEW if viewing
    if (item.status === 'NEW') {
      const updated = inquiries.map((i) =>
        i.id === item.id ? { ...i, status: 'IN_REVIEW' as const } : i
      );
      updateInquiries(updated, 'OPEN_INQUIRY', `Opened and reviewed inquiry from ${item.name}`);
      setEditStatus('IN_REVIEW');
    }
  };

  const handleSaveDetail = () => {
    if (!selectedInquiry) return;

    const updated = inquiries.map((i) =>
      i.id === selectedInquiry.id
        ? {
            ...i,
            status: editStatus,
            priority: editPriority,
            assignedTo: editAssignedTo.trim() || undefined,
            internalNotes: editNotes.trim() || undefined,
          }
        : i
    );
    updateInquiries(
      updated,
      'UPDATE_INQUIRY',
      `Updated inquiry from ${selectedInquiry.name} (Status: ${editStatus}, Assigned: ${editAssignedTo || 'Unassigned'})`
    );
    setSelectedInquiry(null);
  };

  const handleQuickStatusChange = (id: string, newStatus: InquiryItem['status']) => {
    const updated = inquiries.map((i) =>
      i.id === id ? { ...i, status: newStatus } : i
    );
    const item = inquiries.find((i) => i.id === id);
    updateInquiries(
      updated,
      'QUICK_STATUS_INQUIRY',
      `Changed status of inquiry from ${item?.name || 'User'} to ${newStatus}`
    );
  };

  const handleDeleteInquiry = (id: string, name: string) => {
    if (!window.confirm(`Permanently remove inquiry record from "${name}"?`)) return;
    const updated = inquiries.filter((i) => i.id !== id);
    updateInquiries(updated, 'DELETE_INQUIRY', `Removed inquiry record from ${name}`);
    if (selectedInquiry?.id === id) {
      setSelectedInquiry(null);
    }
  };

  // Export to CSV
  const handleExportCSV = () => {
    const headers = [
      'ID',
      'Date',
      'Type',
      'Name',
      'Email',
      'Phone',
      'Company',
      'Sector',
      'Subject',
      'Status',
      'Priority',
      'Assigned To',
      'Message',
      'Internal Notes',
    ];

    const rows = filtered.map((i) => [
      i.id,
      i.submittedAt,
      i.type,
      `"${i.name.replace(/"/g, '""')}"`,
      i.email,
      i.phone || '',
      `"${(i.company || '').replace(/"/g, '""')}"`,
      `"${(i.sector || '').replace(/"/g, '""')}"`,
      `"${i.subject.replace(/"/g, '""')}"`,
      i.status,
      i.priority,
      `"${(i.assignedTo || '').replace(/"/g, '""')}"`,
      `"${i.message.replace(/"/g, '""')}"`,
      `"${(i.internalNotes || '').replace(/"/g, '""')}"`,
    ]);

    const csvContent =
      'data:text/csv;charset=utf-8,' +
      [headers.join(','), ...rows.map((e) => e.join(','))].join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `nkomazi_inquiries_leads_${new Date().toISOString().split('T')[0]}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  // Filtering
  const filtered = inquiries.filter((i) => {
    const matchesType = typeFilter === 'ALL' || i.type === typeFilter;
    const matchesStatus = statusFilter === 'ALL' || i.status === statusFilter;
    const matchesPriority = priorityFilter === 'ALL' || i.priority === priorityFilter;
    const matchesSearch =
      searchQuery === '' ||
      i.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      i.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (i.company && i.company.toLowerCase().includes(searchQuery.toLowerCase())) ||
      i.subject.toLowerCase().includes(searchQuery.toLowerCase()) ||
      i.message.toLowerCase().includes(searchQuery.toLowerCase());

    return matchesType && matchesStatus && matchesPriority && matchesSearch;
  });

  const totalNew = inquiries.filter((i) => i.status === 'NEW').length;
  const totalInvestorLeads = inquiries.filter((i) => i.type === 'INVESTOR_LEAD').length;
  const totalTenderQueries = inquiries.filter((i) => i.type === 'TENDER_QUERY').length;

  const getTypeBadge = (type: InquiryItem['type']) => {
    switch (type) {
      case 'INVESTOR_LEAD':
        return { label: 'Investor Lead', bg: 'bg-emerald-50 text-emerald-800 border-emerald-200' };
      case 'TENDER_QUERY':
        return { label: 'Tender Query', bg: 'bg-amber-50 text-amber-800 border-amber-200' };
      case 'MSME_REGISTRATION':
        return { label: 'MSME Incubator', bg: 'bg-blue-50 text-blue-800 border-blue-200' };
      case 'STAKEHOLDER':
        return { label: 'Stakeholder', bg: 'bg-purple-50 text-purple-800 border-purple-200' };
      default:
        return { label: 'General Contact', bg: 'bg-gray-100 text-gray-700 border-gray-200' };
    }
  };

  const getPriorityBadge = (priority: InquiryItem['priority']) => {
    switch (priority) {
      case 'HIGH':
        return 'bg-red-50 text-red-700 border-red-200';
      case 'MEDIUM':
        return 'bg-amber-50 text-amber-700 border-amber-200';
      default:
        return 'bg-gray-50 text-gray-600 border-gray-200';
    }
  };

  return (
    <div className="space-y-6" style={{ fontFamily: BODY_FONT }}>
      {/* Header Banner */}
      <div className="bg-gradient-to-r from-[#023A23] via-[#044c2f] to-[#023A23] p-6 sm:p-8 rounded-2xl text-white shadow-xl flex flex-col md:flex-row md:items-center justify-between gap-6 border border-emerald-900/30">
        <div>
          <div className="flex items-center gap-2 text-[#F2AE37] text-xs font-semibold uppercase tracking-wider mb-2">
            <Inbox size={16} />
            Public Relations &amp; Investor Pipeline
          </div>
          <h1
            className="text-2xl sm:text-3xl font-bold tracking-tight text-white mb-2"
            style={{ fontFamily: HEADING_FONT }}
          >
            Submissions &amp; Investor Leads Inbox
          </h1>
          <p className="text-emerald-100/80 text-sm max-w-2xl leading-relaxed">
            Manage incoming investor inquiries, tender clarification requests, MSME incubator registrations, and public correspondence in real-time.
          </p>
        </div>
        <button
          onClick={handleExportCSV}
          className="flex items-center justify-center gap-2 px-5 py-3 rounded-xl bg-white/10 hover:bg-white/20 text-white font-medium text-sm transition-all duration-200 border border-white/20 self-start md:self-auto shrink-0 shadow-sm"
        >
          <Download size={16} />
          <span>Export Leads (CSV)</span>
        </button>
      </div>

      {/* KPI Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white p-5 rounded-xl border border-gray-100 shadow-sm">
          <div className="text-xs font-medium text-gray-500 uppercase tracking-wider mb-1">
            Total Submissions
          </div>
          <div className="text-2xl font-bold text-[#023A23]" style={{ fontFamily: HEADING_FONT }}>
            {inquiries.length}
          </div>
        </div>
        <div className="bg-white p-5 rounded-xl border border-gray-100 shadow-sm">
          <div className="text-xs font-medium text-gray-500 uppercase tracking-wider mb-1">
            New / Unread Leads
          </div>
          <div className="text-2xl font-bold text-[#e87326]" style={{ fontFamily: HEADING_FONT }}>
            {totalNew}
          </div>
        </div>
        <div className="bg-white p-5 rounded-xl border border-gray-100 shadow-sm">
          <div className="text-xs font-medium text-gray-500 uppercase tracking-wider mb-1">
            Investor Expressions of Interest
          </div>
          <div className="text-2xl font-bold text-[#28B674]" style={{ fontFamily: HEADING_FONT }}>
            {totalInvestorLeads}
          </div>
        </div>
        <div className="bg-white p-5 rounded-xl border border-gray-100 shadow-sm">
          <div className="text-xs font-medium text-gray-500 uppercase tracking-wider mb-1">
            Tender Enquiries
          </div>
          <div className="text-2xl font-bold text-[#F2AE37]" style={{ fontFamily: HEADING_FONT }}>
            {totalTenderQueries}
          </div>
        </div>
      </div>

      {/* Filters and Search Bar */}
      <div className="bg-white p-4 sm:p-5 rounded-xl border border-gray-100 shadow-sm space-y-4">
        <div className="flex flex-col md:flex-row gap-3">
          <div className="relative flex-1">
            <Search
              size={18}
              className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400"
            />
            <input
              type="text"
              placeholder="Search by sender name, company, email, subject, or message content..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 rounded-lg border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-[#28B674] focus:border-transparent transition-all"
            />
          </div>

          <div className="flex flex-wrap gap-2">
            <select
              value={typeFilter}
              onChange={(e) => setTypeFilter(e.target.value)}
              aria-label="Filter by Type"
              className="px-3 py-2.5 rounded-lg border border-gray-200 text-sm bg-white focus:outline-none focus:ring-2 focus:ring-[#28B674] text-gray-700"
            >
              <option value="ALL">All Inquiry Types</option>
              <option value="INVESTOR_LEAD">Investor Leads</option>
              <option value="TENDER_QUERY">Tender Queries</option>
              <option value="MSME_REGISTRATION">MSME Registrations</option>
              <option value="GENERAL_CONTACT">General Contact</option>
              <option value="STAKEHOLDER">Stakeholder Relations</option>
            </select>

            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              aria-label="Filter by Status"
              className="px-3 py-2.5 rounded-lg border border-gray-200 text-sm bg-white focus:outline-none focus:ring-2 focus:ring-[#28B674] text-gray-700"
            >
              <option value="ALL">All Statuses</option>
              <option value="NEW">New / Unread</option>
              <option value="IN_REVIEW">In Review</option>
              <option value="RESPONDED">Responded</option>
              <option value="ARCHIVED">Archived</option>
            </select>

            <select
              value={priorityFilter}
              onChange={(e) => setPriorityFilter(e.target.value)}
              aria-label="Filter by Priority"
              className="px-3 py-2.5 rounded-lg border border-gray-200 text-sm bg-white focus:outline-none focus:ring-2 focus:ring-[#28B674] text-gray-700"
            >
              <option value="ALL">All Priorities</option>
              <option value="HIGH">High Priority</option>
              <option value="MEDIUM">Medium Priority</option>
              <option value="LOW">Low Priority</option>
            </select>
          </div>
        </div>
      </div>

      {/* Inquiries List / Table */}
      <div className="bg-white rounded-xl border border-gray-100 shadow-sm overflow-hidden">
        {filtered.length === 0 ? (
          <div className="p-12 text-center">
            <Inbox size={40} className="mx-auto text-gray-300 mb-3" />
            <p className="text-gray-500 font-medium">No inquiries or leads match your active filters.</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm text-gray-600">
              <thead className="bg-gray-50/75 border-b border-gray-100 text-xs uppercase font-semibold text-gray-500 tracking-wider">
                <tr>
                  <th className="py-3.5 px-4 sm:px-6">Sender &amp; Organisation</th>
                  <th className="py-3.5 px-4">Subject &amp; Message</th>
                  <th className="py-3.5 px-4">Type &amp; Priority</th>
                  <th className="py-3.5 px-4">Status &amp; Assigned</th>
                  <th className="py-3.5 px-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {filtered.map((item) => {
                  const typeBadge = getTypeBadge(item.type);
                  return (
                    <tr
                      key={item.id}
                      className={`hover:bg-gray-50/75 transition-colors cursor-pointer ${
                        item.status === 'NEW' ? 'bg-amber-50/20 font-medium' : ''
                      }`}
                      onClick={() => handleOpenDetail(item)}
                    >
                      <td className="py-4 px-4 sm:px-6 max-w-xs">
                        <div className="flex items-center gap-2 mb-1">
                          <span
                            className="font-semibold text-gray-900"
                            style={{ fontFamily: HEADING_FONT }}
                          >
                            {item.name}
                          </span>
                          {item.status === 'NEW' && (
                            <span className="w-2 h-2 rounded-full bg-[#e87326] shrink-0" />
                          )}
                        </div>
                        {item.company && (
                          <div className="flex items-center gap-1.5 text-xs text-gray-600 mb-1">
                            <Building size={13} className="text-[#28B674]" />
                            <span className="truncate">{item.company}</span>
                          </div>
                        )}
                        <div className="text-xs text-gray-400 flex items-center gap-2">
                          <span>{item.email}</span>
                          <span>•</span>
                          <span>{item.submittedAt}</span>
                        </div>
                      </td>

                      <td className="py-4 px-4 max-w-md">
                        <div className="font-medium text-gray-900 line-clamp-1 mb-1">
                          {item.subject}
                        </div>
                        <p className="text-xs text-gray-500 line-clamp-2 leading-relaxed">
                          {item.message}
                        </p>
                      </td>

                      <td className="py-4 px-4 whitespace-nowrap">
                        <div className="space-y-1.5">
                          <span
                            className={`inline-block px-2.5 py-0.5 rounded-full text-xs font-medium border ${typeBadge.bg}`}
                          >
                            {typeBadge.label}
                          </span>
                          <div>
                            <span
                              className={`inline-block px-2 py-0.5 rounded text-[11px] font-semibold uppercase tracking-wider border ${getPriorityBadge(
                                item.priority
                              )}`}
                            >
                              {item.priority}
                            </span>
                          </div>
                        </div>
                      </td>

                      <td className="py-4 px-4 whitespace-nowrap">
                        <div className="space-y-1">
                          <span
                            className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold ${
                              item.status === 'NEW'
                                ? 'bg-amber-100 text-amber-800'
                                : item.status === 'IN_REVIEW'
                                ? 'bg-blue-100 text-blue-800'
                                : item.status === 'RESPONDED'
                                ? 'bg-emerald-100 text-emerald-800'
                                : 'bg-gray-100 text-gray-600'
                            }`}
                          >
                            {item.status === 'NEW' && <Clock size={12} />}
                            {item.status === 'RESPONDED' && <CheckCircle2 size={12} />}
                            {item.status === 'ARCHIVED' && <Archive size={12} />}
                            {item.status.replace('_', ' ')}
                          </span>
                          <div className="text-[11px] text-gray-400">
                            {item.assignedTo ? `Assigned: ${item.assignedTo}` : 'Unassigned'}
                          </div>
                        </div>
                      </td>

                      <td
                        className="py-4 px-4 text-right whitespace-nowrap"
                        onClick={(e) => e.stopPropagation()}
                      >
                        <div className="flex items-center justify-end gap-1.5">
                          <button
                            onClick={() => handleOpenDetail(item)}
                            className="p-1.5 rounded-lg text-gray-400 hover:text-[#023A23] hover:bg-gray-100 transition-colors"
                            title="View Full Inquiry"
                          >
                            <MessageSquare size={16} />
                          </button>
                          <a
                            href={`mailto:${item.email}?subject=Re: [Nkomazi SEZ] ${encodeURIComponent(
                              item.subject
                            )}`}
                            className="p-1.5 rounded-lg text-gray-400 hover:text-[#28B674] hover:bg-gray-100 transition-colors"
                            title="Reply by Email"
                          >
                            <Mail size={16} />
                          </a>
                          <button
                            onClick={() =>
                              handleQuickStatusChange(
                                item.id,
                                item.status === 'ARCHIVED' ? 'IN_REVIEW' : 'ARCHIVED'
                              )
                            }
                            className="p-1.5 rounded-lg text-gray-400 hover:text-amber-600 hover:bg-gray-100 transition-colors"
                            title={item.status === 'ARCHIVED' ? 'Unarchive' : 'Archive'}
                          >
                            <Archive size={16} />
                          </button>
                          {isSuperAdmin && (
                            <button
                              onClick={() => handleDeleteInquiry(item.id, item.name)}
                              className="p-1.5 rounded-lg text-gray-400 hover:text-red-600 hover:bg-red-50 transition-colors"
                              title="Delete Record"
                            >
                              <Trash2 size={16} />
                            </button>
                          )}
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Detail Slide-over / Modal */}
      {selectedInquiry && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm overflow-y-auto">
          <div className="bg-white rounded-2xl max-w-2xl w-full p-6 shadow-2xl border border-gray-100 my-8">
            <div className="flex items-center justify-between pb-4 border-b border-gray-100 mb-5">
              <div className="flex items-center gap-3">
                <span
                  className={`px-3 py-1 rounded-full text-xs font-semibold border ${
                    getTypeBadge(selectedInquiry.type).bg
                  }`}
                >
                  {getTypeBadge(selectedInquiry.type).label}
                </span>
                <span className="text-xs text-gray-400 flex items-center gap-1">
                  <Calendar size={13} />
                  {selectedInquiry.submittedAt}
                </span>
              </div>
              <button
                onClick={() => setSelectedInquiry(null)}
                className="text-gray-400 hover:text-gray-600 p-1 rounded-lg hover:bg-gray-100"
              >
                <X size={20} />
              </button>
            </div>

            <div className="space-y-5">
              {/* Sender Profile Box */}
              <div className="bg-gray-50/75 p-4 rounded-xl border border-gray-100 space-y-2">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                  <h3
                    className="text-lg font-bold text-gray-900"
                    style={{ fontFamily: HEADING_FONT }}
                  >
                    {selectedInquiry.name}
                  </h3>
                  {selectedInquiry.company && (
                    <span className="text-xs font-semibold text-[#023A23] bg-emerald-100/60 px-2.5 py-1 rounded-md">
                      {selectedInquiry.company}
                    </span>
                  )}
                </div>

                <div className="flex flex-wrap items-center gap-4 text-xs text-gray-600 pt-1">
                  <a
                    href={`mailto:${selectedInquiry.email}`}
                    className="flex items-center gap-1.5 text-[#023A23] hover:text-[#28B674] font-medium"
                  >
                    <Mail size={13} className="text-[#28B674]" />
                    <span>{selectedInquiry.email}</span>
                  </a>
                  {selectedInquiry.phone && (
                    <a
                      href={`tel:${selectedInquiry.phone}`}
                      className="flex items-center gap-1.5 text-gray-700 hover:text-[#28B674]"
                    >
                      <Phone size={13} className="text-gray-400" />
                      <span>{selectedInquiry.phone}</span>
                    </a>
                  )}
                  {selectedInquiry.sector && (
                    <div className="flex items-center gap-1.5 text-gray-500">
                      <Tag size={13} className="text-[#F2AE37]" />
                      <span>{selectedInquiry.sector}</span>
                    </div>
                  )}
                </div>
              </div>

              {/* Subject & Full Message */}
              <div>
                <h4
                  className="font-bold text-gray-900 mb-2 text-base"
                  style={{ fontFamily: HEADING_FONT }}
                >
                  {selectedInquiry.subject}
                </h4>
                <div className="bg-white p-4 rounded-xl border border-gray-200 text-sm text-gray-700 leading-relaxed whitespace-pre-line shadow-inner">
                  {selectedInquiry.message}
                </div>
              </div>

              {/* Status and Assignment Form Controls */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-2">
                <div>
                  <label className="block text-xs font-semibold text-gray-700 uppercase tracking-wider mb-1">
                    Inquiry Status
                  </label>
                  <select
                    value={editStatus}
                    onChange={(e) => setEditStatus(e.target.value as InquiryItem['status'])}
                    className="w-full px-3 py-2 rounded-lg border border-gray-200 text-xs font-medium bg-white focus:outline-none focus:ring-2 focus:ring-[#28B674]"
                  >
                    <option value="NEW">New / Unread</option>
                    <option value="IN_REVIEW">In Review</option>
                    <option value="RESPONDED">Responded</option>
                    <option value="ARCHIVED">Archived</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-gray-700 uppercase tracking-wider mb-1">
                    Priority Level
                  </label>
                  <select
                    value={editPriority}
                    onChange={(e) => setEditPriority(e.target.value as InquiryItem['priority'])}
                    className="w-full px-3 py-2 rounded-lg border border-gray-200 text-xs font-medium bg-white focus:outline-none focus:ring-2 focus:ring-[#28B674]"
                  >
                    <option value="HIGH">High Priority</option>
                    <option value="MEDIUM">Medium Priority</option>
                    <option value="LOW">Low Priority</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-gray-700 uppercase tracking-wider mb-1">
                    Assign To
                  </label>
                  <input
                    type="text"
                    placeholder="e.g. Investment Desk"
                    value={editAssignedTo}
                    onChange={(e) => setEditAssignedTo(e.target.value)}
                    className="w-full px-3 py-2 rounded-lg border border-gray-200 text-xs focus:outline-none focus:ring-2 focus:ring-[#28B674]"
                  />
                </div>
              </div>

              {/* Internal Notes */}
              <div>
                <label className="block text-xs font-semibold text-gray-700 uppercase tracking-wider mb-1">
                  Internal Team Notes / Action Log
                </label>
                <textarea
                  rows={3}
                  placeholder="Add confidential notes, meeting dates, officer comments, or follow-up milestones..."
                  value={editNotes}
                  onChange={(e) => setEditNotes(e.target.value)}
                  className="w-full px-3 py-2 rounded-lg border border-gray-200 text-xs focus:outline-none focus:ring-2 focus:ring-[#28B674]"
                />
              </div>

              {/* Action Buttons */}
              <div className="flex flex-col sm:flex-row items-center justify-between gap-3 pt-4 border-t border-gray-100">
                <a
                  href={`mailto:${selectedInquiry.email}?subject=Re: [Nkomazi SEZ] ${encodeURIComponent(
                    selectedInquiry.subject
                  )}`}
                  className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-lg bg-[#28B674] hover:bg-[#20925c] text-white text-xs font-semibold transition-colors shadow-sm"
                >
                  <Send size={14} />
                  <span>Send Direct Email Reply</span>
                </a>

                <div className="flex items-center gap-2 w-full sm:w-auto justify-end">
                  <button
                    type="button"
                    onClick={() => setSelectedInquiry(null)}
                    className="px-4 py-2 rounded-lg border border-gray-200 text-gray-700 hover:bg-gray-50 text-xs font-medium transition-colors"
                  >
                    Cancel
                  </button>
                  <button
                    type="button"
                    onClick={handleSaveDetail}
                    className="px-5 py-2 rounded-lg bg-[#023A23] hover:bg-[#035232] text-white text-xs font-semibold transition-colors shadow-sm"
                  >
                    Save Changes
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
