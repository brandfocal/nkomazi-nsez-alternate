import React, { useState } from 'react';
import { useAdminAuth } from '../context/AdminAuthContext';
import { NewsArticleItem, ApprovalRequest, AuditLog } from '../types';
import {
  STORAGE_KEYS,
  INITIAL_NEWS,
  loadFromStorage,
  saveToStorage,
  createAuditLog,
} from '../mockData';
import {
  Newspaper,
  Search,
  Plus,
  Trash2,
  Edit,
  ExternalLink,
  Calendar,
  AlertTriangle,
  X,
  FileCheck2,
  Eye,
  CheckCircle2,
} from 'lucide-react';

export const AdminNewsPage: React.FC = () => {
  const { user, isSuperAdmin } = useAdminAuth();

  const [articles, setArticles] = useState<NewsArticleItem[]>(() =>
    loadFromStorage<NewsArticleItem[]>(STORAGE_KEYS.NEWS, INITIAL_NEWS)
  );

  const [searchQuery, setSearchQuery] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('ALL');

  // Modal State
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingItem, setEditingItem] = useState<NewsArticleItem | null>(null);

  // Form State
  const [title, setTitle] = useState('');
  const [category, setCategory] = useState<NewsArticleItem['category']>('Featured Article');
  const [excerpt, setExcerpt] = useState('');
  const [authorOrSource, setAuthorOrSource] = useState('Corporate Communications');
  const [date, setDate] = useState(new Date().toISOString().split('T')[0]);
  const [image, setImage] = useState('https://images.unsplash.com/photo-1465447142348-e9952c393450?w=800&q=80');
  const [link, setLink] = useState('');

  // Deletion modal
  const [deleteModalItem, setDeleteModalItem] = useState<NewsArticleItem | null>(null);
  const [deleteJustification, setDeleteJustification] = useState('');

  const updateArticles = (newArticles: NewsArticleItem[], auditAction: string, detail: string) => {
    setArticles(newArticles);
    saveToStorage(STORAGE_KEYS.NEWS, newArticles);

    const logs = loadFromStorage<AuditLog[]>(STORAGE_KEYS.AUDIT_LOGS, []);
    const newLog = createAuditLog(
      user?.name || 'Administrator',
      user?.role || 'STANDARD_ADMIN',
      auditAction,
      'News & Media',
      detail
    );
    saveToStorage(STORAGE_KEYS.AUDIT_LOGS, [newLog, ...logs]);
  };

  const openCreateModal = () => {
    setEditingItem(null);
    setTitle('');
    setCategory('Featured Article');
    setExcerpt('');
    setAuthorOrSource('Corporate Communications');
    setDate(new Date().toISOString().split('T')[0]);
    setImage('https://images.unsplash.com/photo-1465447142348-e9952c393450?w=800&q=80');
    setLink('');
    setIsModalOpen(true);
  };

  const openEditModal = (item: NewsArticleItem) => {
    setEditingItem(item);
    setTitle(item.title);
    setCategory(item.category);
    setExcerpt(item.excerpt);
    setAuthorOrSource(item.authorOrSource);
    setDate(item.date);
    setImage(item.image);
    setLink(item.link || '');
    setIsModalOpen(true);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (editingItem) {
      const updated = articles.map((a) =>
        a.id === editingItem.id
          ? {
              ...a,
              title,
              category,
              excerpt,
              authorOrSource,
              date,
              image,
              link: link || undefined,
            }
          : a
      );
      updateArticles(updated, 'UPDATE', `Updated article "${title}"`);
    } else {
      const newItem: NewsArticleItem = {
        id: `news-${Date.now()}`,
        title,
        category,
        excerpt,
        authorOrSource,
        date,
        image,
        link: link || undefined,
        published: true,
      };
      updateArticles([newItem, ...articles], 'CREATE', `Published news article "${title}"`);
    }

    setIsModalOpen(false);
  };

  const handleDeleteClick = (item: NewsArticleItem) => {
    setDeleteModalItem(item);
    setDeleteJustification('');
  };

  const handleConfirmDelete = () => {
    if (!deleteModalItem) return;

    if (isSuperAdmin) {
      const filtered = articles.filter((a) => a.id !== deleteModalItem.id);
      updateArticles(filtered, 'DELETE', `Super Admin permanently deleted article "${deleteModalItem.title}"`);
      setDeleteModalItem(null);
    } else {
      const approvals = loadFromStorage<ApprovalRequest[]>(STORAGE_KEYS.APPROVALS, []);
      const newApproval: ApprovalRequest = {
        id: `appr-${Date.now()}`,
        itemType: 'NEWS',
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
        'News & Media',
        `Submitted approval request to delete article "${deleteModalItem.title}"`
      );
      saveToStorage(STORAGE_KEYS.AUDIT_LOGS, [newLog, ...logs]);

      setDeleteModalItem(null);
      alert('Deletion request sent to the Super Admin Approval Desk for review.');
    }
  };

  const categories = ['ALL', 'Featured Article', 'Press Release', 'Media Statement', 'Video Highlights', 'Event'];

  const filteredArticles = articles.filter((item) => {
    const matchesSearch =
      item.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.excerpt.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.authorOrSource.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCat = categoryFilter === 'ALL' || item.category === categoryFilter;
    return matchesSearch && matchesCat;
  });

  return (
    <div className="space-y-6">
      {/* Top Header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-[#023A23]">News, Media & Press Releases</h1>
          <p className="text-sm text-gray-600 mt-1">
            Manage public media statements, gazetted milestones, event recaps, and video highlights.
          </p>
        </div>
        <button
          onClick={openCreateModal}
          className="inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-lg bg-[#023A23] text-white hover:bg-[#023A23]/90 font-medium text-sm transition-colors shadow-sm"
        >
          <Plus className="w-4 h-4" />
          Create News Article
        </button>
      </div>

      {/* Filter and Search Bar */}
      <div className="bg-white p-4 rounded-xl border border-gray-200 shadow-sm flex flex-col md:flex-row gap-4 items-center justify-between">
        <div className="relative w-full md:w-96">
          <Search className="w-4 h-4 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search articles by title, excerpt, or source..."
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

      {/* Articles Table */}
      <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse text-sm">
            <thead>
              <tr className="bg-gray-50 border-b border-gray-200 text-gray-600 font-semibold text-xs uppercase tracking-wider">
                <th className="py-3 px-4">Article</th>
                <th className="py-3 px-4">Category</th>
                <th className="py-3 px-4">Source / Author</th>
                <th className="py-3 px-4">Date</th>
                <th className="py-3 px-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {filteredArticles.length === 0 ? (
                <tr>
                  <td colSpan={5} className="py-8 text-center text-gray-500">
                    No articles found matching criteria.
                  </td>
                </tr>
              ) : (
                filteredArticles.map((item) => (
                  <tr key={item.id} className="hover:bg-gray-50 transition-colors">
                    <td className="py-3 px-4 max-w-md">
                      <div className="flex items-start gap-3">
                        <img
                          src={item.image}
                          alt=""
                          className="w-12 h-12 rounded-lg object-cover bg-gray-100 shrink-0 border border-gray-200"
                        />
                        <div>
                          <div className="font-semibold text-gray-900 line-clamp-1">{item.title}</div>
                          <div className="text-xs text-gray-500 line-clamp-2 mt-0.5">{item.excerpt}</div>
                        </div>
                      </div>
                    </td>
                    <td className="py-3 px-4">
                      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-[#023A23]/10 text-[#023A23]">
                        {item.category}
                      </span>
                    </td>
                    <td className="py-3 px-4 text-xs text-gray-700 font-medium">
                      {item.authorOrSource}
                    </td>
                    <td className="py-3 px-4 text-xs text-gray-500">
                      <div className="flex items-center gap-1.5">
                        <Calendar className="w-3.5 h-3.5 text-gray-400" />
                        <span>{item.date}</span>
                      </div>
                    </td>
                    <td className="py-3 px-4 text-right">
                      <div className="flex items-center justify-end gap-1">
                        {item.link && (
                          <a
                            href={item.link}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="p-1.5 text-gray-500 hover:text-[#023A23] hover:bg-gray-100 rounded-md transition-colors"
                            title="Open external media"
                          >
                            <ExternalLink className="w-4 h-4" />
                          </a>
                        )}
                        <button
                          onClick={() => openEditModal(item)}
                          className="p-1.5 text-gray-500 hover:text-[#023A23] hover:bg-gray-100 rounded-md transition-colors"
                          title="Edit Article"
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

      {/* Create / Edit Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
          <div className="bg-white rounded-2xl max-w-lg w-full overflow-hidden shadow-2xl animate-in fade-in zoom-in duration-200">
            <div className="px-6 py-4 border-b border-gray-100 flex items-center justify-between bg-gray-50/50">
              <h3 className="font-bold text-[#023A23] text-lg">
                {editingItem ? 'Edit Media Article' : 'Publish New Media Statement'}
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
                  Headline / Article Title *
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. MPUMALANGA NKOMAZI SEZ Occupies Strategic Economic Position"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
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
                    <option value="Featured Article">Featured Article</option>
                    <option value="Press Release">Press Release</option>
                    <option value="Media Statement">Media Statement</option>
                    <option value="Video Highlights">Video Highlights</option>
                    <option value="Event">Event</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-semibold uppercase tracking-wider text-gray-700 mb-1">
                    Date of Release *
                  </label>
                  <input
                    type="date"
                    required
                    value={date}
                    onChange={(e) => setDate(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#023A23]/20 focus:border-[#023A23]"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-gray-700 mb-1">
                  Author / Publication Source *
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Mpumalanga 247, Office of the CEO, SABC News"
                  value={authorOrSource}
                  onChange={(e) => setAuthorOrSource(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#023A23]/20 focus:border-[#023A23]"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-gray-700 mb-1">
                  Brief Summary / Excerpt *
                </label>
                <textarea
                  rows={3}
                  required
                  placeholder="Overview of article content and significance..."
                  value={excerpt}
                  onChange={(e) => setExcerpt(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#023A23]/20 focus:border-[#023A23]"
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold uppercase tracking-wider text-gray-700 mb-1">
                    Cover Image URL
                  </label>
                  <input
                    type="url"
                    placeholder="https://images.unsplash.com/..."
                    value={image}
                    onChange={(e) => setImage(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#023A23]/20 focus:border-[#023A23]"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold uppercase tracking-wider text-gray-700 mb-1">
                    External Link / Full Story URL
                  </label>
                  <input
                    type="url"
                    placeholder="https://..."
                    value={link}
                    onChange={(e) => setLink(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#023A23]/20 focus:border-[#023A23]"
                  />
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
                  {editingItem ? 'Save Changes' : 'Publish Article'}
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
                {isSuperAdmin ? 'Permanently Delete Article?' : 'Submit Deletion for Approval?'}
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
                    placeholder="Explain why this article should be deleted..."
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
