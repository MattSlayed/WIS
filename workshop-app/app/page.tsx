import Link from 'next/link';
import { Wrench, Clipboard, User } from 'lucide-react';

export default function HomePage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-primary-600 to-primary-800 flex items-center justify-center p-4">
      <div className="max-w-4xl w-full">
        {/* Logo / Header */}
        <div className="text-center mb-12">
          <h1 className="text-5xl font-bold text-white mb-4">
            Workshop Intelligence System
          </h1>
          <p className="text-xl text-primary-100">
            Powered by AI | Built for Excellence
          </p>
        </div>

        {/* Role Selection Cards */}
        <div className="grid md:grid-cols-3 gap-6">
          {/* Technician */}
          <Link
            href="/technician"
            className="card hover:shadow-xl transition-all duration-200 hover:scale-105 cursor-pointer group"
          >
            <div className="card-body text-center py-12">
              <div className="mx-auto w-20 h-20 bg-primary-100 rounded-full flex items-center justify-center mb-6 group-hover:bg-primary-200 transition-colors">
                <Wrench className="w-10 h-10 text-primary-600" />
              </div>
              <h3 className="text-2xl font-bold text-gray-900 mb-2">Technician</h3>
              <p className="text-gray-600">
                Workshop floor interface for completing the 11-step process
              </p>
            </div>
          </Link>

          {/* Manager */}
          <Link
            href="/manager"
            className="card hover:shadow-xl transition-all duration-200 hover:scale-105 cursor-pointer group"
          >
            <div className="card-body text-center py-12">
              <div className="mx-auto w-20 h-20 bg-success-100 rounded-full flex items-center justify-center mb-6 group-hover:bg-success-200 transition-colors">
                <Clipboard className="w-10 h-10 text-success-600" />
              </div>
              <h3 className="text-2xl font-bold text-gray-900 mb-2">Manager</h3>
              <p className="text-gray-600">
                Dashboard for quotes, job tracking, and report approval
              </p>
            </div>
          </Link>

          {/* Client */}
          <Link
            href="/client"
            className="card hover:shadow-xl transition-all duration-200 hover:scale-105 cursor-pointer group"
          >
            <div className="card-body text-center py-12">
              <div className="mx-auto w-20 h-20 bg-warning-100 rounded-full flex items-center justify-center mb-6 group-hover:bg-warning-200 transition-colors">
                <User className="w-10 h-10 text-warning-600" />
              </div>
              <h3 className="text-2xl font-bold text-gray-900 mb-2">Client Portal</h3>
              <p className="text-gray-600">
                View quotes, approve work, and track equipment status
              </p>
            </div>
          </Link>
        </div>

        {/* Footer */}
        <div className="text-center mt-12 text-primary-100">
          <p className="text-sm">
            Powered by NOVATEK LLC | Brimis 11-Step Service Excellence
          </p>
        </div>
      </div>
    </div>
  );
}
