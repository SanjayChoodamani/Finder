import React from 'react';
import heroImage from '../assets/images/hero.png';

const Hero = () => (
    <div className="relative min-h-screen" id="hero">
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

export default Hero;
