'use client';

import { useState } from 'react';
import { FiMail, FiGlobe, FiPlus, FiRefreshCw, FiCheck, FiX, FiAlertCircle, FiLock } from 'react-icons/fi';

export default function ExternalIntegrations() {
  const [activeTab, setActiveTab] = useState('email');
  const [isConnecting, setIsConnecting] = useState(false);
  const [isScanning, setIsScanning] = useState(false);
  const [success, setSuccess] = useState('');
  const [error, setError] = useState('');
  
  // Email connection form state
  const [emailForm, setEmailForm] = useState({
    email: '',
    password: '',
    server: '',
    port: '',
    useSSL: true,
    autoScan: true,
    scanFrequency: 'daily'
  });
  
  // Dropbox connection state
  const [dropboxConnected, setDropboxConnected] = useState(false);
  const [dropboxEmail, setDropboxEmail] = useState('');
  
  // Mock connected email accounts
  const [connectedEmails, setConnectedEmails] = useState([
    { id: '1', email: 'john.doe@example.com', lastScan: '2025-04-06T14:30:00Z', status: 'active', billsFound: 12 }
  ]);
  
  const handleEmailFormChange = (e) => {
    const { name, value, type, checked } = e.target;
    setEmailForm({
      ...emailForm,
      [name]: type === 'checkbox' ? checked : value
    });
  };
  
  const handleConnectEmail = async (e) => {
    e.preventDefault();
    setIsConnecting(true);
    setError('');
    setSuccess('');
    
    try {
      // This would be an API call in a real app
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      // Add the new email to connected accounts
      const newEmail = {
        id: `email_${Date.now()}`,
        email: emailForm.email,
        lastScan: new Date().toISOString(),
        status: 'active',
        billsFound: 0
      };
      
      setConnectedEmails([...connectedEmails, newEmail]);
      setSuccess(`Successfully connected ${emailForm.email}`);
      
      // Reset form
      setEmailForm({
        email: '',
        password: '',
        server: '',
        port: '',
        useSSL: true,
        autoScan: true,
        scanFrequency: 'daily'
      });
    } catch (err) {
      setError('Failed to connect email account. Please check your credentials and try again.');
    } finally {
      setIsConnecting(false);
    }
  };
  
  const handleConnectDropbox = async () => {
    setIsConnecting(true);
    setError('');
    setSuccess('');
    
    try {
      // This would redirect to Dropbox OAuth in a real app
      // For now, we'll simulate the OAuth flow
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      setDropboxConnected(true);
      setDropboxEmail('john.doe@example.com');
      setSuccess('Successfully connected to Dropbox');
    } catch (err) {
      setError('Failed to connect to Dropbox. Please try again.');
    } finally {
      setIsConnecting(false);
    }
  };
  
  const handleDisconnectDropbox = async () => {
    setIsConnecting(true);
    setError('');
    setSuccess('');
    
    try {
      // This would be an API call in a real app
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      setDropboxConnected(false);
      setDropboxEmail('');
      setSuccess('Successfully disconnected from Dropbox');
    } catch (err) {
      setError('Failed to disconnect from Dropbox. Please try again.');
    } finally {
      setIsConnecting(false);
    }
  };
  
  const handleDisconnectEmail = async (id) => {
    if (!window.confirm('Are you sure you want to disconnect this email account?')) {
      return;
    }
    
    setIsConnecting(true);
    setError('');
    setSuccess('');
    
    try {
      // This would be an API call in a real app
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      const updatedEmails = connectedEmails.filter(email => email.id !== id);
      setConnectedEmails(updatedEmails);
      setSuccess('Successfully disconnected email account');
    } catch (err) {
      setError('Failed to disconnect email account. Please try again.');
    } finally {
      setIsConnecting(false);
    }
  };
  
  const handleScanNow = async (id) => {
    setIsScanning(true);
    setError('');
    setSuccess('');
    
    try {
      // This would be an API call in a real app
      await new Promise(resolve => setTimeout(resolve, 3000));
      
      // Update the last scan time and randomly add some bills found
      const updatedEmails = connectedEmails.map(email => {
        if (email.id === id) {
          return {
            ...email,
            lastScan: new Date().toISOString(),
            billsFound: email.billsFound + Math.floor(Math.random() * 3)
          };
        }
        return email;
      });
      
      setConnectedEmails(updatedEmails);
      setSuccess('Scan completed successfully');
    } catch (err) {
      setError('Failed to scan email account. Please try again.');
    } finally {
      setIsScanning(false);
    }
  };
  
  const handleScanDropbox = async () => {
    setIsScanning(true);
    setError('');
    setSuccess('');
    
    try {
      // This would be an API call in a real app
      await new Promise(resolve => setTimeout(resolve, 3000));
      
      setSuccess('Dropbox scan completed successfully. Found 2 new bills.');
    } catch (err) {
      setError('Failed to scan Dropbox. Please try again.');
    } finally {
      setIsScanning(false);
    }
  };
  
  return (
    <div className="space-y-6">
      <div className="md:flex md:items-center md:justify-between">
        <div className="flex-1 min-w-0">
          <h2 className="text-2xl font-bold leading-7 text-gray-900 sm:text-3xl sm:truncate">
            External Integrations
          </h2>
          <p className="mt-1 text-sm text-gray-500">
            Connect your email and cloud storage accounts to automatically detect bills.
          </p>
        </div>
      </div>
      
      {error && (
        <div className="bg-red-50 border-l-4 border-red-400 p-4">
          <div className="flex">
            <div className="flex-shrink-0">
              <FiAlertCircle className="h-5 w-5 text-red-400" />
            </div>
            <div className="ml-3">
              <p className="text-sm text-red-700">{error}</p>
            </div>
          </div>
        </div>
      )}
      
      {success && (
        <div className="bg-green-50 border-l-4 border-green-400 p-4">
          <div className="flex">
            <div className="flex-shrink-0">
              <FiCheck className="h-5 w-5 text-green-400" />
            </div>
            <div className="ml-3">
              <p className="text-sm text-green-700">{success}</p>
            </div>
          </div>
        </div>
      )}
      
      <div className="bg-white shadow overflow-hidden sm:rounded-lg">
        <div className="border-b border-gray-200">
          <nav className="-mb-px flex space-x-8" aria-label="Tabs">
            <button
              onClick={() => setActiveTab('email')}
              className={`${
                activeTab === 'email'
                  ? 'border-blue-500 text-blue-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              } whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm`}
            >
              Email Integration
            </button>
            <button
              onClick={() => setActiveTab('dropbox')}
              className={`${
                activeTab === 'dropbox'
                  ? 'border-blue-500 text-blue-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              } whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm`}
            >
              Dropbox Integration
            </button>
          </nav>
        </div>
        
        <div className="px-4 py-5 sm:p-6">
          {/* Email Integration Tab */}
          {activeTab === 'email' && (
            <div className="space-y-6">
              <div>
                <h3 className="text-lg leading-6 font-medium text-gray-900">Connected Email Accounts</h3>
                <p className="mt-1 text-sm text-gray-500">
                  Connect your email accounts to automatically scan for bills in your inbox.
                </p>
              </div>
              
              {/* Connected Email Accounts */}
              {connectedEmails.length > 0 && (
                <div className="bg-gray-50 rounded-lg overflow-hidden">
                  <ul className="divide-y divide-gray-200">
                    {connectedEmails.map((email) => (
                      <li key={email.id} className="px-4 py-4 sm:px-6">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center">
                            <div className="flex-shrink-0">
                              <FiMail className="h-6 w-6 text-blue-500" />
                            </div>
                            <div className="ml-4">
                              <div className="text-sm font-medium text-gray-900">{email.email}</div>
                              <div className="text-sm text-gray-500">
                                Last scan: {new Date(email.lastScan).toLocaleString()} • 
                                Bills found: {email.billsFound}
                              </div>
                            </div>
                          </div>
                          <div className="flex space-x-2">
                            <button
                              type="button"
                              onClick={() => handleScanNow(email.id)}
                              disabled={isScanning}
                              className={`inline-flex items-center px-3 py-1.5 border border-transparent text-xs font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 ${
                                isScanning ? 'opacity-75 cursor-not-allowed' : ''
                              }`}
                            >
                              <FiRefreshCw className={`-ml-0.5 mr-1 h-4 w-4 ${isScanning ? 'animate-spin' : ''}`} />
                              {isScanning ? 'Scanning...' : 'Scan Now'}
                            </button>
                            <button
                              type="button"
                              onClick={() => handleDisconnectEmail(email.id)}
                              disabled={isConnecting}
                              className="inline-flex items-center px-3 py-1.5 border border-gray-300 shadow-sm text-xs font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                            >
                              Disconnect
                            </button>
                          </div>
                        </div>
                      </li>
                    ))}
                  </ul>
                </div>
              )}
              
              {/* Add New Email Account Form */}
              <div className="mt-6">
                <h4 className="text-md font-medium text-gray-900">Add New Email Account</h4>
                <form onSubmit={handleConnectEmail} className="mt-4 space-y-4">
                  <div className="grid grid-cols-1 gap-y-6 gap-x-4 sm:grid-cols-6">
                    <div className="sm:col-span-3">
                      <label htmlFor="email" className="block text-sm font-medium text-gray-700">
                        Email Address
                      </label>
                      <div className="mt-1">
                        <input
                          type="email"
                          name="email"
                          id="email"
                          value={emailForm.email}
                          onChange={handleEmailFormChange}
                          required
                          className="shadow-sm focus:ring-blue-500 focus:border-blue-500 block w-full sm:text-sm border-gray-300 rounded-md"
                        />
                      </div>
                    </div>
                    
                    <div className="sm:col-span-3">
                      <label htmlFor="password" className="block text-sm font-medium text-gray-700">
                        Password
                      </label>
                      <div className="mt-1 relative rounded-md shadow-sm">
                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                          <FiLock className="h-5 w-5 text-gray-400" />
                        </div>
                        <input
                          type="password"
                          name="password"
                          id="password"
                          value={emailForm.password}
                          onChange={handleEmailFormChange}
                          required
                          className="focus:ring-blue-500 focus:border-blue-500 block w-full pl-10 sm:text-sm border-gray-300 rounded-md"
                        />
                      </div>
                      <p className="mt-1 text-xs text-gray-500">
                        Your credentials are securely encrypted and only used to access your emails.
                      </p>
                    </div>
                    
                    <div className="sm:col-span-3">
                      <label htmlFor="server" className="block text-sm font-medium text-gray-700">
                        IMAP Server
                      </label>
                      <div className="mt-1">
                        <input
                          type="text"
                          name="server"
                          id="server"
                          value={emailForm.server}
                          onChange={handleEmailFormChange}
                          placeholder="imap.example.com"
                          className="shadow-sm focus:ring-blue-500 focus:border-blue-500 block w-full sm:text-sm border-gray-300 rounded-md"
                        />
                      </div>
                    </div>
                    
                    <div className="sm:col-span-3">
                      <label htmlFor="port" className="block text-sm font-medium text-gray-700">
                        Port
                      </label>
                      <div className="mt-1">
                        <input
                          type="text"
                          name="port"
                          id="port"
                          value={emailForm.port}
                          onChange={handleEmailFormChange}
                          placeholder="993"
                          className="shadow-sm focus:ring-blue-500 focus:border-blue-500 block w-full sm:text-sm border-gray-300 rounded-md"
                        />
                      </div>
                    </div>
                    
                    <div className="sm:col-span-6">
                      <div className="flex items-start">
                        <div className="flex items-center h-5">
                          <input
                            id="useSSL"
                            name="useSSL"
                            type="checkbox"
                            checked={emailForm.useSSL}
                            onChange={handleEmailFormChange}
                            className="focus:ring-blue-500 h-4 w-4 text-blue-600 border-gray-300 rounded"
                          />
                        </div>
                        <div className="ml-3 text-sm">
                          <label htmlFor="useSSL" className="font-medium text-gray-700">
                            Use SSL/TLS
                          </label>
                          <p className="text-gray-500">Recommended f
(Content truncated due to size limit. Use line ranges to read in chunks)