// src/components/user/Profile/PasswordChange.jsx

import React, { useState } from 'react';
import { FiLock, FiEye, FiEyeOff, FiCheck, FiX, FiAlertTriangle } from 'react-icons/fi';
import { useAuth } from '../../../context/AuthContext';
import { updatePassword, reauthenticateWithCredential, EmailAuthProvider } from 'firebase/auth';
import { auth } from '../../../services/firebase/config';
import { toast } from 'react-toastify';

const PasswordChange = () => {
  const { user } = useAuth();
  const [formData, setFormData] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  });
  const [showPasswords, setShowPasswords] = useState({
    current: false,
    new: false,
    confirm: false
  });
  const [loading, setLoading] = useState(false);
  const [passwordStrength, setPasswordStrength] = useState(0);

  // Check if user signed in with email/password or social login
  const isEmailUser = user?.providerData?.some(provider => provider.providerId === 'password');
  const socialProviders = user?.providerData?.filter(provider => provider.providerId !== 'password') || [];

  const calculatePasswordStrength = (password) => {
    let strength = 0;
    if (password.length >= 8) strength++;
    if (password.length >= 12) strength++;
    if (/[a-z]/.test(password) && /[A-Z]/.test(password)) strength++;
    if (/[0-9]/.test(password)) strength++;
    if (/[!@#$%^&*]/.test(password)) strength++;
    setPasswordStrength(strength);
    return strength;
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    if (name === 'newPassword') {
      calculatePasswordStrength(value);
    }
  };

  const togglePasswordVisibility = (field) => {
    setShowPasswords(prev => ({
      ...prev,
      [field]: !prev[field]
    }));
  };

  const validatePasswords = () => {
    if (!formData.currentPassword) {
      toast.error('Please enter your current password');
      return false;
    }
    if (!formData.newPassword) {
      toast.error('Please enter a new password');
      return false;
    }
    if (formData.newPassword.length < 8) {
      toast.error('New password must be at least 8 characters long');
      return false;
    }
    if (formData.newPassword !== formData.confirmPassword) {
      toast.error('New passwords do not match');
      return false;
    }
    if (formData.currentPassword === formData.newPassword) {
      toast.error('New password must be different from current password');
      return false;
    }
    return true;
  };

  const handleChangePassword = async (e) => {
    e.preventDefault();
    
    if (!validatePasswords()) return;

    setLoading(true);
    try {
      // Re-authenticate the user
      const credential = EmailAuthProvider.credential(user.email, formData.currentPassword);
      await reauthenticateWithCredential(user, credential);

      // Update password
      await updatePassword(user, formData.newPassword);

      toast.success('Password changed successfully!');
      setFormData({
        currentPassword: '',
        newPassword: '',
        confirmPassword: ''
      });
      setPasswordStrength(0);
    } catch (error) {
      if (error.code === 'auth/wrong-password') {
        toast.error('Current password is incorrect');
      } else if (error.code === 'auth/weak-password') {
        toast.error('Password is too weak. Please use a stronger password');
      } else {
        toast.error('Error changing password: ' + error.message);
      }
      console.error('Password change error:', error);
    } finally {
      setLoading(false);
    }
  };

  const getPasswordStrengthColor = () => {
    if (passwordStrength === 0) return 'bg-gray-300';
    if (passwordStrength === 1) return 'bg-red-500';
    if (passwordStrength === 2) return 'bg-orange-500';
    if (passwordStrength === 3) return 'bg-yellow-500';
    if (passwordStrength === 4) return 'bg-lime-500';
    return 'bg-green-500';
  };

  const getPasswordStrengthText = () => {
    if (passwordStrength === 0) return '';
    if (passwordStrength === 1) return 'Very Weak';
    if (passwordStrength === 2) return 'Weak';
    if (passwordStrength === 3) return 'Fair';
    if (passwordStrength === 4) return 'Good';
    return 'Strong';
  };

  return (
    <div className="space-y-6">
      <div className="bg-white rounded-lg shadow-md p-6">
        <h2 className="text-2xl font-bold text-gray-800 mb-6 flex items-center gap-2">
          <FiLock size={24} />
          Change Password
        </h2>

        {!isEmailUser ? (
          // Social Login Users
          <div className="bg-amber-50 border border-amber-200 rounded-lg p-6">
            <div className="flex items-start gap-4">
              <FiAlertTriangle className="w-6 h-6 text-amber-600 flex-shrink-0 mt-1" />
              <div>
                <h3 className="font-semibold text-amber-900 mb-2">Password Change Not Available</h3>
                <p className="text-amber-800 mb-4">
                  You're using {socialProviders.length > 0 && (
                    <span className="font-medium">
                      {socialProviders.map(p => 
                        p.providerId === 'google.com' ? 'Google' :
                        p.providerId === 'facebook.com' ? 'Facebook' :
                        p.providerId === 'github.com' ? 'GitHub' :
                        p.providerId === 'apple.com' ? 'Apple' :
                        p.providerId.charAt(0).toUpperCase() + p.providerId.slice(1)
                      ).join(', ')}
                    </span>
                  )} to sign in to your account. Password management is handled by your social login provider.
                </p>
                
                <div className="bg-white rounded-lg p-4 space-y-3">
                  <p className="text-sm text-amber-800 font-medium">To change your password:</p>
                  <ol className="text-sm text-amber-800 space-y-2 list-decimal list-inside">
                    <li>Visit your {socialProviders.length > 0 && socialProviders[0].providerId === 'google.com' ? 'Google Account' : 'social provider'} settings</li>
                    <li>Update your password there</li>
                    <li>The changes will apply to all services using that account</li>
                  </ol>
                </div>

                {socialProviders.length > 0 && (
                  <div className="mt-4 flex gap-3">
                    {socialProviders.map(provider => {
                      const getProviderUrl = (providerId) => {
                        switch(providerId) {
                          case 'google.com':
                            return 'https://myaccount.google.com/security';
                          case 'facebook.com':
                            return 'https://www.facebook.com/settings/security';
                          case 'github.com':
                            return 'https://github.com/settings/security';
                          case 'apple.com':
                            return 'https://appleid.apple.com/account/manage';
                          default:
                            return '#';
                        }
                      };
                      
                      const getProviderName = (providerId) => {
                        switch(providerId) {
                          case 'google.com':
                            return 'Google Account Security';
                          case 'facebook.com':
                            return 'Facebook Settings';
                          case 'github.com':
                            return 'GitHub Security';
                          case 'apple.com':
                            return 'Apple ID Management';
                          default:
                            return 'Provider Settings';
                        }
                      };

                      return (
                        <a
                          key={provider.providerId}
                          href={getProviderUrl(provider.providerId)}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex items-center gap-2 bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600 transition text-sm"
                        >
                          <span>Go to {getProviderName(provider.providerId)}</span>
                          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                          </svg>
                        </a>
                      );
                    })}
                  </div>
                )}
              </div>
            </div>
          </div>
        ) : (
          // Email/Password Users
          <form onSubmit={handleChangePassword} className="space-y-4">
          {/* Current Password */}
          <div>
            <label className="text-gray-700 font-semibold block mb-2">Current Password</label>
            <div className="relative">
              <input
                type={showPasswords.current ? 'text' : 'password'}
                name="currentPassword"
                value={formData.currentPassword}
                onChange={handleInputChange}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
                placeholder="Enter your current password"
              />
              <button
                type="button"
                onClick={() => togglePasswordVisibility('current')}
                className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500"
              >
                {showPasswords.current ? <FiEyeOff size={20} /> : <FiEye size={20} />}
              </button>
            </div>
          </div>

          {/* New Password */}
          <div>
            <label className="text-gray-700 font-semibold block mb-2">New Password</label>
            <div className="relative">
              <input
                type={showPasswords.new ? 'text' : 'password'}
                name="newPassword"
                value={formData.newPassword}
                onChange={handleInputChange}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
                placeholder="Enter a new password (min 8 characters)"
              />
              <button
                type="button"
                onClick={() => togglePasswordVisibility('new')}
                className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500"
              >
                {showPasswords.new ? <FiEyeOff size={20} /> : <FiEye size={20} />}
              </button>
            </div>

            {/* Password Strength Indicator */}
            {formData.newPassword && (
              <div className="mt-3">
                <div className="flex justify-between items-center mb-2">
                  <span className="text-sm text-gray-600">Password Strength:</span>
                  <span className={`text-sm font-semibold ${
                    passwordStrength === 1 ? 'text-red-500' :
                    passwordStrength === 2 ? 'text-orange-500' :
                    passwordStrength === 3 ? 'text-yellow-500' :
                    passwordStrength === 4 ? 'text-lime-500' :
                    'text-green-500'
                  }`}>
                    {getPasswordStrengthText()}
                  </span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div
                    className={`h-2 rounded-full transition-all ${getPasswordStrengthColor()}`}
                    style={{ width: `${(passwordStrength / 5) * 100}%` }}
                  ></div>
                </div>
                <ul className="mt-3 space-y-1 text-sm text-gray-600">
                  <li className={formData.newPassword.length >= 8 ? 'text-green-600' : ''}>
                    ✓ At least 8 characters
                  </li>
                  <li className={/[a-z]/.test(formData.newPassword) && /[A-Z]/.test(formData.newPassword) ? 'text-green-600' : ''}>
                    ✓ Mix of uppercase and lowercase
                  </li>
                  <li className={/[0-9]/.test(formData.newPassword) ? 'text-green-600' : ''}>
                    ✓ Contains numbers
                  </li>
                  <li className={/[!@#$%^&*]/.test(formData.newPassword) ? 'text-green-600' : ''}>
                    ✓ Contains special characters (!@#$%^&*)
                  </li>
                </ul>
              </div>
            )}
          </div>

          {/* Confirm Password */}
          <div>
            <label className="text-gray-700 font-semibold block mb-2">Confirm Password</label>
            <div className="relative">
              <input
                type={showPasswords.confirm ? 'text' : 'password'}
                name="confirmPassword"
                value={formData.confirmPassword}
                onChange={handleInputChange}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
                placeholder="Confirm your new password"
              />
              <button
                type="button"
                onClick={() => togglePasswordVisibility('confirm')}
                className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500"
              >
                {showPasswords.confirm ? <FiEyeOff size={20} /> : <FiEye size={20} />}
              </button>
            </div>
            {formData.newPassword && formData.confirmPassword && (
              <p className={`text-sm mt-2 ${formData.newPassword === formData.confirmPassword ? 'text-green-600' : 'text-red-600'}`}>
                {formData.newPassword === formData.confirmPassword ? '✓ Passwords match' : '✗ Passwords do not match'}
              </p>
            )}
          </div>

          {/* Action Buttons */}
          <div className="flex gap-4 pt-4">
            <button
              type="submit"
              disabled={loading || !formData.currentPassword || !formData.newPassword || !formData.confirmPassword}
              className="flex items-center gap-2 bg-orange-500 text-white px-6 py-2 rounded-lg hover:bg-orange-600 transition disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <FiCheck size={18} />
              {loading ? 'Changing...' : 'Change Password'}
            </button>
            <button
              type="reset"
              onClick={() => {
                setFormData({ currentPassword: '', newPassword: '', confirmPassword: '' });
                setPasswordStrength(0);
              }}
              className="flex items-center gap-2 bg-gray-300 text-gray-700 px-6 py-2 rounded-lg hover:bg-gray-400 transition"
            >
              <FiX size={18} />
              Clear
            </button>
          </div>

          {/* Security Tips */}
          <div className="mt-6 p-4 bg-blue-50 rounded-lg border border-blue-200">
            <h3 className="font-semibold text-blue-900 mb-2">Security Tips:</h3>
            <ul className="text-sm text-blue-800 space-y-1">
              <li>• Use a unique password that you don't use elsewhere</li>
              <li>• Include uppercase, lowercase, numbers, and special characters</li>
              <li>• Never share your password with anyone</li>
              <li>• Change your password regularly for better security</li>
            </ul>
          </div>
        </form>
        )}
      </div>
    </div>
  );
};

export default PasswordChange;
