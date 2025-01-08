import { useState } from 'react';
import { ChevronDown, Menu, X } from 'lucide-react';
import heroImage from '../assets/images/hero.png';

const Navbar = () => {
    const [isOpen, setIsOpen] = useState(false);

    return (
        <nav className="fixed w-full bg-[#F3F3E0] shadow-lg z-50">
            <div className="container mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex justify-between items-center h-16 sm:h-20">
                    {/* Logo */}
                    <div className="flex-shrink-0">
                        <a href="/" className="text-xl sm:text-2xl font-bold text-[#133E87]">
                            Logo
                        </a>
                    </div>

                    {/* Desktop Menu */}
                    <div className="hidden md:flex items-center space-x-4 lg:space-x-8">
                        <a href="#" className="text-sm lg:text-base text-[#133E87] hover:text-[#133E87]/80">How it Works</a>
                        <a href="#" className="text-sm lg:text-base text-[#133E87] hover:text-[#133E87]/80">Services</a>
                        <a href="#" className="text-sm lg:text-base text-[#133E87] hover:text-[#133E87]/80">Company</a>
                        <a href="#" className="text-sm lg:text-base text-[#133E87] hover:text-[#133E87]/80">Resources</a>
                    </div>

                    {/* Auth Buttons */}
                    <div className="hidden md:flex items-center space-x-3 lg:space-x-4">
                        <button className="text-sm lg:text-base text-[#133E87] hover:text-[#133E87]/80">
                            Login
                        </button>
                        <button className="bg-[#133E87] text-[#F3F3E0] px-4 lg:px-6 py-2 rounded-lg hover:bg-[#133E87]/90 text-sm lg:text-base">
                            Sign Up
                        </button>
                    </div>

                    {/* Mobile Menu Button */}
                    <div className="md:hidden">
                        <button
                            onClick={() => setIsOpen(!isOpen)}
                            className="text-[#133E87] hover:text-[#133E87]/80 p-2"
                        >
                            {isOpen ? <X size={24} /> : <Menu size={24} />}
                        </button>
                    </div>
                </div>

                {/* Mobile Menu */}
                {isOpen && (
                    <div className="md:hidden absolute top-16 left-0 right-0 bg-[#F3F3E0] border-b border-[#CBDCEB]">
                        <div className="px-4 pt-2 pb-4 space-y-1">
                            <a href="#" className="block px-3 py-2 text-base text-[#133E87] hover:text-[#133E87]/80">
                                How it Works
                            </a>
                            <a href="#" className="block px-3 py-2 text-base text-[#133E87] hover:text-[#133E87]/80">
                                Services
                            </a>
                            <a href="#" className="block px-3 py-2 text-base text-[#133E87] hover:text-[#133E87]/80">
                                Company
                            </a>
                            <a href="#" className="block px-3 py-2 text-base text-[#133E87] hover:text-[#133E87]/80">
                                Resources
                            </a>
                            <div className="pt-4 space-y-2">
                                <button className="block w-full text-left px-3 py-2 text-base text-[#133E87] hover:text-[#133E87]/80">
                                    Login
                                </button>
                                <button className="block w-full bg-[#133E87] text-[#F3F3E0] px-3 py-2 rounded-lg hover:bg-[#133E87]/90">
                                    Sign Up
                                </button>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </nav>
    );
};

// Hero Section Component

const Hero = () => (
    <div className="relative min-h-screen">
        {/* Background image container */}
        <div
            className="absolute inset-0 bg-cover bg-center bg-no-repeat"
            style={{
                backgroundImage: `url(${heroImage})`,  
                backgroundPosition: "50% 50%"
            }}
        />

        {/* Overlay */}
        <div className="absolute inset-0 ">
            {/* Content */}
            <div className="container mx-auto px-4 sm:px-6 lg:px-8">
                <div className="min-h-screen flex items-center pt-16 sm:pt-20">
                    <div className="max-w-xl md:max-w-2xl lg:max-w-3xl text-[#F3F3E0]">
                        <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold mb-4 sm:mb-6">
                            Empowering Your Daily Services with Ease
                        </h1>
                        <p className="text-lg sm:text-xl lg:text-2xl mb-6 sm:mb-8">
                            Connect with reliable service providers for all your daily needs through our intuitive platform.
                        </p>
                        <button className="w-full sm:w-auto bg-[#F3F3E0] text-[#133E87] px-6 sm:px-8 py-3 rounded-lg font-semibold text-base sm:text-lg hover:bg-[#CBDCEB] transition-colors duration-300">
                            Get Started
                        </button>
                    </div>
                </div>
            </div>
        </div>
    </div>
);

// Services Section Component
const ServicesSection = () => (
    <div className="py-12 sm:py-16 lg:py-20 bg-[#F3F3E0]">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid md:grid-cols-2 gap-8 lg:gap-12 items-center">
                <div>
                    <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold mb-4 sm:mb-6 text-[#133E87]">
                        Unlock Everyday Services for Everyone
                    </h2>
                    <p className="text-[#133E87]/80 text-base sm:text-lg mb-6 sm:mb-8">
                        Our platform connects users with a variety of service providers that match your specific needs and budget.
                    </p>
                    <button className="w-full sm:w-auto bg-[#133E87] text-[#F3F3E0] px-6 py-2 rounded-lg text-base sm:text-lg hover:bg-[#133E87]/90">
                        Discover More
                    </button>
                </div>
                <div className="relative mt-8 md:mt-0">
                    <img
                        src="/api/placeholder/600/400"
                        alt="Services Map"
                        className="rounded-lg shadow-xl w-full"
                    />
                </div>
            </div>
        </div>
    </div>
);

// Feature Card Component
const FeatureCard = ({ icon, title, description }) => (
    <div className="bg-[#F3F3E0] p-6 sm:p-8 rounded-lg shadow-lg h-full border border-[#CBDCEB]">
        <div className="mb-4 sm:mb-6">{icon}</div>
        <h3 className="text-lg sm:text-xl font-semibold mb-2 sm:mb-3 text-[#133E87]">{title}</h3>
        <p className="text-[#133E87]/80 text-base">{description}</p>
        <button className="mt-4 text-[#133E87] hover:text-[#133E87]/80">Learn more</button>
    </div>
);

// Features Section Component
const FeaturesSection = () => (
    <div className="bg-[#CBDCEB]/30 py-12 sm:py-16 lg:py-20">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
            <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-center mb-8 sm:mb-12 text-[#133E87]">
                Discover the features that make our platform stand out for you
            </h2>
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
                <FeatureCard
                    icon={<div className="w-12 h-12 sm:w-16 sm:h-16 bg-[#CBDCEB] rounded-full" />}
                    title="Affordable Services"
                    description="Find services that match your budget perfectly with our transparent pricing system."
                />
                <FeatureCard
                    icon={<div className="w-12 h-12 sm:w-16 sm:h-16 bg-[#CBDCEB] rounded-full" />}
                    title="Seamless Experience"
                    description="Book and manage services with our intuitive interface designed for simplicity."
                />
                <FeatureCard
                    icon={<div className="w-12 h-12 sm:w-16 sm:h-16 bg-[#CBDCEB] rounded-full" />}
                    title="Quality Assured"
                    description="Every service provider is verified and rated to ensure the best experience."
                />
            </div>
        </div>
    </div>
);

// FAQ Component
const FAQ = ({ question, answer }) => {
    const [isOpen, setIsOpen] = useState(false);

    return (
        <div className="border-b border-[#CBDCEB]">
            <button
                className="flex justify-between items-center w-full text-left py-4"
                onClick={() => setIsOpen(!isOpen)}
            >
                <span className="text-base sm:text-lg font-semibold text-[#133E87]">{question}</span>
                <ChevronDown className={`w-5 h-5 text-[#133E87] transform transition-transform ${isOpen ? 'rotate-180' : ''}`} />
            </button>
            <div className={`mt-2 text-[#133E87]/80 text-base pb-4 ${isOpen ? 'block' : 'hidden'}`}>
                {answer}
            </div>
        </div>
    );
};

// FAQ Section Component
const FAQSection = () => (
    <div className="bg-[#F3F3E0] py-12 sm:py-16 lg:py-20">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
            <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-center mb-8 sm:mb-12 text-[#133E87]">FAQs</h2>
            <div className="max-w-2xl lg:max-w-3xl mx-auto">
                <FAQ
                    question="What services do we offer?"
                    answer="We offer a wide range of daily services including home maintenance, cleaning, and professional services."
                />
                <FAQ
                    question="How do we work?"
                    answer="Simply browse our services, select your needed service, and book a time slot that works for you."
                />
                <FAQ
                    question="What's the cost?"
                    answer="Prices vary by service and provider. You can view detailed pricing before booking."
                />
            </div>
        </div>
    </div>
);

// Footer Component
const Footer = () => (
    <footer className="bg-[#133E87] text-[#F3F3E0] py-12 sm:py-16">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
                <div>
                    <h3 className="font-bold text-lg mb-4">Company</h3>
                    <ul className="space-y-2">
                        <li><a href="#" className="hover:text-[#CBDCEB]">About Us</a></li>
                        <li><a href="#" className="hover:text-[#CBDCEB]">Careers</a></li>
                        <li><a href="#" className="hover:text-[#CBDCEB]">Contact</a></li>
                    </ul>
                </div>
                <div>
                    <h3 className="font-bold text-lg mb-4">Services</h3>
                    <ul className="space-y-2">
                        <li><a href="#" className="hover:text-[#CBDCEB]">Home Services</a></li>
                        <li><a href="#" className="hover:text-[#CBDCEB]">Professional Services</a></li>
                        <li><a href="#" className="hover:text-[#CBDCEB]">Business Services</a></li>
                    </ul>
                </div>
                <div>
                    <h3 className="font-bold text-lg mb-4">Legal</h3>
                    <ul className="space-y-2">
                        <li><a href="#" className="hover:text-[#CBDCEB]">Privacy Policy</a></li>
                        <li><a href="#" className="hover:text-[#CBDCEB]">Terms of Service</a></li>
                    </ul>
                </div>
                <div className="sm:col-span-2 lg:col-span-1">
                    <h3 className="font-bold text-lg mb-4">Newsletter</h3>
                    <p className="mb-4">Subscribe to our newsletter for updates</p>
                    <div className="flex flex-col sm:flex-row gap-2">
                        <input
                            type="email"
                            placeholder="Enter your email"
                            className="px-4 py-2 rounded-lg text-[#133E87] bg-[#F3F3E0] flex-grow"
                        />
                        <button className="bg-[#CBDCEB] text-[#133E87] px-4 py-2 rounded-lg hover:bg-[#CBDCEB]/90 whitespace-nowrap font-semibold">
                            Subscribe
                        </button>
                    </div>
                </div>
            </div>
        </div>
    </footer>
);

// Main Home Component
const Home = () => {
    return (
        <div className="min-h-screen bg-[#F3F3E0]">
            <Navbar />
            <Hero />
            <ServicesSection />
            <FeaturesSection />
            <FAQSection />
            <Footer />
        </div>
    );
};

export default Home;