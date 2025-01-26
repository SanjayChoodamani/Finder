import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { X, Mail, Lock, User, Phone, MapPin, Briefcase, Calendar, Map, Eye, EyeOff } from 'lucide-react';

// Shared Form Components
const FormInput = ({ icon: Icon, label, error, type = "text", ...props }) => {
    const [showPassword, setShowPassword] = useState(false);
    const isPassword = type === "password";

    return (
        <div className="relative">
            <label className="block text-[#133E87] mb-2 font-medium text-sm">
                {label}
            </label>
            <div className="relative">
                <div className="absolute left-3 top-1/2 -translate-y-1/2 text-[#133E87]/50">
                    <Icon size={18} />
                </div>
                <input
                    {...props}
                    type={isPassword ? (showPassword ? "text" : "password") : type}
                    className={`w-full pl-10 pr-${isPassword ? '10' : '4'} py-3 bg-white/50 border ${
                        error ? 'border-red-500' : 'border-[#133E87]/20'
                    } rounded-lg focus:outline-none focus:border-[#133E87] focus:ring-2 focus:ring-[#133E87]/10 transition-all duration-200`}
                />
                {isPassword && (
                    <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className="absolute right-3 top-1/2 -translate-y-1/2 text-[#133E87]/50 hover:text-[#133E87] transition-colors"
                    >
                        {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                    </button>
                )}
            </div>
            {error && (
                <p className="mt-1 text-red-500 text-sm">{error}</p>
            )}
        </div>
    );
};

const FormTextArea = ({ icon: Icon, label, error, ...props }) => (
    <div className="relative">
        <label className="block text-[#133E87] mb-2 font-medium text-sm">
            {label}
        </label>
        <div className="relative">
            <div className="absolute left-3 top-4 text-[#133E87]/50">
                <Icon size={18} />
            </div>
            <textarea
                {...props}
                className={`w-full pl-10 pr-4 py-3 bg-white/50 border ${
                    error ? 'border-red-500' : 'border-[#133E87]/20'
                } rounded-lg focus:outline-none focus:border-[#133E87] focus:ring-2 focus:ring-[#133E87]/10 transition-all duration-200 min-h-[100px] resize-none`}
            />
        </div>
        {error && (
            <p className="mt-1 text-red-500 text-sm">{error}</p>
        )}
    </div>
);

// Login Modal Component
export const LoginModal = ({ isOpen, onClose }) => {
    const navigate = useNavigate();
    const [formData, setFormData] = useState({
        email: '',
        password: ''
    });
    const [error, setError] = useState('');
    const [isLoading, setIsLoading] = useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsLoading(true);
        setError('');

        try {
            const response = await fetch('http://localhost:5000/api/auth/login', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(formData),
            });

            const data = await response.json();
            
            if (response.ok) {
                // Store auth data
                localStorage.setItem('token', data.token);
                localStorage.setItem('userType', data.user.userType);
                localStorage.setItem('userData', JSON.stringify(data.user));

                // Close modal
                onClose();

                // Navigate based on user type
                if (data.user.userType === 'client') {
                    navigate('/client/dashboard');
                } else if (data.user.userType === 'worker') {
                    navigate('/worker/dashboard');
                }
            } else {
                setError(data.message || 'Login failed');
            }
        } catch (err) {
            setError('An error occurred. Please try again.');
        } finally {
            setIsLoading(false);
        }
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-50">
            <div 
                className="absolute inset-0 bg-black/30 backdrop-blur-sm"
                onClick={onClose}
            />
            
            <div className="fixed inset-0 flex items-center justify-center p-4 sm:p-6">
                <div className="bg-[#F3F3E0] rounded-2xl shadow-2xl w-full max-w-md mx-auto overflow-hidden relative">
                    {/* Design elements */}
                    <div className="absolute top-0 left-0 w-full h-2 bg-gradient-to-r from-[#133E87] to-[#133E87]/70" />
                    
                    {/* Close button */}
                    <button
                        onClick={onClose}
                        className="absolute top-4 right-4 text-[#133E87] hover:text-[#133E87]/80 p-2 rounded-full hover:bg-[#133E87]/10 transition-all duration-200"
                    >
                        <X size={20} />
                    </button>

                    {/* Content */}
                    <div className="p-8">
                        <h2 className="text-3xl font-bold text-[#133E87] mb-2">Welcome Back</h2>
                        <p className="text-[#133E87]/70 mb-8">Please sign in to continue</p>
                        
                        {error && (
                            <div className="bg-red-100/80 border border-red-200 text-red-700 px-4 py-3 rounded-lg mb-6">
                                <span className="text-sm">{error}</span>
                            </div>
                        )}
                        
                        <form onSubmit={handleSubmit} className="space-y-6">
                            <div>
                                <label className="block text-[#133E87] mb-2 font-medium text-sm">
                                    Email Address
                                </label>
                                <div className="relative">
                                    <div className="absolute left-3 top-1/2 -translate-y-1/2 text-[#133E87]/50">
                                        <Mail size={18} />
                                    </div>
                                    <input
                                        type="email"
                                        value={formData.email}
                                        onChange={(e) => setFormData({...formData, email: e.target.value})}
                                        className="w-full pl-10 pr-4 py-3 bg-white/50 border border-[#133E87]/20 rounded-lg focus:outline-none focus:border-[#133E87] focus:ring-2 focus:ring-[#133E87]/10 transition-all duration-200"
                                        placeholder="your@email.com"
                                        required
                                    />
                                </div>
                            </div>
                            
                            <div>
                                <label className="block text-[#133E87] mb-2 font-medium text-sm">
                                    Password
                                </label>
                                <div className="relative">
                                    <div className="absolute left-3 top-1/2 -translate-y-1/2 text-[#133E87]/50">
                                        <Lock size={18} />
                                    </div>
                                    <input
                                        type="password"
                                        value={formData.password}
                                        onChange={(e) => setFormData({...formData, password: e.target.value})}
                                        className="w-full pl-10 pr-4 py-3 bg-white/50 border border-[#133E87]/20 rounded-lg focus:outline-none focus:border-[#133E87] focus:ring-2 focus:ring-[#133E87]/10 transition-all duration-200"
                                        placeholder="••••••••"
                                        required
                                    />
                                </div>
                            </div>
                            
                            <button
                                type="submit"
                                disabled={isLoading}
                                className="w-full bg-[#133E87] text-[#F3F3E0] py-3 rounded-lg hover:bg-[#133E87]/90 transition-all duration-200 font-medium relative overflow-hidden group disabled:opacity-70"
                            >
                                <span className="relative z-10">
                                    {isLoading ? 'Signing in...' : 'Sign In'}
                                </span>
                                <div className="absolute inset-0 bg-gradient-to-r from-[#133E87]/0 via-[#F3F3E0]/10 to-[#133E87]/0 transform translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-1000" />
                            </button>
                        </form>
                    </div>
                </div>
            </div>
        </div>
    );
};


