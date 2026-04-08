
import React from "react";
import "./index.css";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Index from "./pages/Index";
import SlideInput from "./pages/SlideInput";
import Create from "./pages/Create";
import SignIn from "./pages/SignIn";
import SignUp from "./pages/SignUp";
import MyDecks from "./pages/MyDecks";
import Themes from "./pages/Themes";
import InstantCreator from "./pages/InstantCreator";
import SlideInputRefactored from "./pages/SlideInputRefactored";
import NotFound from "./pages/NotFound";
import { AuthProvider } from "./contexts/AuthContext";
import ErrorBoundary from "./components/ErrorBoundary";

// Static pages
import Features from "./pages/Features";
import HowItWorksPage from "./pages/HowItWorksPage";
import PricingPage from "./pages/PricingPage";
import FAQPage from "./pages/FAQPage";
import AboutPage from "./pages/AboutPage";
import BlogPage from "./pages/BlogPage";
import CareersPage from "./pages/CareersPage";
import ContactPage from "./pages/ContactPage";
import PrivacyPolicyPage from "./pages/PrivacyPolicyPage";
import TermsOfServicePage from "./pages/TermsOfServicePage";
import SecurityPage from "./pages/SecurityPage";

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: 1,
      refetchOnWindowFocus: false,
      staleTime: 5 * 60 * 1000,
    },
  },
});

const App = () => {
  return (
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
          <BrowserRouter>
            <ErrorBoundary>
              <Routes>
                <Route path="/" element={<Index />} />
                <Route path="/create" element={<SlideInputRefactored />} />
                <Route path="/slide-input" element={<SlideInputRefactored />} />
                <Route path="/instant-creator" element={<SlideInputRefactored />} />
                <Route path="/sign-in" element={<SignIn />} />
                <Route path="/sign-up" element={<SignUp />} />
                <Route path="/my-decks" element={<MyDecks />} />
                <Route path="/themes" element={<Themes />} />
                <Route path="/features" element={<Features />} />
                <Route path="/how-it-works" element={<HowItWorksPage />} />
                <Route path="/pricing" element={<PricingPage />} />
                <Route path="/faq" element={<FAQPage />} />
                <Route path="/about" element={<AboutPage />} />
                <Route path="/blog" element={<BlogPage />} />
                <Route path="/careers" element={<CareersPage />} />
                <Route path="/contact" element={<ContactPage />} />
                <Route path="/privacy" element={<PrivacyPolicyPage />} />
                <Route path="/terms" element={<TermsOfServicePage />} />
                <Route path="/security" element={<SecurityPage />} />
                <Route path="*" element={<NotFound />} />
              </Routes>
            </ErrorBoundary>
          </BrowserRouter>
      </AuthProvider>
    </QueryClientProvider>
  );
};

export default App;
