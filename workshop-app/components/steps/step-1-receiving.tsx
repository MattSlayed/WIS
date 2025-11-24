'use client';

/**
 * Step 1: Receiving
 * Record equipment arrival and initial observations
 */

import { useState } from 'react';
import { AlertTriangle, CheckCircle } from 'lucide-react';
import PhotoUpload from '@/components/shared/photo-upload';
import type { Job, JobPhoto } from '@/types';

interface Step1Props {
  job: Job;
  onUpdate: (job: Job) => void;
  onSave: () => void;
  onComplete: () => void;
}

export default function Step1Receiving({ job, onUpdate, onSave, onComplete }: Step1Props) {
  const [photos, setPhotos] = useState<JobPhoto[]>([]);
  const [receivingNotes, setReceivingNotes] = useState(job.receiving_notes || '');
  const [hasHazmat, setHasHazmat] = useState(job.has_hazmat || false);
  const [hazmatDetails, setHazmatDetails] = useState(job.hazmat_details || '');

  const handleUpdate = () => {
    onUpdate({
      ...job,
      receiving_notes: receivingNotes,
      has_hazmat: hasHazmat,
      hazmat_details: hazmatDetails,
    });
  };

  const canComplete = receivingNotes.trim().length > 0 && photos.length >= 2;

  return (
    <div className="space-y-6">
      <div className="card">
        <h2 className="text-xl font-semibold text-gray-900 mb-4">
          Step 1: Receiving
        </h2>
        <p className="text-gray-600 mb-6">
          Record the equipment arrival and initial condition assessment.
        </p>

        {/* Receiving Photos */}
        <div className="mb-6">
          <h3 className="text-sm font-medium text-gray-900 mb-2">
            Receiving Photos <span className="text-danger-500">*</span>
          </h3>
          <p className="text-sm text-gray-600 mb-3">
            Take photos of the equipment as received (minimum 2 required)
          </p>
          <PhotoUpload
            jobId={job.id}
            stepNumber={1}
            photos={photos}
            onPhotosChange={setPhotos}
            maxPhotos={10}
            enableAIAnalysis={false}
          />
        </div>

        {/* Receiving Notes */}
        <div className="mb-6">
          <label className="form-label" htmlFor="receiving-notes">
            Receiving Notes <span className="text-danger-500">*</span>
          </label>
          <textarea
            id="receiving-notes"
            value={receivingNotes}
            onChange={(e) => setReceivingNotes(e.target.value)}
            onBlur={handleUpdate}
            rows={4}
            className="input"
            placeholder="Document equipment condition, visible damage, missing parts, etc."
          />
          <p className="mt-1 text-sm text-gray-500">
            Describe the overall condition and any obvious issues
          </p>
        </div>

        {/* Hazmat Toggle */}
        <div className="mb-6">
          <div className="flex items-start gap-3 p-4 bg-gray-50 rounded-lg">
            <input
              type="checkbox"
              id="has-hazmat"
              checked={hasHazmat}
              onChange={(e) => {
                setHasHazmat(e.target.checked);
                if (!e.target.checked) {
                  setHazmatDetails('');
                }
                handleUpdate();
              }}
              className="mt-1 h-5 w-5 rounded border-gray-300 text-primary-600 focus:ring-primary-500"
            />
            <div className="flex-1">
              <label
                htmlFor="has-hazmat"
                className="font-medium text-gray-900 cursor-pointer flex items-center gap-2"
              >
                <AlertTriangle className="w-5 h-5 text-warning-600" />
                Hazmat Detected
              </label>
              <p className="text-sm text-gray-600 mt-1">
                Check if equipment contains hazardous materials requiring special handling
              </p>
            </div>
          </div>

          {hasHazmat && (
            <div className="mt-3">
              <label className="form-label" htmlFor="hazmat-details">
                Hazmat Details <span className="text-danger-500">*</span>
              </label>
              <textarea
                id="hazmat-details"
                value={hazmatDetails}
                onChange={(e) => setHazmatDetails(e.target.value)}
                onBlur={handleUpdate}
                rows={3}
                className="input"
                placeholder="Describe the hazardous materials and required precautions..."
              />
            </div>
          )}
        </div>

        {/* Completion Requirements */}
        <div className="mb-6 p-4 bg-blue-50 border border-blue-200 rounded-lg">
          <h4 className="text-sm font-medium text-blue-900 mb-2">
            Completion Requirements
          </h4>
          <ul className="space-y-1 text-sm text-blue-800">
            <li className="flex items-center gap-2">
              {photos.length >= 2 ? (
                <CheckCircle className="w-4 h-4 text-success-600" />
              ) : (
                <div className="w-4 h-4 rounded-full border-2 border-blue-400" />
              )}
              Minimum 2 receiving photos
            </li>
            <li className="flex items-center gap-2">
              {receivingNotes.trim().length > 0 ? (
                <CheckCircle className="w-4 h-4 text-success-600" />
              ) : (
                <div className="w-4 h-4 rounded-full border-2 border-blue-400" />
              )}
              Receiving notes documented
            </li>
            {hasHazmat && (
              <li className="flex items-center gap-2">
                {hazmatDetails.trim().length > 0 ? (
                  <CheckCircle className="w-4 h-4 text-success-600" />
                ) : (
                  <div className="w-4 h-4 rounded-full border-2 border-blue-400" />
                )}
                Hazmat details documented
              </li>
            )}
          </ul>
        </div>

        {/* Action Buttons */}
        <div className="flex gap-3">
          <button onClick={onSave} className="btn btn-secondary flex-1">
            Save Progress
          </button>
          <button
            onClick={onComplete}
            disabled={!canComplete || (hasHazmat && !hazmatDetails.trim())}
            className="btn btn-primary flex-1"
          >
            Complete Step 1
          </button>
        </div>
      </div>
    </div>
  );
}
