'use client';

/**
 * Step Wizard Navigation Component
 * Premium NOVATEK design with glowing effects and animations
 * Displays the 11-step workflow with progress indication
 */

import { motion } from 'framer-motion';
import { Check, Lock, AlertTriangle, Sparkles } from 'lucide-react';
import type { WorkflowStep, Job } from '@/types';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from '@/components/ui/tooltip';
import { cn } from '@/lib/utils';

interface StepWizardProps {
  currentStep: WorkflowStep;
  job: Job;
  onStepClick?: (step: WorkflowStep) => void;
}

const STEP_CONFIG = [
  { id: 'step_1_receiving', number: 1, name: 'Receiving', short: 'Receive', icon: '01' },
  { id: 'step_2_logging', number: 2, name: 'Logging', short: 'Log', icon: '02' },
  { id: 'step_3_strip_assess', number: 3, name: 'Strip & Assess', short: 'Strip', icon: '03' },
  { id: 'step_4_document_faults', number: 4, name: 'Document Faults', short: 'Faults', icon: '04' },
  { id: 'step_5_technical_report', number: 5, name: 'Technical Report', short: 'Report', icon: '05' },
  { id: 'step_6_await_po', number: 6, name: 'Await PO', short: 'PO', icon: '06' },
  { id: 'step_7_repair', number: 7, name: 'Repair', short: 'Repair', icon: '07' },
  { id: 'step_8_reassemble', number: 8, name: 'Reassemble', short: 'Rebuild', icon: '08' },
  { id: 'step_9_function_test', number: 9, name: 'Function Test', short: 'Test', icon: '09' },
  { id: 'step_10_qc_inspection', number: 10, name: 'QC Inspection', short: 'QC', icon: '10' },
  { id: 'step_11_dispatch', number: 11, name: 'Dispatch', short: 'Dispatch', icon: '11' },
];

type StepStatus = 'completed' | 'current' | 'blocked' | 'upcoming';

