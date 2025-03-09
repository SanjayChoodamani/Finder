import React, { useState, useEffect } from 'react';
import { X, Upload, MapPin, Search, Clock } from 'lucide-react';
import { getCurrentLocation, getAddressFromCoordinates, isValidCoordinates } from '../../utils/location';

const JobPostingModal = ({ isOpen, onClose, onSuccess }) => {
    const [formData, setFormData] = useState({
        title: '',
        description: '',
        location: '',
        latitude: '',
        longitude: '',
        budget: '',
        deadline: '',
        timeStart: '',
        timeEnd: '',
        category: '',
        categorySearch: '', // For filtering categories
        images: []
    });
    const [isLocating, setIsLocating] = useState(false);
    const [error, setError] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [categories, setCategories] = useState([]);
    const [showCategoryDropdown, setShowCategoryDropdown] = useState(false);

    // Fetch available categories on component mount
    useEffect(() => {
        fetchCategories();
    }, []);

    const fetchCategories = async () => {
        try {
            const token = localStorage.getItem('token');
            if (!token) return;

            const response = await fetch('http://localhost:5000/api/categories', {
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });

            if (response.ok) {
                const data = await response.json();
                setCategories(data);
            }
        } catch (err) {
            console.error('Error fetching categories:', err);
        }
    };

    useEffect(() => {
        if (!formData.location || formData.location === 'Current Location' || isLocating) return;

        const timeoutId = setTimeout(() => {
            getLocationCoordinates(formData.location);
        }, 1000);

        return () => clearTimeout(timeoutId);
    }, [formData.location]);

    const handleCurrentLocation = async () => {
        try {
            setIsLocating(true);
            setError('');

            const position = await getCurrentLocation();
            const { latitude, longitude } = position.coords;
            const address = await getAddressFromCoordinates(latitude, longitude);

            setFormData(prev => ({
                ...prev,
                location: address,
                latitude: latitude.toString(),
                longitude: longitude.toString()
            }));
        } catch (err) {
            console.error('Location error:', err);
            setError(err.message || 'Error getting current location. Please enter address manually.');
        } finally {
            setIsLocating(false);
        }
    };

    const getLocationCoordinates = async (address) => {
        try {
            if (!address || address.trim().length < 3) return;
            setIsLocating(true);
            setError('');

            const apiKey = import.meta.env.VITE_REACT_APP_GOOGLE_MAPS_API_KEY;
            const response = await fetch(
                `https://maps.googleapis.com/maps/api/geocode/json?address=${encodeURIComponent(address)}&key=${apiKey}`
            );

            const data = await response.json();
            if (data.status === 'OK' && data.results && data.results[0]) {
                const { lat, lng } = data.results[0].geometry.location;
                if (isValidCoordinates(lat, lng)) {
                    setFormData(prev => ({
                        ...prev,
                        latitude: lat.toString(),
                        longitude: lng.toString(),
                        location: data.results[0].formatted_address
                    }));
                } else {
                    throw new Error('Invalid coordinates received');
                }
            } else {
                throw new Error(
                    data.status === 'ZERO_RESULTS'
                        ? 'No location found for this address'
                        : 'Error getting location coordinates'
                );
            }
        } catch (err) {
            console.error('Geocoding error:', err);
            setError(err.message || 'Error getting location coordinates');
        } finally {
            setIsLocating(false);
        }
    };

    const handleImageUpload = (e) => {
        const files = Array.from(e.target.files);
        if (files.length + formData.images.length > 5) {
            setError('Maximum 5 images allowed');
            return;
        }

        const validFiles = files.filter(file => {
            const isValid = file.type.startsWith('image/');
            const isValidSize = file.size <= 10 * 1024 * 1024;
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

    const handleCategorySearch = (e) => {
        setFormData(prev => ({ ...prev, categorySearch: e.target.value }));
        setShowCategoryDropdown(true);
    };

    const selectCategory = (category) => {
        setFormData(prev => ({ 
            ...prev, 
            category: category,
            categorySearch: category
        }));
        setShowCategoryDropdown(false);
    };

    const filteredCategories = formData.categorySearch
        ? categories.filter(cat => 
            cat.toLowerCase().includes(formData.categorySearch.toLowerCase()))
        : categories;
    
    // Add common categories if they're not already in the list
    const commonCategories = [
        'plumbing', 'electrical', 'carpentry', 'painting', 
        'cleaning', 'gardening', 'moving', 'appliance_repair', 
        'hvac', 'roofing', 'other'
    ];
    
    const allFilteredCategories = [...new Set([
        ...filteredCategories,
        ...commonCategories
            .filter(cat => cat.includes(formData.categorySearch.toLowerCase()))
            .filter(cat => !filteredCategories.includes(cat))
    ])];

    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsLoading(true);
        setError('');

        try {
            const token = localStorage.getItem('token');
            if (!token) {
                throw new Error('Authentication required');
            }

            const lat = parseFloat(formData.latitude);
            const lng = parseFloat(formData.longitude);
            if (!lat || !lng || !isValidCoordinates(lat, lng)) {
                throw new Error('Valid location coordinates are required');
            }

            const payload = {
                ...formData,
                address: formData.location, // Added to satisfy backend job validation
                category: formData.category || formData.categorySearch,
                latitude: formData.latitude.toString(),
                longitude: formData.longitude.toString()
            };

            const response = await fetch('http://localhost:5000/api/jobs/create', {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(payload)
            });

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.message || 'Failed to create job posting');
            }

            const data = await response.json();
            setFormData({
                title: '',
                description: '',
                location: '',
                latitude: '',
                longitude: '',
                budget: '',
                deadline: '',
                timeStart: '',
                timeEnd: '',
                category: '',
                categorySearch: '',
                images: []
            });
            onSuccess(data);
            onClose();
        } catch (err) {
            console.error('Job posting error:', err);
            setError(err.message || 'An error occurred while posting the job');
        } finally {
            setIsLoading(false);
        }
    };

    const validateForm = () => {
        const requiredFields = [
            'title', 'category', 'description', 'location',
            'latitude', 'longitude', 'budget', 'deadline', 'timeStart', 'timeEnd'
        ];
        return requiredFields.every(field => formData[field]) &&
            formData.budget > 0 &&
            !isLocating;
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
                                    Job Title <span className="text-xs text-gray-500">(What service do you need?)</span>
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
                            
                            {/* Category - Searchable */}
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Service Category <span className="text-xs text-gray-500">(Type to search or create new category)</span>
                                </label>
                                <div className="relative">
                                    <div className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">
                                        <Search size={18} />
                                    </div>
                                    <input
                                        type="text"
                                        value={formData.categorySearch}
                                        onChange={handleCategorySearch}
                                        onFocus={() => setShowCategoryDropdown(true)}
                                        className="w-full p-3 pl-10 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#133E87]/20 focus:border-[#133E87]"
                                        placeholder="Search or enter category..."
                                        required
                                    />
                                    
                                    {showCategoryDropdown && allFilteredCategories.length > 0 && (
                                        <div className="absolute z-10 mt-1 w-full bg-white border border-gray-300 rounded-md shadow-lg max-h-60 overflow-auto">
                                            {allFilteredCategories.map((category, index) => (
                                                <div 
                                                    key={index}
                                                    className="px-4 py-2 hover:bg-gray-100 cursor-pointer"
                                                    onClick={() => selectCategory(category)}
                                                >
                                                    {category}
                                                </div>
                                            ))}
                                        </div>
                                    )}
                                </div>
                            </div>

                            {/* Description */}
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Job Description <span className="text-xs text-gray-500">(Provide details about the work required)</span>
                                </label>
                                <textarea
                                    value={formData.description}
                                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                                    className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#133E87]/20 focus:border-[#133E87] min-h-[120px]"
                                    placeholder="Describe the job in detail including any specific requirements..."
                                    required
                                    maxLength={1000}
                                />
                            </div>

                            {/* Location */}
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Service Location <span className="text-xs text-gray-500">(Where the service is needed)</span>
                                </label>
                                <div className="relative">
                                    <input
                                        type="text"
                                        value={formData.location}
                                        onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                                        className="w-full p-3 pl-10 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#133E87]/20 focus:border-[#133E87]"
                                        placeholder="Enter address or use current location"
                                        required
                                    />
                                    <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
                                    <button
                                        type="button"
                                        onClick={handleCurrentLocation}
                                        className="absolute right-3 top-1/2 -translate-y-1/2 text-[#133E87] text-sm hover:underline"
                                    >
                                        Use Current Location
                                    </button>
                                </div>
                                {isLocating && (
                                    <div className="mt-2 flex items-center text-sm text-gray-500">
                                        <div className="animate-spin rounded-full h-4 w-4 border-2 border-[#133E87] border-t-transparent mr-2"></div>
                                        Verifying location...
                                    </div>
                                )}
                                {formData.latitude && formData.longitude && !isLocating && (
                                    <p className="mt-2 text-sm text-green-600 flex items-center">
                                        <MapPin className="mr-1" size={16} />
                                        Location verified
                                    </p>
                                )}
                            </div>

                            {/* Budget */}
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Budget (₹) <span className="text-xs text-gray-500">(How much are you willing to pay?)</span>
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
                                    Service Date <span className="text-xs text-gray-500">(When do you need this completed by?)</span>
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

                            {/* Time Duration */}
                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                        Start Time <span className="text-xs text-gray-500">(Service begins at)</span>
                                    </label>
                                    <div className="relative">
                                        <div className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">
                                            <Clock size={18} />
                                        </div>
                                        <input
                                            type="time"
                                            value={formData.timeStart}
                                            onChange={(e) => setFormData({ ...formData, timeStart: e.target.value })}
                                            className="w-full p-3 pl-10 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#133E87]/20 focus:border-[#133E87]"
                                            required
                                        />
                                    </div>
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                        End Time <span className="text-xs text-gray-500">(Service ends by)</span>
                                    </label>
                                    <div className="relative">
                                        <div className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">
                                            <Clock size={18} />
                                        </div>
                                        <input
                                            type="time"
                                            value={formData.timeEnd}
                                            onChange={(e) => setFormData({ ...formData, timeEnd: e.target.value })}
                                            className="w-full p-3 pl-10 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#133E87]/20 focus:border-[#133E87]"
                                            required
                                        />
                                    </div>
                                </div>
                            </div>

                            {/* Image Upload */}
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Supporting Images <span className="text-xs text-gray-500">(Upload up to 5 images to help explain the job)</span>
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