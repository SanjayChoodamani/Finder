import React from 'react';

const DiscoverSection = () => {
    const steps = [
        {
            title: "Follow These Simple Steps to Get Started with Our Services",
            description: "Our platform is designed to connect you with essential services quickly and efficiently.",
            icon: "/api/placeholder/64/64",
            action: "Start"
        },
        {
            title: "Choose Your Desired Service from Our Extensive List of Offerings",
            description: "Browse through our diverse range of services tailored to your unique needs.",
            icon: "/api/placeholder/64/64",
            action: "Select"
        },
        {
            title: "Complete Your Request and Enjoy a Hassle-Free Experience",
            description: "Submit your request, and our team will handle the rest.",
            icon: "/api/placeholder/64/64",
            action: "Submit"
        }
    ];

    return (
        <div className="py-16 bg-[#133E87] text-[#F3F3E0]" id="discover">
            <div className="container mx-auto px-4 sm:px-6 lg:px-8">
                {/* Main Title */}
                <div className="text-center mb-12">
                    <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold mb-4">
                        Discover How Our Platform Simplifies<br />
                        Your Daily Service Needs Effortlessly
                    </h2>
                </div>

                {/* Steps Grid */}
                <div className="grid md:grid-cols-3 gap-8 mt-12">
                    {steps.map((step, index) => (
                        <div 
                            key={index}
                            className="bg-[#F3F3E0] rounded-lg p-6 text-[#133E87]"
                        >
                            <img
                                src={step.icon}
                                alt={`Step ${index + 1}`}
                                className="w-16 h-16 mb-4"
                            />
                            <h3 className="text-xl font-semibold mb-3">
                                {step.title}
                            </h3>
                            <p className="text-[#133E87]/80 mb-4">
                                {step.description}
                            </p>
                            <button className="text-[#133E87] font-semibold hover:text-[#133E87]/80">
                                {step.action} →
                            </button>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default DiscoverSection;