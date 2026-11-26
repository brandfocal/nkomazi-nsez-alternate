export type AdminRole = 'SUPER_ADMIN' | 'STANDARD_ADMIN';

export interface AdminUser {
  id: string;
  name: string;
  email: string;
  role: AdminRole;
  department: string;
  avatarUrl?: string;
  lastLogin: string;
  status?: 'ACTIVE' | 'INACTIVE';
}

export interface OpportunityItem {
  id: string;
  title: string;
  sector: 'Agro-processing' | 'Logistics & Warehousing' | 'Manufacturing' | 'Green Economy' | 'Commercial';
  investmentValue: string;
  hectares: string;
  status: 'ACTIVE' | 'PENDING_APPROVAL' | 'DRAFT';
  location: string;
  description: string;
  dateAdded: string;
  pendingAction?: 'DELETE' | 'PUBLISH';
}

export interface TenderItem {
  id: string;
  refNo: string;
  title: string;
  category: 'Infrastructure & Civils' | 'Security & Facilities' | 'Professional Services' | 'ICT & Technology' | 'Agriculture';
  closingDate: string;
  status: 'OPEN' | 'EVALUATING' | 'CLOSED' | 'PENDING_APPROVAL';
  documentCount: number;
  dateAdded: string;
  pendingAction?: 'DELETE' | 'PUBLISH';
}

export interface ResourceItem {
  id: string;
  title: string;
  category: 'Investment Guides' | 'Legal & Regulatory' | 'Sector Brochures' | 'Application Forms';
  format: 'PDF' | 'DOCX' | 'XLSX';
  fileSize: string;
  downloadsCount: number;
  status: 'PUBLISHED' | 'PENDING_APPROVAL' | 'ARCHIVED';
  updatedAt: string;
  description?: string;
  pendingAction?: 'DELETE' | 'PUBLISH';
}

export interface NewsArticleItem {
  id: string;
  category: 'Featured Article' | 'Press Release' | 'Media Statement' | 'Video Highlights' | 'Event';
  title: string;
  excerpt: string;
  date: string;
  authorOrSource: string;
  image: string;
  link?: string;
  published: boolean;
  pendingAction?: 'DELETE' | 'PUBLISH';
}

export interface CareerItem {
  id: string;
  title: string;
  category: 'Vacancy' | 'Learnership' | 'Graduate Programme' | 'Internship';
  department: string;
  location: string;
  closingDate: string;
  description: string;
  type: 'Permanent' | 'Contract' | 'Full-Time';
  status: 'OPEN' | 'CLOSED' | 'PENDING_APPROVAL';
  pdfUrl?: string;
  pendingAction?: 'DELETE' | 'PUBLISH';
}

export interface ApprovalRequest {
  id: string;
  itemType: 'OPPORTUNITY' | 'TENDER' | 'RESOURCE' | 'NEWS' | 'CAREER';
  action: 'DELETE' | 'PUBLISH';
  itemId: string;
  itemTitle: string;
  requestedBy: string;
  requestedByEmail: string;
  requestedAt: string;
  reason: string;
  status: 'PENDING' | 'APPROVED' | 'REJECTED';
  reviewedBy?: string;
  reviewedAt?: string;
  reviewNotes?: string;
}

export interface AuditLog {
  id: string;
  userName: string;
  userRole: AdminRole;
  action: string;
  target: string;
  timestamp: string;
  ipAddress: string;
}

export interface InquiryItem {
  id: string;
  type: 'INVESTOR_LEAD' | 'TENDER_QUERY' | 'GENERAL_CONTACT' | 'MSME_REGISTRATION' | 'STAKEHOLDER';
  name: string;
  email: string;
  phone?: string;
  company?: string;
  sector?: string;
  subject: string;
  message: string;
  submittedAt: string;
  status: 'NEW' | 'IN_REVIEW' | 'RESPONDED' | 'ARCHIVED';
  priority: 'HIGH' | 'MEDIUM' | 'LOW';
  assignedTo?: string;
  internalNotes?: string;
}

export interface SiteSettings {
  contactPhone: string;
  generalEmail: string;
  investmentEmail: string;
  procurementEmail: string;
  physicalAddress: string;
  postalAddress: string;
  officeHours: string;
  socialLinkedIn: string;
  socialFacebook: string;
  socialYouTube: string;
  socialTwitter: string;
  bannerEnabled: boolean;
  bannerTitle?: string;
  bannerText: string;
  bannerLink?: string;
  lastUpdated: string;
  updatedBy?: string;
}
