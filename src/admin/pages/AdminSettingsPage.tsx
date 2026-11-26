import React, { useState } from 'react';
import { useAdminAuth } from '../context/AdminAuthContext';
import { SiteSettings, AuditLog } from '../types';
import {
  STORAGE_KEYS,
  INITIAL_SETTINGS,
  loadFromStorage,
  saveToStorage,
  createAuditLog,
} from '../mockData';
import {
  Settings,
  Phone,
  Mail,
  MapPin,
  Clock,
  Globe,
  Bell,
  Save,
  CheckCircle2,
  ExternalLink,
  ShieldCheck,
  AlertTriangle,
  Building2,
} from 'lucide-react';

export const AdminSettingsPage: React.FC = () => {
  const { user, isSuperAdmin } = useAdminAuth();

  const [settings, setSettings] = useState<SiteSettings>(() =>
    loadFromStorage<SiteSettings>(STORAGE_KEYS.SETTINGS, INITIAL_SETTINGS)
  );

  const [savedNotice, setSavedNotice] = useState<string | null>(null);

  // Form states
  const [contactPhone, setContactPhone] = useState(settings.contactPhone);
  const [generalEmail, setGeneralEmail] = useState(settings.generalEmail);
  const [investmentEmail, setInvestmentEmail] = useState(settings.investmentEmail);
  const [procurementEmail, setProcurementEmail] = useState(settings.procurementEmail);
  const [physicalAddress, setPhysicalAddress] = useState(settings.physicalAddress);
  const [postalAddress, setPostalAddress] = useState(settings.postalAddress);
  const [officeHours, setOfficeHours] = useState(settings.officeHours);
  const [socialLinkedIn, setSocialLinkedIn] = useState(settings.socialLinkedIn);
  const [socialFacebook, setSocialFacebook] = useState(settings.socialFacebook);
  const [socialYouTube, setSocialYouTube] = useState(settings.socialYouTube);
  const [socialTwitter, setSocialTwitter] = useState(settings.socialTwitter);

  // Banner states
  const [bannerEnabled, setBannerEnabled] = useState(settings.bannerEnabled);
  const [bannerTitle, setBannerTitle] = useState(settings.bannerTitle || '');
  const [bannerText, setBannerText] = useState(settings.bannerText);
  const [bannerLink, setBannerLink] = useState(settings.bannerLink || '/tenders');

  const [activeTab, setActiveTab] = useState<'CONTACT' | 'OFFICE' | 'SOCIAL' | 'BANNER'>('CONTACT');

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();

    const updated: SiteSettings = {
      contactPhone,
      generalEmail,
      investmentEmail,
      procurementEmail,
      physicalAddress,
      postalAddress,
      officeHours,
      socialLinkedIn,
      socialFacebook,
      socialYouTube,
      socialTwitter,
      bannerEnabled,
      bannerTitle,
      bannerText,
      bannerLink,
      lastUpdated: new Date().toISOString().split('T')[0],
      updatedBy: user?.name || 'Administrator',
    };

    setSettings(updated);
    saveToStorage(STORAGE_KEYS.SETTINGS, updated);

    // Audit log
    const logs = loadFromStorage<AuditLog[]>(STORAGE_KEYS.AUDIT_LOGS, []);
    const newLog = createAuditLog(
      user?.name || 'Administrator',
      user?.role || 'STANDARD_ADMIN',
      'UPDATE_SETTINGS',
      'Site Settings',
      `Updated corporate contact and site parameters (${activeTab.toLowerCase()})`
    );
    saveToStorage(STORAGE_KEYS.AUDIT_LOGS, [newLog, ...logs]);

    setSavedNotice('Site settings updated and synchronized with live website.');
    setTimeout(() => setSavedNotice(null), 4000);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-[#023A23]">
            Site Settings & Corporate Directory
          </h1>
          <p className="text-sm text-gray-600 mt-1">
            Manage public enquiry routing, physical address directories, social accounts, and urgent broadcast announcements.
          </p>
        </div>

        <button
          onClick={handleSave}
          className="inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-lg bg-[#023A23] text-white hover:bg-[#023A23]/90 font-semibold text-sm transition-colors shadow-sm"
        >
          <Save className="w-4 h-4 text-[#28B674]" />
          Save Changes
        </button>
      </div>

      {/* Feedback Alert */}
      {savedNotice && (
        <div className="p-4 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-900 flex items-center justify-between animate-in fade-in slide-in-from-top-2">
          <div className="flex items-center gap-2.5 text-xs font-semibold">
            <CheckCircle2 className="w-4 h-4 text-[#28B674]" />
            <span>{savedNotice}</span>
          </div>
          <span className="text-[11px] text-emerald-700 font-medium">Last Saved: Just now</span>
        </div>
      )}

      {/* Main Tabs */}
      <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
        <div className="flex border-b border-gray-200 bg-gray-50/50 overflow-x-auto">
          <button
            onClick={() => setActiveTab('CONTACT')}
            className={`px-5 py-3 text-xs font-semibold flex items-center gap-2 border-b-2 transition-colors whitespace-nowrap ${
              activeTab === 'CONTACT'
                ? 'border-[#023A23] text-[#023A23] bg-white'
                : 'border-transparent text-gray-600 hover:text-gray-900 hover:bg-gray-100/50'
            }`}
          >
            <Mail className="w-3.5 h-3.5" />
            Enquiry Channels & Emails
          </button>
          <button
            onClick={() => setActiveTab('OFFICE')}
            className={`px-5 py-3 text-xs font-semibold flex items-center gap-2 border-b-2 transition-colors whitespace-nowrap ${
              activeTab === 'OFFICE'
                ? 'border-[#023A23] text-[#023A23] bg-white'
                : 'border-transparent text-gray-600 hover:text-gray-900 hover:bg-gray-100/50'
            }`}
          >
            <MapPin className="w-3.5 h-3.5" />
            Location & Operating Hours
          </button>
          <button
            onClick={() => setActiveTab('SOCIAL')}
            className={`px-5 py-3 text-xs font-semibold flex items-center gap-2 border-b-2 transition-colors whitespace-nowrap ${
              activeTab === 'SOCIAL'
                ? 'border-[#023A23] text-[#023A23] bg-white'
                : 'border-transparent text-gray-600 hover:text-gray-900 hover:bg-gray-100/50'
            }`}
          >
            <Globe className="w-3.5 h-3.5" />
            Social Media Handles
          </button>
          <button
            onClick={() => setActiveTab('BANNER')}
            className={`px-5 py-3 text-xs font-semibold flex items-center gap-2 border-b-2 transition-colors whitespace-nowrap ${
              activeTab === 'BANNER'
                ? 'border-[#023A23] text-[#023A23] bg-white'
                : 'border-transparent text-gray-600 hover:text-gray-900 hover:bg-gray-100/50'
            }`}
          >
            <Bell className="w-3.5 h-3.5" />
            Urgent Notice Alert Banner
            {bannerEnabled && (
              <span className="w-2 h-2 rounded-full bg-[#28B674]"></span>
            )}
          </button>
        </div>

        <form onSubmit={handleSave} className="p-6">
          {/* Tab 1: Contact Enquiries */}
          {activeTab === 'CONTACT' && (
            <div className="space-y-5 max-w-2xl">
              <div>
                <h3 className="text-sm font-bold text-[#023A23]">Enquiry Routing Addresses</h3>
                <p className="text-xs text-gray-500 mt-0.5">
                  These emails power the contact links, investor inquiries, and procurement communication across the site.
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold uppercase tracking-wider text-gray-700 mb-1">
                    Central Reception Telephone *
                  </label>
                  <div className="relative">
                    <Phone className="w-4 h-4 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" />
                    <input
                      type="text"
                      required
                      value={contactPhone}
                      onChange={(e) => setContactPhone(e.target.value)}
                      className="w-full pl-9 pr-3 py-2 border border-gray-300 rounded-lg text-xs focus:outline-none focus:ring-2 focus:ring-[#023A23]/20 focus:border-[#023A23]"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-semibold uppercase tracking-wider text-gray-700 mb-1">
                    General Information Email *
                  </label>
                  <div className="relative">
                    <Mail className="w-4 h-4 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" />
                    <input
                      type="email"
                      required
                      value={generalEmail}
                      onChange={(e) => setGeneralEmail(e.target.value)}
                      className="w-full pl-9 pr-3 py-2 border border-gray-300 rounded-lg text-xs focus:outline-none focus:ring-2 focus:ring-[#023A23]/20 focus:border-[#023A23]"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-semibold uppercase tracking-wider text-gray-700 mb-1">
                    Investment Facilitation Desk Email *
                  </label>
                  <div className="relative">
                    <Mail className="w-4 h-4 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" />
                    <input
                      type="email"
                      required
                      value={investmentEmail}
                      onChange={(e) => setInvestmentEmail(e.target.value)}
                      className="w-full pl-9 pr-3 py-2 border border-gray-300 rounded-lg text-xs focus:outline-none focus:ring-2 focus:ring-[#023A23]/20 focus:border-[#023A23]"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-semibold uppercase tracking-wider text-gray-700 mb-1">
                    Procurement & Tenders Unit Email *
                  </label>
                  <div className="relative">
                    <Mail className="w-4 h-4 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" />
                    <input
                      type="email"
                      required
                      value={procurementEmail}
                      onChange={(e) => setProcurementEmail(e.target.value)}
                      className="w-full pl-9 pr-3 py-2 border border-gray-300 rounded-lg text-xs focus:outline-none focus:ring-2 focus:ring-[#023A23]/20 focus:border-[#023A23]"
                    />
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Tab 2: Location & Office */}
          {activeTab === 'OFFICE' && (
            <div className="space-y-5 max-w-2xl">
              <div>
                <h3 className="text-sm font-bold text-[#023A23]">Physical Locations & Hours</h3>
                <p className="text-xs text-gray-500 mt-0.5">
                  Displayed on the Contact, About Us, and legal footer sections.
                </p>
              </div>

              <div className="space-y-4">
                <div>
                  <label className="block text-xs font-semibold uppercase tracking-wider text-gray-700 mb-1">
                    Physical Headquarters Address *
                  </label>
                  <div className="relative">
                    <MapPin className="w-4 h-4 text-gray-400 absolute left-3 top-3" />
                    <textarea
                      rows={2}
                      required
                      value={physicalAddress}
                      onChange={(e) => setPhysicalAddress(e.target.value)}
                      className="w-full pl-9 pr-3 py-2 border border-gray-300 rounded-lg text-xs focus:outline-none focus:ring-2 focus:ring-[#023A23]/20 focus:border-[#023A23]"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-semibold uppercase tracking-wider text-gray-700 mb-1">
                    Postal Address
                  </label>
                  <div className="relative">
                    <Building2 className="w-4 h-4 text-gray-400 absolute left-3 top-3" />
                    <textarea
                      rows={2}
                      value={postalAddress}
                      onChange={(e) => setPostalAddress(e.target.value)}
                      className="w-full pl-9 pr-3 py-2 border border-gray-300 rounded-lg text-xs focus:outline-none focus:ring-2 focus:ring-[#023A23]/20 focus:border-[#023A23]"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-semibold uppercase tracking-wider text-gray-700 mb-1">
                    Public Operating Office Hours *
                  </label>
                  <div className="relative">
                    <Clock className="w-4 h-4 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" />
                    <input
                      type="text"
                      required
                      value={officeHours}
                      onChange={(e) => setOfficeHours(e.target.value)}
                      className="w-full pl-9 pr-3 py-2 border border-gray-300 rounded-lg text-xs focus:outline-none focus:ring-2 focus:ring-[#023A23]/20 focus:border-[#023A23]"
                    />
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Tab 3: Social Media */}
          {activeTab === 'SOCIAL' && (
            <div className="space-y-5 max-w-2xl">
              <div>
                <h3 className="text-sm font-bold text-[#023A23]">Official Social Media Handles</h3>
                <p className="text-xs text-gray-500 mt-0.5">
                  Links for all icons in the desktop top banner, mobile navigation drawer, and footer.
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold uppercase tracking-wider text-gray-700 mb-1">
                    LinkedIn Organization URL
                  </label>
                  <input
                    type="url"
                    value={socialLinkedIn}
                    onChange={(e) => setSocialLinkedIn(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg text-xs focus:outline-none focus:ring-2 focus:ring-[#023A23]/20 focus:border-[#023A23]"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold uppercase tracking-wider text-gray-700 mb-1">
                    Facebook Page URL
                  </label>
                  <input
                    type="url"
                    value={socialFacebook}
                    onChange={(e) => setSocialFacebook(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg text-xs focus:outline-none focus:ring-2 focus:ring-[#023A23]/20 focus:border-[#023A23]"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold uppercase tracking-wider text-gray-700 mb-1">
                    YouTube Channel URL
                  </label>
                  <input
                    type="url"
                    value={socialYouTube}
                    onChange={(e) => setSocialYouTube(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg text-xs focus:outline-none focus:ring-2 focus:ring-[#023A23]/20 focus:border-[#023A23]"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold uppercase tracking-wider text-gray-700 mb-1">
                    X (Twitter) Profile URL
                  </label>
                  <input
                    type="url"
                    value={socialTwitter}
                    onChange={(e) => setSocialTwitter(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg text-xs focus:outline-none focus:ring-2 focus:ring-[#023A23]/20 focus:border-[#023A23]"
                  />
                </div>
              </div>
            </div>
          )}

          {/* Tab 4: Broadcast Banner */}
          {activeTab === 'BANNER' && (
            <div className="space-y-5 max-w-2xl">
              <div>
                <h3 className="text-sm font-bold text-[#023A23]">Urgent Public Alert Banner</h3>
                <p className="text-xs text-gray-500 mt-0.5">
                  Controls the sticky high-priority notice displayed at the top of the website for gazetted deadlines and tender site briefings.
                </p>
              </div>

              <div className="p-4 rounded-xl border border-gray-200 bg-gray-50 flex items-center justify-between">
                <div>
                  <div className="font-bold text-xs text-[#023A23]">Enable Broadcast Banner</div>
                  <div className="text-[11px] text-gray-500">When active, this banner is displayed to all website visitors.</div>
                </div>
                <button
                  type="button"
                  onClick={() => setBannerEnabled(!bannerEnabled)}
                  className={`w-12 h-6 rounded-full transition-colors relative focus:outline-none ${
                    bannerEnabled ? 'bg-[#28B674]' : 'bg-gray-300'
                  }`}
                >
                  <span
                    className={`block w-5 h-5 rounded-full bg-white shadow-md transform transition-transform ${
                      bannerEnabled ? 'translate-x-6' : 'translate-x-0.5'
                    }`}
                  />
                </button>
              </div>

              <div className="space-y-4">
                <div>
                  <label className="block text-xs font-semibold uppercase tracking-wider text-gray-700 mb-1">
                    Banner Eyebrow / Reference Tag
                  </label>
                  <input
                    type="text"
                    placeholder="e.g. Mandatory Briefing"
                    value={bannerTitle}
                    onChange={(e) => setBannerTitle(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg text-xs focus:outline-none focus:ring-2 focus:ring-[#023A23]/20 focus:border-[#023A23]"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold uppercase tracking-wider text-gray-700 mb-1">
                    Broadcast Message *
                  </label>
                  <textarea
                    rows={2}
                    required
                    placeholder="Brief explanation of notice or closing deadline..."
                    value={bannerText}
                    onChange={(e) => setBannerText(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg text-xs focus:outline-none focus:ring-2 focus:ring-[#023A23]/20 focus:border-[#023A23]"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold uppercase tracking-wider text-gray-700 mb-1">
                    Destination URL / Page
                  </label>
                  <input
                    type="text"
                    placeholder="/tenders or https://..."
                    value={bannerLink}
                    onChange={(e) => setBannerLink(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg text-xs focus:outline-none focus:ring-2 focus:ring-[#023A23]/20 focus:border-[#023A23]"
                  />
                </div>
              </div>

              {/* Live Preview */}
              <div className="pt-2">
                <div className="text-xs font-bold uppercase tracking-wider text-gray-500 mb-2">Live Visitor Preview:</div>
                <div className="p-3 bg-[#023A23] text-white rounded-lg flex items-center justify-between text-xs border border-[#28B674]/30 shadow-md">
                  <div className="flex items-center gap-2">
                    <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-[#F2AE37] text-[#023A23]">
                      {bannerTitle || 'Notice'}
                    </span>
                    <span className="text-white/90 line-clamp-1">{bannerText}</span>
                  </div>
                  <span className="text-[#28B674] text-xs font-semibold hover:underline cursor-pointer shrink-0 ml-2">
                    View Details &rarr;
                  </span>
                </div>
              </div>
            </div>
          )}

          {/* Form Submit Footer */}
          <div className="pt-6 mt-6 border-t border-gray-100 flex items-center justify-between">
            <div className="text-xs text-gray-500">
              Last saved by <strong className="text-gray-700">{settings.updatedBy || 'Super Admin'}</strong> on {settings.lastUpdated}
            </div>

            <button
              type="submit"
              className="px-5 py-2.5 rounded-lg bg-[#023A23] hover:bg-[#023A23]/90 text-white font-semibold text-xs transition-colors shadow-sm"
            >
              Save Configuration
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
