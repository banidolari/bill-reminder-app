'use client';

import { useState, useEffect } from 'react';
import { FiTrendingUp, FiPieChart, FiBarChart2, FiDollarSign, FiCalendar, FiAlertCircle } from 'react-icons/fi';

// Mock data for bills and spending history
const mockBillsData = [
  { month: 'Jan', amount: 1250 },
  { month: 'Feb', amount: 1300 },
  { month: 'Mar', amount: 1180 },
  { month: 'Apr', amount: 1420 },
  { month: 'May', amount: 1350 },
  { month: 'Jun', amount: 1290 },
];

const mockCategoryData = [
  { category: 'Utilities', amount: 450, percentage: 32 },
  { category: 'Housing', amount: 1200, percentage: 42 },
  { category: 'Subscriptions', amount: 120, percentage: 8 },
  { category: 'Insurance', amount: 180, percentage: 13 },
  { category: 'Other', amount: 70, percentage: 5 },
];

const mockPredictions = [
  { month: 'May', predicted: 1380, actual: null },
  { month: 'Jun', predicted: 1320, actual: null },
  { month: 'Jul', predicted: 1400, actual: null },
  { month: 'Aug', predicted: 1450, actual: null },
];

const mockInsights = [
  {
    id: 1,
    type: 'saving',
    title: 'Potential Savings on Utilities',
    description: 'Your electricity bill is 15% higher than average. Consider energy-saving measures to reduce costs.',
    potentialSavings: 45,
    category: 'Utilities'
  },
  {
    id: 2,
    type: 'trend',
    title: 'Subscription Costs Increasing',
    description: 'Your subscription costs have increased by 12% over the last 3 months. Review your subscriptions for unused services.',
    potentialSavings: 25,
    category: 'Subscriptions'
  },
  {
    id: 3,
    type: 'alert',
    title: 'Unusual Bill Amount',
    description: 'Your water bill this month is 30% higher than your 6-month average. You might want to check for leaks or usage issues.',
    potentialSavings: null,
    category: 'Utilities'
  },
  {
    id: 4,
    type: 'forecast',
    title: 'Upcoming Bill Increase',
    description: 'Based on seasonal patterns, your heating bill is likely to increase by 20-25% next month.',
    potentialSavings: null,
    category: 'Utilities'
  },
];

