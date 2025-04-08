'use client';

import { useState } from 'react';
import { FiCalendar, FiDollarSign, FiClock, FiPlusCircle, FiBarChart2, FiCheckCircle } from 'react-icons/fi';
import Link from 'next/link';

// Mock data for demonstration
const upcomingBills = [
  { id: '1', name: 'Electricity Bill', amount: 85.50, dueDate: '2025-04-15', category: 'Utilities', status: 'unpaid' },
  { id: '2', name: 'Internet Service', amount: 59.99, dueDate: '2025-04-18', category: 'Utilities', status: 'unpaid' },
  { id: '3', name: 'Rent', amount: 1200.00, dueDate: '2025-05-01', category: 'Housing', status: 'unpaid' },
  { id: '4', name: 'Netflix Subscription', amount: 15.99, dueDate: '2025-04-22', category: 'Subscriptions', status: 'unpaid' },
];

const recentlyPaid = [
  { id: '5', name: 'Water Bill', amount: 45.75, paidDate: '2025-04-05', category: 'Utilities' },
  { id: '6', name: 'Phone Bill', amount: 75.00, paidDate: '2025-04-03', category: 'Utilities' },
];

export default function Dashboard() {
  const [activeTab, setActiveTab] = useState('upcoming');
  
  // Calculate summary statistics
  const totalDue = upcomingBills.reduce((sum, bill) => sum + bill.amount, 0);
  const totalPaid = recentlyPaid.reduce((sum, bill) => sum + bill.amount, 0);
  const billsDueThisWeek = upcomingBills.filter(bill => {
    const dueDate = new Date(bill.dueDate);
    const today = new Date();
    const nextWeek = new Date();
    nextWeek.setDate(today.getDate() + 7);
    return dueDate >= today && dueDate <= nextWeek;
  }).length;

  return (
    <div className="space-y-6">
      <div className="md:flex md:items-center md:justify-between">
        <div className="flex-1 min-w-0">
          <h2 className="text-2xl font-bold leading-7 text-gray-900 sm:text-3xl sm:truncate">
            Dashboard
          </h2>
        </div>
        <div className="mt-4 flex md:mt-0 md:ml-4">
          <Link
            href="/bills/new"
            className="ml-3 inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
          >
            <FiPlusCircle className="-ml-1 mr-2 h-5 w-5" />
            Add New Bill
          </Link>
        </div>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
        {/* Total Due */}
        <div className="bg-white overflow-hidden shadow rounded-lg">
          <div className="p-5">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <FiDollarSign className="h-6 w-6 text-gray-400" />
              </div>
              <div className="ml-5 w-0 flex-1">
                <dl>
                  <dt className="text-sm font-medium text-gray-500 truncate">
                    Total Due
                  </dt>
                  <dd>
                    <div className="text-lg font-medium text-gray-900">
                      ${totalDue.toFixed(2)}
                    </div>
                  </dd>
                </dl>
              </div>
            </div>
          </div>
        </div>

        {/* Bills Due This Week */}
        <div className="bg-white overflow-hidden shadow rounded-lg">
          <div className="p-5">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <FiCalendar className="h-6 w-6 text-gray-400" />
              </div>
              <div className="ml-5 w-0 flex-1">
                <dl>
                  <dt className="text-sm font-medium text-gray-500 truncate">
                    Due This Week
                  </dt>
                  <dd>
                    <div className="text-lg font-medium text-gray-900">
                      {billsDueThisWeek} bills
                    </div>
                  </dd>
                </dl>
              </div>
            </div>
          </div>
        </div>

        {/* Recently Paid */}
        <div className="bg-white overflow-hidden shadow rounded-lg">
          <div className="p-5">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <FiCheckCircle className="h-6 w-6 text-gray-400" />
              </div>
              <div className="ml-5 w-0 flex-1">
                <dl>
                  <dt className="text-sm font-medium text-gray-500 truncate">
                    Recently Paid
                  </dt>
                  <dd>
                    <div className="text-lg font-medium text-gray-900">
                      ${totalPaid.toFixed(2)}
                    </div>
                  </dd>
                </dl>
              </div>
            </div>
          </div>
        </div>

        {/* Monthly Overview */}
        <div className="bg-white overflow-hidden shadow rounded-lg">
          <div className="p-5">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <FiBarChart2 className="h-6 w-6 text-gray-400" />
              </div>
              <div className="ml-5 w-0 flex-1">
                <dl>
                  <dt className="text-sm font-medium text-gray-500 truncate">
                    Monthly Total
                  </dt>
                  <dd>
                    <div className="text-lg font-medium text-gray-900">
                      ${(totalDue + totalPaid).toFixed(2)}
                    </div>
                  </dd>
                </dl>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="border-b border-gray-200">
        <nav className="-mb-px flex space-x-8" aria-label="Tabs">
          <button
            onClick={() => setActiveTab('upcoming')}
            className={`${
              activeTab === 'upcoming'
                ? 'border-blue-500 text-blue-600'
                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
            } whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm`}
          >
            Upcoming Bills
          </button>
          <button
            onClick={() => setActiveTab('paid')}
            className={`${
              activeTab === 'paid'
                ? 'border-blue-500 text-blue-600'
                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
            } whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm`}
          >
            Recently Paid
          </button>
        </nav>
      </div>

      {/* Bills List */}
      <div className="bg-white shadow overflow-hidden sm:rounded-md">
        <ul className="divide-y divide-gray-200">
          {activeTab === 'upcoming' ? (
            upcomingBills.length > 0 ? (
              upcomingBills.map((bill) => (
                <li key={bill.id}>
                  <div className="px-4 py-4 sm:px-6">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center">
                        <p className="text-sm font-medium text-blue-600 truncate">{bill.name}</p>
                        <div className="ml-2 flex-shrink-0 flex">
                          <p className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-blue-100 text-blue-800">
                            {bill.category}
                          </p>
                        </div>
                      </div>
                      <div className="ml-2 flex-shrink-0 flex">
                        <button
                          type="button"
                          className="ml-3 inline-flex items-center px-3 py-1 border border-transparent text-xs leading-4 font-medium rounded-md text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500"
                        >
                          Mark as Paid
                        </button>
                      </div>
                    </div>
                    <div className="mt-2 sm:flex sm:justify-between">
                      <div className="sm:flex">
                        <p className="flex items-center text-sm text-gray-500">
                          <FiDollarSign className="flex-shrink-0 mr-1.5 h-5 w-5 text-gray-400" />
                          ${bill.amount.toFixed(2)}
                        </p>
                      </div>
                      <div className="mt-2 flex items-center text-sm text-gray-500 sm:mt-0">
                        <FiCalendar className="flex-shrink-0 mr-1.5 h-5 w-5 text-gray-400" />
                        <p>
                          Due on <time dateTime={bill.dueDate}>{new Date(bill.dueDate).toLocaleDateString()}</time>
                        </p>
                      </div>
                    </div>
                  </div>
                </li>
              ))
            ) : (
              <li className="px-4 py-5 sm:px-6">
                <div className="text-center text-gray-500">
                  <p>No upcoming bills. You're all caught up!</p>
                </div>
              </li>
            )
          ) : (
            recentlyPaid.length > 0 ? (
              recentlyPaid.map((bill) => (
                <li key={bill.id}>
                  <div className="px-4 py-4 sm:px-6">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center">
                        <p className="text-sm font-medium text-gray-600 truncate">{bill.name}</p>
                        <div className="ml-2 flex-shrink-0 flex">
                          <p className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-blue-100 text-blue-800">
                            {bill.category}
                          </p>
                        </div>
                      </div>
                      <div className="ml-2 flex-shrink-0 flex">
                        <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-green-100 text-green-800">
                          Paid
                        </span>
                      </div>
                    </div>
                    <div className="mt-2 sm:flex sm:justify-between">
                      <div className="sm:flex">
                        <p className="flex items-center text-sm text-gray-500">
                          <FiDollarSign className="flex-shrink-0 mr-1.5 h-5 w-5 text-gray-400" />
                          ${bill.amount.toFixed(2)}
                        </p>
                      </div>
                      <div className="mt-2 flex items-center text-sm text-gray-500 sm:mt-0">
                        <FiClock className="flex-shrink-0 mr-1.5 h-5 w-5 text-gray-400" />
                        <p>
                          Paid on <time dateTime={bill.paidDate}>{new Date(bill.paidDate).toLocaleDateString()}</time>
                        </p>
                      </div>
                    </div>
                  </div>
                </li>
              ))
            ) : (
              <li className="px-4 py-5 sm:px-6">
                <div className="text-center text-gray-500">
                  <p>No recently paid bills.</p>
                </div>
              </li>
            )
          )}
        </ul>
      </div>

      {/* View All Link */}
      <div className="text-center">
        <Link
          href="/bills"
          className="inline-flex items-center px-4 py-2 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
        >
          View All Bills
        </Link>
      </div>
    </div>
  );
}
