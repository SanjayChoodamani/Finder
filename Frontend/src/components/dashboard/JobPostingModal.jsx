import React, { useState } from 'react';
import { X, Upload, Calendar, MapPin, FileText, DollarSign, Clock } from 'lucide-react';

const JobPostingModal = ({ isOpen, onClose, onSuccess }) => {
    const [formData, setFormData] = useState({
        title: '',
        description: '',
        location: '',
        budget: '',
        deadline: '',
        timePreference: '',
        category: '',
        images: []
    });
    const [error, setError] = useState('');
    const [isLoading, setIsLoading] = useState(false);

    const handleImageUpload = (e) => {
        const files = Array.from(e.target.files);
        if (files.length + formData.images.length > 5) {
            setError('Maximum 5 images allowed');
            return;
        }

        const validFiles = files.filter(file => {
            const isValid = file.type.startsWith('image/');
            const isValidSize = file.size <= 10 * 1024 * 1024; // 10MB
            return isValid && isValidSize;
        });

        const imageArray = validFiles.map(file => ({
            file,
            preview: URL.createObjectURL(file)
        }));

        setFormData(prev => ({
            ...prev,
            images: [...prev.images, ...imageArray]
        }));
    };

    const removeImage = (index) => {
        setFormData(prev => {
            const newImages = [...prev.images];
            URL.revokeObjectURL(newImages[index].preview);
            newImages.splice(index, 1);
            return {
                ...prev,
                images: newImages
            };
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsLoading(true);
        setError('');

        try {
            const token = localStorage.getItem('token');
            if (!token) {
                throw new Error('Authentication required');
            }

            const formDataToSend = new FormData();

            // Append basic form fields
            formDataToSend.append('title', formData.title);
            formDataToSend.append('description', formData.description);
            formDataToSend.append('location', formData.location);
            formDataToSend.append('budget', formData.budget);
            formDataToSend.append('deadline', formData.deadline);
            formDataToSend.append('category', formData.category);
            formDataToSend.append('timePreference', formData.timePreference);

            // Append images
            formData.images.forEach((img, index) => {
                formDataToSend.append('images', img.file);
            });

            const response = await fetch('http://localhost:5000/api/jobs/create', {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${token}`
                },
                body: formDataToSend
            });

            const data = await response.json();

            if (response.ok) {
                // Clear form and close modal
                setFormData({
                    title: '',
                    description: '',
                    location: '',
                    budget: '',
                    deadline: '',
                    timePreference: '',
                    category: '',
                    images: []
                });
                onSuccess(data);
                onClose();
            } else {
                setError(data.message || 'Failed to create job posting');
            }
        } catch (err) {
            setError(err.message || 'An error occurred. Please try again.');
        } finally {
            setIsLoading(false);
        }
    };

    const validateForm = () => {
        const requiredFields = ['title', 'category', 'description', 'location', 'budget', 'deadline', 'timePreference'];
        return requiredFields.every(field => formData[field]) && formData.budget > 0;
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-50">
            <div
                className="absolute inset-0 bg-black/30 backdrop-blur-sm"
                onClick={onClose}
            />

            <div className="fixed inset-0 flex items-center justify-center p-4 sm:p-6">
                <div className="bg-white rounded-2xl shadow-xl w-full max-w-3xl mx-auto h-[90vh] flex flex-col relative">
                    {/* Header */}
                    <div className="p-6 border-b border-gray-200">
                        <div className="flex justify-between items-center">
                            <h2 className="text-2xl font-semibold text-gray-800">Post a New Job</h2>
                            <button
                                onClick={onClose}
                                className="text-gray-500 hover:text-gray-700 transition-colors"
                            >
                                <X size={24} />
                            </button>
                        </div>
                    </div>

                    {/* Form Content - Scrollable */}
                    <div className="flex-1 overflow-y-auto p-6">
                        {error && (
                            <div className="bg-red-100 border border-red-200 text-red-700 px-4 py-3 rounded-lg mb-6">
                                {error}
                            </div>
                        )}

                        <form id="jobPostForm" onSubmit={handleSubmit} className="space-y-6">
                            {/* Job Title */}
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Job Title
                                </label>
                                <input
                                    type="text"
                                    value={formData.title}
                                    onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                                    className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#133E87]/20 focus:border-[#133E87]"
                                    placeholder="e.g., Plumbing Repair Needed"
                                    required
                                    maxLength={100}
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Category
                                </label>
                                <select
                                    value={formData.category}
                                    onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                                    className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#133E87]/20 focus:border-[#133E87]"
                                    required
                                >
                                    <option value="">Select a category</option>
                                    <option value="plumbing">Plumbing</option>
                                    <option value="electrical">Electrical</option>
                                    <option value="carpentry">Carpentry</option>
                                    <option value="painting">Painting</option>
                                    <option value="cleaning">Cleaning</option>
                                    <option value="gardening">Gardening</option>
                                    <option value="moving">Moving</option>
                                    <option value="appliance_repair">Appliance Repair</option>
                                    <option value="hvac">HVAC</option>
                                    <option value="roofing">Roofing</option>
                                    <option value="other">Other</option>
                                </select>
                            </div>

                            {/* Description */}
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Description
                                </label>
                                <textarea
                                    value={formData.description}
                                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                                    className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#133E87]/20 focus:border-[#133E87] min-h-[120px]"
                                    placeholder="Describe the job in detail..."
                                    required
                                    maxLength={1000}
                                />
                            </div>

                            {/* Location */}
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Location
                                </label>
                                <input
                                    type="text"
                                    value={formData.location}
                                    onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                                    className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#133E87]/20 focus:border-[#133E87]"
                                    placeholder="Enter job location"
                                    required
                                />
                            </div>

                            {/* Budget */}
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Budget (₹)
                                </label>
                                <input
                                    type="number"
                                    value={formData.budget}
                                    onChange={(e) => setFormData({ ...formData, budget: e.target.value })}
                                    className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#133E87]/20 focus:border-[#133E87]"
                                    placeholder="Enter your budget"
                                    required
                                    min="1"
                                />
                            </div>

                            {/* Deadline */}
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Deadline
                                </label>
                                <input
                                    type="date"
                                    value={formData.deadline}
                                    onChange={(e) => setFormData({ ...formData, deadline: e.target.value })}
                                    className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#133E87]/20 focus:border-[#133E87]"
                                    required
                                    min={new Date().toISOString().split('T')[0]}
                                />
                            </div>

                            {/* Time Preference */}
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Preferred Time
                                </label>
                                <select
                                    value={formData.timePreference}
                                    onChange={(e) => setFormData({ ...formData, timePreference: e.target.value })}
                                    className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#133E87]/20 focus:border-[#133E87]"
                                    required
                                >
                                    <option value="">Select time preference</option>
                                    <option value="morning">Morning (8 AM - 12 PM)</option>
                                    <option value="afternoon">Afternoon (12 PM - 4 PM)</option>
                                    <option value="evening">Evening (4 PM - 8 PM)</option>
                                </select>
                            </div>

                            {/* Image Upload */}
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Upload Images (Maximum 5)
                                </label>
                                <div className="mt-1 flex justify-center px-6 pt-5 pb-6 border-2 border-gray-300 border-dashed rounded-lg">
                                    <div className="space-y-1 text-center">
                                        <Upload className="mx-auto h-12 w-12 text-gray-400" />
                                        <div className="flex text-sm text-gray-600">
                                            <label
                                                htmlFor="file-upload"
                                                className="relative cursor-pointer rounded-md bg-white font-medium text-[#133E87] hover:text-[#133E87]/80"
                                            >
                                                <span>Upload images</span>
                                                <input
                                                    id="file-upload"
                                                    name="file-upload"
                                                    type="file"
                                                    className="sr-only"
                                                    multiple
                                                    accept="image/*"
                                                    onChange={handleImageUpload}
                                                    disabled={formData.images.length >= 5}
                                                />
                                            </label>
                                            <p className="pl-1">or drag and drop</p>
                                        </div>
                                        <p className="text-xs text-gray-500">
                                            PNG, JPG, GIF up to 10MB each ({formData.images.length}/5 images)
                                        </p>
                                    </div>
                                </div>

                                {/* Image Preview */}
                                {formData.images.length > 0 && (
                                    <div className="mt-4 grid grid-cols-2 sm:grid-cols-3 gap-4">
                                        {formData.images.map((img, index) => (
                                            <div key={index} className="relative group">
                                                <img
                                                    src={img.preview}
                                                    alt={`Preview ${index + 1}`}
                                                    className="h-24 w-full object-cover rounded-lg"
                                                />
                                                <button
                                                    type="button"
                                                    onClick={() => removeImage(index)}
                                                    className="absolute top-1 right-1 p-1 bg-red-500 text-white rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
                                                >
                                                    <X size={14} />
                                                </button>
                                            </div>
                                        ))}
                                    </div>
                                )}
                            </div>
                        </form>
                    </div>

                    {/* Footer */}
                    <div className="p-6 border-t border-gray-200">
                        <div className="flex justify-end space-x-4">
                            <button
                                onClick={onClose}
                                className="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors"
                            >
                                Cancel
                            </button>
                            <button
                                form="jobPostForm"
                                type="submit"
                                disabled={isLoading || !validateForm()}
                                className="px-4 py-2 bg-[#133E87] text-white rounded-lg hover:bg-[#133E87]/90 transition-colors disabled:opacity-70"
                            >
                                {isLoading ? 'Posting...' : 'Post Job'}
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default JobPostingModal;