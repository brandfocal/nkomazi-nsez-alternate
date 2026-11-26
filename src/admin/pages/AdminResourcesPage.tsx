import React, { useState } from 'react';
import { useAdminAuth } from '../context/AdminAuthContext';
import {
  ResourceItem,
  ApprovalRequest,
  AuditLog,
} from '../types';
import {
  STORAGE_KEYS,
  INITIAL_RESOURCES,
  loadFromStorage,
  saveToStorage,
  createAuditLog,
} from '../mockData';
import {
  FileText,
  Search,
  Plus,
  Trash2,
  Edit,
  Download,
  AlertTriangle,
  X,
  FileCheck2,
} from 'lucide-react';

export const AdminResourcesPage: React.FC = () => {
  const { user, isSuperAdmin } = useAdminAuth();

  const [resources, setResources] = useState<ResourceItem[]>(() =>
    loadFromStorage<ResourceItem[]>(STORAGE_KEYS.RESOURCES, INITIAL_RESOURCES)
  );

  const [searchQuery, setSearchQuery] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('ALL');

  // Modal State
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingItem, setEditingItem] = useState<ResourceItem | null>(null);

  // Form State
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [category, setCategory] = useState<ResourceItem['category']>('Investment Guides');
  const [format, setFormat] = useState<ResourceItem['format']>('PDF');
  const [fileSize, setFileSize] = useState('2.4 MB');

  // Deletion modal
  const [deleteModalItem, setDeleteModalItem] = useState<ResourceItem | null>(null);
  const [deleteJustification, setDeleteJustification] = useState('');

  // Persist helper
  const updateResources = (newResources: ResourceItem[], auditAction: string, detail: string) => {
    setResources(newResources);
    saveToStorage(STORAGE_KEYS.RESOURCES, newResources);

    const logs = loadFromStorage<AuditLog[]>(STORAGE_KEYS.AUDIT_LOGS, []);
    const newLog = createAuditLog(
      user?.name || 'Administrator',
      user?.role || 'STANDARD_ADMIN',
      auditAction,
      'Resource',
      detail
    );
    saveToStorage(STORAGE_KEYS.AUDIT_LOGS, [newLog, ...logs]);
  };

  const openCreateModal = () => {
    setEditingItem(null);
    setTitle('');
    setDescription('');
    setCategory('Investment Guides');
    setFormat('PDF');
    setFileSize('2.4 MB');
    setIsModalOpen(true);
  };

  const openEditModal = (item: ResourceItem) => {
    setEditingItem(item);
    setTitle(item.title);
    setDescription(item.description || '');
    setCategory(item.category);
    setFormat(item.format);
    setFileSize(item.fileSize);
    setIsModalOpen(true);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (editingItem) {
      const updated = resources.map((r) =>
        r.id === editingItem.id
          ? {
              ...r,
              title,
              description,
              category,
              format,
              fileSize,
              updatedAt: new Date().toISOString().split('T')[0],
            }
          : r
      );
      updateResources(updated, 'UPDATE', `Updated resource document "${title}"`);
    } else {
      const newItem: ResourceItem = {
        id: `res-${Date.now()}`,
        title,
        description,
        category,
        format,
        fileSize,
        downloadsCount: 0,
        status: 'PUBLISHED',
        updatedAt: new Date().toISOString().split('T')[0],
      };
      updateResources([newItem, ...resources], 'CREATE', `Published new publication/document "${title}"`);
    }

    setIsModalOpen(false);
  };

  const handleDeleteClick = (item: ResourceItem) => {
    setDeleteModalItem(item);
    setDeleteJustification('');
  };

  const handleConfirmDelete = () => {
    if (!deleteModalItem) return;

    if (isSuperAdmin) {
      const filtered = resources.filter((r) => r.id !== deleteModalItem.id);
      updateResources(filtered, 'DELETE', `Super Admin permanently deleted resource "${deleteModalItem.title}"`);
      setDeleteModalItem(null);
    } else {
      // Standard admin must queue approval
      const approvals = loadFromStorage<ApprovalRequest[]>(STORAGE_KEYS.APPROVALS, []);
      const newApproval: ApprovalRequest = {
        id: `appr-${Date.now()}`,
        itemType: 'RESOURCE',
        action: 'DELETE',
        itemId: deleteModalItem.id,
        itemTitle: deleteModalItem.title,
        requestedBy: user?.name || 'Standard Admin',
        requestedByEmail: user?.email || 'admin@nkomazisez.gov.za',
        requestedAt: new Date().toISOString().replace('T', ' ').substring(0, 16),
        reason: deleteJustification || 'No justification provided by operator.',
        status: 'PENDING',
      };

      saveToStorage(STORAGE_KEYS.APPROVALS, [newApproval, ...approvals]);

      const logs = loadFromStorage<AuditLog[]>(STORAGE_KEYS.AUDIT_LOGS, []);
      const newLog = createAuditLog(
        user?.name || 'Administrator',
        user?.role || 'STANDARD_ADMIN',
        'REQUEST_DELETE',
        'Resource',
        `Submitted approval request to delete "${deleteModalItem.title}"`
      );
      saveToStorage(STORAGE_KEYS.AUDIT_LOGS, [newLog, ...logs]);

      setDeleteModalItem(null);
      alert('Deletion request sent to the Super Admin Approval Desk for review.');
    }
  };

  const filteredResources = resources.filter((item) => {
    const matchesSearch =
      item.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (item.description && item.description.toLowerCase().includes(searchQuery.toLowerCase()));
    const matchesCat = categoryFilter === 'ALL' || item.category === categoryFilter;
    return matchesSearch && matchesCat;
  });

  const categories = ['ALL', 'Investment Guides', 'Legal & Regulatory', 'Sector Brochures', 'Application Forms'];

  return (
    <div className="space-y-6">
      {/* Top Header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-[#023A23]">Downloads & Resource Library</h1>
          <p className="text-sm text-gray-600 mt-1">
            Manage investor documentation, application guidelines, master plans, and compliance forms.
          </p>
        </div>
        <button
          onClick={openCreateModal}
          className="inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-lg bg-[#023A23] text-white hover:bg-[#023A23]/90 font-medium text-sm transition-colors shadow-sm"
        >
          <Plus className="w-4 h-4" />
          Upload New Document
        </button>
      </div>

      {/* Filter and Search Bar */}
      <div className="bg-white p-4 rounded-xl border border-gray-200 shadow-sm flex flex-col md:flex-row gap-4 items-center justify-between">
        <div className="relative w-full md:w-96">
          <Search className="w-4 h-4 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search documents by title or description..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-9 pr-4 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#023A23]/20 focus:border-[#023A23]"
          />
        </div>

        <div className="flex items-center gap-2 w-full md:w-auto overflow-x-auto pb-1 md:pb-0">
          <span className="text-xs font-semibold uppercase tracking-wider text-gray-500 whitespace-nowrap mr-1">
            Category:
          </span>
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setCategoryFilter(cat)}
              className={`px-3 py-1.5 rounded-md text-xs font-medium whitespace-nowrap transition-colors ${
                categoryFilter === cat
                  ? 'bg-[#023A23] text-white'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      {/* Table / Grid */}
      <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse text-sm">
            <thead>
              <tr className="bg-gray-50 border-b border-gray-200 text-gray-600 font-semibold text-xs uppercase tracking-wider">
                <th className="py-3 px-4">Document Title</th>
                <th className="py-3 px-4">Category</th>
                <th className="py-3 px-4">Format & Size</th>
                <th className="py-3 px-4">Downloads</th>
                <th className="py-3 px-4">Last Updated</th>
                <th className="py-3 px-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {filteredResources.length === 0 ? (
                <tr>
                  <td colSpan={6} className="py-8 text-center text-gray-500">
                    No documentation found matching criteria.
                  </td>
                </tr>
              ) : (
                filteredResources.map((item) => (
                  <tr key={item.id} className="hover:bg-gray-50 transition-colors">
                    <td className="py-3 px-4">
                      <div className="flex items-start gap-3">
                        <div className="p-2 bg-[#023A23]/10 text-[#023A23] rounded-lg shrink-0 mt-0.5">
                          <FileText className="w-4 h-4" />
                        </div>
                        <div>
                          <div className="font-semibold text-gray-900">{item.title}</div>
                          {item.description && (
                            <div className="text-xs text-gray-500 line-clamp-1">{item.description}</div>
                          )}
                        </div>
                      </div>
                    </td>
                    <td className="py-3 px-4">
                      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-[#023A23]/10 text-[#023A23]">
                        {item.category}
                      </span>
                    </td>
                    <td className="py-3 px-4">
                      <span className="text-xs text-gray-700 font-medium">
                        {item.format} • {item.fileSize}
                      </span>
                    </td>
                    <td className="py-3 px-4">
                      <div className="flex items-center gap-1.5 text-gray-600 text-xs">
                        <Download className="w-3.5 h-3.5 text-gray-400" />
                        <span>{item.downloadsCount.toLocaleString()}</span>
                      </div>
                    </td>
                    <td className="py-3 px-4 text-xs text-gray-500">
                      {item.updatedAt}
                    </td>
                    <td className="py-3 px-4 text-right">
                      <div className="flex items-center justify-end gap-1">
                        <button
                          onClick={() => openEditModal(item)}
                          className="p-1.5 text-gray-500 hover:text-[#023A23] hover:bg-gray-100 rounded-md transition-colors"
                          title="Edit Document Info"
                        >
                          <Edit className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => handleDeleteClick(item)}
                          className="p-1.5 text-gray-500 hover:text-red-600 hover:bg-red-50 rounded-md transition-colors"
                          title={isSuperAdmin ? 'Permanently Delete' : 'Request Deletion'}
                        >
                          <Trash2 className="w-4 h-4" />
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

      {/* Edit / Create Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
          <div className="bg-white rounded-2xl max-w-lg w-full overflow-hidden shadow-2xl animate-in fade-in zoom-in duration-200">
            <div className="px-6 py-4 border-b border-gray-100 flex items-center justify-between bg-gray-50/50">
              <h3 className="font-bold text-[#023A23] text-lg">
                {editingItem ? 'Edit Document Metadata' : 'Upload Resource to Library'}
              </h3>
              <button
                onClick={() => setIsModalOpen(false)}
                className="text-gray-400 hover:text-gray-600 p-1 rounded-md"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="p-6 space-y-4">
              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-gray-700 mb-1">
                  Document Title *
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Master Development Plan 2026-2030"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#023A23]/20 focus:border-[#023A23]"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-gray-700 mb-1">
                  Brief Description *
                </label>
                <textarea
                  rows={3}
                  required
                  placeholder="Summary of document purpose and contents..."
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#023A23]/20 focus:border-[#023A23]"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold uppercase tracking-wider text-gray-700 mb-1">
                    Category *
                  </label>
                  <select
                    value={category}
                    onChange={(e: any) => setCategory(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#023A23]/20 focus:border-[#023A23]"
                  >
                    <option value="Investment Guides">Investment Guides</option>
                    <option value="Legal & Regulatory">Legal & Regulatory</option>
                    <option value="Sector Brochures">Sector Brochures</option>
                    <option value="Application Forms">Application Forms</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-semibold uppercase tracking-wider text-gray-700 mb-1">
                    File Format
                  </label>
                  <select
                    value={format}
                    onChange={(e: any) => setFormat(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#023A23]/20 focus:border-[#023A23]"
                  >
                    <option value="PDF">PDF</option>
                    <option value="XLSX">Excel Spreadsheet (XLSX)</option>
                    <option value="DOCX">Word Document (DOCX)</option>
                  </select>
                </div>
              </div>

              <div className="p-3 bg-gray-50 border border-dashed border-gray-300 rounded-xl flex items-center justify-center text-center">
                <div className="text-xs text-gray-500">
                  <FileCheck2 className="w-6 h-6 text-[#28B674] mx-auto mb-1" />
                  <span className="font-semibold text-gray-800">Simulated Upload Storage</span>: Live file link defaults to standard encrypted media bundle.
                </div>
              </div>

              <div className="pt-4 border-t border-gray-100 flex items-center justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2 border border-gray-300 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-50"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-[#023A23] hover:bg-[#023A23]/90 text-white rounded-lg text-sm font-medium transition-colors"
                >
                  {editingItem ? 'Save Changes' : 'Publish Document'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Delete / Approval Modal */}
      {deleteModalItem && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
          <div className="bg-white rounded-2xl max-w-md w-full overflow-hidden shadow-2xl animate-in fade-in zoom-in duration-200">
            <div className="p-6">
              <div className="w-12 h-12 rounded-full bg-red-100 text-red-600 flex items-center justify-center mb-4">
                <AlertTriangle className="w-6 h-6" />
              </div>

              <h3 className="text-lg font-bold text-[#023A23]">
                {isSuperAdmin ? 'Permanently Delete Resource?' : 'Submit Deletion for Approval?'}
              </h3>
              <p className="text-sm text-gray-600 mt-2">
                You are targeting <span className="font-semibold text-gray-900">"{deleteModalItem.title}"</span>.
              </p>

              {!isSuperAdmin && (
                <div className="mt-4">
                  <label className="block text-xs font-semibold uppercase tracking-wider text-gray-700 mb-1">
                    Reason / Justification *
                  </label>
                  <textarea
                    rows={3}
                    required
                    placeholder="Explain why this document should be deleted..."
                    value={deleteJustification}
                    onChange={(e) => setDeleteJustification(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#023A23]/20 focus:border-[#023A23]"
                  />
                  <p className="text-xs text-amber-600 mt-1">
                    Standard Admins cannot delete directly. This request will be routed to the Super Admin desk.
                  </p>
                </div>
              )}

              <div className="mt-6 flex items-center justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setDeleteModalItem(null)}
                  className="px-4 py-2 border border-gray-300 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-50"
                >
                  Cancel
                </button>
                <button
                  type="button"
                  onClick={handleConfirmDelete}
                  className={`px-4 py-2 rounded-lg text-sm font-medium text-white transition-colors ${
                    isSuperAdmin
                      ? 'bg-red-600 hover:bg-red-700'
                      : 'bg-[#F2AE37] hover:bg-[#F2AE37]/90 text-gray-900 font-semibold'
                  }`}
                >
                  {isSuperAdmin ? 'Yes, Delete Permanently' : 'Submit Approval Request'}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