export default function AIAnalytics() {
  const [activeTab, setActiveTab] = useState('insights');
  const [timeRange, setTimeRange] = useState('6m');
  const [isLoading, setIsLoading] = useState(false);
  
  // Simulate loading data
  useEffect(() => {
    if (timeRange) {
      setIsLoading(true);
      const timer = setTimeout(() => {
        setIsLoading(false);
      }, 1200);
      
      return () => clearTimeout(timer);
    }
  }, [timeRange]);
  
  const renderInsights = () => {
    return (
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <h3 className="text-lg font-medium text-gray-900">AI-Generated Insights</h3>
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
          </div>
        </div>
        
        {isLoading ? (
          <div className="py-12 flex justify-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
            {mockInsights.map((insight) => (
              <div 
                key={insight.id} 
                className={`bg-white overflow-hidden shadow rounded-lg border-l-4 ${
                  insight.type === 'saving' ? 'border-green-500' :
                  insight.type === 'trend' ? 'border-blue-500' :
                  insight.type === 'alert' ? 'border-red-500' :
                  'border-yellow-500'
                }`}
              >
                <div className="px-4 py-5 sm:p-6">
                  <div className="flex items-center">
                    <div className={`flex-shrink-0 rounded-md p-2 ${
                      insight.type === 'saving' ? 'bg-green-100' :
                      insight.type === 'trend' ? 'bg-blue-100' :
                      insight.type === 'alert' ? 'bg-red-100' :
                      'bg-yellow-100'
                    }`}>
                      {insight.type === 'saving' && <FiDollarSign className="h-6 w-6 text-green-600" />}
                      {insight.type === 'trend' && <FiTrendingUp className="h-6 w-6 text-blue-600" />}
                      {insight.type === 'alert' && <FiAlertCircle className="h-6 w-6 text-red-600" />}
                      {insight.type === 'forecast' && <FiCalendar className="h-6 w-6 text-yellow-600" />}
                    </div>
                    <div className="ml-4">
                      <h4 className="text-lg font-medium text-gray-900">{insight.title}</h4>
                      <div className="mt-1 text-sm text-gray-500">
                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-800 mr-2">
                          {insight.category}
                        </span>
                        {insight.potentialSavings && (
                          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                            Potential savings: ${insight.potentialSavings}/mo
                          </span>
                        )}
                      </div>
                    </div>
                  </div>
                  <div className="mt-4 text-sm text-gray-500">
                    {insight.description}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    );
  };
  
  const renderPredictions = () => {
    return (
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <h3 className="text-lg font-medium text-gray-900">Spending Predictions</h3>
          <div className="flex space-x-2">
            <select
              id="prediction-range"
              name="prediction-range"
              className="block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm rounded-md"
            >
              <option value="3m">Next 3 months</option>
              <option value="6m">Next 6 months</option>
              <option value="1y">Next year</option>
            </select>
          </div>
        </div>
        
        {isLoading ? (
          <div className="py-12 flex justify-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
          </div>
        ) : (
          <div className="bg-white shadow overflow-hidden sm:rounded-lg">
            <div className="px-4 py-5 sm:p-6">
              <div className="h-64 relative">
                {/* This would be a real chart in a production app */}
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="text-center">
                    <FiBarChart2 className="mx-auto h-12 w-12 text-gray-400" />
                    <h3 className="mt-2 text-sm font-medium text-gray-900">Spending Prediction Chart</h3>
                    <p className="mt-1 text-sm text-gray-500">
                      This would be a chart showing historical spending and predicted future spending.
                    </p>
                  </div>
                </div>
              </div>
              
              <div className="mt-6">
                <h4 className="text-sm font-medium text-gray-900">Predicted Monthly Spending</h4>
                <div className="mt-2 grid grid-cols-2 gap-4 sm:grid-cols-4">
                  {mockPredictions.map((prediction) => (
                    <div key={prediction.month} className="bg-gray-50 rounded-lg p-4">
                      <div className="text-sm font-medium text-gray-500">{prediction.month}</div>
                      <div className="mt-1 text-lg font-semibold text-blue-600">${prediction.predicted}</div>
                      {prediction.actual !== null && (
                        <div className="mt-1 text-xs text-gray-500">
                          Actual: ${prediction.actual}
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </div>
              
              <div className="mt-6">
                <h4 className="text-sm font-medium text-gray-900">Prediction Accuracy</h4>
                <div className="mt-2 flex items-center">
                  <div className="w-full bg-gray-200 rounded-full h-2.5">
                    <div className="bg-blue-600 h-2.5 rounded-full" style={{ width: '85%' }}></div>
                  </div>
                  <span className="ml-2 text-sm font-medium text-gray-500">85%</span>
                </div>
                <p className="mt-1 text-xs text-gray-500">
                  Based on the accuracy of our predictions over the past 6 months.
                </p>
              </div>
            </div>
          </div>
        )}
        
        <div className="bg-white shadow overflow-hidden sm:rounded-lg">
          <div className="px-4 py-5 sm:p-6">
            <h3 className="text-lg leading-6 font-medium text-gray-900">Spending Trends by Category</h3>
            <div className="mt-4 grid grid-cols-1 gap-4 sm:grid-cols-2">
              <div className="bg-gray-50 rounded-lg p-4">
                <h4 className="text-sm font-medium text-gray-900">Expected to Increase</h4>
                <ul className="mt-2 divide-y divide-gray-200">
                  <li className="py-2">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center">
                        <span className="text-sm font-medium text-gray-900">Utilities</span>
                      </div>
                      <div className="text-sm text-red-600">+8.5%</div>
                    </div>
                  </li>
                  <li className="py-2">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center">
                        <span className="text-sm font-medium text-gray-900">Subscriptions</span>
                      </div>
                      <div className="text-sm text-red-600">+4.2%</div>
                    </div>
                  </li>
                </ul>
              </div>
              
              <div className="bg-gray-50 rounded-lg p-4">
                <h4 className="text-sm font-medium text-gray-900">Expected to Decrease</h4>
                <ul className="mt-2 divide-y divide-gray-200">
                  <li className="py-2">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center">
                        <span className="text-sm font-medium text-gray-900">Insurance</span>
                      </div>
                      <div className="text-sm text-green-600">-3.1%</div>
                    </div>
                  </li>
                  <li className="py-2">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center">
                        <span className="text-sm font-medium text-gray-900">Other</span>
                      </div>
                      <div className="text-sm text-green-600">-2.5%</div>
                    </div>
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  };
  
  const renderAnalysis = () => {
    return (
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <h3 className="text-lg font-medium text-gray-900">Spending Analysis</h3>
          <div className="flex space-x-2">
            <select
              id="analysis-range"
              name="analysis-range"
              value={timeRange}
              onChange={(e) => setTimeRange(e.target.value)}
              className="block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm rounded-md"
            >
              <option value="3m">Last 3 months</option>
              <option value="6m">Last 6 months</option>
              <option value="1y">Last year</option>
            </select>
          </div>
        </div>
        
        {isLoading ? (
          <div className="py-12 flex justify-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
          </div>
        ) : (
          <>
            <div className="bg-white shadow overflow-hidden sm:rounded-lg">
              <div className="px-4 py-5 sm:p-6">
                <h3 className="text-lg leading-6 font-medium text-gray-900">Monthly Spending Trend</h3>
                <div className="mt-4 h-64 relative">
                  {/* This would be a real chart in a production app */}
                  <div className="absolute inset-0 flex items-center justify-center">
                    <div className="text-center">
                      <FiTrendingUp className="mx-auto h-12 w-12 text-gray-400" />
                      <h3 className="mt-2 text-sm font-medium text-gray-900">Spending Trend Chart</h3>
                      <p className="mt-1 text-sm text-gray-500">
                        This would be a line chart showing monthly spending trends.
                      </p>
                    </div>
                  </div>
                </div>
                
                <div className="mt-6 grid grid-cols-3 gap-4 sm:grid-cols-6">
                  {mockBillsData.map((data) => (
                    <div key={data.month} className="text-center">
                      <div className="text-sm font-medium text-gray-500">{data.month}</div>
                      <div className="mt-1 text-lg font-semibold text-gray-900">${data.amount}</div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
            
            <div className="bg-white shadow overflow-hidden sm:rounded-lg">
              <div className="px-4 py-5 sm:p-6">
                <h3 className="text-lg leading-6 font-medium text-gray-900">Spending by Category</h3>
                <div className="mt-4 grid grid-cols-1 gap-6 sm:grid-cols-2">
                  <div className="h-64 relative">
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
                  
                  <div>
                    <ul className="divide-y divide-gray-200">
                      {mockCategoryData.map((category) => (
                        <li key={category.category} className="py-3">
                          <div className="flex items-center justify-between">
                            <div>
                  
(Content truncated due to size limit. Use line ranges to read in chunks)