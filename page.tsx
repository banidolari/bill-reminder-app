import Link from 'next/link';
import { FaRegCreditCard, FaRegCalendarAlt, FaChartPie, FaCamera } from 'react-icons/fa';

export default function Home() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 to-white">
      {/* Header */}
      <header className="bg-white shadow-sm">
        <div className="container mx-auto px-4 py-4 flex justify-between items-center">
          <h1 className="text-2xl font-bold text-blue-600">BillReminder</h1>
          <div className="space-x-4">
            <Link href="/auth/login" className="text-gray-600 hover:text-blue-600">
              Login
            </Link>
            <Link href="/auth/register" className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700">
              Sign Up
            </Link>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="py-16 px-4">
        <div className="container mx-auto max-w-6xl">
          <div className="text-center mb-12">
            <h2 className="text-4xl md:text-5xl font-bold mb-4 text-gray-800">Never Miss a Bill Payment Again</h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Track, manage, and pay your bills on time with our smart reminder system.
              Scan bills, get notifications, and analyze your spending all in one place.
            </p>
            <div className="mt-8">
              <Link href="/auth/register" className="bg-blue-600 text-white px-6 py-3 rounded-md text-lg font-medium hover:bg-blue-700 mr-4">
                Get Started Free
              </Link>
              <Link href="/dashboard/demo" className="bg-white text-blue-600 border border-blue-600 px-6 py-3 rounded-md text-lg font-medium hover:bg-blue-50">
                View Demo
              </Link>
            </div>
          </div>

          {/* Feature Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mt-16">
            <div className="bg-white p-6 rounded-lg shadow-md hover:shadow-lg transition-shadow">
              <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mb-4">
                <FaRegCreditCard className="text-blue-600 text-xl" />
              </div>
              <h3 className="text-xl font-semibold mb-2">Bill Management</h3>
              <p className="text-gray-600">
                Track all your bills in one place with due dates, payment status, and categories.
              </p>
            </div>

            <div className="bg-white p-6 rounded-lg shadow-md hover:shadow-lg transition-shadow">
              <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center mb-4">
                <FaCamera className="text-green-600 text-xl" />
              </div>
              <h3 className="text-xl font-semibold mb-2">Bill Scanning</h3>
              <p className="text-gray-600">
                Scan physical bills or connect your email to automatically import bill details.
              </p>
            </div>

            <div className="bg-white p-6 rounded-lg shadow-md hover:shadow-lg transition-shadow">
              <div className="w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center mb-4">
                <FaRegCalendarAlt className="text-purple-600 text-xl" />
              </div>
              <h3 className="text-xl font-semibold mb-2">Smart Reminders</h3>
              <p className="text-gray-600">
                Get timely notifications and never miss a payment deadline again.
              </p>
            </div>

            <div className="bg-white p-6 rounded-lg shadow-md hover:shadow-lg transition-shadow">
              <div className="w-12 h-12 bg-orange-100 rounded-full flex items-center justify-center mb-4">
                <FaChartPie className="text-orange-600 text-xl" />
              </div>
              <h3 className="text-xl font-semibold mb-2">Spending Insights</h3>
              <p className="text-gray-600">
                Analyze your spending patterns with AI-powered insights and reports.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section className="py-16 px-4 bg-gray-50">
        <div className="container mx-auto max-w-6xl">
          <h2 className="text-3xl font-bold text-center mb-12 text-gray-800">How It Works</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="w-16 h-16 bg-blue-600 rounded-full flex items-center justify-center mx-auto mb-4 text-white text-2xl font-bold">1</div>
              <h3 className="text-xl font-semibold mb-2">Add Your Bills</h3>
              <p className="text-gray-600">
                Manually add bills or scan them with your camera. Connect your email to automatically import bills.
              </p>
            </div>
            
            <div className="text-center">
              <div className="w-16 h-16 bg-blue-600 rounded-full flex items-center justify-center mx-auto mb-4 text-white text-2xl font-bold">2</div>
              <h3 className="text-xl font-semibold mb-2">Get Reminders</h3>
              <p className="text-gray-600">
                Receive notifications before bills are due. Customize when and how you want to be reminded.
              </p>
            </div>
            
            <div className="text-center">
              <div className="w-16 h-16 bg-blue-600 rounded-full flex items-center justify-center mx-auto mb-4 text-white text-2xl font-bold">3</div>
              <h3 className="text-xl font-semibold mb-2">Track & Analyze</h3>
              <p className="text-gray-600">
                Mark bills as paid and analyze your spending patterns with detailed reports and insights.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section className="py-16 px-4">
        <div className="container mx-auto max-w-6xl">
          <h2 className="text-3xl font-bold text-center mb-12 text-gray-800">What Our Users Say</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="bg-white p-6 rounded-lg shadow-md">
              <div className="flex items-center mb-4">
                <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mr-4">
                  <span className="text-blue-600 font-bold">JD</span>
                </div>
                <div>
                  <h4 className="font-semibold">John Doe</h4>
                  <p className="text-gray-500 text-sm">Small Business Owner</p>
                </div>
              </div>
              <p className="text-gray-600">
                "This app has completely transformed how I manage my business expenses. I never miss a payment now!"
              </p>
            </div>
            
            <div className="bg-white p-6 rounded-lg shadow-md">
              <div className="flex items-center mb-4">
                <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center mr-4">
                  <span className="text-green-600 font-bold">JS</span>
                </div>
                <div>
                  <h4 className="font-semibold">Jane Smith</h4>
                  <p className="text-gray-500 text-sm">Freelancer</p>
                </div>
              </div>
              <p className="text-gray-600">
                "The bill scanning feature saves me so much time. I just snap a photo and everything is organized automatically."
              </p>
            </div>
            
            <div className="bg-white p-6 rounded-lg shadow-md">
              <div className="flex items-center mb-4">
                <div className="w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center mr-4">
                  <span className="text-purple-600 font-bold">RJ</span>
                </div>
                <div>
                  <h4 className="font-semibold">Robert Johnson</h4>
                  <p className="text-gray-500 text-sm">Family Budget Manager</p>
                </div>
              </div>
              <p className="text-gray-600">
                "The spending insights have helped our family save over $200 per month by identifying unnecessary expenses."
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 px-4 bg-blue-600 text-white">
        <div className="container mx-auto max-w-6xl text-center">
          <h2 className="text-3xl font-bold mb-4">Ready to Take Control of Your Bills?</h2>
          <p className="text-xl mb-8 max-w-3xl mx-auto">
            Join thousands of users who never miss a payment and save money with smart bill management.
          </p>
          <Link href="/auth/register" className="bg-white text-blue-600 px-6 py-3 rounded-md text-lg font-medium hover:bg-gray-100">
            Get Started Free
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-800 text-white py-12 px-4">
        <div className="container mx-auto max-w-6xl">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div>
              <h3 className="text-xl font-bold mb-4">BillReminder</h3>
              <p className="text-gray-400">
                The smart way to manage your bills and never miss a payment again.
              </p>
            </div>
            
            <div>
              <h4 className="font-semibold mb-4">Features</h4>
              <ul className="space-y-2 text-gray-400">
                <li><Link href="#" className="hover:text-white">Bill Management</Link></li>
                <li><Link href="#" className="hover:text-white">Bill Scanning</Link></li>
                <li><Link href="#" className="hover:text-white">Smart Reminders</Link></li>
                <li><Link href="#" className="hover:text-white">Spending Insights</Link></li>
              </ul>
            </div>
            
            <div>
              <h4 className="font-semibold mb-4">Company</h4>
              <ul className="space-y-2 text-gray-400">
                <li><Link href="#" className="hover:text-white">About Us</Link></li>
                <li><Link href="#" className="hover:text-white">Contact</Link></li>
                <li><Link href="#" className="hover:text-white">Careers</Link></li>
                <li><Link href="#" className="hover:text-white">Blog</Link></li>
              </ul>
            </div>
            
            <div>
              <h4 className="font-semibold mb-4">Legal</h4>
              <ul className="space-y-2 text-gray-400">
                <li><Link href="#" className="hover:text-white">Privacy Policy</Link></li>
                <li><Link href="#" className="hover:text-white">Terms of Service</Link></li>
                <li><Link href="#" className="hover:text-white">Cookie Policy</Link></li>
              </ul>
            </div>
          </div>
          
          <div className="border-t border-gray-700 mt-8 pt-8 text-center text-gray-400">
            <p>&copy; {new Date().getFullYear()} BillReminder. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}
