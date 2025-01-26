import { useState } from 'react';
import { ChevronDown } from 'lucide-react';

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
    <div className="bg-[#F3F3E0] py-12 sm:py-16 lg:py-20" id='faq'>
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

export default FAQSection;