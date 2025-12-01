'use client';

/**
 * React Hooks for Job Data
 * Client-side data fetching with SWR-like patterns
 */

import { useState, useEffect, useCallback } from 'react';

// Types matching the API response
interface JobListItem {
  id: string;
  jobNumber: string;
  equipmentType: string;
  serialNumber: string;
  manufacturer: string | null;
  model: string | null;
  currentStep: string;
  status: string;
  hasHazmat: boolean;
  hazmatLevel: string | null;
  receivedAt: string;
  targetCompletionDate: string | null;
  createdAt: string;
  client: {
    id: string;
    name: string;
    company: string;
  } | null;
  technician: {
    id: string;
    fullName: string;
  } | null;
}

interface JobsResponse {
  jobs: JobListItem[];
  pagination: {
    total: number;
    limit: number;
    offset: number;
    hasMore: boolean;
  };
}

interface UseJobsOptions {
  status?: string;
  step?: string;
  technicianId?: string;
  hasHazmat?: boolean;
  search?: string;
  limit?: number;
  offset?: number;
}

interface UseJobsReturn {
  jobs: JobListItem[];
  isLoading: boolean;
  error: Error | null;
  pagination: JobsResponse['pagination'] | null;
  refetch: () => Promise<void>;
}

/**
 * Hook to fetch jobs list with filters
 */
export function useJobs(options: UseJobsOptions = {}): UseJobsReturn {
  const [jobs, setJobs] = useState<JobListItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);
  const [pagination, setPagination] = useState<JobsResponse['pagination'] | null>(null);

  const fetchJobs = useCallback(async () => {
    setIsLoading(true);
    setError(null);

    try {
      const params = new URLSearchParams();
      if (options.status) params.set('status', options.status);
      if (options.step) params.set('step', options.step);
      if (options.technicianId) params.set('technicianId', options.technicianId);
      if (options.hasHazmat) params.set('hasHazmat', 'true');
      if (options.search) params.set('search', options.search);
      if (options.limit) params.set('limit', options.limit.toString());
      if (options.offset) params.set('offset', options.offset.toString());

      const response = await fetch(`/api/jobs?${params.toString()}`);

      if (!response.ok) {
        throw new Error('Failed to fetch jobs');
      }

      const data: JobsResponse = await response.json();
      setJobs(data.jobs);
      setPagination(data.pagination);
    } catch (err) {
      setError(err instanceof Error ? err : new Error('Unknown error'));
    } finally {
      setIsLoading(false);
    }
  }, [
    options.status,
    options.step,
    options.technicianId,
    options.hasHazmat,
    options.search,
    options.limit,
    options.offset,
  ]);

  useEffect(() => {
    fetchJobs();
  }, [fetchJobs]);

  return { jobs, isLoading, error, pagination, refetch: fetchJobs };
}

/**
 * Hook to fetch a single job by ID
 */
export function useJob(id: string | null) {
  const [job, setJob] = useState<JobListItem | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  const fetchJob = useCallback(async () => {
    if (!id) {
      setJob(null);
      setIsLoading(false);
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      const response = await fetch(`/api/jobs/${id}`);

      if (!response.ok) {
        throw new Error('Failed to fetch job');
      }

      const data = await response.json();
      setJob(data);
    } catch (err) {
      setError(err instanceof Error ? err : new Error('Unknown error'));
    } finally {
      setIsLoading(false);
    }
  }, [id]);

  useEffect(() => {
    fetchJob();
  }, [fetchJob]);

  return { job, isLoading, error, refetch: fetchJob };
}

/**
 * Hook to fetch job statistics
 */
export function useJobStats() {
  const [stats, setStats] = useState<{
    totalJobs: number;
    activeJobs: number;
    hazmatJobs: number;
    completedToday: number;
  } | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  const fetchStats = useCallback(async () => {
    setIsLoading(true);
    setError(null);

    try {
      // Using server action import
      const { getJobStats } = await import('@/lib/actions/jobs');
      const result = await getJobStats();

      if (result.success && result.stats) {
        setStats({
          totalJobs: Number(result.stats.totalJobs) || 0,
          activeJobs: Number(result.stats.activeJobs) || 0,
          hazmatJobs: Number(result.stats.hazmatJobs) || 0,
          completedToday: Number(result.stats.completedToday) || 0,
        });
      }
    } catch (err) {
      setError(err instanceof Error ? err : new Error('Unknown error'));
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchStats();
  }, [fetchStats]);

  return { stats, isLoading, error, refetch: fetchStats };
}

/**
 * Hook to fetch workflow progress for a job
 */
export function useWorkflowProgress(jobId: string | null) {
  const [progress, setProgress] = useState<{
    currentStep: string;
    status: string;
    steps: Array<{
      step: string;
      stepNumber: number;
      title: string;
      isCompleted: boolean;
      isCurrent: boolean;
      isLocked: boolean;
    }>;
    progress: number;
    completedCount: number;
    totalSteps: number;
  } | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  const fetchProgress = useCallback(async () => {
    if (!jobId) {
      setProgress(null);
      setIsLoading(false);
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      const { getWorkflowProgress } = await import('@/lib/actions/workflow');
      const result = await getWorkflowProgress(jobId);

      if (result.success) {
        setProgress({
          currentStep: result.currentStep!,
          status: result.status!,
          steps: result.steps!,
          progress: result.progress!,
          completedCount: result.completedCount!,
          totalSteps: result.totalSteps!,
        });
      } else {
        throw new Error(result.error || 'Failed to fetch progress');
      }
    } catch (err) {
      setError(err instanceof Error ? err : new Error('Unknown error'));
    } finally {
      setIsLoading(false);
    }
  }, [jobId]);

  useEffect(() => {
    fetchProgress();
  }, [fetchProgress]);

  return { progress, isLoading, error, refetch: fetchProgress };
}

// Export types for use in components
export type { JobListItem, JobsResponse, UseJobsOptions };
