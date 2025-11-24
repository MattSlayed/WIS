'use client';

/**
 * Step 3: Strip & Assess
 * Disassemble equipment and document internal condition with AI-powered defect detection
 */

import { useState } from 'react';
import { CheckCircle, Sparkles } from 'lucide-react';
import PhotoUpload from '@/components/shared/photo-upload';
import type { Job, JobPhoto } from '@/types';

interface Step3Props {
  job: Job;
  onUpdate: (job: Job) => void;
  onSave: () => void;
  onComplete: () => void;
}

export default function Step3StripAssess({ job, onUpdate, onSave, onComplete }: Step3Props) {
  const [photos, setPhotos] = useState<JobPhoto[]>([]);
  const [assessmentNotes, setAssessmentNotes] = useState('');
  const [identifiedIssues, setIdentifiedIssues] = useState<string[]>([]);
  const [newIssue, setNewIssue] = useState('');

  const handleUpdate = () => {
    // Update job data
  };

  const handleAddIssue = () => {
    if (newIssue.trim()) {
      setIdentifiedIssues([...identifiedIssues, newIssue.trim()]);
      setNewIssue('');
    }
  };

  const handleRemoveIssue = (index: number) => {
    setIdentifiedIssues(identifiedIssues.filter((_, i) => i !== index));
  };

  const canComplete = photos.length >= 3 && assessmentNotes.trim().length > 0;

  return (
    <div className="space-y-6">
      <div className="card">
        <h2 className="text-xl font-semibold text-gray-900 mb-4">
          Step 3: Strip & Assess
        </h2>
        <p className="text-gray-600 mb-6">
          Disassemble the equipment and document all internal components and defects.
        </p>

        {/* AI-Powered Photo Upload */}
        <div className="mb-6">
          <div className="flex items-center gap-2 mb-2">
            <h3 className="text-sm font-medium text-gray-900">
              Internal Component Photos <span className="text-danger-500">*</span>
            </h3>
            <span className="badge badge-primary text-xs">
              <Sparkles className="w-3 h-3" />
              AI Detection
            </span>
          </div>
          <p className="text-sm text-gray-600 mb-3">
            Take photos of internal components. AI will automatically detect defects like corrosion,
            cracks, wear, and pitting (minimum 3 required).
          </p>
          <PhotoUpload
            jobId={job.id}
            stepNumber={3}
            photos={photos}
            onPhotosChange={setPhotos}
            maxPhotos={20}
            enableAIAnalysis={true}
          />
        </div>

        {/* Assessment Notes */}
        <div className="mb-6">
          <label className="form-label" htmlFor="assessment-notes">
            Assessment Notes <span className="text-danger-500">*</span>
          </label>
          <textarea
            id="assessment-notes"
            value={assessmentNotes}
            onChange={(e) => setAssessmentNotes(e.target.value)}
            onBlur={handleUpdate}
            rows={5}
            className="input"
            placeholder="Document the condition of internal components, wear patterns, contamination, etc."
          />
          <p className="mt-1 text-sm text-gray-500">
            Provide detailed observations about the equipment's internal condition
          </p>
        </div>

        {/* Identified Issues List */}
        <div className="mb-6">
          <label className="form-label" htmlFor="new-issue">
            Identified Issues
          </label>
          <div className="flex gap-2 mb-3">
            <input
              type="text"
              id="new-issue"
              value={newIssue}
              onChange={(e) => setNewIssue(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleAddIssue()}
              className="input flex-1"
              placeholder="Add an issue or defect..."
            />
            <button onClick={handleAddIssue} className="btn btn-secondary">
              Add
            </button>
          </div>

          {identifiedIssues.length > 0 && (
            <div className="space-y-2">
              {identifiedIssues.map((issue, index) => (
                <div
                  key={index}
                  className="flex items-center justify-between p-3 bg-gray-50 rounded-lg"
                >
                  <span className="text-sm text-gray-900">{issue}</span>
                  <button
                    onClick={() => handleRemoveIssue(index)}
                    className="text-danger-600 hover:text-danger-700 text-sm font-medium"
                  >
                    Remove
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* AI Analysis Summary */}
        {photos.some((p) => p.ai_analysis?.detected_defects && p.ai_analysis.detected_defects.length > 0) && (
          <div className="mb-6 p-4 bg-purple-50 border border-purple-200 rounded-lg">
            <div className="flex items-start gap-2">
              <Sparkles className="w-5 h-5 text-purple-600 flex-shrink-0 mt-0.5" />
              <div className="flex-1">
                <h4 className="text-sm font-medium text-purple-900 mb-2">
                  AI Defect Detection Summary
                </h4>
                <div className="space-y-1 text-sm text-purple-800">
                  {Array.from(
                    new Set(
                      photos.flatMap((p) => p.ai_analysis?.detected_defects || [])
                    )
                  ).map((defect, index) => (
                    <div key={index} className="flex items-center gap-2">
                      <div className="w-2 h-2 rounded-full bg-purple-500" />
                      <span className="capitalize">{defect}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Completion Requirements */}
        <div className="mb-6 p-4 bg-blue-50 border border-blue-200 rounded-lg">
          <h4 className="text-sm font-medium text-blue-900 mb-2">
            Completion Requirements
          </h4>
          <ul className="space-y-1 text-sm text-blue-800">
            <li className="flex items-center gap-2">
              {photos.length >= 3 ? (
                <CheckCircle className="w-4 h-4 text-success-600" />
              ) : (
                <div className="w-4 h-4 rounded-full border-2 border-blue-400" />
              )}
              Minimum 3 internal component photos
            </li>
            <li className="flex items-center gap-2">
              {assessmentNotes.trim().length > 0 ? (
                <CheckCircle className="w-4 h-4 text-success-600" />
              ) : (
                <div className="w-4 h-4 rounded-full border-2 border-blue-400" />
              )}
              Assessment notes documented
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
            Complete Step 3
          </button>
        </div>
      </div>
    </div>
  );
}
