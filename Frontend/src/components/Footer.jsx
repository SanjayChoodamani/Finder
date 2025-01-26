import React from "react";

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

export default Footer;