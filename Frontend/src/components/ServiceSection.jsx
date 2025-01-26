import React from 'react';
import mapsImage from '../assets/images/maps.png';

const ServicesSection = () => (
    <div className="py-12 sm:py-16 lg:py-20 bg-[#F3F3E0]" id="services">
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
                        src={mapsImage}
                        alt="Services Map"
                        className="rounded-lg shadow-xl w-full"
                    />
                </div>
            </div>
        </div>
    </div>
);

export default ServicesSection;