// utils/location.js

// Get current location using browser's geolocation API
export const getCurrentLocation = () => {
    return new Promise((resolve, reject) => {
        if (!navigator.geolocation) {
            reject(new Error('Geolocation is not supported by your browser'));
            return;
        }

        navigator.geolocation.getCurrentPosition(
            (position) => {
                console.log('Got current location:', {
                    latitude: position.coords.latitude,
                    longitude: position.coords.longitude
                });
                resolve(position);
            },
            (error) => {
                switch (error.code) {
                    case error.PERMISSION_DENIED:
                        reject(new Error('Location permission denied'));
                        break;
                    case error.POSITION_UNAVAILABLE:
                        reject(new Error('Location information is unavailable'));
                        break;
                    case error.TIMEOUT:
                        reject(new Error('Location request timed out'));
                        break;
                    default:
                        reject(new Error('An unknown error occurred'));
                        break;
                }
            },
            {
                enableHighAccuracy: true,
                timeout: 10000, // Increase timeout to 10 seconds
                maximumAge: 0
            }
        );
    });
};

// Convert coordinates to address using reverse geocoding
export const getAddressFromCoordinates = async (latitude, longitude) => {
    try {
        console.log(`Getting address for coordinates: lat=${latitude}, lng=${longitude}`);
        
        if (!isValidCoordinates(latitude, longitude)) {
            throw new Error('Invalid coordinates');
        }
        
        const response = await fetch(
            `https://maps.googleapis.com/maps/api/geocode/json?latlng=${latitude},${longitude}&key=${import.meta.env.VITE_REACT_APP_GOOGLE_MAPS_API_KEY}`
        );
        const data = await response.json();
        
        if (data.results && data.results[0]) {
            const address = data.results[0].formatted_address;
            console.log(`Address found: ${address}`);
            return address;
        }
        throw new Error('No address found for these coordinates');
    } catch (error) {
        console.error('Error getting address:', error);
        throw error;
    }
};

// Calculate distance between two points in kilometers
export const calculateDistance = (lat1, lon1, lat2, lon2) => {
    if (!isValidCoordinates(lat1, lon1) || !isValidCoordinates(lat2, lon2)) {
        console.error('Invalid coordinates for distance calculation');
        return -1;
    }
    
    const R = 6371; // Earth's radius in kilometers
    const dLat = toRad(lat2 - lat1);
    const dLon = toRad(lon1 - lon2);
    const a =
        Math.sin(dLat / 2) * Math.sin(dLat / 2) +
        Math.cos(toRad(lat1)) * Math.cos(toRad(lat2)) *
        Math.sin(dLon / 2) * Math.sin(dLon / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    return R * c;
};

const toRad = (value) => {
    return (value * Math.PI) / 180;
};

// Validate coordinates
export const isValidCoordinates = (latitude, longitude) => {
    const lat = parseFloat(latitude);
    const lng = parseFloat(longitude);

    return !isNaN(lat) && !isNaN(lng) &&
        lat >= -90 && lat <= 90 &&
        lng >= -180 && lng <= 180;
};

// Update worker location on the server
export const updateWorkerLocation = async (latitude, longitude) => {
    try {
        if (!isValidCoordinates(latitude, longitude)) {
            throw new Error('Invalid coordinates');
        }
        
        console.log(`Updating worker location to: lat=${latitude}, lng=${longitude}`);
        
        const token = localStorage.getItem('token');
        if (!token) {
            throw new Error('Authentication required');
        }
        
        const response = await fetch('http://localhost:5000/api/worker/update-location', {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            },
            body: JSON.stringify({ latitude, longitude })
        });
        
        const data = await response.json();
        
        if (!response.ok) {
            throw new Error(data.message || 'Failed to update location');
        }
        
        console.log('Worker location updated successfully:', data);
        return data;
    } catch (error) {
        console.error('Error updating worker location:', error);
        throw error;
    }
};