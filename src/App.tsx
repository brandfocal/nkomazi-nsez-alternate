import { BrowserRouter, Routes, Route, useLocation } from 'react-router-dom';
import { useMemo, useEffect } from 'react';
import { Container, Theme } from './settings/types';
import { AirCargoPage } from './components/generated/AirCargoPage';
import { Home2Page } from './components/generated/Home2Page';
import { Homev2Page } from './components/generated/Homev2Page';
import { InvestorHubPage } from './components/generated/InvestorHubPage';
import { EnterpriseHubPage } from './components/generated/EnterpriseHubPage';
import { StakeholderEngagementPage } from './components/generated/StakeholderEngagementPage';
import { CompliancePortalPage } from './components/generated/CompliancePortalPage';
import { ContactPage } from './components/generated/ContactPage';
import { SectorsPage } from './components/generated/NSEZSectorsPage';
import { TendersPage } from './components/generated/TendersPage';
import { CareersPage } from './components/generated/CareersPage';
import { NewsAndMediaPage } from './components/generated/NewsAndMediaPage';
import { AboutNSEZPage } from './components/generated/AboutNSEZPage';

let theme: Theme = 'light';

function ScrollToTopOnNavigation() {
  const { pathname, hash } = useLocation();
  useEffect(() => {
    if (!hash) {
      window.scrollTo(0, 0);
    } else {
      const element = document.getElementById(hash.substring(1));
      if (element) {
        element.scrollIntoView({ behavior: 'smooth' });
      }
    }
  }, [pathname, hash]);
  return null;
}

function App() {
  useEffect(() => {
    if (theme === 'dark') {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, []);

  return (
    <BrowserRouter>
      <ScrollToTopOnNavigation />
      <Routes>
        <Route path="/" element={<Homev2Page />} />
        <Route path="/air-cargo" element={<AirCargoPage />} />
        <Route path="/home2" element={<Home2Page />} />
        <Route path="/homev2" element={<Homev2Page />} />
        <Route path="/investor-hub" element={<InvestorHubPage />} />
        <Route path="/enterprise-hub" element={<EnterpriseHubPage />} />
        <Route path="/about-us" element={<AboutNSEZPage />} />
        <Route path="/sectors" element={<SectorsPage />} />
        <Route path="/tenders" element={<TendersPage />} />
        <Route path="/careers" element={<CareersPage />} />
        <Route path="/stakeholder-engagement" element={<StakeholderEngagementPage />} />
        <Route path="/news-media" element={<NewsAndMediaPage />} />
        <Route path="/compliance-portal" element={<CompliancePortalPage />} />
        <Route path="/contact" element={<ContactPage />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;