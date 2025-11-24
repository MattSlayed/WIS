/**
 * 11-Step Workflow State Machine Engine
 *
 * This engine enforces the Brimis 11-Step Process with strict step-gating logic.
 * No step can be skipped, and certain steps require specific conditions to be met.
 */

import {
  Job,
  WorkflowStep,
  JobStatus,
  StepConfig,
  WORKFLOW_STEPS,
  StepCompletion,
} from '@/types';
import { supabase } from './supabase/client';

export interface StepValidationResult {
  canProceed: boolean;
  errors: string[];
  warnings: string[];
}

export interface StepTransitionResult {
  success: boolean;
  message: string;
  updatedJob?: Job;
}

export class WorkflowEngine {
  /**
   * Validate if a job can proceed to the next step
   */
  static async validateStepProgression(
    job: Job,
    targetStep: WorkflowStep
  ): Promise<StepValidationResult> {
    const errors: string[] = [];
    const warnings: string[] = [];

    const currentStepConfig = WORKFLOW_STEPS[job.current_step];
    const targetStepConfig = WORKFLOW_STEPS[targetStep];

    // Check if trying to skip steps
    if (currentStepConfig.next_step !== targetStep) {
      errors.push(`Cannot skip from ${currentStepConfig.title} to ${targetStepConfig.title}`);
      return { canProceed: false, errors, warnings };
    }

    // Step-specific validation
    switch (job.current_step) {
      case 'step_2_logging':
        // Must complete hazmat check if hazmat present
        if (job.has_hazmat && !job.hazmat_cleaned) {
          errors.push('Hazmat cleaning procedure must be completed before proceeding');
        }
        break;

      case 'step_3_strip_assess':
        // Must have photos
        const stripPhotos = await this.getStepPhotos(job.id, 'step_3_strip_assess');
        if (stripPhotos.length === 0) {
          errors.push('At least one photo must be uploaded during Strip & Assess');
        }
        break;

      case 'step_4_document_faults':
        // Must have parts documented
        const { data: parts } = await supabase
          .from('job_parts')
          .select('*')
          .eq('job_id', job.id);

        if (!parts || parts.length === 0) {
          errors.push('At least one part must be documented');
        }
        break;

      case 'step_5_technical_report':
        // Must have technical report generated
        const { data: report } = await supabase
          .from('technical_reports')
          .select('*')
          .eq('job_id', job.id)
          .single();

        if (!report || report.status !== 'final') {
          errors.push('Technical report must be finalized before sending to client');
        }
        break;

      case 'step_6_await_po':
        // CRITICAL GATE: Must have PO received
        if (!job.po_received_at || !job.po_number) {
          errors.push('Purchase Order must be received before starting repairs');
          errors.push('This is a hard stop - equipment cannot proceed until client approves');
        }
        break;

      case 'step_7_repair':
        // Must have measurements recorded
        const { data: repairCompletion } = await supabase
          .from('step_completions')
          .select('*')
          .eq('job_id', job.id)
          .eq('step', 'step_7_repair')
          .single();

        if (!repairCompletion || !repairCompletion.measurements) {
          errors.push('Repair measurements must be recorded');
        }
        break;

      case 'step_9_function_test':
        // Must have test results
        const { data: testCompletion } = await supabase
          .from('step_completions')
          .select('*')
          .eq('job_id', job.id)
          .eq('step', 'step_9_function_test')
          .single();

        if (!testCompletion || !testCompletion.checklist_data) {
          errors.push('Function test checklist must be completed');
        }
        break;

      case 'step_10_qc_inspection':
        // CRITICAL GATE: Must pass QC
        const { data: qcInspection } = await supabase
          .from('qc_inspections')
          .select('*')
          .eq('job_id', job.id)
          .order('created_at', { ascending: false })
          .limit(1)
          .single();

        if (!qcInspection) {
          errors.push('QC Inspection must be completed');
        } else if (qcInspection.overall_status === 'failed') {
          errors.push('Equipment failed QC inspection and cannot be dispatched');
        } else if (qcInspection.overall_status === 'conditional') {
          warnings.push('Equipment has conditional QC approval - verify conditions are met');
        }
        break;
    }

    return {
      canProceed: errors.length === 0,
      errors,
      warnings,
    };
  }

