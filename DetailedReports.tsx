'use client';

import { useState, useEffect } from 'react';
import { FiDownload, FiFilter, FiCalendar, FiDollarSign, FiPieChart, FiBarChart2, FiTrendingUp } from 'react-icons/fi';

// Mock data for reports
const mockMonthlyData = [
  { month: 'Jan', paid: 1250, unpaid: 150 },
  { month: 'Feb', paid: 1300, unpaid: 200 },
  { month: 'Mar', paid: 1180, unpaid: 120 },
  { month: 'Apr', paid: 1420, unpaid: 0 },
  { month: 'May', paid: 1350, unpaid: 180 },
  { month: 'Jun', paid: 1290, unpaid: 210 },
];

const mockCategoryData = [
  { category: 'Utilities', amount: 450, percentage: 32 },
  { category: 'Housing', amount: 1200, percentage: 42 },
  { category: 'Subscriptions', amount: 120, percentage: 8 },
  { category: 'Insurance', amount: 180, percentage: 13 },
  { category: 'Other', amount: 70, percentage: 5 },
];

const mockPaymentMethodData = [
  { method: 'Credit Card', amount: 850, percentage: 45 },
  { method: 'Bank Transfer', amount: 720, percentage: 38 },
  { method: 'Digital Wallet', amount: 320, percentage: 17 },
];

const mockBillsData = [
  { id: '1', name: 'Electricity Bill', amount: 85.50, dueDate: '2025-04-15', category: 'Utilities', status: 'unpaid' },
  { id: '2', name: 'Internet Service', amount: 59.99, dueDate: '2025-04-18', category: 'Utilities', status: 'unpaid' },
  { id: '3', name: 'Rent', amount: 1200.00, dueDate: '2025-05-01', category: 'Housing', status: 'unpaid' },
  { id: '4', name: 'Netflix Subscription', amount: 15.99, dueDate: '2025-04-22', category: 'Subscriptions', status: 'unpaid' },
  { id: '5', name: 'Water Bill', amount: 45.75, dueDate: '2025-04-05', category: 'Utilities', status: 'paid' },
  { id: '6', name: 'Phone Bill', amount: 75.00, dueDate: '2025-04-28', category: 'Utilities', status: 'unpaid' },
  { id: '7', name: 'Car Insurance', amount: 120.00, dueDate: '2025-04-10', category: 'Insurance', status: 'paid' },
  { id: '8', name: 'Gym Membership', amount: 35.00, dueDate: '2025-04-20', category: 'Subscriptions', status: 'unpaid' },
];

