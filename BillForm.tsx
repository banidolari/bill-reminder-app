'use client';

import { useState } from 'react';
import { FiCalendar, FiDollarSign, FiTag, FiFileText, FiRepeat, FiCreditCard, FiSave } from 'react-icons/fi';

// Mock data for categories
const categories = [
  { id: 'cat_default_utilities', name: 'Utilities', color: '#3B82F6' },
  { id: 'cat_default_rent', name: 'Rent/Mortgage', color: '#10B981' },
  { id: 'cat_default_subscription', name: 'Subscriptions', color: '#F59E0B' },
  { id: 'cat_default_insurance', name: 'Insurance', color: '#8B5CF6' },
  { id: 'cat_default_credit', name: 'Credit Cards', color: '#EF4444' },
  { id: 'cat_default_other', name: 'Other', color: '#6B7280' },
];

export default function BillForm({ bill = null }) {
  // Initialize form state with bill data if editing, or empty values if creating
  const [formData, setFormData] = useState({
    name: bill?.name || '',
    amount: bill?.amount || '',
    dueDate: bill?.dueDate || '',
    categoryId: bill?.categoryId || '',
    recurrence: bill?.recurrence || 'none',
    paymentMethod: bill?.paymentMethod || '',
    notes: bill?.notes || '',
    notificationType: bill?.notificationType || 'in-app',
    daysBefore: bill?.daysBefore || 3,
    enableNotifications: bill?.enableNotifications !== false,
  });

  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData({
      ...formData,
      [name]: type === 'checkbox' ? checked : value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    setIsLoading(true);

    try {
      // This will be replaced with actual API call
      console.log('Saving bill:', formData);
      
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      setSuccess(bill ? 'Bill updated successfully!' : 'Bill created successfully!');
      
      // In a real app, we would redirect or clear the form here
      if (!bill) {
        setFormData({
          name: '',
          amount: '',
          dueDate: '',
          categoryId: '',
          recurrence: 'none',
          paymentMethod: '',
          notes: '',
          notificationType: 'in-app',
          daysBefore: 3,
          enableNotifications: true,
        });
      }
    } catch (err) {
      setError('Failed to save bill. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="max-w-3xl mx-auto">
      <div className="md:grid md:grid-cols-3 md:gap-6">
        <div className="md:col-span-1">
          <div className="px-4 sm:px-0">
            <h3 className="text-lg font-medium leading-6 text-gray-900">
              {bill ? 'Edit Bill' : 'Add New Bill'}
            </h3>
            <p className="mt-1 text-sm text-gray-600">
              {bill
                ? 'Update the details of your existing bill.'
                : 'Enter the details of your bill to start tracking it.'}
            </p>
          </div>
        </div>
        <div className="mt-5 md:mt-0 md:col-span-2">
          <form onSubmit={handleSubmit}>
            <div className="shadow overflow-hidden sm:rounded-md">
              <div className="px-4 py-5 bg-white sm:p-6">
                {error && (
                  <div className="mb-4 bg-red-50 border-l-4 border-red-400 p-4">
                    <div className="flex">
                      <div className="ml-3">
                        <p className="text-sm text-red-700">{error}</p>
                      </div>
                    </div>
                  </div>
                )}
                
                {success && (
                  <div className="mb-4 bg-green-50 border-l-4 border-green-400 p-4">
                    <div className="flex">
                      <div className="ml-3">
                        <p className="text-sm text-green-700">{success}</p>
                      </div>
                    </div>
                  </div>
                )}
                
                <div className="grid grid-cols-6 gap-6">
                  {/* Bill Name */}
                  <div className="col-span-6 sm:col-span-4">
                    <label htmlFor="name" className="block text-sm font-medium text-gray-700">
                      Bill Name
                    </label>
                    <div className="mt-1 relative rounded-md shadow-sm">
                      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <FiFileText className="h-5 w-5 text-gray-400" />
                      </div>
                      <input
                        type="text"
                        name="name"
                        id="name"
                        value={formData.name}
                        onChange={handleChange}
                        className="focus:ring-blue-500 focus:border-blue-500 block w-full pl-10 sm:text-sm border-gray-300 rounded-md"
                        placeholder="e.g., Electricity Bill"
                        required
                      />
                    </div>
                  </div>

                  {/* Amount */}
                  <div className="col-span-6 sm:col-span-3">
                    <label htmlFor="amount" className="block text-sm font-medium text-gray-700">
                      Amount
                    </label>
                    <div className="mt-1 relative rounded-md shadow-sm">
                      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <FiDollarSign className="h-5 w-5 text-gray-400" />
                      </div>
                      <input
                        type="number"
                        name="amount"
                        id="amount"
                        value={formData.amount}
                        onChange={handleChange}
                        className="focus:ring-blue-500 focus:border-blue-500 block w-full pl-10 sm:text-sm border-gray-300 rounded-md"
                        placeholder="0.00"
                        step="0.01"
                        min="0"
                        required
                      />
                    </div>
                  </div>

                  {/* Due Date */}
                  <div className="col-span-6 sm:col-span-3">
                    <label htmlFor="dueDate" className="block text-sm font-medium text-gray-700">
                      Due Date
                    </label>
                    <div className="mt-1 relative rounded-md shadow-sm">
                      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <FiCalendar className="h-5 w-5 text-gray-400" />
                      </div>
                      <input
                        type="date"
                        name="dueDate"
                        id="dueDate"
                        value={formData.dueDate}
                        onChange={handleChange}
                        className="focus:ring-blue-500 focus:border-blue-500 block w-full pl-10 sm:text-sm border-gray-300 rounded-md"
                        required
                      />
                    </div>
                  </div>

                  {/* Category */}
                  <div className="col-span-6 sm:col-span-3">
                    <label htmlFor="categoryId" className="block text-sm font-medium text-gray-700">
                      Category
                    </label>
                    <div className="mt-1 relative rounded-md shadow-sm">
                      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <FiTag className="h-5 w-5 text-gray-400" />
                      </div>
                      <select
                        id="categoryId"
                        name="categoryId"
                        value={formData.categoryId}
                        onChange={handleChange}
                        className="focus:ring-blue-500 focus:border-blue-500 block w-full pl-10 sm:text-sm border-gray-300 rounded-md"
                        required
                      >
                        <option value="">Select a category</option>
                        {categories.map((category) => (
                          <option key={category.id} value={category.id}>
                            {category.name}
                          </option>
                        ))}
                      </select>
                    </div>
                  </div>

                  {/* Recurrence */}
                  <div className="col-span-6 sm:col-span-3">
                    <label htmlFor="recurrence" className="block text-sm font-medium text-gray-700">
                      Recurrence
                    </label>
                    <div className="mt-1 relative rounded-md shadow-sm">
                      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <FiRepeat className="h-5 w-5 text-gray-400" />
                      </div>
                      <select
                        id="recurrence"
                        name="recurrence"
                        value={formData.recurrence}
                        onChange={handleChange}
                        className="focus:ring-blue-500 focus:border-blue-500 block w-full pl-10 sm:text-sm border-gray-300 rounded-md"
                      >
                        <option value="none">One-time</option>
                        <option value="daily">Daily</option>
                        <option value="weekly">Weekly</option>
                        <option value="monthly">Monthly</option>
                        <option value="quarterly">Quarterly</option>
                        <option value="annually">Annually</option>
                      </select>
                    </div>
                  </div>

                  {/* Payment Method */}
                  <div className="col-span-6 sm:col-span-3">
                    <label htmlFor="paymentMethod" className="block text-sm font-medium text-gray-700">
                      Payment Method
                    </label>
                    <div className="mt-1 relative rounded-md shadow-sm">
                      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <FiCreditCard className="h-5 w-5 text-gray-400" />
                      </div>
                      <input
                        type="text"
                        name="paymentMethod"
                        id="paymentMethod"
                        value={formData.paymentMethod}
                        onChange={handleChange}
                        className="focus:ring-blue-500 focus:border-blue-500 block w-full pl-10 sm:text-sm border-gray-300 rounded-md"
                        placeholder="e.g., Credit Card, Bank Transfer"
                      />
                    </div>
                  </div>

                  {/* Notes */}
                  <div className="col-span-6">
                    <label htmlFor="notes" className="block text-sm font-medium text-gray-700">
                      Notes
                    </label>
                    <div className="mt-1">
                      <textarea
                        id="notes"
                        name="notes"
                        rows={3}
                        value={formData.notes}
                        onChange={handleChange}
                        className="shadow-sm focus:ring-blue-500 focus:border-blue-500 block w-full sm:text-sm border-gray-300 rounded-md"
                        placeholder="Additional information about this bill"
                      />
                    </div>
                  </div>

                  {/* Notification Settings */}
                  <div className="col-span-6">
                    <h4 className="text-sm font-medium text-gray-700 mb-2">Notification Settings</h4>
                    
                    <div className="flex items-start mb-4">
                      <div className="flex items-center h-5">
                        <input
                          id="enableNotifications"
                          name="enableNotifications"
                          type="checkbox"
                          checked={formData.enableNotifications}
                          onChange={handleChange}
                          className="focus:ring-blue-500 h-4 w-4 text-blue-600 border-gray-300 rounded"
                        />
                      </div>
                      <div className="ml-3 text-sm">
                        <label htmlFor="enableNotifications" className="font-medium text-gray-700">
                          Enable notifications for this bill
                        </label>
                      </div>
                    </div>

                    {formData.enableNotifications && (
                      <div className="grid grid-cols-6 gap-6">
                        <div className="col-span-6 sm:col-span-3">
                          <label htmlFor="notificationType" className="block text-sm font-medium text-gray-700">
                            Notification Type
                          </label>
                          <select
                            id="notificationType"
                            name="notificationType"
                            value={formData.notificationType}
                            onChange={handleChange}
                            className="mt-1 block w-full py-2 px-3 border border-gray-300 bg-white rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                          >
                            <option value="in-app">In-app only</option>
                            <option value="email">Email only</option>
                            <option value="both">Both in-app and email</option>
                          </select>
                        </div>

                        <div className="col-span-6 sm:col-span-3">
                          <label htmlFor="daysBefore" className="block text-sm font-medium text-gray-700">
                            Days Before Due Date
                          </label>
                          <select
                            id="daysBefore"
                            name="daysBefore"
                            value={formData.daysBefore}
                            onChange={handleChange}
                            className="mt-1 block w-full py-2 px-3 border border-gray-300 bg-white rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                          >
                            <option value="1">1 day before</option>
                            <option value="2">2 days before</option>
                            <option value="3">3 days before</option>
                            <option value="5">5 days before</option>
                            <option value="7">7 days before</option>
                          </select>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              </div>
              <div className="px-4 py-3 bg-gray-50 text-right sm:px-6">
                <button
                  type="submit"
                  disabled={isLoading}
                  className={`inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 ${
                    isLoading ? 'opacity-75 cursor-not-allowed' : ''
              
(Content truncated due to size limit. Use line ranges to read in chunks)