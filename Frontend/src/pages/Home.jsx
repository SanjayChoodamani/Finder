import React from 'react';
import Navbar from '../components/Navbar';
import Hero from '../components/Hero';
import ServicesSection from '../components/ServiceSection';
import DiscoverSection from '../components/DiscoverSection';
import TestimonialSection from '../components/TestimonialSection';
import FeaturesSection from '../components/FeatureSection';
import FAQSection from '../components/FAQSection';
import Footer from '../components/Footer';

const Home = () => {
    return (
        <div className="min-h-screen bg-[#F3F3E0]">
            <Navbar />
            <Hero />
            <ServicesSection />
            <DiscoverSection />
            <TestimonialSection />
            <FeaturesSection />
            <FAQSection />
            <Footer />
        </div>
    );
};

export default Home;