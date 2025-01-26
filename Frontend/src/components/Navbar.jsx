import React, { useState, useEffect } from "react";
import { Menu, X, User } from 'lucide-react';
import { LoginModal, RegisterModal } from './AuthModals';

const Navbar = () => {
    const [isOpen, setIsOpen] = useState(false);
    const [showLoginModal, setShowLoginModal] = useState(false);
    const [showRegisterModal, setShowRegisterModal] = useState(false);
    const [activeSection, setActiveSection] = useState('');
    const [user, setUser] = useState(null);

    // Handle smooth scrolling
    const scrollToSection = (sectionId) => {
        const element = document.getElementById(sectionId);
        if (element) {
            const navbarHeight = 80; // Approximate navbar height
            const elementPosition = element.offsetTop - navbarHeight;
            
            window.scrollTo({
                top: elementPosition,
                behavior: "smooth"
            });
            
            setIsOpen(false); // Close mobile menu after clicking
        }
    };

    // Track active section while scrolling
    useEffect(() => {
        const handleScroll = () => {
            const sections = ['hero', 'services', 'discover', 'testimonials', 'features', 'faq'];
            const scrollPosition = window.scrollY + 100; // Offset for navbar

            for (const section of sections) {
                const element = document.getElementById(section);
                if (element) {
                    const { offsetTop, offsetHeight } = element;
                    if (scrollPosition >= offsetTop && scrollPosition < offsetTop + offsetHeight) {
                        setActiveSection(section);
                        break;
                    }
                }
            }
        };

        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    // Check for stored auth token on mount
    useEffect(() => {
        const token = localStorage.getItem('token');
        if (token) {
            fetchUserData(token);
        }
    }, []);

    const fetchUserData = async (token) => {
        try {
            const response = await fetch('http://localhost:5000/api/auth/profile', {
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });
            if (response.ok) {
                const userData = await response.json();
                setUser(userData);
            }
        } catch (error) {
            console.error('Error fetching user data:', error);
        }
    };

    const handleLoginSuccess = (userData) => {
        setUser(userData.user);
        setShowLoginModal(false);
        setShowRegisterModal(false);
    };

    const handleLogout = () => {
        localStorage.removeItem('token');
        localStorage.removeItem('userType');
        setUser(null);
    };

    const navLinks = [
        { name: "Services", section: "services" },
        { name: "How it Works", section: "discover" },
        { name: "Features", section: "features" },
        { name: "Testimonials", section: "testimonials" },
        { name: "FAQ", section: "faq" }
    ];

    const UserMenu = () => (
        <div className="relative group">
            <button className="flex items-center space-x-2 text-[#133E87]">
                <User size={20} />
                <span>{user.name}</span>
            </button>
            <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg hidden group-hover:block">
                <div className="py-1">
                    <button
                        onClick={() => {/* Navigate to profile */}}
                        className="block w-full text-left px-4 py-2 text-sm text-[#133E87] hover:bg-[#133E87]/10"
                    >
                        Profile
                    </button>
                    <button
                        onClick={handleLogout}
                        className="block w-full text-left px-4 py-2 text-sm text-[#133E87] hover:bg-[#133E87]/10"
                    >
                        Logout
                    </button>
                </div>
            </div>
        </div>
    );

    return (
        <>
            <nav className="fixed w-full bg-[#F3F3E0] shadow-lg z-50">
                <div className="container mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex justify-between items-center h-16 sm:h-20">
                        {/* Logo */}
                        <div className="flex-shrink-0">
                            <button 
                                onClick={() => scrollToSection('hero')} 
                                className="text-xl sm:text-2xl font-bold text-[#133E87]"
                            >
                                Logo
                            </button>
                        </div>

                        {/* Desktop Menu */}
                        <div className="hidden md:flex items-center space-x-4 lg:space-x-8">
                            {navLinks.map((link) => (
                                <button
                                    key={link.section}
                                    onClick={() => scrollToSection(link.section)}
                                    className={`text-sm lg:text-base ${
                                        activeSection === link.section 
                                        ? 'text-[#133E87] font-semibold' 
                                        : 'text-[#133E87]/80 hover:text-[#133E87]'
                                    }`}
                                >
                                    {link.name}
                                </button>
                            ))}
                        </div>

                        {/* Auth Buttons */}
                        <div className="hidden md:flex items-center space-x-3 lg:space-x-4">
                            {user ? (
                                <UserMenu />
                            ) : (
                                <>
                                    <button 
                                        onClick={() => setShowLoginModal(true)}
                                        className="text-sm lg:text-base text-[#133E87] hover:text-[#133E87]/80"
                                    >
                                        Login
                                    </button>
                                    <button 
                                        onClick={() => setShowRegisterModal(true)}
                                        className="bg-[#133E87] text-[#F3F3E0] px-4 lg:px-6 py-2 rounded-lg hover:bg-[#133E87]/90 text-sm lg:text-base"
                                    >
                                        Sign Up
                                    </button>
                                </>
                            )}
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
                                {navLinks.map((link) => (
                                    <button
                                        key={link.section}
                                        onClick={() => scrollToSection(link.section)}
                                        className={`block w-full text-left px-3 py-2 text-base ${
                                            activeSection === link.section 
                                            ? 'text-[#133E87] font-semibold' 
                                            : 'text-[#133E87]/80 hover:text-[#133E87]'
                                        }`}
                                    >
                                        {link.name}
                                    </button>
                                ))}
                                {user ? (
                                    <div className="pt-4 space-y-2">
                                        <button
                                            onClick={() => {/* Navigate to profile */}}
                                            className="block w-full text-left px-3 py-2 text-base text-[#133E87] hover:text-[#133E87]/80"
                                        >
                                            Profile
                                        </button>
                                        <button
                                            onClick={handleLogout}
                                            className="block w-full text-left px-3 py-2 text-base text-[#133E87] hover:text-[#133E87]/80"
                                        >
                                            Logout
                                        </button>
                                    </div>
                                ) : (
                                    <div className="pt-4 space-y-2">
                                        <button 
                                            onClick={() => {
                                                setShowLoginModal(true);
                                                setIsOpen(false);
                                            }}
                                            className="block w-full text-left px-3 py-2 text-base text-[#133E87] hover:text-[#133E87]/80"
                                        >
                                            Login
                                        </button>
                                        <button 
                                            onClick={() => {
                                                setShowRegisterModal(true);
                                                setIsOpen(false);
                                            }}
                                            className="block w-full bg-[#133E87] text-[#F3F3E0] px-3 py-2 rounded-lg hover:bg-[#133E87]/90"
                                        >
                                            Sign Up
                                        </button>
                                    </div>
                                )}
                            </div>
                        </div>
                    )}
                </div>
            </nav>

            {/* Auth Modals */}
            <LoginModal
                isOpen={showLoginModal}
                onClose={() => setShowLoginModal(false)}
                onSuccess={handleLoginSuccess}
            />
            <RegisterModal
                isOpen={showRegisterModal}
                onClose={() => setShowRegisterModal(false)}
                onSuccess={handleLoginSuccess}
            />
        </>
    );
};

export default Navbar;