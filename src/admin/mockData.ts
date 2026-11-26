import { OpportunityItem, TenderItem, ResourceItem, ApprovalRequest, AuditLog, AdminUser, AdminRole, SiteSettings } from './types';

export const STORAGE_KEYS = {
  USERS: 'users',
  OPPORTUNITIES: 'opportunities',
  TENDERS: 'tenders',
  RESOURCES: 'resources',
  APPROVALS: 'approvals',
  AUDIT_LOGS: 'audit_logs',
  SETTINGS: 'site_settings',
};

export const INITIAL_SETTINGS: SiteSettings = {
  contactPhone: '+27 (0) 13 759 8600',
  generalEmail: 'info@nkomazisez.co.za',
  investmentEmail: 'invest@nkomazisez.co.za',
  procurementEmail: 'tenders@nkomazisez.co.za',
  physicalAddress: 'Komatipoort Industrial Precinct, N4 Trade Corridor, Mpumalanga, 1340',
  postalAddress: 'PO Box 114, Komatipoort, 1340, South Africa',
  officeHours: 'Monday – Friday: 08:00 – 16:30 (CAT)',
  socialLinkedIn: 'https://www.linkedin.com/company/nkomazi-sez',
  socialFacebook: 'https://www.facebook.com/NkomaziSEZ',
  socialYouTube: 'https://www.youtube.com/@NkomaziSEZ',
  socialTwitter: 'https://x.com/NkomaziSEZ',
  bannerEnabled: true,
  bannerTitle: 'Tender Notice NSEZ/ENG/2026/014',
  bannerText: 'Compulsory site inspection briefing for 33kV dedicated substation is scheduled for 2 December 2026.',
  bannerLink: '/tenders',
  lastUpdated: '2026-11-26',
  updatedBy: 'Sipho Ndlovu'
};

export const INITIAL_USERS: AdminUser[] = [
  {
    id: 'user-01',
    name: 'Sipho Ndlovu',
    email: 'sipho.ndlovu@nkomazisez.gov.za',
    role: 'SUPER_ADMIN',
    department: 'Executive / Board Oversight',
    lastLogin: 'Today at 09:14 AM',
    status: 'ACTIVE'
  },
  {
    id: 'user-02',
    name: 'Thandi Mokoena',
    email: 'thandi.m@nkomazisez.gov.za',
    role: 'STANDARD_ADMIN',
    department: 'Investment Facilitation & Marketing',
    lastLogin: 'Yesterday at 16:40 PM',
    status: 'ACTIVE'
  },
  {
    id: 'user-03',
    name: 'David Ferreira',
    email: 'david.f@nkomazisez.gov.za',
    role: 'STANDARD_ADMIN',
    department: 'Procurement & Tenders Unit',
    lastLogin: '24 Nov 2026, 11:05 AM',
    status: 'ACTIVE'
  }
];

export const INITIAL_OPPORTUNITIES: OpportunityItem[] = [
  {
    id: 'opp-1',
    title: 'Citrus & Subtropical Fruit Processing Plant (Zone 1A)',
    sector: 'Agro-processing',
    investmentValue: 'R 450 Million',
    hectares: '12.5 Ha',
    status: 'ACTIVE',
    location: 'Komatipoort Primary Precinct',
    description: 'High-throughput facility engineered for export-grade packing, concentrate extraction, and cold-storage distribution.',
    dateAdded: '2026-11-10'
  },
  {
    id: 'opp-2',
    title: 'Cross-Border Intermodal Logistics Depot & Bonded Yard',
    sector: 'Logistics & Warehousing',
    investmentValue: 'R 620 Million',
    hectares: '24.0 Ha',
    status: 'ACTIVE',
    location: 'N4 Maputo Corridor Gateway',
    description: 'Direct rail-siding tie-in with bonded container yard, transshipment staging, and customs inspection lanes.',
    dateAdded: '2026-11-12'
  },
  {
    id: 'opp-3',
    title: 'Biomass & Agri-Waste Pellet Fuel Manufacturing',
    sector: 'Green Economy',
    investmentValue: 'R 180 Million',
    hectares: '6.0 Ha',
    status: 'PENDING_APPROVAL',
    location: 'Zone 2 Green Industrial Hub',
    description: 'Industrial plant utilizing bagasse and macadamia shell residues for clean steam and export bio-pellet production.',
    dateAdded: '2026-11-20',
    pendingAction: 'PUBLISH'
  },
  {
    id: 'opp-4',
    title: 'Automotive Component Sub-Assembly Facility',
    sector: 'Manufacturing',
    investmentValue: 'R 310 Million',
    hectares: '9.0 Ha',
    status: 'ACTIVE',
    location: 'Heavy Industrial Zone 1B',
    description: 'Tier-2 component supply plant servicing regional truck corridors and heavy haulage equipment assembly.',
    dateAdded: '2026-11-05'
  }
];

export const INITIAL_TENDERS: TenderItem[] = [
  {
    id: 'ten-1',
    refNo: 'NSEZ/ENG/2026/014',
    title: 'Construction of 33kV Dedicated Substation Tie-In & Internal Reticulation (Phase 1)',
    category: 'Infrastructure & Civils',
    closingDate: '15 Dec 2026',
    status: 'OPEN',
    documentCount: 3,
    dateAdded: '2026-11-01'
  },
  {
    id: 'ten-2',
    refNo: 'NSEZ/SEC/2026/009',
    title: 'Provision of Integrated Biometric Access Control & 24/7 Perimeter CCTV Monitoring',
    category: 'Security & Facilities',
    closingDate: '08 Dec 2026',
    status: 'OPEN',
    documentCount: 2,
    dateAdded: '2026-11-08'
  },
  {
    id: 'ten-3',
    refNo: 'NSEZ/LEGAL/2026/003',
    title: 'Appointment of Panel of Transaction Advisors for 99-Year Head Lease Structuring',
    category: 'Professional Services',
    closingDate: '28 Nov 2026',
    status: 'EVALUATING',
    documentCount: 4,
    dateAdded: '2026-10-25'
  }
];

