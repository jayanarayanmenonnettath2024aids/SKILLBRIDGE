import React, { useState } from 'react';
import Card from '../../components/ui/Card';
import Button from '../../components/ui/Button';
import { UserCircle, Mail, Phone, MapPin, Calendar } from 'lucide-react';
import '../../styles/Onboarding.css';

const BasicInfo = ({ onNext }) => {
    const [formData, setFormData] = useState({
        fullName: '',
        phoneNumber: '',
        email: '',
        dateOfBirth: '',
        gender: '',
        state: '',
        district: ''
    });

    const [errors, setErrors] = useState({});

    const states = [
        'Andhra Pradesh', 'Arunachal Pradesh', 'Assam', 'Bihar', 'Chhattisgarh',
        'Goa', 'Gujarat', 'Haryana', 'Himachal Pradesh', 'Jharkhand',
        'Karnataka', 'Kerala', 'Madhya Pradesh', 'Maharashtra', 'Manipur',
        'Meghalaya', 'Mizoram', 'Nagaland', 'Odisha', 'Punjab',
        'Rajasthan', 'Sikkim', 'Tamil Nadu', 'Telangana', 'Tripura',
        'Uttar Pradesh', 'Uttarakhand', 'West Bengal'
    ];

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
        // Clear error when user starts typing
        if (errors[name]) {
            setErrors(prev => ({
                ...prev,
                [name]: ''
            }));
        }
    };

    const validateForm = () => {
        const newErrors = {};

        // Name validation
        if (!formData.fullName.trim()) {
            newErrors.fullName = 'Full name is required';
        } else if (formData.fullName.trim().length < 3) {
            newErrors.fullName = 'Name must be at least 3 characters';
        }

        // Phone validation
        if (!formData.phoneNumber) {
            newErrors.phoneNumber = 'Phone number is required';
        } else if (!/^[6-9]\d{9}$/.test(formData.phoneNumber)) {
            newErrors.phoneNumber = 'Enter a valid 10-digit Indian mobile number';
        }

        // Email validation (optional but validate if provided)
        if (formData.email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
            newErrors.email = 'Enter a valid email address';
        }

        // Date of Birth validation
        if (!formData.dateOfBirth) {
            newErrors.dateOfBirth = 'Date of birth is required';
        } else {
            const dob = new Date(formData.dateOfBirth);
            const today = new Date();
            const age = today.getFullYear() - dob.getFullYear();
            if (age < 18 || age > 100) {
                newErrors.dateOfBirth = 'Age must be between 18 and 100 years';
            }
        }

        // Gender validation
        if (!formData.gender) {
            newErrors.gender = 'Please select your gender';
        }

        // State validation
        if (!formData.state) {
            newErrors.state = 'Please select your state';
        }

        // District validation
        if (!formData.district.trim()) {
            newErrors.district = 'District is required';
        }

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        if (validateForm()) {
            onNext(formData);
        }
    };

    return (
        <div className="onboarding-step-body" style={{ maxWidth: '880px', margin: '0 auto', width: '100%' }}>
            <Card className="onboarding-card-base">
                <form onSubmit={handleSubmit} className="form-grid-2col">
                    {/* Full Name */}
                    <div className="form-group col-span-full">
                        <label className="input-label-premium" htmlFor="fullName">
                            Full Name <span className="text-error">*</span>
                        </label>
                        <input
                            type="text"
                            id="fullName"
                            name="fullName"
                            placeholder="Enter your full name"
                            value={formData.fullName}
                            onChange={handleChange}
                            className={`input-field-premium ${errors.fullName ? 'error' : ''}`}
                        />
                        {errors.fullName && <span className="error-message">{errors.fullName}</span>}
                    </div>

                    {/* Phone Number */}
                    <div className="form-group">
                        <label className="input-label-premium" htmlFor="phoneNumber">
                            Mobile Number <span className="text-error">*</span>
                        </label>
                        <input
                            type="tel"
                            id="phoneNumber"
                            name="phoneNumber"
                            placeholder="10-digit mobile number"
                            value={formData.phoneNumber}
                            onChange={(e) => {
                                const value = e.target.value.replace(/\D/g, '').slice(0, 10);
                                handleChange({ target: { name: 'phoneNumber', value } });
                            }}
                            className={`input-field-premium ${errors.phoneNumber ? 'error' : ''}`}
                        />
                        {errors.phoneNumber && <span className="error-message">{errors.phoneNumber}</span>}
                    </div>

                    {/* Email (Optional) */}
                    <div className="form-group">
                        <label className="input-label-premium" htmlFor="email">
                            Email Address <span className="text-secondary">(Optional)</span>
                        </label>
                        <input
                            type="email"
                            id="email"
                            name="email"
                            placeholder="your.email@example.com"
                            value={formData.email}
                            onChange={handleChange}
                            className={`input-field-premium ${errors.email ? 'error' : ''}`}
                        />
                        {errors.email && <span className="error-message">{errors.email}</span>}
                    </div>

                    {/* Date of Birth */}
                    <div className="form-group">
                        <label className="input-label-premium" htmlFor="dateOfBirth">
                            Date of Birth <span className="text-error">*</span>
                        </label>
                        <input
                            type="date"
                            id="dateOfBirth"
                            name="dateOfBirth"
                            value={formData.dateOfBirth}
                            onChange={handleChange}
                            max={new Date(new Date().setFullYear(new Date().getFullYear() - 18)).toISOString().split('T')[0]}
                            className={`input-field-premium ${errors.dateOfBirth ? 'error' : ''}`}
                        />
                        {errors.dateOfBirth && <span className="error-message">{errors.dateOfBirth}</span>}
                    </div>

                    {/* Gender */}
                    <div className="form-group">
                        <label className="input-label-premium" htmlFor="gender">
                            Gender <span className="text-error">*</span>
                        </label>
                        <select
                            id="gender"
                            name="gender"
                            value={formData.gender}
                            onChange={handleChange}
                            className={`input-field-premium ${errors.gender ? 'error' : ''}`}
                        >
                            <option value="">Select Gender</option>
                            <option value="male">Male</option>
                            <option value="female">Female</option>
                            <option value="other">Other</option>
                        </select>
                        {errors.gender && <span className="error-message">{errors.gender}</span>}
                    </div>

                    {/* State */}
                    <div className="form-group">
                        <label className="input-label-premium" htmlFor="state">
                            State <span className="text-error">*</span>
                        </label>
                        <select
                            id="state"
                            name="state"
                            value={formData.state}
                            onChange={handleChange}
                            className={`input-field-premium ${errors.state ? 'error' : ''}`}
                        >
                            <option value="">Select State</option>
                            {states.map(state => (
                                <option key={state} value={state}>{state}</option>
                            ))}
                        </select>
                        {errors.state && <span className="error-message">{errors.state}</span>}
                    </div>

                    {/* District */}
                    <div className="form-group">
                        <label className="input-label-premium" htmlFor="district">
                            District <span className="text-error">*</span>
                        </label>
                        <input
                            type="text"
                            id="district"
                            name="district"
                            placeholder="Enter your district"
                            value={formData.district}
                            onChange={handleChange}
                            className={`input-field-premium ${errors.district ? 'error' : ''}`}
                        />
                        {errors.district && <span className="error-message">{errors.district}</span>}
                    </div>
                </form>
            </Card>

            <footer className="onboarding-actions-row">
                <button
                    type="button"
                    className="onboarding-btn-text"
                    style={{ padding: 0 }}
                >
                    Back
                </button>
                <div style={{ flex: 1 }}></div>
                <button
                    type="submit"
                    className="onboarding-btn-primary"
                    onClick={handleSubmit}
                >
                    Continue
                </button>
            </footer>
        </div>
    );
};

export default BasicInfo;
