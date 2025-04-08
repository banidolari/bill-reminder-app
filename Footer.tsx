'use client';

import { FiGithub } from 'react-icons/fi';

export default function Footer() {
  return (
    <footer className="bg-white">
      <div className="max-w-7xl mx-auto py-6 px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col items-center justify-between md:flex-row">
          <div className="flex items-center">
            <span className="text-gray-500 text-sm">
              © {new Date().getFullYear()} BillReminder. All rights reserved.
            </span>
          </div>
          <div className="mt-4 md:mt-0">
            <div className="flex space-x-6">
              <a href="#" className="text-gray-400 hover:text-gray-500">
                <span className="sr-only">Privacy Policy</span>
                <span className="text-sm">Privacy Policy</span>
              </a>
              <a href="#" className="text-gray-400 hover:text-gray-500">
                <span className="sr-only">Terms of Service</span>
                <span className="text-sm">Terms of Service</span>
              </a>
              <a href="#" className="text-gray-400 hover:text-gray-500">
                <span className="sr-only">Contact</span>
                <span className="text-sm">Contact</span>
              </a>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