export default function StepWizard({ currentStep, job, onStepClick }: StepWizardProps) {
  const currentStepNumber = STEP_CONFIG.find((s) => s.id === currentStep)?.number || 1;
  const progressPercentage = ((currentStepNumber - 1) / (STEP_CONFIG.length - 1)) * 100;

  const getStepStatus = (stepNumber: number): StepStatus => {
    if (stepNumber < currentStepNumber) return 'completed';
    if (stepNumber === currentStepNumber) return 'current';

    // Step 6 (Await PO) blocks Step 7 (Repair) until PO is received
    if (stepNumber === 7 && currentStepNumber === 6 && !job.po_received_at) {
      return 'blocked';
    }

    return 'upcoming';
  };

  const statusConfig: Record<StepStatus, { ring: string; bg: string; text: string; border: string; glow: string }> = {
    completed: {
      ring: 'ring-success/20',
      bg: 'bg-success',
      text: 'text-success-foreground',
      border: 'border-success',
      glow: 'shadow-[0_0_12px_hsl(var(--success)/0.5)]',
    },
    current: {
      ring: 'ring-primary/30',
      bg: 'bg-primary',
      text: 'text-primary-foreground',
      border: 'border-primary',
      glow: 'shadow-[0_0_20px_hsl(var(--primary)/0.6)] animate-glow-pulse',
    },
    blocked: {
      ring: 'ring-destructive/10',
      bg: 'bg-destructive/10',
      text: 'text-destructive',
      border: 'border-destructive/50',
      glow: '',
    },
    upcoming: {
      ring: 'ring-muted/10',
      bg: 'bg-muted',
      text: 'text-muted-foreground',
      border: 'border-border',
      glow: '',
    },
  };

  return (
    <Card variant="glass">
      <CardHeader className="pb-2">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <CardTitle className="text-lg">Workflow Progress</CardTitle>
            <Badge variant="glow" className="font-mono">
              Step {currentStepNumber} of 11
            </Badge>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-sm text-muted-foreground">Progress</span>
            <span className="text-lg font-mono font-bold text-primary">
              {Math.round(progressPercentage)}%
            </span>
          </div>
        </div>
        <Progress value={progressPercentage} variant="gradient" className="h-2 mt-3" />
      </CardHeader>

      <CardContent className="pt-6">
        {/* Desktop View - Horizontal Timeline */}
        <div className="hidden lg:block">
          <div className="relative">
            {/* Background connector line */}
            <div className="absolute top-6 left-6 right-6 h-0.5 bg-border z-0" />

            {/* Progress connector line */}
            <motion.div
              className="absolute top-6 left-6 h-0.5 bg-gradient-to-r from-success via-primary to-primary/50 z-0"
              initial={{ width: '0%' }}
              animate={{ width: `${Math.min(progressPercentage, 100)}%` }}
              transition={{ duration: 0.8, ease: 'easeOut' }}
            />

            <div className="relative z-10 flex items-start justify-between">
              {STEP_CONFIG.map((step, index) => {
                const status = getStepStatus(step.number);
                const config = statusConfig[status];
                const isClickable = status === 'completed' || status === 'current';

                return (
                  <Tooltip key={step.id}>
                    <TooltipTrigger asChild>
                      <motion.button
                        onClick={() => isClickable && onStepClick?.(step.id as WorkflowStep)}
                        disabled={!isClickable}
                        className={cn(
                          'flex flex-col items-center gap-3 p-2 rounded-xl transition-all',
                          isClickable && 'cursor-pointer hover:bg-accent/50',
                          !isClickable && 'cursor-not-allowed'
                        )}
                        whileHover={isClickable ? { scale: 1.05 } : {}}
                        whileTap={isClickable ? { scale: 0.95 } : {}}
                      >
                        <div
                          className={cn(
                            'relative w-12 h-12 rounded-full border-2 flex items-center justify-center',
                            'font-mono font-bold text-sm transition-all',
                            config.bg,
                            config.text,
                            config.border,
                            config.glow
                          )}
                        >
                          {status === 'completed' && <Check className="w-5 h-5" />}
                          {status === 'blocked' && <Lock className="w-4 h-4" />}
                          {(status === 'current' || status === 'upcoming') && step.icon}

                          {/* Current step pulse ring */}
                          {status === 'current' && (
                            <div className="absolute inset-0 rounded-full border-2 border-primary animate-ping opacity-50" />
                          )}
                        </div>
                        <div className="text-center max-w-[80px]">
                          <p className={cn(
                            'text-xs font-medium leading-tight',
                            status === 'current' ? 'text-primary' : 'text-foreground'
                          )}>
                            {step.name}
                          </p>
                        </div>
                      </motion.button>
                    </TooltipTrigger>
                    <TooltipContent>
                      <p>{step.name}</p>
                      <p className="text-xs text-muted-foreground capitalize">{status}</p>
                    </TooltipContent>
                  </Tooltip>
                );
              })}
            </div>
          </div>
        </div>

        {/* Tablet/Mobile View - Grid Layout */}
        <div className="lg:hidden">
          <div className="grid grid-cols-3 sm:grid-cols-4 gap-3">
            {STEP_CONFIG.map((step) => {
              const status = getStepStatus(step.number);
              const config = statusConfig[status];
              const isClickable = status === 'completed' || status === 'current';

              return (
                <motion.button
                  key={step.id}
                  onClick={() => isClickable && onStepClick?.(step.id as WorkflowStep)}
                  disabled={!isClickable}
                  className={cn(
                    'relative flex flex-col items-center gap-2 p-3 rounded-xl border transition-all',
                    config.border,
                    status === 'current' && 'bg-primary/5',
                    status === 'completed' && 'bg-success/5',
                    isClickable && 'cursor-pointer hover:bg-accent/50',
                    !isClickable && 'cursor-not-allowed opacity-60'
                  )}
                  whileTap={isClickable ? { scale: 0.95 } : {}}
                >
                  <div
                    className={cn(
                      'w-10 h-10 rounded-full flex items-center justify-center',
                      'font-mono font-bold text-sm',
                      config.bg,
                      config.text,
                      status === 'current' && config.glow
                    )}
                  >
                    {status === 'completed' && <Check className="w-4 h-4" />}
                    {status === 'blocked' && <Lock className="w-3 h-3" />}
                    {(status === 'current' || status === 'upcoming') && step.icon}
                  </div>
                  <span className={cn(
                    'text-xs font-medium text-center leading-tight',
                    status === 'current' ? 'text-primary' : 'text-foreground'
                  )}>
                    {step.short}
                  </span>

                  {/* Current indicator */}
                  {status === 'current' && (
                    <div className="absolute -top-1 -right-1">
                      <span className="relative flex h-3 w-3">
                        <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-primary opacity-75" />
                        <span className="relative inline-flex rounded-full h-3 w-3 bg-primary" />
                      </span>
                    </div>
                  )}
                </motion.button>
              );
            })}
          </div>
        </div>

        {/* Legend */}
        <div className="mt-6 pt-4 border-t border-border flex flex-wrap gap-4 text-sm">
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded-full bg-success shadow-[0_0_8px_hsl(var(--success)/0.5)]" />
            <span className="text-muted-foreground">Completed</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded-full bg-primary shadow-[0_0_8px_hsl(var(--primary)/0.5)] animate-pulse" />
            <span className="text-muted-foreground">Current</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded-full bg-destructive/30 border border-destructive/50" />
            <span className="text-muted-foreground">Blocked</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded-full bg-muted border border-border" />
            <span className="text-muted-foreground">Upcoming</span>
          </div>
        </div>

        {/* Hazmat Warning */}
        {job.has_hazmat && (
          <Alert variant="warning" className="mt-4">
            <AlertTriangle className="h-4 w-4" />
            <AlertTitle>Hazmat Detected</AlertTitle>
            <AlertDescription>
              Special handling and documentation required throughout workflow.
              {!job.hazmat_cleaned && (
                <span className="font-semibold text-warning"> Cleaning not yet completed.</span>
              )}
            </AlertDescription>
          </Alert>
        )}

        {/* Current Step Info */}
        <div className="mt-4 p-4 rounded-xl bg-primary/5 border border-primary/20">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
              <Sparkles className="w-5 h-5 text-primary" />
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Currently Working On</p>
              <p className="font-semibold text-foreground">
                Step {currentStepNumber}: {STEP_CONFIG[currentStepNumber - 1]?.name}
              </p>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
