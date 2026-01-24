// src/components/user/Profile/SecuritySettings.jsx

import React, { useState } from 'react';
import { FiShield, FiSmartphone, FiKey, FiAlertTriangle, FiCheck, FiTrash2 } from 'react-icons/fi';
import { useAuth } from '../../../context/AuthContext';
import { doc, updateDoc, collection, query, where, getDocs, deleteDoc } from 'firebase/firestore';
import { db } from '../../../services/firebase/config';
import { toast } from 'react-toastify';

const SecuritySettings = () => {
  const { user, userData } = useAuth();
  const [loading, setLoading] = useState(false);
  const [activeSessions, setActiveSessions] = useState([
    {
      id: 1,
      device: 'Chrome on Windows',
      location: 'Kisii, Kenya',
      lastActive: 'Just now',
      ipAddress: '192.168.1.1',
      current: true
    },
    {
      id: 2,
      device: 'Safari on iPhone',
      location: 'Nairobi, Kenya',
      lastActive: '2 hours ago',
      ipAddress: '10.0.0.1',
      current: false
    }
  ]);

  const [twoFactorEnabled, setTwoFactorEnabled] = useState(userData?.twoFactorEnabled ?? false);
  const [backupCodes, setBackupCodes] = useState(userData?.backupCodes ?? []);

  // Logout from other sessions
  const handleLogoutOtherSessions = async () => {
    setLoading(true);
    try {
      // In a real app, you'd implement this on the backend
      toast.success('All other sessions have been logged out');
      setActiveSessions([activeSessions[0]]);
    } catch (error) {
      toast.error('Error logging out other sessions');
    } finally {
      setLoading(false);
    }
  };

  // Remove specific session
  const handleRemoveSession = (sessionId) => {
    setActiveSessions(sessions => sessions.filter(s => s.id !== sessionId));
    toast.info('Session removed');
  };

  // Enable 2FA
  const handleEnable2FA = async () => {
    setLoading(true);
    try {
      // Generate backup codes (in real app, this would be on backend)
      const codes = Array.from({ length: 10 }, () => 
        Math.random().toString(36).substring(2, 10).toUpperCase()
      );
      
      const userDocRef = doc(db, 'users', user.uid);
      await updateDoc(userDocRef, {
        twoFactorEnabled: true,
        backupCodes: codes,
        updatedAt: new Date().toISOString()
      });

      setTwoFactorEnabled(true);
      setBackupCodes(codes);
      toast.success('Two-factor authentication enabled!');
    } catch (error) {
      toast.error('Error enabling 2FA');
      console.error('2FA error:', error);
    } finally {
      setLoading(false);
    }
  };

  // Disable 2FA
  const handleDisable2FA = async () => {
    if (!window.confirm('Are you sure you want to disable two-factor authentication?')) return;

    setLoading(true);
    try {
      const userDocRef = doc(db, 'users', user.uid);
      await updateDoc(userDocRef, {
        twoFactorEnabled: false,
        backupCodes: [],
        updatedAt: new Date().toISOString()
      });

      setTwoFactorEnabled(false);
      setBackupCodes([]);
      toast.success('Two-factor authentication disabled');
    } catch (error) {
      toast.error('Error disabling 2FA');
      console.error('2FA error:', error);
    } finally {
      setLoading(false);
    }
  };

  // Copy backup codes
  const handleCopyBackupCodes = () => {
    const codesText = backupCodes.join('\n');
    navigator.clipboard.writeText(codesText);
    toast.success('Backup codes copied to clipboard');
  };

  // Download backup codes
  const handleDownloadBackupCodes = () => {
    const element = document.createElement('a');
    const file = new Blob([backupCodes.join('\n')], { type: 'text/plain' });
    element.href = URL.createObjectURL(file);
    element.download = 'aruviah-backup-codes.txt';
    document.body.appendChild(element);
    element.click();
    document.body.removeChild(element);
    toast.success('Backup codes downloaded');
  };

  return (
    <div className="space-y-6">
      {/* Security Overview */}
      <div className="bg-white rounded-lg shadow-md p-6">
        <h2 className="text-2xl font-bold text-gray-800 mb-4 flex items-center gap-2">
          <FiShield size={24} />
          Security Overview
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="bg-green-50 border border-green-200 rounded-lg p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-green-700 font-semibold">Password Status</p>
                <p className="text-lg font-bold text-green-900">Secure</p>
              </div>
              <FiCheck className="text-green-500" size={24} />
            </div>
          </div>

          <div className={`${twoFactorEnabled ? 'bg-green-50 border-green-200' : 'bg-yellow-50 border-yellow-200'} border rounded-lg p-4`}>
            <div className="flex items-center justify-between">
              <div>
                <p className={`text-sm font-semibold ${twoFactorEnabled ? 'text-green-700' : 'text-yellow-700'}`}>
                  Two-Factor Auth
                </p>
                <p className={`text-lg font-bold ${twoFactorEnabled ? 'text-green-900' : 'text-yellow-900'}`}>
                  {twoFactorEnabled ? 'Enabled' : 'Disabled'}
                </p>
              </div>
              {twoFactorEnabled ? (
                <FiCheck className="text-green-500" size={24} />
              ) : (
                <FiAlertTriangle className="text-yellow-500" size={24} />
              )}
            </div>
          </div>

          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-blue-700 font-semibold">Active Sessions</p>
                <p className="text-lg font-bold text-blue-900">{activeSessions.length}</p>
              </div>
              <FiSmartphone className="text-blue-500" size={24} />
            </div>
          </div>
        </div>
      </div>

      {/* Two-Factor Authentication */}
      <div className="bg-white rounded-lg shadow-md p-6">
        <h2 className="text-2xl font-bold text-gray-800 mb-4 flex items-center gap-2">
          <FiSmartphone size={24} />
          Two-Factor Authentication
        </h2>

        <p className="text-gray-600 mb-4">
          Add an extra layer of security to your account by requiring a second form of verification.
        </p>

        {!twoFactorEnabled ? (
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-4">
            <h3 className="font-semibold text-blue-900 mb-2">Benefits of Two-Factor Authentication:</h3>
            <ul className="text-sm text-blue-800 space-y-1">
              <li>• Protects your account from unauthorized access</li>
              <li>• Requires both password and verification code</li>
              <li>• Works with authenticator apps like Google Authenticator</li>
            </ul>
          </div>
        ) : (
          <div className="bg-green-50 border border-green-200 rounded-lg p-4 mb-4">
            <p className="text-green-800 font-semibold">
              ✓ Two-factor authentication is enabled and active
            </p>
          </div>
        )}

        <div className="flex gap-4">
          {twoFactorEnabled ? (
            <button
              onClick={handleDisable2FA}
              disabled={loading}
              className="flex items-center gap-2 bg-red-500 text-white px-6 py-2 rounded-lg hover:bg-red-600 transition disabled:opacity-50"
            >
              <FiTrash2 size={18} />
              Disable 2FA
            </button>
          ) : (
            <button
              onClick={handleEnable2FA}
              disabled={loading}
              className="flex items-center gap-2 bg-orange-500 text-white px-6 py-2 rounded-lg hover:bg-orange-600 transition disabled:opacity-50"
            >
              <FiCheck size={18} />
              {loading ? 'Enabling...' : 'Enable 2FA'}
            </button>
          )}
        </div>

        {/* Backup Codes */}
        {backupCodes.length > 0 && (
          <div className="mt-6 bg-amber-50 border border-amber-200 rounded-lg p-4">
            <h3 className="font-semibold text-amber-900 mb-3 flex items-center gap-2">
              <FiKey size={18} />
              Backup Codes
            </h3>
            <p className="text-sm text-amber-800 mb-3">
              Save these codes in a safe place. You can use them to access your account if you lose your authenticator device.
            </p>
            <div className="bg-white rounded p-3 mb-3 font-mono text-sm max-h-40 overflow-y-auto">
              {backupCodes.map((code, index) => (
                <div key={index} className="text-amber-900">{code}</div>
              ))}
            </div>
            <div className="flex gap-2">
              <button
                onClick={handleCopyBackupCodes}
                className="flex items-center gap-2 bg-amber-500 text-white px-4 py-2 rounded hover:bg-amber-600 transition text-sm"
              >
                <FiCheck size={16} />
                Copy Codes
              </button>
              <button
                onClick={handleDownloadBackupCodes}
                className="flex items-center gap-2 bg-amber-600 text-white px-4 py-2 rounded hover:bg-amber-700 transition text-sm"
              >
                <FiCheck size={16} />
                Download
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Active Sessions */}
      <div className="bg-white rounded-lg shadow-md p-6">
        <h2 className="text-2xl font-bold text-gray-800 mb-4 flex items-center gap-2">
          <FiSmartphone size={24} />
          Active Sessions
        </h2>

        <p className="text-gray-600 mb-4">
          Manage your active sessions and devices. Sign out of sessions you don't recognize.
        </p>

        <div className="space-y-4">
          {activeSessions.map(session => (
            <div key={session.id} className="border border-gray-200 rounded-lg p-4 flex justify-between items-start">
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-2">
                  <h3 className="font-semibold text-gray-800">{session.device}</h3>
                  {session.current && (
                    <span className="bg-green-100 text-green-800 text-xs px-2 py-1 rounded">
                      Current Session
                    </span>
                  )}
                </div>
                <p className="text-sm text-gray-600">📍 {session.location}</p>
                <p className="text-sm text-gray-600">🕐 Last active: {session.lastActive}</p>
                <p className="text-sm text-gray-500">IP: {session.ipAddress}</p>
              </div>
              {!session.current && (
                <button
                  onClick={() => handleRemoveSession(session.id)}
                  className="text-red-500 hover:text-red-700 transition ml-4"
                  title="Sign out of this session"
                >
                  <FiTrash2 size={20} />
                </button>
              )}
            </div>
          ))}
        </div>

        <button
          onClick={handleLogoutOtherSessions}
          disabled={loading || activeSessions.length <= 1}
          className="mt-4 bg-red-500 text-white px-6 py-2 rounded-lg hover:bg-red-600 transition disabled:opacity-50 disabled:cursor-not-allowed"
        >
          Sign Out All Other Sessions
        </button>
      </div>

      {/* Device Management */}
      <div className="bg-white rounded-lg shadow-md p-6">
        <h2 className="text-2xl font-bold text-gray-800 mb-4">Trusted Devices</h2>

        <p className="text-gray-600 mb-4">
          Devices you've verified with two-factor authentication will be marked as trusted.
        </p>

        <div className="border border-gray-200 rounded-lg p-4 text-center">
          <p className="text-gray-600">No trusted devices yet</p>
          <p className="text-sm text-gray-500 mt-2">
            Once you enable 2FA, verified devices will appear here
          </p>
        </div>
      </div>

      {/* Login Activity */}
      <div className="bg-white rounded-lg shadow-md p-6">
        <h2 className="text-2xl font-bold text-gray-800 mb-4">Login Activity</h2>

        <div className="space-y-3">
          <div className="flex justify-between items-center py-2 border-b">
            <div>
              <p className="font-semibold text-gray-800">Last login</p>
              <p className="text-sm text-gray-600">Today at 2:30 PM</p>
            </div>
            <p className="text-sm text-green-600">✓ Successful</p>
          </div>
          <div className="flex justify-between items-center py-2">
            <div>
              <p className="font-semibold text-gray-800">Previous login</p>
              <p className="text-sm text-gray-600">Yesterday at 5:15 PM</p>
            </div>
            <p className="text-sm text-green-600">✓ Successful</p>
          </div>
        </div>
      </div>

      {/* Security Tips */}
      <div className="bg-blue-50 border border-blue-200 rounded-lg p-6">
        <h3 className="font-semibold text-blue-900 mb-3 flex items-center gap-2">
          <FiShield size={20} />
          Security Tips
        </h3>
        <ul className="text-sm text-blue-800 space-y-2">
          <li>• Use a strong, unique password that you don't use elsewhere</li>
          <li>• Enable two-factor authentication for maximum security</li>
          <li>• Regularly review your active sessions</li>
          <li>• Don't share your backup codes with anyone</li>
          <li>• Sign out of sessions on devices you no longer use</li>
          <li>• Keep your contact information up to date</li>
        </ul>
      </div>
    </div>
  );
};

export default SecuritySettings;