  /**
   * Transition a job to the next step
   */
  static async transitionToNextStep(
    jobId: string,
    userId: string,
    notes?: string
  ): Promise<StepTransitionResult> {
    // Get current job
    const { data: job, error: jobError } = await supabase
      .from('jobs')
      .select('*')
      .eq('id', jobId)
      .single();

    if (jobError || !job) {
      return {
        success: false,
        message: 'Job not found',
      };
    }

    const currentStepConfig = WORKFLOW_STEPS[job.current_step];

    // Check if there is a next step
    if (!currentStepConfig.next_step) {
      return {
        success: false,
        message: 'Job is already at the final step',
      };
    }

    // Validate progression
    const validation = await this.validateStepProgression(
      job,
      currentStepConfig.next_step
    );

    if (!validation.canProceed) {
      return {
        success: false,
        message: validation.errors.join('. '),
      };
    }

    // Mark current step as complete
    await supabase.from('step_completions').upsert({
      job_id: jobId,
      step: job.current_step,
      completed_by: userId,
      completed_at: new Date().toISOString(),
      notes,
    });

    // Update job to next step
    const nextStep = currentStepConfig.next_step;
    const newStatus = this.getStatusForStep(nextStep);

    const { data: updatedJob, error: updateError } = await supabase
      .from('jobs')
      .update({
        current_step: nextStep,
        status: newStatus,
        updated_at: new Date().toISOString(),
      })
      .eq('id', jobId)
      .select()
      .single();

    if (updateError) {
      return {
        success: false,
        message: 'Failed to update job',
      };
    }

    return {
      success: true,
      message: `Job advanced to ${WORKFLOW_STEPS[nextStep].title}`,
      updatedJob: updatedJob as Job,
    };
  }

  /**
   * Check if a step can be accessed (e.g., can go back)
   */
  static canAccessStep(currentStep: WorkflowStep, targetStep: WorkflowStep): boolean {
    const currentConfig = WORKFLOW_STEPS[currentStep];
    const targetConfig = WORKFLOW_STEPS[targetStep];

    // Can't go forward beyond next step
    if (targetConfig.number > currentConfig.number + 1) {
      return false;
    }

    // Can only go back if target step allows it
    if (targetConfig.number < currentConfig.number && !targetConfig.can_go_back) {
      return false;
    }

    return true;
  }

  /**
   * Get the job status that corresponds to a workflow step
   */
  static getStatusForStep(step: WorkflowStep): JobStatus {
    const statusMap: Record<WorkflowStep, JobStatus> = {
      step_1_receiving: 'received',
      step_2_logging: 'logged',
      step_3_strip_assess: 'stripped',
      step_4_document_faults: 'assessed',
      step_5_technical_report: 'assessed',
      step_6_await_po: 'awaiting_quote_approval',
      step_7_repair: 'in_repair',
      step_8_reassemble: 'assembled',
      step_9_function_test: 'tested',
      step_10_qc_inspection: 'tested',
      step_11_dispatch: 'ready_for_dispatch',
    };

    return statusMap[step] || 'received';
  }

  /**
   * Get photos for a specific step
   */
  private static async getStepPhotos(jobId: string, step: WorkflowStep) {
    const { data, error } = await supabase
      .from('job_photos')
      .select('*')
      .eq('job_id', jobId)
      .eq('step', step);

    return data || [];
  }

  /**
   * Get progress percentage for a job
   */
  static getProgressPercentage(currentStep: WorkflowStep): number {
    const stepConfig = WORKFLOW_STEPS[currentStep];
    return Math.round((stepConfig.number / 11) * 100);
  }

  /**
   * Get all steps with their completion status for a job
   */
  static async getJobStepsSummary(jobId: string) {
    const { data: completions } = await supabase
      .from('step_completions')
      .select('*')
      .eq('job_id', jobId);

    const completedSteps = new Set((completions || []).map((c) => c.step));

    return Object.values(WORKFLOW_STEPS).map((stepConfig) => ({
      ...stepConfig,
      completed: completedSteps.has(stepConfig.id),
    }));
  }

  /**
   * Check if PO has been received (critical gate for Step 6)
   */
  static async isPOReceived(jobId: string): Promise<boolean> {
    const { data: job } = await supabase
      .from('jobs')
      .select('po_received_at, po_number')
      .eq('id', jobId)
      .single();

    return !!(job?.po_received_at && job?.po_number);
  }

  /**
   * Lock/Unlock Step 6 Repair button based on PO status
   */
  static async isRepairUnlocked(jobId: string): Promise<boolean> {
    const { data: job } = await supabase
      .from('jobs')
      .select('current_step, po_received_at, po_number')
      .eq('id', jobId)
      .single();

    if (!job) return false;

    // If past step 6, repair is unlocked
    const currentStepNum = WORKFLOW_STEPS[job.current_step as WorkflowStep].number;
    if (currentStepNum > 6) return true;

    // If at step 6, check PO
    if (currentStepNum === 6) {
      return !!(job.po_received_at && job.po_number);
    }

    // Before step 6, not yet at repair
    return false;
  }
}
