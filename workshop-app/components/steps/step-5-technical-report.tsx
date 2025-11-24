'use client';

import type { Job } from '@/types';

interface Step5Props {
  job: Job;
  onUpdate: (job: Job) => void;
  onSave: () => void;
  onComplete: () => void;
}

export default function Step5TechnicalReport({ job, onUpdate, onSave, onComplete }: Step5Props) {
  return (
    <div className="card">
      <h2 className="text-xl font-semibold mb-4">Step 5: Technical Report</h2>
      <p className="text-gray-600 mb-6">AI-powered report generation coming soon...</p>
      <div className="flex gap-3">
        <button onClick={onSave} className="btn btn-secondary flex-1">Save Progress</button>
        <button onClick={onComplete} className="btn btn-primary flex-1">Complete Step 5</button>
      </div>
    </div>
  );
}
