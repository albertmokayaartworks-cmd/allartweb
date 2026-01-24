// src/components/auth/PhoneAuthForm.jsx

import React, { useState, useRef, useEffect } from 'react';
import { FiSmartphone, FiArrowRight, FiX, FiCheck, FiLoader } from 'react-icons/fi';
import { useAuth } from '../../context/AuthContext';

const PhoneAuthForm = ({ onSuccess, onClose }) => {
  const { sendPhoneVerificationOTP, verifyPhoneCode } = useAuth();
  const [step, setStep] = useState('phone'); // phone, otp, displayName
  const [phoneNumber, setPhoneNumber] = useState('');
  const [displayName, setDisplayName] = useState('');
  const [otp, setOtp] = useState(['', '', '', '', '', '']);
  const [confirmationResult, setConfirmationResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const otpRefs = useRef([]);
  const [resendTimer, setResendTimer] = useState(0);

  // Timer for resend OTP
  useEffect(() => {
    let interval;
    if (resendTimer > 0) {
      interval = setInterval(() => {
        setResendTimer(prev => prev - 1);
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [resendTimer]);

  const formatPhoneDisplay = (phone) => {
    const digits = phone.replace(/\D/g, '');
    if (digits.length === 12) return `+${digits}`;
    if (digits.length === 10) return `+254${digits.substring(1)}`;
    return phone;
  };

  const handlePhoneSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      if (!phoneNumber.trim()) {
        throw new Error('Please enter a phone number');
      }

      // Validate phone format
      const digits = phoneNumber.replace(/\D/g, '');
      if (digits.length < 9) {
        throw new Error('Please enter a valid phone number');
      }

      const result = await sendPhoneVerificationOTP(phoneNumber);
      if (result.success) {
        setConfirmationResult(result.confirmationResult);
        setSuccess('✅ OTP sent successfully! Check your phone.');
        setTimeout(() => {
          setSuccess('');
          setStep('otp');
        }, 1500);
      } else {
        throw new Error(result.error);
      }
    } catch (err) {
      setError(err.message || 'Failed to send OTP');
    } finally {
      setLoading(false);
    }
  };

  const handleOtpChange = (index, value) => {
    if (value.length > 1) return;
    if (!/^\d*$/.test(value)) return;

    const newOtp = [...otp];
    newOtp[index] = value;
    setOtp(newOtp);

    // Auto move to next input
    if (value && index < 5) {
      otpRefs.current[index + 1]?.focus();
    }
  };

  const handleOtpKeyDown = (index, e) => {
    if (e.key === 'Backspace' && !otp[index] && index > 0) {
      otpRefs.current[index - 1]?.focus();
    }
  };

  const handleOtpSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const otpCode = otp.join('');
      if (otpCode.length !== 6) {
        throw new Error('Please enter the complete 6-digit code');
      }

      if (!confirmationResult) {
        throw new Error('Confirmation result not found. Please start over.');
      }

      setStep('displayName');
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleDisplayNameSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      if (!displayName.trim()) {
        throw new Error('Please enter your name');
      }

      if (displayName.trim().length < 2) {
        throw new Error('Name must be at least 2 characters');
      }

      const otpCode = otp.join('');
      const result = await verifyPhoneCode(confirmationResult, otpCode, displayName.trim());

      if (result.success) {
        setSuccess('✅ Authentication successful!');
        setTimeout(() => {
          if (onSuccess) onSuccess(result.user, result.userData);
        }, 1000);
      } else {
        throw new Error(result.error);
      }
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleResendOTP = async () => {
    setError('');
    setLoading(true);

    try {
      const result = await sendPhoneVerificationOTP(phoneNumber);
      if (result.success) {
        setConfirmationResult(result.confirmationResult);
        setOtp(['', '', '', '', '', '']);
        setResendTimer(60);
        setSuccess('✅ New OTP sent to your phone');
        setTimeout(() => setSuccess(''), 2000);
      } else {
        throw new Error(result.error);
      }
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="w-full max-w-md mx-auto p-6">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-2">
          <div className="bg-blue-100 p-2 rounded-lg">
            <FiSmartphone className="text-blue-600 text-lg" />
          </div>
          <div>
            <h2 className="text-xl font-bold text-gray-900">Phone Auth</h2>
            <p className="text-xs text-gray-500">
              {step === 'phone' && 'Enter your phone number'}
              {step === 'otp' && 'Enter the 6-digit code'}
              {step === 'displayName' && 'Complete your profile'}
            </p>
          </div>
        </div>
        {onClose && (
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 transition"
          >
            <FiX size={20} />
          </button>
        )}
      </div>

      {/* Progress Indicator */}
      <div className="flex gap-2 mb-6">
        {[1, 2, 3].map((num) => (
          <div
            key={num}
            className={`h-1 flex-1 rounded-full transition ${
              (step === 'phone' && num <= 1) ||
              (step === 'otp' && num <= 2) ||
              (step === 'displayName' && num <= 3)
                ? 'bg-blue-600'
                : 'bg-gray-200'
            }`}
          />
        ))}
      </div>

      {/* Error Message */}
      {error && (
        <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg flex items-start gap-2">
          <FiX className="text-red-600 mt-0.5 flex-shrink-0" />
          <p className="text-sm text-red-600">{error}</p>
        </div>
      )}

      {/* Success Message */}
      {success && (
        <div className="mb-4 p-3 bg-green-50 border border-green-200 rounded-lg flex items-start gap-2">
          <FiCheck className="text-green-600 mt-0.5 flex-shrink-0" />
          <p className="text-sm text-green-600">{success}</p>
        </div>
      )}

      {/* Phone Number Step */}
      {step === 'phone' && (
        <form onSubmit={handlePhoneSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Phone Number
            </label>
            <input
              type="tel"
              placeholder="+254712345678 or 0712345678"
              value={phoneNumber}
              onChange={(e) => {
                setPhoneNumber(e.target.value);
                setError('');
              }}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition"
              disabled={loading}
            />
            <p className="text-xs text-gray-500 mt-2">
              Works with Kenya (+254), other countries coming soon
            </p>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-blue-600 text-white py-3 rounded-lg font-medium hover:bg-blue-700 transition disabled:bg-gray-400 flex items-center justify-center gap-2"
          >
            {loading ? (
              <>
                <FiLoader className="animate-spin" size={18} />
                Sending...
              </>
            ) : (
              <>
                Send OTP
                <FiArrowRight size={18} />
              </>
            )}
          </button>
        </form>
      )}

      {/* OTP Step */}
      {step === 'otp' && (
        <form onSubmit={handleOtpSubmit} className="space-y-4">
          <div className="bg-blue-50 p-3 rounded-lg">
            <p className="text-sm text-blue-900">
              Enter the 6-digit code sent to{' '}
              <span className="font-semibold">{formatPhoneDisplay(phoneNumber)}</span>
            </p>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-3">
              Verification Code
            </label>
            <div className="flex gap-2 justify-center">
              {otp.map((digit, index) => (
                <input
                  key={index}
                  ref={(el) => (otpRefs.current[index] = el)}
                  type="text"
                  maxLength="1"
                  value={digit}
                  onChange={(e) => handleOtpChange(index, e.target.value)}
                  onKeyDown={(e) => handleOtpKeyDown(index, e)}
                  className="w-12 h-12 text-center text-2xl font-bold border-2 border-gray-300 rounded-lg focus:outline-none focus:ring-0 focus:border-blue-500 transition"
                  disabled={loading}
                />
              ))}
            </div>
          </div>

          <button
            type="submit"
            disabled={loading || otp.join('').length !== 6}
            className="w-full bg-blue-600 text-white py-3 rounded-lg font-medium hover:bg-blue-700 transition disabled:bg-gray-400 flex items-center justify-center gap-2"
          >
            {loading ? (
              <>
                <FiLoader className="animate-spin" size={18} />
                Verifying...
              </>
            ) : (
              <>
                Verify Code
                <FiArrowRight size={18} />
              </>
            )}
          </button>

          <div className="text-center">
            <button
              type="button"
              onClick={handleResendOTP}
              disabled={resendTimer > 0 || loading}
              className="text-sm text-blue-600 hover:text-blue-700 disabled:text-gray-400 font-medium transition"
            >
              {resendTimer > 0 ? `Resend in ${resendTimer}s` : 'Resend Code'}
            </button>
          </div>
        </form>
      )}

      {/* Display Name Step */}
      {step === 'displayName' && (
        <form onSubmit={handleDisplayNameSubmit} className="space-y-4">
          <div className="bg-green-50 p-3 rounded-lg">
            <div className="flex items-center gap-2">
              <FiCheck className="text-green-600" size={18} />
              <p className="text-sm text-green-900">Phone verified successfully!</p>
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Your Name
            </label>
            <input
              type="text"
              placeholder="Enter your full name"
              value={displayName}
              onChange={(e) => {
                setDisplayName(e.target.value);
                setError('');
              }}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition"
              disabled={loading}
              autoFocus
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-green-600 text-white py-3 rounded-lg font-medium hover:bg-green-700 transition disabled:bg-gray-400 flex items-center justify-center gap-2"
          >
            {loading ? (
              <>
                <FiLoader className="animate-spin" size={18} />
                Creating Account...
              </>
            ) : (
              <>
                Complete Sign Up
                <FiArrowRight size={18} />
              </>
            )}
          </button>
        </form>
      )}
    </div>
  );
};

export default PhoneAuthForm;
