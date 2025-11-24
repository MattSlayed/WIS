'use client';

/**
 * Step 2: Logging
 * Create job number and record client/equipment details
 */

import { useState, useEffect } from 'react';
import { CheckCircle, QrCode } from 'lucide-react';
import type { Job } from '@/types';

interface Step2Props {
  job: Job;
  onUpdate: (job: Job) => void;
  onSave: () => void;
  onComplete: () => void;
}

export default function Step2Logging({ job, onUpdate, onSave, onComplete }: Step2Props) {
  const [equipmentType, setEquipmentType] = useState(job.equipment_type || '');
  const [serialNumber, setSerialNumber] = useState(job.serial_number || '');
  const [modelNumber, setModelNumber] = useState(job.model_number || '');
  const [showQRCode, setShowQRCode] = useState(false);

  const handleUpdate = () => {
    onUpdate({
      ...job,
      equipment_type: equipmentType,
      serial_number: serialNumber,
      model_number: modelNumber,
    });
  };

  const canComplete =
    equipmentType.trim().length > 0 &&
    serialNumber.trim().length > 0 &&
    modelNumber.trim().length > 0;

  return (
    <div className="space-y-6">
      <div className="card">
        <h2 className="text-xl font-semibold text-gray-900 mb-4">
          Step 2: Logging
        </h2>
        <p className="text-gray-600 mb-6">
          Record equipment details and generate job documentation.
        </p>

        {/* Job Number Display */}
        <div className="mb-6 p-4 bg-primary-50 border border-primary-200 rounded-lg">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-primary-900 mb-1">
                Job Number
              </p>
              <p className="text-2xl font-bold text-primary-700">
                {job.job_number}
              </p>
            </div>
            <button
              onClick={() => setShowQRCode(!showQRCode)}
              className="btn btn-ghost btn-sm"
            >
              <QrCode className="w-5 h-5" />
              {showQRCode ? 'Hide' : 'Show'} QR
            </button>
          </div>

          {showQRCode && (
            <div className="mt-4 pt-4 border-t border-primary-200">
              <div className="bg-white p-4 rounded-lg inline-block">
                {/* TODO: Generate actual QR code */}
                <div className="w-48 h-48 bg-gray-200 flex items-center justify-center">
                  <QrCode className="w-16 h-16 text-gray-400" />
                </div>
              </div>
              <p className="text-xs text-primary-700 mt-2">
                Scan this QR code to quickly access this job
              </p>
            </div>
          )}
        </div>

        {/* Equipment Details Form */}
        <div className="space-y-4 mb-6">
          <div className="form-group">
            <label className="form-label" htmlFor="equipment-type">
              Equipment Type <span className="text-danger-500">*</span>
            </label>
            <input
              type="text"
              id="equipment-type"
              value={equipmentType}
              onChange={(e) => setEquipmentType(e.target.value)}
              onBlur={handleUpdate}
              className="input"
              placeholder="e.g., Hydraulic Pump, Electric Motor, Gearbox"
            />
          </div>

          <div className="form-group">
            <label className="form-label" htmlFor="serial-number">
              Serial Number <span className="text-danger-500">*</span>
            </label>
            <input
              type="text"
              id="serial-number"
              value={serialNumber}
              onChange={(e) => setSerialNumber(e.target.value)}
              onBlur={handleUpdate}
              className="input"
              placeholder="Equipment serial number"
            />
          </div>

          <div className="form-group">
            <label className="form-label" htmlFor="model-number">
              Model Number <span className="text-danger-500">*</span>
            </label>
            <input
              type="text"
              id="model-number"
              value={modelNumber}
              onChange={(e) => setModelNumber(e.target.value)}
              onBlur={handleUpdate}
              className="input"
              placeholder="Equipment model number"
            />
          </div>
        </div>

        {/* Completion Requirements */}
        <div className="mb-6 p-4 bg-blue-50 border border-blue-200 rounded-lg">
          <h4 className="text-sm font-medium text-blue-900 mb-2">
            Completion Requirements
          </h4>
          <ul className="space-y-1 text-sm text-blue-800">
            <li className="flex items-center gap-2">
              <CheckCircle className="w-4 h-4 text-success-600" />
              Job number generated: {job.job_number}
            </li>
            <li className="flex items-center gap-2">
              {equipmentType.trim().length > 0 ? (
                <CheckCircle className="w-4 h-4 text-success-600" />
              ) : (
                <div className="w-4 h-4 rounded-full border-2 border-blue-400" />
              )}
              Equipment type recorded
            </li>
            <li className="flex items-center gap-2">
              {serialNumber.trim().length > 0 ? (
                <CheckCircle className="w-4 h-4 text-success-600" />
              ) : (
                <div className="w-4 h-4 rounded-full border-2 border-blue-400" />
              )}
              Serial number recorded
            </li>
            <li className="flex items-center gap-2">
              {modelNumber.trim().length > 0 ? (
                <CheckCircle className="w-4 h-4 text-success-600" />
              ) : (
                <div className="w-4 h-4 rounded-full border-2 border-blue-400" />
              )}
              Model number recorded
            </li>
          </ul>
        </div>

        {/* Action Buttons */}
        <div className="flex gap-3">
          <button onClick={onSave} className="btn btn-secondary flex-1">
            Save Progress
          </button>
          <button
            onClick={onComplete}
            disabled={!canComplete}
            className="btn btn-primary flex-1"
          >
            Complete Step 2
          </button>
        </div>
      </div>
    </div>
  );
}
