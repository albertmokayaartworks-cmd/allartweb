// src/components/user/Profile/AccountSettings.jsx

import React, { useState } from 'react';
import { FiMail, FiPhone, FiMapPin, FiUser, FiEdit2, FiCheck, FiX } from 'react-icons/fi';
import { useAuth } from '../../../context/AuthContext';
import { doc, updateDoc } from 'firebase/firestore';
import { db } from '../../../services/firebase/config';
import { toast } from 'react-toastify';

const AccountSettings = () => {
  const { user, userData } = useAuth();
  const [isEditing, setIsEditing] = useState(false);
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    displayName: userData?.displayName || '',
    email: userData?.email || '',
    phone: userData?.phone || '',
    address: userData?.address || '',
    city: userData?.city || '',
    state: userData?.state || '',
    zipCode: userData?.zipCode || '',
    country: userData?.country || ''
  });

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSave = async () => {
    setLoading(true);
    try {
      const userDocRef = doc(db, 'users', user.uid);
      await updateDoc(userDocRef, {
        displayName: formData.displayName,
        phone: formData.phone,
        address: formData.address,
        city: formData.city,
        state: formData.state,
        zipCode: formData.zipCode,
        country: formData.country,
        updatedAt: new Date().toISOString()
      });
      toast.success('Account information updated successfully!');
      setIsEditing(false);
    } catch (error) {
      toast.error('Error updating account information');
      console.error('Update error:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleCancel = () => {
    setFormData({
      displayName: userData?.displayName || '',
      email: userData?.email || '',
      phone: userData?.phone || '',
      address: userData?.address || '',
      city: userData?.city || '',
      state: userData?.state || '',
      zipCode: userData?.zipCode || '',
      country: userData?.country || ''
    });
    setIsEditing(false);
  };

  return (
    <div className="space-y-6">
      <div className="bg-white rounded-lg shadow-md p-6">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold text-gray-800">Account Information</h2>
          {!isEditing && (
            <button
              onClick={() => setIsEditing(true)}
              className="flex items-center gap-2 bg-orange-500 text-white px-4 py-2 rounded-lg hover:bg-orange-600 transition"
            >
              <FiEdit2 size={18} />
              Edit Information
            </button>
          )}
        </div>

        {isEditing ? (
          <form className="space-y-4">
            {/* Name Field */}
            <div>
              <label className="flex items-center gap-2 text-gray-700 font-semibold mb-2">
                <FiUser size={18} />
                Full Name
              </label>
              <input
                type="text"
                name="displayName"
                value={formData.displayName}
                onChange={handleInputChange}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
                placeholder="Enter your full name"
              />
            </div>

            {/* Email Field (Read-only) */}
            <div>
              <label className="flex items-center gap-2 text-gray-700 font-semibold mb-2">
                <FiMail size={18} />
                Email Address
              </label>
              <input
                type="email"
                value={formData.email}
                disabled
                className="w-full px-4 py-2 border border-gray-300 rounded-lg bg-gray-100 text-gray-600 cursor-not-allowed"
              />
              <p className="text-sm text-gray-500 mt-1">Email cannot be changed</p>
            </div>

            {/* Phone Field */}
            <div>
              <label className="flex items-center gap-2 text-gray-700 font-semibold mb-2">
                <FiPhone size={18} />
                Phone Number
              </label>
              <input
                type="tel"
                name="phone"
                value={formData.phone}
                onChange={handleInputChange}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
                placeholder="Enter your phone number"
              />
            </div>

            {/* Address Field */}
            <div>
              <label className="flex items-center gap-2 text-gray-700 font-semibold mb-2">
                <FiMapPin size={18} />
                Street Address
              </label>
              <input
                type="text"
                name="address"
                value={formData.address}
                onChange={handleInputChange}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
                placeholder="Enter your street address"
              />
            </div>

            {/* City, State, Zip in grid */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label className="text-gray-700 font-semibold block mb-2">City</label>
                <input
                  type="text"
                  name="city"
                  value={formData.city}
                  onChange={handleInputChange}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
                  placeholder="City"
                />
              </div>
              <div>
                <label className="text-gray-700 font-semibold block mb-2">State</label>
                <input
                  type="text"
                  name="state"
                  value={formData.state}
                  onChange={handleInputChange}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
                  placeholder="State/Province"
                />
              </div>
              <div>
                <label className="text-gray-700 font-semibold block mb-2">Zip Code</label>
                <input
                  type="text"
                  name="zipCode"
                  value={formData.zipCode}
                  onChange={handleInputChange}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
                  placeholder="Zip Code"
                />
              </div>
            </div>

            {/* Country Field */}
            <div>
              <label className="text-gray-700 font-semibold block mb-2">Country</label>
              <input
                type="text"
                name="country"
                value={formData.country}
                onChange={handleInputChange}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
                placeholder="Country"
              />
            </div>

            {/* Action Buttons */}
            <div className="flex gap-4 pt-4">
              <button
                type="button"
                onClick={handleSave}
                disabled={loading}
                className="flex items-center gap-2 bg-green-500 text-white px-6 py-2 rounded-lg hover:bg-green-600 transition disabled:opacity-50"
              >
                <FiCheck size={18} />
                {loading ? 'Saving...' : 'Save Changes'}
              </button>
              <button
                type="button"
                onClick={handleCancel}
                className="flex items-center gap-2 bg-gray-300 text-gray-700 px-6 py-2 rounded-lg hover:bg-gray-400 transition"
              >
                <FiX size={18} />
                Cancel
              </button>
            </div>
          </form>
        ) : (
          <div className="space-y-4">
            <div className="flex justify-between py-3 border-b">
              <span className="text-gray-600 flex items-center gap-2">
                <FiUser size={18} /> Full Name
              </span>
              <span className="font-semibold text-gray-800">{formData.displayName}</span>
            </div>
            <div className="flex justify-between py-3 border-b">
              <span className="text-gray-600 flex items-center gap-2">
                <FiMail size={18} /> Email Address
              </span>
              <span className="font-semibold text-gray-800">{formData.email}</span>
            </div>
            <div className="flex justify-between py-3 border-b">
              <span className="text-gray-600 flex items-center gap-2">
                <FiPhone size={18} /> Phone Number
              </span>
              <span className="font-semibold text-gray-800">{formData.phone || 'Not provided'}</span>
            </div>
            <div className="flex justify-between py-3 border-b">
              <span className="text-gray-600 flex items-center gap-2">
                <FiMapPin size={18} /> Address
              </span>
              <span className="font-semibold text-gray-800">{formData.address || 'Not provided'}</span>
            </div>
            {formData.city && (
              <div className="flex justify-between py-3 border-b">
                <span className="text-gray-600">Location</span>
                <span className="font-semibold text-gray-800">
                  {formData.city}, {formData.state} {formData.zipCode}
                </span>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default AccountSettings;
