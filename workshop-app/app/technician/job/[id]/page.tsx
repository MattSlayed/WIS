'use client';

/**
 * Job Workflow Page
 * Main technician interface for progressing through the 11-step workflow
 */

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { ArrowLeft, Save, CheckCircle } from 'lucide-react';
import StepWizard from '@/components/step-wizard';
import type { Job, WorkflowStep } from '@/types';

// Step Components (will be created next)
import Step1Receiving from '@/components/steps/step-1-receiving';
import Step2Logging from '@/components/steps/step-2-logging';
import Step3StripAssess from '@/components/steps/step-3-strip-assess';
import Step4DocumentFaults from '@/components/steps/step-4-document-faults';
import Step5TechnicalReport from '@/components/steps/step-5-technical-report';
import Step6AwaitPO from '@/components/steps/step-6-await-po';
import Step7Repair from '@/components/steps/step-7-repair';
import Step8Reassemble from '@/components/steps/step-8-reassemble';
import Step9FunctionTest from '@/components/steps/step-9-function-test';
import Step10QCInspection from '@/components/steps/step-10-qc-inspection';
import Step11Dispatch from '@/components/steps/step-11-dispatch';

interface JobWorkflowPageProps {
  params: { id: string };
}

// TODO: Replace with actual Supabase query
const mockJob: Job = {
  id: '1',
  job_number: 'BRIM-2025-001',
  client_id: 'client-1',
  equipment_type: 'Hydraulic Pump',
  serial_number: 'HP-2024-5678',
  model_number: 'HYD-3000X',
  current_step: 'step_3_strip_assess',
  has_hazmat: true,
  hazmat_details: 'Hydraulic fluid contamination - special disposal required',
  receiving_notes: 'Equipment received with visible damage to housing',
  po_received_at: undefined,
  po_number: undefined,
  actual_completion_date: undefined,
  received_at: '2025-01-15T10:30:00Z',
  created_at: '2025-01-15T10:30:00Z',
  updated_at: '2025-01-15T14:45:00Z',
  status: 'stripped',
  hazmat_cleaned: false,
};

export default function JobWorkflowPage({ params }: JobWorkflowPageProps) {
  const router = useRouter();
  const [job, setJob] = useState<Job>(mockJob);
  const [isSaving, setIsSaving] = useState(false);
  const [saveMessage, setSaveMessage] = useState<string | null>(null);

  // TODO: Fetch job data from Supabase
  useEffect(() => {
    // fetchJobData(params.id);
  }, [params.id]);

  const handleStepClick = (step: WorkflowStep) => {
    // Navigate to the clicked step if it's completed or current
    console.log('Navigate to step:', step);
  };

  const handleSaveProgress = async () => {
    setIsSaving(true);
    setSaveMessage(null);

    try {
      // TODO: Save to Supabase
      await new Promise((resolve) => setTimeout(resolve, 1000)); // Simulate API call
      setSaveMessage('Progress saved successfully!');
      setTimeout(() => setSaveMessage(null), 3000);
    } catch (error) {
      setSaveMessage('Error saving progress. Please try again.');
    } finally {
      setIsSaving(false);
    }
  };

  const handleCompleteStep = async () => {
    setIsSaving(true);
    setSaveMessage(null);

    try {
      // TODO: Validate and complete step via Workflow Engine
      await new Promise((resolve) => setTimeout(resolve, 1000)); // Simulate API call

      // Advance to next step
      const stepNumber = parseInt(job.current_step.match(/step_(\d+)_/)?.[1] || '1');
      const nextStepNumber = stepNumber + 1;
      const nextStep = `step_${nextStepNumber}_` as WorkflowStep;

      setJob({ ...job, current_step: nextStep });
      setSaveMessage('Step completed! Moving to next step...');
      setTimeout(() => setSaveMessage(null), 3000);
    } catch (error) {
      setSaveMessage('Error completing step. Please try again.');
    } finally {
      setIsSaving(false);
    }
  };

  const renderCurrentStep = () => {
    const stepProps = {
      job,
      onUpdate: setJob,
      onSave: handleSaveProgress,
      onComplete: handleCompleteStep,
    };

    switch (job.current_step) {
      case 'step_1_receiving':
        return <Step1Receiving {...stepProps} />;
      case 'step_2_logging':
        return <Step2Logging {...stepProps} />;
      case 'step_3_strip_assess':
        return <Step3StripAssess {...stepProps} />;
      case 'step_4_document_faults':
        return <Step4DocumentFaults {...stepProps} />;
      case 'step_5_technical_report':
        return <Step5TechnicalReport {...stepProps} />;
      case 'step_6_await_po':
        return <Step6AwaitPO {...stepProps} />;
      case 'step_7_repair':
        return <Step7Repair {...stepProps} />;
      case 'step_8_reassemble':
        return <Step8Reassemble {...stepProps} />;
      case 'step_9_function_test':
        return <Step9FunctionTest {...stepProps} />;
      case 'step_10_qc_inspection':
        return <Step10QCInspection {...stepProps} />;
      case 'step_11_dispatch':
        return <Step11Dispatch {...stepProps} />;
      default:
        return <div>Unknown step</div>;
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <button
          onClick={() => router.push('/technician')}
          className="btn btn-ghost"
        >
          <ArrowLeft className="w-5 h-5" />
          Back to Jobs
        </button>
        <div className="flex items-center gap-3">
          {saveMessage && (
            <span
              className={`text-sm font-medium ${
                saveMessage.includes('Error') ? 'text-danger-600' : 'text-success-600'
              }`}
            >
              {saveMessage}
            </span>
          )}
          <button
            onClick={handleSaveProgress}
            disabled={isSaving}
            className="btn btn-secondary"
          >
            <Save className="w-5 h-5" />
            {isSaving ? 'Saving...' : 'Save Progress'}
          </button>
        </div>
      </div>

      {/* Job Info Card */}
      <div className="card">
        <div className="flex items-start justify-between mb-4">
          <div>
            <h1 className="text-2xl font-bold text-gray-900 mb-2">
              {job.job_number}
            </h1>
            <p className="text-gray-600">{job.equipment_type}</p>
            <div className="flex gap-4 mt-2 text-sm text-gray-500">
              <span>Serial: {job.serial_number}</span>
              {job.model_number && <span>Model: {job.model_number}</span>}
            </div>
          </div>
          <div className="text-right">
            <span className="badge badge-primary mb-2">
              {job.current_step.replace(/_/g, ' ').replace('step ', 'Step ')}
            </span>
            {job.has_hazmat && (
              <div>
                <span className="badge badge-danger">Hazmat</span>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Step Wizard */}
      <StepWizard
        currentStep={job.current_step}
        job={job}
        onStepClick={handleStepClick}
      />

      {/* Current Step Content */}
      {renderCurrentStep()}
    </div>
  );
}
