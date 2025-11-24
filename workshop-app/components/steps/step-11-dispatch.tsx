'use client';

import type { Job } from '@/types';

interface Step11Props {
  job: Job;
  onUpdate: (job: Job) => void;
  onSave: () => void;
  onComplete: () => void;
}

export default function Step11Dispatch({ job, onUpdate, onSave, onComplete }: Step11Props) {
  return (
    <div className="card">
      <h2 className="text-xl font-semibold mb-4">Step 11: Dispatch</h2>
      <p className="text-gray-600 mb-6">Dispatch and delivery workflow coming soon...</p>
      <div className="flex gap-3">
        <button onClick={onSave} className="btn btn-secondary flex-1">Save Progress</button>
        <button onClick={onComplete} className="btn btn-primary flex-1">Complete Job</button>
      </div>
    </div>
  );
}
