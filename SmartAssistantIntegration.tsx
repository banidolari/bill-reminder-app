'use client';

import { useState } from 'react';
import { FiMic, FiVolume2, FiCheck, FiX, FiAlertCircle, FiSettings, FiHelpCircle } from 'react-icons/fi';

export default function SmartAssistantIntegration() {
  const [activeTab, setActiveTab] = useState('setup');
  const [googleAssistantConnected, setGoogleAssistantConnected] = useState(false);
  const [alexaConnected, setAlexaConnected] = useState(false);
  const [isConnecting, setIsConnecting] = useState(false);
  const [success, setSuccess] = useState('');
  const [error, setError] = useState('');
  
  // Voice command settings
  const [voiceSettings, setVoiceSettings] = useState({
    enableBillStatus: true,
    enablePaymentReminders: true,
    enableBillSummary: true,
    enableQuickPay: false,
    notificationVoice: 'female'
  });
  
  const handleVoiceSettingChange = (e) => {
    const { name, value, type, checked } = e.target;
    setVoiceSettings({
      ...voiceSettings,
      [name]: type === 'checkbox' ? checked : value
    });
  };
  
  const handleConnectGoogleAssistant = async () => {
    setIsConnecting(true);
    setError('');
    setSuccess('');
    
    try {
      // This would be an API call in a real app
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      setGoogleAssistantConnected(true);
      setSuccess('Successfully connected to Google Assistant');
    } catch (err) {
      setError('Failed to connect to Google Assistant. Please try again.');
    } finally {
      setIsConnecting(false);
    }
  };
  
  const handleDisconnectGoogleAssistant = async () => {
    setIsConnecting(true);
    setError('');
    setSuccess('');
    
    try {
      // This would be an API call in a real app
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      setGoogleAssistantConnected(false);
      setSuccess('Successfully disconnected from Google Assistant');
    } catch (err) {
      setError('Failed to disconnect from Google Assistant. Please try again.');
    } finally {
      setIsConnecting(false);
    }
  };
  
  const handleConnectAlexa = async () => {
    setIsConnecting(true);
    setError('');
    setSuccess('');
    
    try {
      // This would be an API call in a real app
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      setAlexaConnected(true);
      setSuccess('Successfully connected to Amazon Alexa');
    } catch (err) {
      setError('Failed to connect to Amazon Alexa. Please try again.');
    } finally {
      setIsConnecting(false);
    }
  };
  
  const handleDisconnectAlexa = async () => {
    setIsConnecting(true);
    setError('');
    setSuccess('');
    
    try {
      // This would be an API call in a real app
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      setAlexaConnected(false);
      setSuccess('Successfully disconnected from Amazon Alexa');
    } catch (err) {
      setError('Failed to disconnect from Amazon Alexa. Please try again.');
    } finally {
      setIsConnecting(false);
    }
  };
  
  const handleSaveVoiceSettings = async () => {
    setIsConnecting(true);
    setError('');
    setSuccess('');
    
    try {
      // This would be an API call in a real app
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      setSuccess('Voice command settings saved successfully');
    } catch (err) {
      setError('Failed to save voice command settings. Please try again.');
    } finally {
      setIsConnecting(false);
    }
  };
  
  return (
    <div className="space-y-6">
      <div className="md:flex md:items-center md:justify-between">
        <div className="flex-1 min-w-0">
          <h2 className="text-2xl font-bold leading-7 text-gray-900 sm:text-3xl sm:truncate">
            Smart Assistant Integration
          </h2>
          <p className="mt-1 text-sm text-gray-500">
            Connect your bill reminder app to smart assistants like Google Assistant and Amazon Alexa.
          </p>
        </div>
      </div>
      
      {error && (
        <div className="bg-red-50 border-l-4 border-red-400 p-4">
          <div className="flex">
            <div className="flex-shrink-0">
              <FiX className="h-5 w-5 text-red-400" />
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
              onClick={() => setActiveTab('setup')}
              className={`${
                activeTab === 'setup'
                  ? 'border-blue-500 text-blue-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              } whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm`}
            >
              Setup
            </button>
            <button
              onClick={() => setActiveTab('commands')}
              className={`${
                activeTab === 'commands'
                  ? 'border-blue-500 text-blue-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              } whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm`}
            >
              Voice Commands
            </button>
            <button
              onClick={() => setActiveTab('settings')}
              className={`${
                activeTab === 'settings'
                  ? 'border-blue-500 text-blue-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              } whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm`}
            >
              Settings
            </button>
          </nav>
        </div>
        
        <div className="px-4 py-5 sm:p-6">
          {/* Setup Tab */}
          {activeTab === 'setup' && (
            <div className="space-y-6">
              <div>
                <h3 className="text-lg leading-6 font-medium text-gray-900">Connect Smart Assistants</h3>
                <p className="mt-1 text-sm text-gray-500">
                  Link your account to voice assistants to check bill status, get reminders, and more.
                </p>
              </div>
              
              <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
                {/* Google Assistant */}
                <div className="bg-gray-50 p-6 rounded-lg">
                  <div className="flex items-center">
                    <div className="flex-shrink-0">
                      <div className="h-12 w-12 rounded-full bg-white flex items-center justify-center">
                        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="32" height="32">
                          <circle cx="12" cy="12" r="10" fill="#4285F4" />
                          <circle cx="12" cy="12" r="4" fill="#FFFFFF" />
                          <rect x="11" y="3" width="2" height="4" fill="#EA4335" />
                          <rect x="11" y="17" width="2" height="4" fill="#34A853" />
                          <rect x="3" y="11" width="4" height="2" fill="#FBBC05" />
                          <rect x="17" y="11" width="4" height="2" fill="#4285F4" />
                        </svg>
                      </div>
                    </div>
                    <div className="ml-4">
                      <h4 className="text-lg font-medium text-gray-900">Google Assistant</h4>
                      <p className="text-sm text-gray-500">
                        Use voice commands with Google Assistant devices.
                      </p>
                    </div>
                  </div>
                  
                  <div className="mt-6">
                    {googleAssistantConnected ? (
                      <div className="space-y-4">
                        <div className="flex items-center">
                          <FiCheck className="h-5 w-5 text-green-500" />
                          <span className="ml-2 text-sm text-gray-700">Connected</span>
                        </div>
                        
                        <button
                          type="button"
                          onClick={handleDisconnectGoogleAssistant}
                          disabled={isConnecting}
                          className={`w-full inline-flex justify-center py-2 px-4 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 ${
                            isConnecting ? 'opacity-75 cursor-not-allowed' : ''
                          }`}
                        >
                          Disconnect
                        </button>
                      </div>
                    ) : (
                      <button
                        type="button"
                        onClick={handleConnectGoogleAssistant}
                        disabled={isConnecting}
                        className={`w-full inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 ${
                          isConnecting ? 'opacity-75 cursor-not-allowed' : ''
                        }`}
                      >
                        {isConnecting ? 'Connecting...' : 'Connect Google Assistant'}
                      </button>
                    )}
                  </div>
                </div>
                
                {/* Amazon Alexa */}
                <div className="bg-gray-50 p-6 rounded-lg">
                  <div className="flex items-center">
                    <div className="flex-shrink-0">
                      <div className="h-12 w-12 rounded-full bg-white flex items-center justify-center">
                        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="32" height="32">
                          <circle cx="12" cy="12" r="12" fill="#00CAFF" />
                          <path d="M7,12 C7,9.23857625 9.23857625,7 12,7 C14.7614237,7 17,9.23857625 17,12" stroke="white" strokeWidth="2" fill="none" />
                          <circle cx="12" cy="12" r="2" fill="white" />
                        </svg>
                      </div>
                    </div>
                    <div className="ml-4">
                      <h4 className="text-lg font-medium text-gray-900">Amazon Alexa</h4>
                      <p className="text-sm text-gray-500">
                        Use voice commands with Alexa-enabled devices.
                      </p>
                    </div>
                  </div>
                  
                  <div className="mt-6">
                    {alexaConnected ? (
                      <div className="space-y-4">
                        <div className="flex items-center">
                          <FiCheck className="h-5 w-5 text-green-500" />
                          <span className="ml-2 text-sm text-gray-700">Connected</span>
                        </div>
                        
                        <button
                          type="button"
                          onClick={handleDisconnectAlexa}
                          disabled={isConnecting}
                          className={`w-full inline-flex justify-center py-2 px-4 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 ${
                            isConnecting ? 'opacity-75 cursor-not-allowed' : ''
                          }`}
                        >
                          Disconnect
                        </button>
                      </div>
                    ) : (
                      <button
                        type="button"
                        onClick={handleConnectAlexa}
                        disabled={isConnecting}
                        className={`w-full inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 ${
                          isConnecting ? 'opacity-75 cursor-not-allowed' : ''
                        }`}
                      >
                        {isConnecting ? 'Connecting...' : 'Connect Amazon Alexa'}
                      </button>
                    )}
                  </div>
                </div>
              </div>
              
              <div className="bg-blue-50 p-4 rounded-md">
                <div className="flex">
                  <div className="flex-shrink-0">
                    <FiAlertCircle className="h-5 w-5 text-blue-400" />
                  </div>
                  <div className="ml-3">
                    <h3 className="text-sm font-medium text-blue-800">How it works</h3>
                    <div className="mt-2 text-sm text-blue-700">
                      <p>
                        After connecting your smart assistant, you'll need to enable the Bill Reminder skill in your
                        assistant's app. Once enabled, you can use voice commands to check bill status, get reminders,
                        and more.
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}
          
          {/* Voice Commands Tab */}
          {activeTab === 'commands' && (
            <div className="space-y-6">
              <div>
                <h3 className="text-lg leading-6 font-medium text-gray-900">Available Voice Commands</h3>
                <p className="mt-1 text-sm text-gray-500">
                  Here are the voice commands you can use with your smart assistants.
                </p>
              </div>
              
              <div className="bg-gray-50 overflow-hidden shadow rounded-lg divide-y divide-gray-200">
                <div className="px-4 py-5 sm:px-6">
                  <div className="flex items-center">
                    <FiMic className="h-5 w-5 text-gray-400 mr-2" />
                    <h3 className="text-lg font-medium leading-6 text-gray-900">Bill Status Commands</h3>
                  </div>
                </div>
                <div className="px-4 py-5 sm:p-6">
                  <ul className="space-y-4">
                    <li className="flex items-start">
                      <span className="inline-flex items-center justify-center h-6 w-6 rounded-full bg-blue-100 text-blue-800 text-xs font-medium mr-3 mt-0.5">1</span>
                      <div>
                        <p className="text-sm font-medium text-gray-900">"Hey Google/Alexa, ask Bill Reminder about my upcoming bills"</p>
                        <p className="text-sm text-gray-500">Get a summary of bills due in the next 7 days</p>
                      </div>
                    </li>
                    <li className="flex items-start">
                      <span className="inline-flex items-center justify-center h-6 w-6 rounded-full bg-blue-100 text-blue-800 text-xs font-medium mr-3 mt-0.5">2</span>
                      <div>
                        <p className="text-sm font-medium text-gray-900">"Hey Googl
(Content truncated due to size limit. Use line ranges to read in chunks)