import React from 'react';
import Navigation from '@/Components/shared/Navigation';
import HeroSection from '@/components/landing/HeroSection';
import SpinelSection from '@/components/landing/SpinelSection';
import CollectionsSection from '@/components/landing/CollectionsSection';
import ProvenanceSection from '@/components/landing/ProvenanceSection';
import AudienceSection from '@/components/landing/AudienceSection';
import WaitlistSection from '@/components/landing/WaitlistSection';
import Footer from '@/components/landing/Footer';

export default function Home() {
    return (
        <div className="min-h-screen bg-[#0a0a0a]">
            <Navigation />
            <HeroSection />
            <SpinelSection />
            <CollectionsSection />
            <ProvenanceSection />
            <AudienceSection />
            <WaitlistSection />
            <Footer />
        </div>
    );
}