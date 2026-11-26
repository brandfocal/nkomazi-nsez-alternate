import bcrypt from 'bcryptjs';
import { prisma } from './db.js';

async function seed() {
  console.log('🌱 Seeding Mpumalanga Nkomazi SEZ database...');

  // 1. Seed Administrators
  const hashedSuperPassword = await bcrypt.hash('Admin@2026!', 10);
  const hashedStdPassword = await bcrypt.hash('Staff@2026!', 10);

  const sipho = await prisma.user.upsert({
    where: { email: 'sipho.ndlovu@nkomazisez.gov.za' },
    update: {},
    create: {
      email: 'sipho.ndlovu@nkomazisez.gov.za',
      password: hashedSuperPassword,
      name: 'Dr. Sipho Ndlovu',
      department: 'Executive Governance & Investments',
      role: 'SUPER_ADMIN',
      status: 'ACTIVE'
    }
  });

  const thandi = await prisma.user.upsert({
    where: { email: 'thandi.m@nkomazisez.gov.za' },
    update: {},
    create: {
      email: 'thandi.m@nkomazisez.gov.za',
      password: hashedStdPassword,
      name: 'Thandi Modise',
      department: 'Procurement & Operations',
      role: 'STANDARD_ADMIN',
      status: 'ACTIVE'
    }
  });

  console.log(`✅ Provisioned Admins: ${sipho.name} (Super), ${thandi.name} (Standard)`);

  // 2. Seed Initial Tenders
  const tender = await prisma.tender.upsert({
    where: { refNo: 'NSEZ/ENG/2026/020' },
    update: {},
    create: {
      refNo: 'NSEZ/ENG/2026/020',
      title: 'Civil & Earthworks Infrastructure Package - Phase 2B Logistics Gateway',
      category: 'Infrastructure & Civil Engineering',
      closingDate: '2026-04-15',
      briefingDate: '2026-03-10 10:00 AM (Site Office, Komatipoort)',
      status: 'OPEN',
      documentUrl: '/uploads/NSEZ-ENG-2026-020-Tender-Dossier.pdf',
      fileSize: '4.8 MB',
      queriesEmail: 'tenders@nkomazisez.co.za'
    }
  });

  console.log(`✅ Seeded Tender: ${tender.refNo}`);

  // 3. Seed Initial Investment Listings
  const agroListing = await prisma.investmentListing.create({
    data: {
      title: 'Nkomazi Agro-Processing & Cold-Chain Superhub',
      sector: 'Agro-Processing & Cold Chain',
      value: 'R 850 Million',
      description: 'High-throughput citrus and tropical fruit cold storage, sorting, and export packaging facility directly adjacent to the Maputo Development Corridor.',
      location: 'Sector 3A - Logistics & Processing Precinct',
      roi: '18.4% Projected IRR',
      impact: '1,200 Direct Jobs, 3,400 Outgrower Beneficiaries',
      stage: 'Feasibility Complete - Shovel Ready',
      imageUrl: '/nsez-industrial.jpg',
      status: 'PUBLISHED'
    }
  }).catch(() => null);

  if (agroListing) console.log(`✅ Seeded Investment Opportunity: ${agroListing.title}`);

  // 4. Initial Site Settings
  await prisma.siteSettings.create({
    data: {
      primaryPhone: '+27 (0) 13 752 4000',
      primaryEmail: 'info@nkomazisez.co.za',
      physicalAddress: 'Nkomazi SEZ Precinct, Komatipoort / Lebombo Border Corridor, Mpumalanga, 1340',
      officeHours: 'Monday – Friday: 08:00 – 16:30 CAT',
      linkedinUrl: 'https://linkedin.com/company/nkomazi-sez',
      twitterUrl: 'https://x.com/NkomaziSEZ',
      alertBannerText: 'Official Notice: RFP NSEZ/ENG/2026/020 is open for submission.',
      alertBannerActive: true
    }
  }).catch(() => null);

  console.log('🎉 Database seeding complete!');
}

seed()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
