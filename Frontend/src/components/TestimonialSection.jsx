import React from 'react';
import { Star } from 'lucide-react';

const TestimonialSection = () => {
    return (
        <div className="py-12 bg-[#F3F3E0]" id="testimonials">
            <div className="container mx-auto px-4 sm:px-6 lg:px-8">
                <div className="max-w-3xl mx-auto text-center">
                    {/* Star Rating */}
                    <div className="flex justify-center space-x-1 mb-4">
                        {[...Array(5)].map((_, index) => (
                            <Star 
                                key={index}
                                className="w-6 h-6 text-[#133E87]"
                                fill="#133E87"
                            />
                        ))}
                    </div>
                    
                    {/* Testimonial Text */}
                    <blockquote className="text-lg sm:text-xl text-[#133E87] mb-6">
                        "This platform has transformed the way I access services daily. The
                        convenience and reliability are unmatched!"
                    </blockquote>
                    
                    {/* Author Info */}
                    <div className="flex items-center justify-center space-x-4">
                        <div className="w-12 h-12 rounded-full bg-[#133E87]/10 flex items-center justify-center">
                            <span className="text-[#133E87] font-semibold">JD</span>
                        </div>
                        <div className="text-left">
                            <p className="font-semibold text-[#133E87]">Jane Doe</p>
                            <p className="text-sm text-[#133E87]/80">CEO, Tech Solutions</p>
                        </div>
                        <div className="h-8 w-px bg-[#133E87]/20 mx-4"></div>
                        <img 
                            src="/api/placeholder/100/40"
                            alt="Company Logo"
                            className="h-8"
                        />
                    </div>
                </div>
            </div>
        </div>
    );
};

export default TestimonialSection;