export const INITIAL_RESOURCES: ResourceItem[] = [
  {
    id: 'res-1',
    title: 'Nkomazi SEZ Investor Master Prospectus (2026/27)',
    category: 'Investment Guides',
    format: 'PDF',
    fileSize: '14.2 MB',
    downloadsCount: 1240,
    status: 'PUBLISHED',
    updatedAt: '2026-11-15',
    description: 'Comprehensive guidelines outlining tax incentives, land parcels, zone benefits, and infrastructure availability.'
  },
  {
    id: 'res-2',
    title: 'Incentives & 12I Corporate Tax Exemption Guidelines',
    category: 'Legal & Regulatory',
    format: 'PDF',
    fileSize: '4.8 MB',
    downloadsCount: 890,
    status: 'PUBLISHED',
    updatedAt: '2026-11-10',
    description: 'Official SARS & dtic policy documentation for Special Economic Zone tax exemptions and allowances.'
  },
  {
    id: 'res-3',
    title: 'Expression of Interest (EOI) Land Allocation Schedule',
    category: 'Application Forms',
    format: 'DOCX',
    fileSize: '1.2 MB',
    downloadsCount: 630,
    status: 'PUBLISHED',
    updatedAt: '2026-11-02',
    description: 'Application template and financial disclosures for qualifying tenant enterprises in the SEZ.'
  }
];

export const INITIAL_APPROVALS: ApprovalRequest[] = [
  {
    id: 'appr-1',
    itemType: 'OPPORTUNITY',
    action: 'DELETE',
    itemId: 'opp-4',
    itemTitle: 'Automotive Component Sub-Assembly Facility',
    requestedBy: 'Thandi Mokoena (Standard Admin)',
    requestedByEmail: 'thandi.m@nkomazisez.gov.za',
    requestedAt: '2026-11-25 10:30',
    reason: 'Investor has relocated application to Phase 2 pipeline. Needs removal from live active listings.',
    status: 'PENDING'
  },
  {
    id: 'appr-2',
    itemType: 'OPPORTUNITY',
    action: 'PUBLISH',
    itemId: 'opp-3',
    itemTitle: 'Biomass & Agri-Waste Pellet Fuel Manufacturing',
    requestedBy: 'Thandi Mokoena (Standard Admin)',
    requestedByEmail: 'thandi.m@nkomazisez.gov.za',
    requestedAt: '2026-11-24 15:12',
    reason: 'Environmental Impact Assessment (EIA) clearance certificate confirmed by DFFE.',
    status: 'PENDING'
  }
];

export const INITIAL_AUDIT_LOGS: AuditLog[] = [
  {
    id: 'log-1',
    userName: 'Sipho Ndlovu',
    userRole: 'SUPER_ADMIN',
    action: 'APPROVED_PUBLICATION',
    target: 'Tender NSEZ/ENG/2026/014',
    timestamp: '2026-11-25 14:15:02',
    ipAddress: '196.25.1.42'
  },
  {
    id: 'log-2',
    userName: 'Thandi Mokoena',
    userRole: 'STANDARD_ADMIN',
    action: 'REQUESTED_DELETION',
    target: 'Opportunity opp-4 (Automotive Component)',
    timestamp: '2026-11-25 10:30:18',
    ipAddress: '196.25.1.88'
  },
  {
    id: 'log-3',
    userName: 'David Ferreira',
    userRole: 'STANDARD_ADMIN',
    action: 'EDITED_TENDER',
    target: 'Tender NSEZ/SEC/2026/009 closing date extended',
    timestamp: '2026-11-24 16:02:44',
    ipAddress: '196.25.1.75'
  }
];

// Helper functions that safely synchronize state with localStorage
export function loadFromStorage<T>(key: string, defaultValue: T): T {
  try {
    const saved = localStorage.getItem(`nkomazi_admin_${key}`);
    if (!saved) return defaultValue;
    const parsed = JSON.parse(saved);
    if (parsed === null || parsed === undefined) return defaultValue;
    if (Array.isArray(defaultValue) && !Array.isArray(parsed)) return defaultValue;
    return parsed as T;
  } catch {
    return defaultValue;
  }
}

export function saveToStorage<T>(key: string, value: T): void {
  try {
    localStorage.setItem(`nkomazi_admin_${key}`, JSON.stringify(value));
  } catch {
    // localStorage might fail in restricted sandboxes
  }
}

export function createAuditLog(
  userName: string,
  userRole: AdminRole,
  action: string,
  target: string,
  detail?: string
): AuditLog {
  return {
    id: `log-${Date.now()}-${Math.floor(Math.random() * 1000)}`,
    userName,
    userRole,
    action,
    target: detail ? `${target}: ${detail}` : target,
    timestamp: new Date().toISOString().replace('T', ' ').substring(0, 19),
    ipAddress: '196.25.1.' + Math.floor(Math.random() * 200 + 10)
  };
}
