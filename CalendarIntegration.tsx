'use client';

import { useState } from 'react';
import { FiCalendar, FiClock, FiDollarSign, FiCheckCircle } from 'react-icons/fi';

export default function CalendarIntegration() {
  const [currentMonth, setCurrentMonth] = useState(new Date());
  const [selectedDate, setSelectedDate] = useState(null);
  
  // Mock data for bills
  const bills = [
    { id: '1', name: 'Electricity Bill', amount: 85.50, dueDate: '2025-04-15', category: 'Utilities', status: 'unpaid' },
    { id: '2', name: 'Internet Service', amount: 59.99, dueDate: '2025-04-18', category: 'Utilities', status: 'unpaid' },
    { id: '3', name: 'Rent', amount: 1200.00, dueDate: '2025-05-01', category: 'Housing', status: 'unpaid' },
    { id: '4', name: 'Netflix Subscription', amount: 15.99, dueDate: '2025-04-22', category: 'Subscriptions', status: 'unpaid' },
    { id: '5', name: 'Water Bill', amount: 45.75, dueDate: '2025-04-05', category: 'Utilities', status: 'paid' },
    { id: '6', name: 'Phone Bill', amount: 75.00, dueDate: '2025-04-28', category: 'Utilities', status: 'unpaid' },
  ];

  // Get days in month
  const getDaysInMonth = (date) => {
    return new Date(date.getFullYear(), date.getMonth() + 1, 0).getDate();
  };

  // Get day of week for first day of month (0 = Sunday, 6 = Saturday)
  const getFirstDayOfMonth = (date) => {
    return new Date(date.getFullYear(), date.getMonth(), 1).getDay();
  };

  // Format date as YYYY-MM-DD
  const formatDate = (date) => {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
  };

  // Get bills due on a specific date
  const getBillsForDate = (date) => {
    const formattedDate = formatDate(date);
    return bills.filter(bill => bill.dueDate === formattedDate);
  };

  // Check if a date has bills
  const hasBills = (date) => {
    const formattedDate = formatDate(date);
    return bills.some(bill => bill.dueDate === formattedDate);
  };

  // Navigate to previous month
  const prevMonth = () => {
    setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() - 1, 1));
  };

  // Navigate to next month
  const nextMonth = () => {
    setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() + 1, 1));
  };

  // Navigate to current month
  const goToToday = () => {
    setCurrentMonth(new Date());
    setSelectedDate(new Date());
  };

  // Handle date selection
  const handleDateClick = (date) => {
    setSelectedDate(date);
  };

  // Render calendar
  const renderCalendar = () => {
    const daysInMonth = getDaysInMonth(currentMonth);
    const firstDayOfMonth = getFirstDayOfMonth(currentMonth);
    const monthName = currentMonth.toLocaleString('default', { month: 'long' });
    const year = currentMonth.getFullYear();
    
    const days = [];
    const today = new Date();
    
    // Add empty cells for days before the first day of the month
    for (let i = 0; i < firstDayOfMonth; i++) {
      days.push(<div key={`empty-${i}`} className="h-14 border border-gray-200 bg-gray-50"></div>);
    }
    
    // Add cells for each day of the month
    for (let day = 1; day <= daysInMonth; day++) {
      const date = new Date(currentMonth.getFullYear(), currentMonth.getMonth(), day);
      const isToday = today.getDate() === day && 
                      today.getMonth() === currentMonth.getMonth() && 
                      today.getFullYear() === currentMonth.getFullYear();
      const isSelected = selectedDate && 
                        selectedDate.getDate() === day && 
                        selectedDate.getMonth() === currentMonth.getMonth() && 
                        selectedDate.getFullYear() === currentMonth.getFullYear();
      const hasBillsDue = hasBills(date);
      
      days.push(
        <div 
          key={day} 
          className={`h-14 border border-gray-200 p-1 cursor-pointer transition-colors ${
            isToday ? 'bg-blue-50' : ''
          } ${
            isSelected ? 'bg-blue-100 border-blue-500' : ''
          } hover:bg-gray-100`}
          onClick={() => handleDateClick(date)}
        >
          <div className="flex flex-col h-full">
            <div className={`text-sm font-medium ${isToday ? 'text-blue-600' : ''}`}>
              {day}
            </div>
            {hasBillsDue && (
              <div className="mt-auto">
                <span className="inline-flex items-center px-1.5 py-0.5 rounded-full text-xs font-medium bg-red-100 text-red-800">
                  <FiDollarSign className="h-3 w-3 mr-0.5" />
                  Due
                </span>
              </div>
            )}
          </div>
        </div>
      );
    }
    
    return (
      <div className="bg-white shadow overflow-hidden rounded-lg">
        <div className="px-4 py-5 border-b border-gray-200 sm:px-6 flex justify-between items-center">
          <h3 className="text-lg leading-6 font-medium text-gray-900">
            {monthName} {year}
          </h3>
          <div className="flex space-x-2">
            <button
              type="button"
              onClick={prevMonth}
              className="inline-flex items-center px-3 py-1 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
            >
              Previous
            </button>
            <button
              type="button"
              onClick={goToToday}
              className="inline-flex items-center px-3 py-1 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
            >
              Today
            </button>
            <button
              type="button"
              onClick={nextMonth}
              className="inline-flex items-center px-3 py-1 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
            >
              Next
            </button>
          </div>
        </div>
        <div className="grid grid-cols-7 gap-px bg-gray-200">
          {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map((day) => (
            <div key={day} className="bg-gray-50 text-center py-2 text-sm font-medium text-gray-500">
              {day}
            </div>
          ))}
        </div>
        <div className="grid grid-cols-7 gap-px bg-gray-200">
          {days}
        </div>
      </div>
    );
  };

  // Render bills for selected date
  const renderBillsForSelectedDate = () => {
    if (!selectedDate) return null;
    
    const billsForDate = getBillsForDate(selectedDate);
    const formattedDate = selectedDate.toLocaleDateString('en-US', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
    
    return (
      <div className="mt-6 bg-white shadow overflow-hidden sm:rounded-lg">
        <div className="px-4 py-5 border-b border-gray-200 sm:px-6">
          <h3 className="text-lg leading-6 font-medium text-gray-900">
            Bills Due on {formattedDate}
          </h3>
        </div>
        {billsForDate.length > 0 ? (
          <ul className="divide-y divide-gray-200">
            {billsForDate.map((bill) => (
              <li key={bill.id} className="px-4 py-4 sm:px-6">
                <div className="flex items-center justify-between">
                  <div className="flex items-center">
                    <div className="text-sm font-medium text-blue-600">{bill.name}</div>
                    <div className="ml-2 flex-shrink-0 flex">
                      <p className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-blue-100 text-blue-800">
                        {bill.category}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center">
                    <div className="text-sm font-medium text-gray-900 mr-4">
                      ${bill.amount.toFixed(2)}
                    </div>
                    <span
                      className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                        bill.status === 'paid'
                          ? 'bg-green-100 text-green-800'
                          : 'bg-yellow-100 text-yellow-800'
                      }`}
                    >
                      {bill.status === 'paid' ? 'Paid' : 'Unpaid'}
                    </span>
                  </div>
                </div>
              </li>
            ))}
          </ul>
        ) : (
          <div className="px-4 py-5 sm:px-6 text-center text-gray-500">
            No bills due on this date.
          </div>
        )}
      </div>
    );
  };

  return (
    <div className="space-y-6">
      <div className="md:flex md:items-center md:justify-between">
        <div className="flex-1 min-w-0">
          <h2 className="text-2xl font-bold leading-7 text-gray-900 sm:text-3xl sm:truncate">
            Calendar
          </h2>
          <p className="mt-1 text-sm text-gray-500">
            View your bill due dates in calendar format.
          </p>
        </div>
      </div>

      {renderCalendar()}
      {renderBillsForSelectedDate()}
    </div>
  );
}