export default function DetailedReports() {
  const [activeTab, setActiveTab] = useState('overview');
  const [timeRange, setTimeRange] = useState('6m');
  const [isLoading, setIsLoading] = useState(false);
  const [categoryFilter, setCategoryFilter] = useState('all');
  const [statusFilter, setStatusFilter] = useState('all');
  
  // Simulate loading data
  useEffect(() => {
    if (timeRange) {
      setIsLoading(true);
      const timer = setTimeout(() => {
        setIsLoading(false);
      }, 1200);
      
      return () => clearTimeout(timer);
    }
  }, [timeRange, categoryFilter, statusFilter]);
  
  const filteredBills = mockBillsData.filter(bill => {
    if (categoryFilter !== 'all' && bill.category !== categoryFilter) return false;
    if (statusFilter !== 'all' && bill.status !== statusFilter) return false;
    return true;
  });
  
  const totalPaid = filteredBills
    .filter(bill => bill.status === 'paid')
    .reduce((sum, bill) => sum + bill.amount, 0);
    
  const totalUnpaid = filteredBills
    .filter(bill => bill.status === 'unpaid')
    .reduce((sum, bill) => sum + bill.amount, 0);
  
  const renderOverview = () => {
    return (
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <h3 className="text-lg font-medium text-gray-900">Financial Overview</h3>
          <div className="flex space-x-2">
            <select
              id="time-range"
              name="time-range"
              value={timeRange}
              onChange={(e) => setTimeRange(e.target.value)}
              className="block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm rounded-md"
            >
              <option value="3m">Last 3 months</option>
              <option value="6m">Last 6 months</option>
              <option value="1y">Last year</option>
            </select>
            <button
              type="button"
              className="inline-flex items-center px-4 py-2 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
            >
              <FiDownload className="-ml-1 mr-2 h-5 w-5" />
              Export
            </button>
          </div>
        </div>
        
        {isLoading ? (
          <div className="py-12 flex justify-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
          </div>
        ) : (
          <>
            <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
              <div className="bg-white overflow-hidden shadow rounded-lg">
                <div className="px-4 py-5 sm:p-6">
                  <div className="flex items-center">
                    <div className="flex-shrink-0 bg-blue-500 rounded-md p-3">
                      <FiDollarSign className="h-6 w-6 text-white" />
                    </div>
                    <div className="ml-5 w-0 flex-1">
                      <dl>
                        <dt className="text-sm font-medium text-gray-500 truncate">Total Bills (This Month)</dt>
                        <dd>
                          <div className="text-lg font-medium text-gray-900">${(totalPaid + totalUnpaid).toFixed(2)}</div>
                        </dd>
                      </dl>
                    </div>
                  </div>
                </div>
              </div>
              
              <div className="bg-white overflow-hidden shadow rounded-lg">
                <div className="px-4 py-5 sm:p-6">
                  <div className="flex items-center">
                    <div className="flex-shrink-0 bg-green-500 rounded-md p-3">
                      <FiDollarSign className="h-6 w-6 text-white" />
                    </div>
                    <div className="ml-5 w-0 flex-1">
                      <dl>
                        <dt className="text-sm font-medium text-gray-500 truncate">Paid Bills</dt>
                        <dd>
                          <div className="text-lg font-medium text-gray-900">${totalPaid.toFixed(2)}</div>
                        </dd>
                      </dl>
                    </div>
                  </div>
                </div>
              </div>
              
              <div className="bg-white overflow-hidden shadow rounded-lg">
                <div className="px-4 py-5 sm:p-6">
                  <div className="flex items-center">
                    <div className="flex-shrink-0 bg-red-500 rounded-md p-3">
                      <FiDollarSign className="h-6 w-6 text-white" />
                    </div>
                    <div className="ml-5 w-0 flex-1">
                      <dl>
                        <dt className="text-sm font-medium text-gray-500 truncate">Unpaid Bills</dt>
                        <dd>
                          <div className="text-lg font-medium text-gray-900">${totalUnpaid.toFixed(2)}</div>
                        </dd>
                      </dl>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            
            <div className="bg-white shadow overflow-hidden sm:rounded-lg">
              <div className="px-4 py-5 sm:p-6">
                <h3 className="text-lg leading-6 font-medium text-gray-900">Monthly Spending Trend</h3>
                <div className="mt-4 h-64 relative">
                  {/* This would be a real chart in a production app */}
                  <div className="absolute inset-0 flex items-center justify-center">
                    <div className="text-center">
                      <FiBarChart2 className="mx-auto h-12 w-12 text-gray-400" />
                      <h3 className="mt-2 text-sm font-medium text-gray-900">Monthly Spending Chart</h3>
                      <p className="mt-1 text-sm text-gray-500">
                        This would be a bar chart showing monthly spending trends.
                      </p>
                    </div>
                  </div>
                </div>
                
                <div className="mt-6 grid grid-cols-3 gap-4 sm:grid-cols-6">
                  {mockMonthlyData.map((data) => (
                    <div key={data.month} className="text-center">
                      <div className="text-sm font-medium text-gray-500">{data.month}</div>
                      <div className="mt-1 text-lg font-semibold text-gray-900">${data.paid + data.unpaid}</div>
                      <div className="mt-1 text-xs text-green-600">Paid: ${data.paid}</div>
                      {data.unpaid > 0 && (
                        <div className="text-xs text-red-600">Unpaid: ${data.unpaid}</div>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            </div>
            
            <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
              <div className="bg-white shadow overflow-hidden sm:rounded-lg">
                <div className="px-4 py-5 sm:p-6">
                  <h3 className="text-lg leading-6 font-medium text-gray-900">Spending by Category</h3>
                  <div className="mt-4 h-64 relative">
                    {/* This would be a real chart in a production app */}
                    <div className="absolute inset-0 flex items-center justify-center">
                      <div className="text-center">
                        <FiPieChart className="mx-auto h-12 w-12 text-gray-400" />
                        <h3 className="mt-2 text-sm font-medium text-gray-900">Category Distribution</h3>
                        <p className="mt-1 text-sm text-gray-500">
                          This would be a pie chart showing spending by category.
                        </p>
                      </div>
                    </div>
                  </div>
                  
                  <div className="mt-6">
                    <ul className="divide-y divide-gray-200">
                      {mockCategoryData.map((category) => (
                        <li key={category.category} className="py-3">
                          <div className="flex items-center justify-between">
                            <div>
                              <p className="text-sm font-medium text-gray-900">{category.category}</p>
                              <p className="text-sm text-gray-500">${category.amount}/month</p>
                            </div>
                            <div className="text-sm font-medium text-gray-900">{category.percentage}%</div>
                          </div>
                          <div className="mt-2">
                            <div className="w-full bg-gray-200 rounded-full h-2.5">
                              <div 
                                className="bg-blue-600 h-2.5 rounded-full" 
                                style={{ width: `${category.percentage}%` }}
                              ></div>
                            </div>
                          </div>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              </div>
              
              <div className="bg-white shadow overflow-hidden sm:rounded-lg">
                <div className="px-4 py-5 sm:p-6">
                  <h3 className="text-lg leading-6 font-medium text-gray-900">Payment Methods</h3>
                  <div className="mt-4 h-64 relative">
                    {/* This would be a real chart in a production app */}
                    <div className="absolute inset-0 flex items-center justify-center">
                      <div className="text-center">
                        <FiPieChart className="mx-auto h-12 w-12 text-gray-400" />
                        <h3 className="mt-2 text-sm font-medium text-gray-900">Payment Method Distribution</h3>
                        <p className="mt-1 text-sm text-gray-500">
                          This would be a pie chart showing payment method distribution.
                        </p>
                      </div>
                    </div>
                  </div>
                  
                  <div className="mt-6">
                    <ul className="divide-y divide-gray-200">
                      {mockPaymentMethodData.map((method) => (
                        <li key={method.method} className="py-3">
                          <div className="flex items-center justify-between">
                            <div>
                              <p className="text-sm font-medium text-gray-900">{method.method}</p>
                              <p className="text-sm text-gray-500">${method.amount}/month</p>
                            </div>
                            <div className="text-sm font-medium text-gray-900">{method.percentage}%</div>
                          </div>
                          <div className="mt-2">
                            <div className="w-full bg-gray-200 rounded-full h-2.5">
                              <div 
                                className="bg-green-600 h-2.5 rounded-full" 
                                style={{ width: `${method.percentage}%` }}
                              ></div>
                            </div>
                          </div>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              </div>
            </div>
          </>
        )}
      </div>
    );
  };
  
  const renderBillsReport = () => {
    return (
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <h3 className="text-lg font-medium text-gray-900">Bills Report</h3>
          <div className="flex space-x-2">
            <button
              type="button"
              className="inline-flex items-center px-4 py-2 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
            >
              <FiDownload className="-ml-1 mr-2 h-5 w-5" />
              Export
            </button>
          </div>
        </div>
        
        <div className="bg-white shadow overflow-hidden sm:rounded-lg">
          <div className="px-4 py-5 sm:p-6">
            <div className="flex flex-col sm:flex-row sm:space-x-4 space-y-3 sm:space-y-0">
              <div>
                <label htmlFor="category-filter" className="block text-sm font-medium text-gray-700">
                  Category
                </label>
                <select
                  id="category-filter"
                  name="category-filter"
                  value={categoryFilter}
                  onChange={(e) => setCategoryFilter(e.target.value)}
                  className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm rounded-md"
                >
                  <option value="all">All Categories</option>
                  <option value="Utilities">Utilities</option>
                  <option value="Housing">Housing</option>
                  <option value="Subscriptions">Subscriptions</option>
                  <option value="Insurance">Insurance</option>
                  <option value="Other">Other</option>
                </select>
              </div>
              
              <div>
                <label htmlFor="status-filter" className="block text-sm font-medium text-gray-700">
                  Status
                </label>
                <select
                  id="status-filter"
                  name="status-filter"
                  value={statusFilter}
                  onChange={(e) => setStatusFilter(e.target.value)}
                  class
(Content truncated due to size limit. Use line ranges to read in chunks)