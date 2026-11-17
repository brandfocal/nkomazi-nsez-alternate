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
import { PrivacyPolicyPage } from './components/generated/PrivacyPolicyPage';
import { CookiePolicyPage } from './components/generated/CookiePolicyPage';
import { CookieConsentBanner } from './components/generated/CookieConsentBanner';

let theme: Theme = 'light';

function ScrollToTopOnNavigation() {
  const { pathname, hash } = useLocation();
  useEffect(() => {
    if (!hash) {
      window.scrollTo(0, 0);
    } else {
      const targetId = hash.substring(1);
      const scroll = () => {
        const element = document.getElementById(targetId);
        if (element) {
          element.scrollIntoView({ behavior: 'smooth' });
        }
      };
      scroll();
      const timer = setTimeout(scroll, 120);
      return () => clearTimeout(timer);
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
        <Route path="/privacy-policy" element={<PrivacyPolicyPage />} />
        <Route path="/cookie-policy" element={<CookiePolicyPage />} />
        <Route path="/finance" element={<AboutNSEZPage />} />
        <Route path="/office-of-the-ceo" element={<AboutNSEZPage />} />
        <Route path="/our-board" element={<AboutNSEZPage />} />
      </Routes>
      <CookieConsentBanner />
    </BrowserRouter>
  );
}

export default App;