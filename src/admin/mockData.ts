import {
  OpportunityItem,
  TenderItem,
  ResourceItem,
  NewsArticleItem,
  CareerItem,
  ApprovalRequest,
  AuditLog,
  AdminUser,
  AdminRole,
  SiteSettings,
  InquiryItem
} from './types';

export const STORAGE_KEYS = {
  USERS: 'users',
  OPPORTUNITIES: 'opportunities',
  TENDERS: 'tenders',
  RESOURCES: 'resources',
  NEWS: 'news_articles',
  CAREERS: 'careers_jobs',
  APPROVALS: 'approvals',
  AUDIT_LOGS: 'audit_logs',
  SETTINGS: 'site_settings',
  INQUIRIES: 'inquiries',
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
  },
  {
    id: 'ten-4',
    refNo: 'NSEZ/ENG/2026/020',
    title: 'Construction of Phase 1 Regional Logistics Access Roads & Gatehouse Complex',
    category: 'Infrastructure & Civils',
    closingDate: '18 Jan 2027',
    status: 'OPEN',
    documentCount: 2,
    dateAdded: '2026-11-26'
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

export const INITIAL_NEWS: NewsArticleItem[] = [
  {
    id: 'news-1',
    category: 'Featured Article',
    title: 'MPUMALANGA NKOMAZI SEZ Occupies One of the Most Strategically Important Economic Positions in South Africa',
    excerpt: 'An in-depth look at how the Nkomazi Special Economic Zone is positioned along the Maputo Development Corridor to drive SADC trade and regional industrial growth.',
    date: '2026-11-18',
    authorOrSource: 'Mpumalanga 247',
    image: 'https://images.unsplash.com/photo-1465447142348-e9952c393450?w=800&q=80',
    link: 'https://mpumalanga247.co.za/nkomazi-sez-occupies-one-of-the-most-strategically-important-economic-positions-in-south-africa/#more',
    published: true
  },
  {
    id: 'news-2',
    category: 'Video Highlights',
    title: 'MPUMALANGA NKOMAZI SEZ Special Broadcast & Milestone Presentation',
    excerpt: 'Watch our corporate video and progress update presentation showing development milestones and active construction sites.',
    date: '2026-11-10',
    authorOrSource: 'Corporate Communications',
    image: 'https://images.unsplash.com/photo-1541888946425-d81bb19240f5?w=800&q=80',
    link: 'https://drive.google.com/file/d/1r3hwIbZZWhrRRm8BerFep7uFmAKBXs4R/view?usp=sharing',
    published: true
  },
  {
    id: 'news-3',
    category: 'Media Statement',
    title: 'MPUMALANGA NKOMAZI SEZ Executive Showcase on Regional Integration',
    excerpt: 'A media statement covering the Mozambique Investment Summit (MIS) highlights, bilateral trade agreements, and border corridor benefits.',
    date: '2026-11-04',
    authorOrSource: 'Office of the CEO',
    image: 'https://images.unsplash.com/photo-1540575861501-7cf05a4b125a?w=800&q=80',
    link: 'https://www.facebook.com/share/v/18va3hETPo/',
    published: true
  }
];

export const INITIAL_CAREERS: CareerItem[] = [
  {
    id: 'job-1',
    title: 'Marketing and Communications Manager',
    category: 'Vacancy',
    department: 'Corporate Services',
    location: 'Mbombela & Komatipoort',
    closingDate: '15 Dec 2026',
    description: 'To develop, implement, and manage internal and external communication and marketing strategies that enhance the organisation\'s visibility, brand reputation, and stakeholder engagement.',
    type: 'Permanent',
    status: 'OPEN',
    pdfUrl: '/careers/vacancies/05-08-2026/marketing and communications manager/736045339_1353480426739712_5508305170083225341_n.jpg'
  },
  {
    id: 'job-2',
    title: 'Senior Civil & Infrastructure Project Engineer',
    category: 'Vacancy',
    department: 'Engineering & Zone Infrastructure',
    location: 'Komatipoort On-Site',
    closingDate: '22 Dec 2026',
    description: 'Provide technical oversight for Phase 1 civils, 33kV substation grid tie-in, bulk water reticulation, and stormwater management systems.',
    type: 'Permanent',
    status: 'OPEN'
  },
  {
    id: 'job-3',
    title: 'Supply Chain & Compliance Officer',
    category: 'Vacancy',
    department: 'Finance & Supply Chain',
    location: 'Mbombela Head Office',
    closingDate: '18 Dec 2026',
    description: 'Oversee PFMA-compliant procurement processes, tender evaluation committees, and supplier database verifications.',
    type: 'Permanent',
    status: 'OPEN'
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

export const INITIAL_INQUIRIES: InquiryItem[] = [
  {
    id: 'inq-1',
    type: 'INVESTOR_LEAD',
    name: 'Johan van der Merwe',
    email: 'johan@maputocoldchain.co.za',
    phone: '+27 82 455 1290',
    company: 'Maputo Cold Chain Logistics (Pty) Ltd',
    sector: 'Logistics & Warehousing',
    subject: 'Expression of Interest: 15-Hectare Cold Storage Facility in Precinct A',
    message: 'We are seeking to expand our regional citrus and avocado export staging operations along the Maputo Development Corridor. We require high-voltage grid connection (minimum 4MVA) and rail siding access. Kindly connect us with your Investment Facilitation Directorate.',
    submittedAt: '2026-11-26 09:14',
    status: 'NEW',
    priority: 'HIGH',
    assignedTo: 'Investment Desk'
  },
  {
    id: 'inq-2',
    type: 'TENDER_QUERY',
    name: 'Sipho Ndlovu',
    email: 'sipho.ndlovu@ingwe-infrastructure.co.za',
    phone: '+27 83 291 0041',
    company: 'Ingwe Infrastructure JV',
    sector: 'Construction & Engineering',
    subject: 'Clarification regarding Tender NSEZ/ENG/2026/014 Substation Specs',
    message: 'Could the procurement committee clarify whether the 33kV switchgear must be SF6-insulated or if vacuum-break with clean air insulation is acceptable as per our eco-green spec submission?',
    submittedAt: '2026-11-25 15:40',
    status: 'IN_REVIEW',
    priority: 'HIGH',
    assignedTo: 'David Ferreira'
  },
  {
    id: 'inq-3',
    type: 'MSME_REGISTRATION',
    name: 'Nomusa Khoza',
    email: 'nomusa@nkomazi-agrofresh.co.za',
    phone: '+27 71 882 3419',
    company: 'Nkomazi AgroFresh Cooperatives',
    sector: 'Agro-processing',
    subject: 'MSME Incubator Hub Application for Smallholder Mango Processing',
    message: 'Our women-led cooperative represents 38 smallholder mango and sub-tropical fruit farmers around Malelane and Komatipoort. We wish to apply for incubation tenancy in Phase 1.',
    submittedAt: '2026-11-24 11:22',
    status: 'NEW',
    priority: 'MEDIUM'
  },
  {
    id: 'inq-4',
    type: 'GENERAL_CONTACT',
    name: 'Dr. Michael Stevens',
    email: 'mstevens@sadc-tradeforum.org',
    phone: '+27 11 789 2000',
    company: 'SADC Trade Integration Forum',
    subject: 'Delegation visit request to Nkomazi SEZ Corridor Logistics Site',
    message: 'We are hosting a delegation of 14 trade ministers and cross-border customs commissioners and would like to request an official guided tour of the dry port site and customs bonded zone.',
    submittedAt: '2026-11-22 14:05',
    status: 'RESPONDED',
    priority: 'LOW',
    assignedTo: 'Corporate Communications',
    internalNotes: 'Tour scheduled and itinerary confirmed for 18 January 2027 with DTI and Provincial Treasury.'
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
    if (typeof window !== 'undefined') {
      window.dispatchEvent(new Event('storage'));
      window.dispatchEvent(new CustomEvent('nkomazi_storage_update', { detail: { key, value } }));
    }
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
