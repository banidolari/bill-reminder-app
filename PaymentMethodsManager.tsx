'use client';

import { useState } from 'react';
import { FiCreditCard, FiPlus, FiEdit2, FiTrash2, FiCheck, FiX, FiDollarSign, FiLock } from 'react-icons/fi';

// Mock data for payment methods
const initialPaymentMethods = [
  { id: '1', name: 'Chase Credit Card', type: 'credit', last4: '4567', expiryDate: '05/27', isDefault: true },
  { id: '2', name: 'Bank of America Checking', type: 'bank', accountNumber: '****3456', routingNumber: '****1234', isDefault: false },
];

export default function PaymentMethodsManager() {
  const [paymentMethods, setPaymentMethods] = useState(initialPaymentMethods);
  const [isAddingMethod, setIsAddingMethod] = useState(false);
  const [editingMethodId, setEditingMethodId] = useState(null);
  const [methodType, setMethodType] = useState('credit');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  
  // Form state for credit card
  const [creditCardForm, setCreditCardForm] = useState({
    name: '',
    cardNumber: '',
    expiryDate: '',
    cvv: '',
    isDefault: false
  });
  
  // Form state for bank account
  const [bankAccountForm, setBankAccountForm] = useState({
    name: '',
    accountNumber: '',
    routingNumber: '',
    accountType: 'checking',
    isDefault: false
  });
  
  // Form state for digital wallet
  const [digitalWalletForm, setDigitalWalletForm] = useState({
    provider: 'paypal',
    email: '',
    isDefault: false
  });
  
  const handleCreditCardChange = (e) => {
    const { name, value, type, checked } = e.target;
    setCreditCardForm({
      ...creditCardForm,
      [name]: type === 'checkbox' ? checked : value
    });
  };
  
  const handleBankAccountChange = (e) => {
    const { name, value, type, checked } = e.target;
    setBankAccountForm({
      ...bankAccountForm,
      [name]: type === 'checkbox' ? checked : value
    });
  };
  
  const handleDigitalWalletChange = (e) => {
    const { name, value, type, checked } = e.target;
    setDigitalWalletForm({
      ...digitalWalletForm,
      [name]: type === 'checkbox' ? checked : value
    });
  };
  
  const handleAddPaymentMethod = () => {
    setError('');
    setSuccess('');
    
    try {
      let newMethod;
      
      if (methodType === 'credit') {
        // Validate credit card form
        if (!creditCardForm.name || !creditCardForm.cardNumber || !creditCardForm.expiryDate) {
          setError('Please fill in all required fields');
          return;
        }
        
        // Create new credit card method
        newMethod = {
          id: `card_${Date.now()}`,
          name: creditCardForm.name,
          type: 'credit',
          last4: creditCardForm.cardNumber.slice(-4),
          expiryDate: creditCardForm.expiryDate,
          isDefault: creditCardForm.isDefault
        };
        
        // Reset form
        setCreditCardForm({
          name: '',
          cardNumber: '',
          expiryDate: '',
          cvv: '',
          isDefault: false
        });
      } else if (methodType === 'bank') {
        // Validate bank account form
        if (!bankAccountForm.name || !bankAccountForm.accountNumber || !bankAccountForm.routingNumber) {
          setError('Please fill in all required fields');
          return;
        }
        
        // Create new bank account method
        newMethod = {
          id: `bank_${Date.now()}`,
          name: bankAccountForm.name,
          type: 'bank',
          accountNumber: `****${bankAccountForm.accountNumber.slice(-4)}`,
          routingNumber: `****${bankAccountForm.routingNumber.slice(-4)}`,
          accountType: bankAccountForm.accountType,
          isDefault: bankAccountForm.isDefault
        };
        
        // Reset form
        setBankAccountForm({
          name: '',
          accountNumber: '',
          routingNumber: '',
          accountType: 'checking',
          isDefault: false
        });
      } else if (methodType === 'digital') {
        // Validate digital wallet form
        if (!digitalWalletForm.email) {
          setError('Please fill in all required fields');
          return;
        }
        
        // Create new digital wallet method
        newMethod = {
          id: `wallet_${Date.now()}`,
          name: `${digitalWalletForm.provider.charAt(0).toUpperCase() + digitalWalletForm.provider.slice(1)}`,
          type: 'digital',
          provider: digitalWalletForm.provider,
          email: digitalWalletForm.email,
          isDefault: digitalWalletForm.isDefault
        };
        
        // Reset form
        setDigitalWalletForm({
          provider: 'paypal',
          email: '',
          isDefault: false
        });
      }
      
      // If new method is set as default, update other methods
      if (newMethod.isDefault) {
        setPaymentMethods(paymentMethods.map(method => ({
          ...method,
          isDefault: false
        })));
      }
      
      // Add new method to list
      setPaymentMethods([...paymentMethods, newMethod]);
      setSuccess('Payment method added successfully');
      setIsAddingMethod(false);
      
      // Clear success message after 3 seconds
      setTimeout(() => {
        setSuccess('');
      }, 3000);
    } catch (err) {
      setError('Failed to add payment method. Please try again.');
    }
  };
  
  const handleEditPaymentMethod = (id) => {
    const methodToEdit = paymentMethods.find(method => method.id === id);
    setEditingMethodId(id);
    
    if (methodToEdit.type === 'credit') {
      setCreditCardForm({
        name: methodToEdit.name,
        cardNumber: `************${methodToEdit.last4}`,
        expiryDate: methodToEdit.expiryDate,
        cvv: '',
        isDefault: methodToEdit.isDefault
      });
      setMethodType('credit');
    } else if (methodToEdit.type === 'bank') {
      setBankAccountForm({
        name: methodToEdit.name,
        accountNumber: methodToEdit.accountNumber,
        routingNumber: methodToEdit.routingNumber,
        accountType: methodToEdit.accountType || 'checking',
        isDefault: methodToEdit.isDefault
      });
      setMethodType('bank');
    } else if (methodToEdit.type === 'digital') {
      setDigitalWalletForm({
        provider: methodToEdit.provider,
        email: methodToEdit.email,
        isDefault: methodToEdit.isDefault
      });
      setMethodType('digital');
    }
    
    setIsAddingMethod(true);
  };
  
  const handleUpdatePaymentMethod = () => {
    setError('');
    setSuccess('');
    
    try {
      const updatedMethods = paymentMethods.map(method => {
        if (method.id === editingMethodId) {
          if (methodType === 'credit') {
            return {
              ...method,
              name: creditCardForm.name,
              expiryDate: creditCardForm.expiryDate,
              isDefault: creditCardForm.isDefault
            };
          } else if (methodType === 'bank') {
            return {
              ...method,
              name: bankAccountForm.name,
              accountType: bankAccountForm.accountType,
              isDefault: bankAccountForm.isDefault
            };
          } else if (methodType === 'digital') {
            return {
              ...method,
              provider: digitalWalletForm.provider,
              email: digitalWalletForm.email,
              name: `${digitalWalletForm.provider.charAt(0).toUpperCase() + digitalWalletForm.provider.slice(1)}`,
              isDefault: digitalWalletForm.isDefault
            };
          }
        }
        
        // If another method is being set as default, update other methods
        if ((methodType === 'credit' && creditCardForm.isDefault) ||
            (methodType === 'bank' && bankAccountForm.isDefault) ||
            (methodType === 'digital' && digitalWalletForm.isDefault)) {
          return {
            ...method,
            isDefault: method.id === editingMethodId
          };
        }
        
        return method;
      });
      
      setPaymentMethods(updatedMethods);
      setSuccess('Payment method updated successfully');
      setIsAddingMethod(false);
      setEditingMethodId(null);
      
      // Reset forms
      setCreditCardForm({
        name: '',
        cardNumber: '',
        expiryDate: '',
        cvv: '',
        isDefault: false
      });
      
      setBankAccountForm({
        name: '',
        accountNumber: '',
        routingNumber: '',
        accountType: 'checking',
        isDefault: false
      });
      
      setDigitalWalletForm({
        provider: 'paypal',
        email: '',
        isDefault: false
      });
      
      // Clear success message after 3 seconds
      setTimeout(() => {
        setSuccess('');
      }, 3000);
    } catch (err) {
      setError('Failed to update payment method. Please try again.');
    }
  };
  
  const handleDeletePaymentMethod = (id) => {
    if (!window.confirm('Are you sure you want to delete this payment method?')) {
      return;
    }
    
    setError('');
    setSuccess('');
    
    try {
      const methodToDelete = paymentMethods.find(method => method.id === id);
      const updatedMethods = paymentMethods.filter(method => method.id !== id);
      
      // If deleted method was default, set first remaining method as default
      if (methodToDelete.isDefault && updatedMethods.length > 0) {
        updatedMethods[0].isDefault = true;
      }
      
      setPaymentMethods(updatedMethods);
      setSuccess('Payment method deleted successfully');
      
      // Clear success message after 3 seconds
      setTimeout(() => {
        setSuccess('');
      }, 3000);
    } catch (err) {
      setError('Failed to delete payment method. Please try again.');
    }
  };
  
  const handleSetDefault = (id) => {
    setError('');
    setSuccess('');
    
    try {
      const updatedMethods = paymentMethods.map(method => ({
        ...method,
        isDefault: method.id === id
      }));
      
      setPaymentMethods(updatedMethods);
      setSuccess('Default payment method updated');
      
      // Clear success message after 3 seconds
      setTimeout(() => {
        setSuccess('');
      }, 3000);
    } catch (err) {
      setError('Failed to update default payment method. Please try again.');
    }
  };
  
  const handleCancel = () => {
    setIsAddingMethod(false);
    setEditingMethodId(null);
    setError('');
    
    // Reset forms
    setCreditCardForm({
      name: '',
      cardNumber: '',
      expiryDate: '',
      cvv: '',
      isDefault: false
    });
    
    setBankAccountForm({
      name: '',
      accountNumber: '',
      routingNumber: '',
      accountType: 'checking',
      isDefault: false
    });
    
    setDigitalWalletForm({
      provider: 'paypal',
      email: '',
      isDefault: false
    });
  };
  
  return (
    <div className="space-y-6">
      <div className="md:flex md:items-center md:justify-between">
        <div className="flex-1 min-w-0">
          <h2 className="text-2xl font-bold leading-7 text-gray-900 sm:text-3xl sm:truncate">
            Payment Methods
          </h2>
          <p className="mt-1 text-sm text-gray-500">
            Manage your payment methods for bill payments.
          </p>
        </div>
        {!isAddingMethod && (
          <div className="mt-4 flex md:mt-0 md:ml-4">
            <button
              type="button"
              onClick={() => setIsAddingMethod(true)}
              className="ml-3 inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
            >
              <FiPlus className="-ml-1 mr-2 h-5 w-5" />
              Add Payment Method
            </button>
          </div>
        )}
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
      
      {/* Add/Edit Payment Method Form */}
      {isAddingMethod && (
        <div className="bg-white shadow px-4 py-5 sm:rounded-lg sm:p-6">
          <div className="md:grid md:grid-cols-3 md:gap-6">
            <div className="md:col-span-1">
              <h3 className="text-lg font-medium leading-6 text-gray-900">
                {editingMethodId ? 'Edit Payment Method' : 'Add Payment Method'}
              </h3>
              <p className="mt-1 text-sm text-gray-500">
                {editingMethodId
                  ? 'Update your payment method details.'
                  : 'Add a new payment method to use for bill payments.'}
              </p>
              
              <div className="mt-4">
                <div className="space-y-4">
                  <div className="flex items-center">
                    <input
                      id="credit-card"
                      name="payment-type"
                      type="radio"
                      checked={methodType === 'credit'}
                      onChange={() => setMethodType('credit')}
                      className="focus:ring-blue-500 h-4 w-4 text-blue-600 border-gray-300"
                    />
                    <label htmlFor="credit-card" className="ml-3 block text-sm font-medium text-gray-700">
                      Credit/Debit Card
                    </label>
                  </div>
                  <div className="flex items-center">
                    <input
                      id="bank-account"
                      name="payment-type"
                      type="radio"
                      checked={methodType === 'bank'}
                      onChange={() => setMethodType('bank')}
                      className="focus:ring-blue-500 h-4 w-4 text-blue-600 border-gray-300"
                    />
                    <label htmlFor="bank-account" className="ml-3 block text-sm font-medium text-gray-700">
                      Bank Account
                    </label>
                  </div>
                  <div className="flex items-center">
                    <input
                      id="digital-wallet"
                      name="payment-type"
                      type="radio"
                      checked={methodType === 'digital'}
                      onChange={() => setMethodType('digital')}
                      className="focus:ring-blue-500 h-4 w-4 text-blue-600 border-gray-300"
                    />
                    <label htmlFor="digital-wallet" className="ml-3 block text-sm font-medium text-gray-700">
                      Digital Wallet
                    </label>
                  </div>
                </div>
              </div>
            </div>
            
            <div className="mt-5 md:mt-0 md:col-span-2">
              {/* Credit Card Form */}
              {methodType === 'credit' && (
                <div className="grid grid-cols-6 gap-6">
                  <div className="col-span-6 sm:col-span-4">
                    <label htmlFor="card-name" className="block text-sm font-medium text-gray-700">
                      Card Name
                    </label>
                    <input
                      type="text"
                      name="name"
                      id="card-name"
                      value={creditCardForm.name}
                      onC
(Content truncated due to size limit. Use line ranges to read in chunks)