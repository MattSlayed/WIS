'use client';

import type { Job } from '@/types';

interface Step6Props {
  job: Job;
  onUpdate: (job: Job) => void;
  onSave: () => void;
  onComplete: () => void;
}

export default function Step6AwaitPO({ job, onUpdate, onSave, onComplete }: Step6Props) {
  return (
    <div className="card">
      <h2 className="text-xl font-semibold mb-4">Step 6: Await PO</h2>
      <p className="text-gray-600 mb-6">PO approval workflow coming soon...</p>
      <div className="flex gap-3">
        <button onClick={onSave} className="btn btn-secondary flex-1">Save Progress</button>
        <button onClick={onComplete} disabled className="btn btn-primary flex-1">
          Awaiting PO Approval
        </button>
      </div>
    </div>
  );
}
