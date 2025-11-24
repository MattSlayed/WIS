'use client';

/**
 * Step Wizard Navigation Component
 * Displays the 11-step workflow with progress indication
 * Shows which steps are completed, current, blocked, and upcoming
 */

import { Check, Lock, AlertTriangle } from 'lucide-react';
import type { WorkflowStep, Job } from '@/types';

interface StepWizardProps {
  currentStep: WorkflowStep;
  job: Job;
  onStepClick?: (step: WorkflowStep) => void;
}

const STEP_CONFIG = [
  { id: 'step_1_receiving', number: 1, name: 'Receiving', short: 'Receive' },
  { id: 'step_2_logging', number: 2, name: 'Logging', short: 'Log' },
  { id: 'step_3_strip_assess', number: 3, name: 'Strip & Assess', short: 'Strip' },
  { id: 'step_4_document_faults', number: 4, name: 'Document Faults', short: 'Faults' },
  { id: 'step_5_technical_report', number: 5, name: 'Technical Report', short: 'Report' },
  { id: 'step_6_await_po', number: 6, name: 'Await PO', short: 'PO' },
  { id: 'step_7_repair', number: 7, name: 'Repair', short: 'Repair' },
  { id: 'step_8_reassemble', number: 8, name: 'Reassemble', short: 'Reassem.' },
  { id: 'step_9_function_test', number: 9, name: 'Function Test', short: 'Test' },
  { id: 'step_10_qc_inspection', number: 10, name: 'QC Inspection', short: 'QC' },
  { id: 'step_11_dispatch', number: 11, name: 'Dispatch', short: 'Dispatch' },
];

export default function StepWizard({ currentStep, job, onStepClick }: StepWizardProps) {
  const currentStepNumber = STEP_CONFIG.find((s) => s.id === currentStep)?.number || 1;

  const getStepStatus = (stepNumber: number): 'completed' | 'current' | 'blocked' | 'upcoming' => {
    if (stepNumber < currentStepNumber) return 'completed';
    if (stepNumber === currentStepNumber) return 'current';

    // Step 6 (Await PO) blocks Step 7 (Repair) until PO is received
    if (stepNumber === 7 && currentStepNumber === 6 && !job.po_received_at) {
      return 'blocked';
    }

    return 'upcoming';
  };

  const getStepStyles = (status: string) => {
    switch (status) {
      case 'completed':
        return 'bg-success-500 text-white border-success-500';
      case 'current':
        return 'bg-primary-500 text-white border-primary-500 ring-4 ring-primary-100';
      case 'blocked':
        return 'bg-danger-100 text-danger-700 border-danger-300';
      case 'upcoming':
        return 'bg-gray-100 text-gray-500 border-gray-300';
      default:
        return 'bg-gray-100 text-gray-500 border-gray-300';
    }
  };

  const getConnectorStyles = (fromStatus: string, toStatus: string) => {
    if (fromStatus === 'completed') {
      return 'bg-success-500';
    }
    return 'bg-gray-300';
  };

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
      <h2 className="text-lg font-semibold text-gray-900 mb-4">Workflow Progress</h2>

      {/* Desktop View */}
      <div className="hidden lg:block">
        <div className="flex items-center justify-between">
          {STEP_CONFIG.map((step, index) => {
            const status = getStepStatus(step.number);
            const isClickable = status === 'completed' || status === 'current';

            return (
              <div key={step.id} className="flex items-center flex-1">
                <button
                  onClick={() => isClickable && onStepClick?.(step.id as WorkflowStep)}
                  disabled={!isClickable}
                  className={`
                    flex flex-col items-center gap-2 px-3 py-2 rounded-lg transition-all
                    ${isClickable ? 'cursor-pointer hover:bg-gray-50' : 'cursor-not-allowed'}
                  `}
                >
                  <div
                    className={`
                      w-12 h-12 rounded-full border-2 flex items-center justify-center
                      font-semibold transition-all
                      ${getStepStyles(status)}
                    `}
                  >
                    {status === 'completed' && <Check className="w-6 h-6" />}
                    {status === 'blocked' && <Lock className="w-5 h-5" />}
                    {(status === 'current' || status === 'upcoming') && step.number}
                  </div>
                  <div className="text-center">
                    <p className="text-xs font-medium text-gray-900">{step.name}</p>
                  </div>
                </button>

                {index < STEP_CONFIG.length - 1 && (
                  <div className="flex-1 h-1 mx-2">
                    <div
                      className={`
                        h-full rounded-full transition-all
                        ${getConnectorStyles(status, getStepStatus(step.number + 1))}
                      `}
                    />
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>

      {/* Tablet/Mobile View */}
      <div className="lg:hidden">
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
          {STEP_CONFIG.map((step) => {
            const status = getStepStatus(step.number);
            const isClickable = status === 'completed' || status === 'current';

            return (
              <button
                key={step.id}
                onClick={() => isClickable && onStepClick?.(step.id as WorkflowStep)}
                disabled={!isClickable}
                className={`
                  flex items-center gap-2 p-3 rounded-lg border-2 transition-all
                  ${getStepStyles(status)}
                  ${isClickable ? 'cursor-pointer hover:opacity-80' : 'cursor-not-allowed'}
                `}
              >
                <div className="flex-shrink-0 w-8 h-8 flex items-center justify-center">
                  {status === 'completed' && <Check className="w-5 h-5" />}
                  {status === 'blocked' && <Lock className="w-4 h-4" />}
                  {(status === 'current' || status === 'upcoming') && (
                    <span className="font-bold">{step.number}</span>
                  )}
                </div>
                <span className="text-sm font-medium truncate">{step.short}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Legend */}
      <div className="mt-6 pt-4 border-t border-gray-200 flex flex-wrap gap-4 text-sm">
        <div className="flex items-center gap-2">
          <div className="w-4 h-4 rounded-full bg-success-500"></div>
          <span className="text-gray-600">Completed</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-4 h-4 rounded-full bg-primary-500"></div>
          <span className="text-gray-600">Current</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-4 h-4 rounded-full bg-danger-100 border-2 border-danger-300"></div>
          <span className="text-gray-600">Blocked</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-4 h-4 rounded-full bg-gray-100 border-2 border-gray-300"></div>
          <span className="text-gray-600">Upcoming</span>
        </div>
      </div>

      {/* Hazmat Warning */}
      {job.has_hazmat && (
        <div className="mt-4 p-3 bg-warning-50 border border-warning-200 rounded-lg flex items-start gap-2">
          <AlertTriangle className="w-5 h-5 text-warning-600 flex-shrink-0 mt-0.5" />
          <div>
            <p className="text-sm font-medium text-warning-900">Hazmat Detected</p>
            <p className="text-xs text-warning-700 mt-1">
              Special handling and documentation required throughout workflow
            </p>
          </div>
        </div>
      )}
    </div>
  );
}
