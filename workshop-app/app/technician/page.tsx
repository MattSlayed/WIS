'use client';

/**
 * Technician Dashboard - Job Selection and QR Scanner
 * Allows technicians to select existing jobs or scan QR codes to begin work
 */

import { useState } from 'react';
import Link from 'next/link';
import { Search, QrCode, Plus, Clock, AlertTriangle } from 'lucide-react';

// TODO: Replace with actual data fetching from Supabase
const mockJobs = [
  {
    id: '1',
    job_number: 'BRIM-2025-001',
    client_name: 'Acme Corp',
    equipment_type: 'Hydraulic Pump',
    current_step: 'step_3_strip_assess',
    has_hazmat: true,
    created_at: '2025-01-15T10:30:00Z',
  },
  {
    id: '2',
    job_number: 'BRIM-2025-002',
    client_name: 'TechCo Industries',
    equipment_type: 'Electric Motor',
    current_step: 'step_5_technical_report',
    has_hazmat: false,
    created_at: '2025-01-16T14:20:00Z',
  },
  {
    id: '3',
    job_number: 'BRIM-2025-003',
    client_name: 'Manufacturing Ltd',
    equipment_type: 'Gearbox Assembly',
    current_step: 'step_6_await_po',
    has_hazmat: false,
    created_at: '2025-01-17T09:15:00Z',
  },
];

export default function TechnicianDashboard() {
  const [searchQuery, setSearchQuery] = useState('');
  const [showScanner, setShowScanner] = useState(false);

  const filteredJobs = mockJobs.filter(
    (job) =>
      job.job_number.toLowerCase().includes(searchQuery.toLowerCase()) ||
      job.client_name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      job.equipment_type.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const getStepName = (step: string): string => {
    const stepNames: Record<string, string> = {
      step_1_receiving: 'Receiving',
      step_2_logging: 'Logging',
      step_3_strip_assess: 'Strip & Assess',
      step_4_document_faults: 'Document Faults',
      step_5_technical_report: 'Technical Report',
      step_6_await_po: 'Awaiting PO',
      step_7_repair: 'Repair',
      step_8_reassemble: 'Reassemble',
      step_9_function_test: 'Function Test',
      step_10_qc_inspection: 'QC Inspection',
      step_11_dispatch: 'Dispatch',
    };
    return stepNames[step] || step;
  };

  const getStepNumber = (step: string): number => {
    const match = step.match(/step_(\d+)_/);
    return match ? parseInt(match[1]) : 0;
  };

  return (
    <div className="space-y-6">
      {/* Header Actions */}
      <div className="flex flex-col sm:flex-row gap-4">
        <div className="flex-1">
          <div className="input-group">
            <Search className="w-5 h-5 text-gray-400" />
            <input
              type="text"
              placeholder="Search jobs by number, client, or equipment..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="input"
            />
          </div>
        </div>
        <div className="flex gap-2">
          <button
            onClick={() => setShowScanner(true)}
            className="btn btn-secondary"
          >
            <QrCode className="w-5 h-5" />
            <span className="hidden sm:inline">Scan QR</span>
          </button>
          <Link href="/technician/new-job" className="btn btn-primary">
            <Plus className="w-5 h-5" />
            <span className="hidden sm:inline">New Job</span>
          </Link>
        </div>
      </div>

      {/* Active Jobs */}
      <div>
        <h2 className="text-xl font-semibold text-gray-900 mb-4">
          Active Jobs ({filteredJobs.length})
        </h2>

        {filteredJobs.length === 0 ? (
          <div className="card text-center py-12">
            <div className="text-gray-400 mb-4">
              <Clock className="w-16 h-16 mx-auto" />
            </div>
            <p className="text-gray-600 text-lg mb-2">No active jobs found</p>
            <p className="text-gray-500 text-sm mb-6">
              {searchQuery
                ? 'Try adjusting your search query'
                : 'Create a new job or scan a QR code to get started'}
            </p>
            <div className="flex gap-3 justify-center">
              <button
                onClick={() => setShowScanner(true)}
                className="btn btn-secondary"
              >
                <QrCode className="w-5 h-5" />
                Scan QR Code
              </button>
              <Link href="/technician/new-job" className="btn btn-primary">
                <Plus className="w-5 h-5" />
                Create New Job
              </Link>
            </div>
          </div>
        ) : (
          <div className="grid gap-4">
            {filteredJobs.map((job) => (
              <Link
                key={job.id}
                href={`/technician/job/${job.id}`}
                className="card hover:shadow-lg transition-shadow duration-200"
              >
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <h3 className="text-lg font-semibold text-gray-900">
                        {job.job_number}
                      </h3>
                      {job.has_hazmat && (
                        <span className="badge badge-danger">
                          <AlertTriangle className="w-3 h-3" />
                          Hazmat
                        </span>
                      )}
                    </div>
                    <p className="text-gray-600 mb-1">{job.client_name}</p>
                    <p className="text-sm text-gray-500 mb-3">
                      {job.equipment_type}
                    </p>
                    <div className="flex items-center gap-2">
                      <span className="badge badge-primary">
                        Step {getStepNumber(job.current_step)}
                      </span>
                      <span className="text-sm text-gray-600">
                        {getStepName(job.current_step)}
                      </span>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-xs text-gray-500">
                      Started {new Date(job.created_at).toLocaleDateString()}
                    </p>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        )}
      </div>

      {/* QR Scanner Modal */}
      {showScanner && (
        <div className="fixed inset-0 z-50 bg-black bg-opacity-75 flex items-center justify-center p-4">
          <div className="bg-white rounded-xl max-w-md w-full p-6">
            <h3 className="text-xl font-semibold mb-4">Scan Job QR Code</h3>
            <p className="text-gray-600 mb-6">
              Position the QR code within the camera view to load the job.
            </p>
            {/* TODO: Integrate QRScanner component */}
            <div className="bg-gray-100 rounded-lg aspect-square flex items-center justify-center mb-4">
              <QrCode className="w-24 h-24 text-gray-400" />
            </div>
            <button
              onClick={() => setShowScanner(false)}
              className="btn btn-secondary w-full"
            >
              Cancel
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