// Registration Modal Component
export const RegisterModal = ({ isOpen, onClose, onSuccess }) => {
    const navigate = useNavigate();
    const [userType, setUserType] = useState('client');
    const [currentStep, setCurrentStep] = useState(1);
    const [isLoading, setIsLoading] = useState(false);
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        password: '',
        confirmPassword: '',
        phone: '',
        address: '',
        skills: '',
        experience: '',
        serviceArea: ''
    });
    const [errors, setErrors] = useState({});

    const totalSteps = userType === 'worker' ? 3 : 2;

    const validateStep = (step) => {
        const newErrors = {};
        
        if (step === 1) {
            if (!formData.name) newErrors.name = 'Name is required';
            if (!formData.email) newErrors.email = 'Email is required';
            if (!/\S+@\S+\.\S+/.test(formData.email)) newErrors.email = 'Invalid email format';
        }
        
        if (step === 2) {
            if (!formData.password) newErrors.password = 'Password is required';
            if (formData.password.length < 6) newErrors.password = 'Password must be at least 6 characters';
            if (formData.password !== formData.confirmPassword) newErrors.confirmPassword = 'Passwords do not match';
            if (!formData.phone) newErrors.phone = 'Phone number is required';
        }
        
        if (step === 3 && userType === 'worker') {
            if (!formData.skills) newErrors.skills = 'Skills are required';
            if (!formData.experience) newErrors.experience = 'Experience is required';
            if (!formData.serviceArea) newErrors.serviceArea = 'Service area is required';
        }
        
        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!validateStep(currentStep)) return;

        if (currentStep < totalSteps) {
            setCurrentStep(prev => prev + 1);
            return;
        }

        setIsLoading(true);
        try {
            const response = await fetch('http://localhost:5000/api/auth/register', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    ...formData,
                    userType
                }),
            });

            const data = await response.json();
            
            if (response.ok) {
                // Store the token in localStorage
                localStorage.setItem('token', data.token);
                localStorage.setItem('userType', userType);
                
                // Call onSuccess with the data
                if (onSuccess) {
                    onSuccess(data);
                }
                
                // Close the modal
                onClose();
                
                // Navigate to the appropriate dashboard based on userType
                const dashboardPath = userType === 'client' ? '/client/dashboard' : '/worker/dashboard';
                navigate(dashboardPath, { replace: true });
                
                // Force a page refresh to ensure proper state update
                window.location.reload();
            } else {
                setErrors({ submit: data.message || 'Registration failed' });
            }
        } catch (err) {
            console.error('Registration error:', err);
            setErrors({ submit: 'An error occurred. Please try again.' });
        } finally {
            setIsLoading(false);
        }
    };

    // Progress indicator
    const ProgressBar = () => (
        <div className="flex space-x-2 mb-8">
            {[...Array(totalSteps)].map((_, index) => (
                <div
                    key={index}
                    className={`h-1 rounded-full flex-1 transition-all duration-300 ${
                        index + 1 <= currentStep ? 'bg-[#133E87]' : 'bg-[#133E87]/20'
                    }`}
                />
            ))}
        </div>
    );

    const renderStepContent = () => {
        switch (currentStep) {
            case 1:
                return (
                    <div className="space-y-6">
                        <div className="flex space-x-4 mb-8">
                            <button
                                type="button"
                                onClick={() => setUserType('client')}
                                className={`flex-1 py-4 rounded-lg transition-all duration-200 relative overflow-hidden group ${
                                    userType === 'client'
                                        ? 'bg-[#133E87] text-[#F3F3E0]'
                                        : 'bg-[#133E87]/10 text-[#133E87] hover:bg-[#133E87]/20'
                                }`}
                            >
                                <span className="relative z-10 font-medium">Client</span>
                                {userType === 'client' && (
                                    <div className="absolute inset-0 bg-gradient-to-r from-[#133E87]/0 via-[#F3F3E0]/10 to-[#133E87]/0 animate-shimmer" />
                                )}
                            </button>
                            <button
                                type="button"
                                onClick={() => setUserType('worker')}
                                className={`flex-1 py-4 rounded-lg transition-all duration-200 relative overflow-hidden group ${
                                    userType === 'worker'
                                        ? 'bg-[#133E87] text-[#F3F3E0]'
                                        : 'bg-[#133E87]/10 text-[#133E87] hover:bg-[#133E87]/20'
                                }`}
                            >
                                <span className="relative z-10 font-medium">Service Provider</span>
                                {userType === 'worker' && (
                                    <div className="absolute inset-0 bg-gradient-to-r from-[#133E87]/0 via-[#F3F3E0]/10 to-[#133E87]/0 animate-shimmer" />
                                )}
                            </button>
                        </div>

                        <FormInput
                            icon={User}
                            label="Full Name"
                            value={formData.name}
                            onChange={(e) => setFormData({...formData, name: e.target.value})}
                            error={errors.name}
                            placeholder="John Doe"
                            required
                        />
                        
                        <FormInput
                            icon={Mail}
                            label="Email Address"
                            type="email"
                            value={formData.email}
                            onChange={(e) => setFormData({...formData, email: e.target.value})}
                            error={errors.email}
                            placeholder="your@email.com"
                            required
                        />
                    </div>
                );
            case 2:
                return (
                    <div className="space-y-6">
                        <FormInput
                            icon={Lock}
                            label="Password"
                            type="password"
                            value={formData.password}
                            onChange={(e) => setFormData({...formData, password: e.target.value})}
                            error={errors.password}
                            placeholder="••••••••"
                            required
                        />
                        
                        <FormInput
                            icon={Lock}
                            label="Confirm Password"
                            type="password"
                            value={formData.confirmPassword}
                            onChange={(e) => setFormData({...formData, confirmPassword: e.target.value})}
                            error={errors.confirmPassword}
                            placeholder="••••••••"
                            required
                        />
                        
                        <FormInput
                            icon={Phone}
                            label="Phone Number"
                            type="tel"
                            value={formData.phone}
                            onChange={(e) => setFormData({...formData, phone: e.target.value})}
                            error={errors.phone}
                            placeholder="+1 (555) 000-0000"
                            required
                        />
                        
                        <FormTextArea
                            icon={MapPin}
                            label="Address"
                            value={formData.address}
                            onChange={(e) => setFormData({...formData, address: e.target.value})}
                            error={errors.address}
                            placeholder="Enter your full address"
                            required
                        />
                    </div>
                );
            case 3:
                return (
                    <div className="space-y-6">
                        <FormInput
                            icon={Briefcase}
                            label="Skills"
                            value={formData.skills}
                            onChange={(e) => setFormData({...formData, skills: e.target.value})}
                            error={errors.skills}
                            placeholder="e.g., Plumbing, Electrical, Carpentry"
                            required
                        />
                        
                        <FormInput
                            icon={Calendar}
                            label="Experience (years)"
                            type="number"
                            value={formData.experience}
                            onChange={(e) => setFormData({...formData, experience: e.target.value})}
                            error={errors.experience}
                            min="0"
                            required
                        />
                        
                        <FormInput
                            icon={Map}
                            label="Service Area"
                            value={formData.serviceArea}
                            onChange={(e) => setFormData({...formData, serviceArea: e.target.value})}
                            error={errors.serviceArea}
                            placeholder="e.g., Downtown, North Side"
                            required
                        />
                    </div>
                );
            default:
                return null;
        }
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-50">
            {/* Backdrop */}
            <div 
                className="absolute inset-0 bg-gradient-to-br from-black/30 to-black/40 backdrop-blur-md"
                onClick={onClose}
            />
            
            {/* Modal Container */}
            <div className="fixed inset-0 flex items-center justify-center p-4 sm:p-6">
                <div className="bg-[#F3F3E0] rounded-2xl shadow-2xl w-full max-w-xl mx-auto h-[90vh] flex flex-col relative transform transition-all duration-300">

                    {/* Close button */}
                    <button
                        onClick={onClose}
                        className="absolute top-4 right-4 text-[#133E87] hover:text-[#133E87]/80 p-2 rounded-full hover:bg-[#133E87]/10 transition-all duration-200 z-10"
                    >
                        <X size={20} />
                    </button>

                    {/* Content - Scrollable */}
                    <div className="p-8 flex-1 overflow-y-auto">
                        <h2 className="text-3xl font-bold text-[#133E87] mb-2">Create Account</h2>
                        <p className="text-[#133E87]/70 mb-6">
                            Step {currentStep} of {totalSteps}: {
                                currentStep === 1 ? 'Basic Information' :
                                currentStep === 2 ? 'Security & Contact' :
                                'Professional Details'
                            }
                        </p>

                        <ProgressBar />
                        
                        {errors.submit && (
                            <div className="bg-red-100/80 border border-red-200 text-red-700 px-4 py-3 rounded-lg mb-6">
                                <span className="text-sm">{errors.submit}</span>
                            </div>
                        )}

                        <form onSubmit={handleSubmit}>
                            {renderStepContent()}
                            
                            <div className="flex space-x-4 mt-8">
                                {currentStep > 1 && (
                                    <button
                                        type="button"
                                        onClick={() => setCurrentStep(prev => prev - 1)}
                                        className="flex-1 py-3 rounded-lg border-2 border-[#133E87] text-[#133E87] hover:bg-[#133E87]/10 transition-all duration-200 font-medium"
                                    >
                                        Back
                                    </button>
                                )}
                                <button
                                    type="submit"
                                    disabled={isLoading}
                                    className={`flex-1 bg-[#133E87] text-[#F3F3E0] py-3 rounded-lg hover:bg-[#133E87]/90 transition-all duration-200 font-medium relative overflow-hidden group disabled:opacity-70 ${
                                        currentStep === 1 ? 'w-full' : ''
                                    }`}
                                >
                                    <span className="relative z-10">
                                        {isLoading 
                                            ? 'Processing...' 
                                            : currentStep === totalSteps 
                                                ? 'Complete Registration' 
                                                : 'Continue'
                                        }
                                    </span>
                                    <div className="absolute inset-0 bg-gradient-to-r from-[#133E87]/0 via-[#F3F3E0]/10 to-[#133E87]/0 transform translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-1000" />
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            </div>
        </div>
    );
};

