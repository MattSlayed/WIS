'use client';

/**
 * Technician Dashboard - Job Selection and QR Scanner
 * Premium NOVATEK design with glass effects and animations
 * Connected to Neon PostgreSQL via Drizzle ORM
 */

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Search,
  QrCode,
  Plus,
  Clock,
  AlertTriangle,
  ChevronRight,
  Filter,
  Cpu,
  Layers,
  RefreshCw,
  Loader2,
} from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from '@/components/ui/dialog';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useJobs, useJobStats, type JobListItem } from '@/lib/hooks/use-jobs';

// Animation variants
const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.05 },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.4, ease: 'easeOut' as const },
  },
};

// Fallback mock data for when database is not configured
const mockJobs: JobListItem[] = [
  {
    id: '1',
    jobNumber: 'BRIM-2025-001',
    equipmentType: 'Hydraulic Pump',
    serialNumber: 'HP-2025-001',
    manufacturer: 'Caterpillar',
    model: 'CAT 390F',
    currentStep: 'step_3_strip_assess',
    status: 'stripped',
    hasHazmat: true,
    hazmatLevel: 'medium',
    receivedAt: '2025-01-15T10:30:00Z',
    targetCompletionDate: '2025-01-25T10:30:00Z',
    createdAt: '2025-01-15T10:30:00Z',
    client: { id: '1', name: 'David Pretorius', company: 'AngloGold Ashanti' },
    technician: { id: '1', fullName: 'Sipho Ndlovu' },
  },
  {
    id: '2',
    jobNumber: 'BRIM-2025-002',
    equipmentType: 'Electric Motor',
    serialNumber: 'EM-2025-002',
    manufacturer: 'Siemens',
    model: 'S100',
    currentStep: 'step_5_technical_report',
    status: 'assessed',
    hasHazmat: false,
    hazmatLevel: null,
    receivedAt: '2025-01-16T14:20:00Z',
    targetCompletionDate: '2025-01-30T14:20:00Z',
    createdAt: '2025-01-16T14:20:00Z',
    client: { id: '2', name: 'Sarah Mitchell', company: 'Sasol Mining' },
    technician: { id: '2', fullName: 'Thabo Molefe' },
  },
  {
    id: '3',
    jobNumber: 'BRIM-2025-003',
    equipmentType: 'Gearbox Assembly',
    serialNumber: 'GB-2025-003',
    manufacturer: 'Flender',
    model: 'B3SH 08',
    currentStep: 'step_6_await_po',
    status: 'awaiting_quote_approval',
    hasHazmat: false,
    hazmatLevel: null,
    receivedAt: '2025-01-17T09:15:00Z',
    targetCompletionDate: '2025-02-05T09:15:00Z',
    createdAt: '2025-01-17T09:15:00Z',
    client: { id: '3', name: 'Michael Khumalo', company: 'Impala Platinum' },
    technician: { id: '3', fullName: 'Pieter Botha' },
  },
  {
    id: '4',
    jobNumber: 'BRIM-2025-004',
    equipmentType: 'Compressor Unit',
    serialNumber: 'CU-2025-004',
    manufacturer: 'Atlas Copco',
    model: 'GA 75',
    currentStep: 'step_7_repair',
    status: 'in_repair',
    hasHazmat: true,
    hazmatLevel: 'high',
    receivedAt: '2025-01-18T11:45:00Z',
    targetCompletionDate: '2025-02-01T11:45:00Z',
    createdAt: '2025-01-18T11:45:00Z',
    client: { id: '4', name: 'Nomsa Dlamini', company: 'Harmony Gold' },
    technician: { id: '1', fullName: 'Sipho Ndlovu' },
  },
];

export default function TechnicianDashboard() {
  const [searchQuery, setSearchQuery] = useState('');
  const [showScanner, setShowScanner] = useState(false);
  const [activeTab, setActiveTab] = useState('all');
  const [useMockData, setUseMockData] = useState(false);

  // Fetch real data from API
  const { jobs: apiJobs, isLoading, error, refetch } = useJobs({
    hasHazmat: activeTab === 'hazmat' ? true : undefined,
    search: searchQuery || undefined,
  });
  const { stats: apiStats, isLoading: statsLoading } = useJobStats();

  // Determine which data to use
  const jobs = useMockData || error || apiJobs.length === 0 ? mockJobs : apiJobs;

  // Check if database is not configured
  useEffect(() => {
    if (error && error.message.includes('DATABASE_URL')) {
      setUseMockData(true);
    }
  }, [error]);

  // Calculate stats
  const stats = apiStats || {
    totalJobs: jobs.length,
    activeJobs: jobs.filter(j => !['dispatched', 'cancelled'].includes(j.status)).length,
    hazmatJobs: jobs.filter(j => j.hasHazmat).length,
    completedToday: 0,
  };

  const filteredJobs = jobs.filter((job) => {
    const matchesSearch =
      job.jobNumber.toLowerCase().includes(searchQuery.toLowerCase()) ||
      job.client?.company?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      job.equipmentType.toLowerCase().includes(searchQuery.toLowerCase());

    if (activeTab === 'hazmat') return matchesSearch && job.hasHazmat;
    if (activeTab === 'urgent') {
      // Consider jobs with high hazmat level or close to target date as urgent
      const isUrgent =
        job.hazmatLevel === 'high' ||
        job.hazmatLevel === 'extreme' ||
        (job.targetCompletionDate &&
          new Date(job.targetCompletionDate) < new Date(Date.now() + 3 * 24 * 60 * 60 * 1000));
      return matchesSearch && isUrgent;
    }
    return matchesSearch;
  });

  const getStepInfo = (step: string) => {
    const stepData: Record<string, { name: string; number: number }> = {
      step_1_receiving: { name: 'Receiving', number: 1 },
      step_2_logging: { name: 'Logging', number: 2 },
      step_3_strip_assess: { name: 'Strip & Assess', number: 3 },
      step_4_document_faults: { name: 'Document Faults', number: 4 },
      step_5_technical_report: { name: 'Technical Report', number: 5 },
      step_6_await_po: { name: 'Awaiting PO', number: 6 },
      step_7_repair: { name: 'Repair', number: 7 },
      step_8_reassemble: { name: 'Reassemble', number: 8 },
      step_9_function_test: { name: 'Function Test', number: 9 },
      step_10_qc_inspection: { name: 'QC Inspection', number: 10 },
      step_11_dispatch: { name: 'Dispatch', number: 11 },
    };
    return stepData[step] || { name: step, number: 0 };
  };

  const getHazmatColor = (level: string | null) => {
    switch (level) {
      case 'extreme':
      case 'high':
        return 'destructive';
      case 'medium':
        return 'warning';
      case 'low':
        return 'secondary';
      default:
        return 'destructive';
    }
  };

  const statsConfig = [
    { label: 'Active Jobs', value: stats.activeJobs, icon: Layers, color: 'text-primary' },
    { label: 'In Progress', value: jobs.filter(j => j.status === 'in_repair').length, icon: Clock, color: 'text-yellow-500' },
    { label: 'AI Reports', value: '12', icon: Cpu, color: 'text-green-500' },
    { label: 'Hazmat Jobs', value: stats.hazmatJobs, icon: AlertTriangle, color: 'text-red-500' },
  ];

  return (
    <motion.div
      variants={containerVariants}
      initial="hidden"
      animate="visible"
      className="space-y-8"
    >
      {/* Page Header */}
      <motion.div variants={itemVariants} className="flex flex-col gap-2">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-foreground">My Jobs</h1>
            <p className="text-muted-foreground">
              Manage your active jobs and track progress through the 11-step process
            </p>
          </div>
          {!useMockData && (
            <Button
              variant="ghost"
              size="sm"
              onClick={() => refetch()}
              disabled={isLoading}
            >
              <RefreshCw className={`w-4 h-4 mr-2 ${isLoading ? 'animate-spin' : ''}`} />
              Refresh
            </Button>
          )}
        </div>
        {useMockData && (
          <div className="flex items-center gap-2 text-xs text-muted-foreground bg-muted/50 px-3 py-2 rounded-md">
            <AlertTriangle className="w-3 h-3" />
            <span>Using demo data. Configure DATABASE_URL in .env.local to connect to Neon.</span>
          </div>
        )}
      </motion.div>

      {/* Stats Cards */}
      <motion.div
        variants={itemVariants}
        className="grid grid-cols-2 md:grid-cols-4 gap-4"
      >
        {statsConfig.map((stat) => (
          <Card key={stat.label} variant="glass" className="p-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-lg bg-muted flex items-center justify-center">
                <stat.icon className={`w-5 h-5 ${stat.color}`} />
              </div>
              <div>
                <p className="text-2xl font-mono font-bold text-foreground">
                  {statsLoading && typeof stat.value === 'number' ? (
                    <Loader2 className="w-5 h-5 animate-spin" />
                  ) : (
                    stat.value
                  )}
                </p>
                <p className="text-xs text-muted-foreground">{stat.label}</p>
              </div>
            </div>
          </Card>
        ))}
      </motion.div>

      {/* Search and Actions */}
      <motion.div
        variants={itemVariants}
        className="flex flex-col sm:flex-row gap-4"
      >
        <div className="flex-1">
          <Input
            placeholder="Search jobs by number, client, or equipment..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            icon={<Search className="w-4 h-4" />}
          />
        </div>
        <div className="flex gap-2">
          <Button variant="secondary" onClick={() => setShowScanner(true)}>
            <QrCode className="w-4 h-4 mr-2" />
            <span className="hidden sm:inline">Scan QR</span>
          </Button>
          <Button asChild>
            <Link href="/technician/new-job">
              <Plus className="w-4 h-4 mr-2" />
              <span className="hidden sm:inline">New Job</span>
            </Link>
          </Button>
        </div>
      </motion.div>

      {/* Tabs and Job List */}
      <motion.div variants={itemVariants}>
        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <div className="flex items-center justify-between mb-4">
            <TabsList>
              <TabsTrigger value="all">All Jobs</TabsTrigger>
              <TabsTrigger value="hazmat">
                <AlertTriangle className="w-3 h-3 mr-1" />
                Hazmat
              </TabsTrigger>
              <TabsTrigger value="urgent">Urgent</TabsTrigger>
            </TabsList>
            <Button variant="ghost" size="sm">
              <Filter className="w-4 h-4 mr-2" />
              Filter
            </Button>
          </div>

          <TabsContent value={activeTab} className="mt-0">
            <AnimatePresence mode="wait">
              {isLoading && !useMockData ? (
                <motion.div
                  key="loading"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                >
                  <Card variant="glass" className="p-12 text-center">
                    <Loader2 className="w-8 h-8 animate-spin mx-auto mb-4 text-primary" />
                    <p className="text-muted-foreground">Loading jobs...</p>
                  </Card>
                </motion.div>
              ) : filteredJobs.length === 0 ? (
                <motion.div
                  key="empty"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                >
                  <Card variant="glass" className="p-12 text-center">
                    <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-muted mb-4">
                      <Clock className="w-8 h-8 text-muted-foreground" />
                    </div>
                    <h3 className="text-lg font-semibold text-foreground mb-2">
                      No jobs found
                    </h3>
                    <p className="text-muted-foreground mb-6">
                      {searchQuery
                        ? 'Try adjusting your search query'
                        : 'Create a new job or scan a QR code to get started'}
                    </p>
                    <div className="flex gap-3 justify-center">
                      <Button variant="secondary" onClick={() => setShowScanner(true)}>
                        <QrCode className="w-4 h-4 mr-2" />
                        Scan QR Code
                      </Button>
                      <Button asChild>
                        <Link href="/technician/new-job">
                          <Plus className="w-4 h-4 mr-2" />
                          Create New Job
                        </Link>
                      </Button>
                    </div>
                  </Card>
                </motion.div>
              ) : (
                <motion.div
                  key="list"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="grid gap-4"
                >
                  {filteredJobs.map((job, index) => {
                    const stepInfo = getStepInfo(job.currentStep);
                    const progress = (stepInfo.number / 11) * 100;

                    return (
                      <motion.div
                        key={job.id}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: index * 0.05 }}
                      >
                        <Link href={`/technician/job/${job.id}`}>
                          <Card
                            variant="glass"
                            className="group cursor-pointer hover:border-primary/30 transition-all"
                          >
                            <CardContent className="p-6">
                              <div className="flex items-start justify-between gap-4">
                                <div className="flex-1 space-y-4">
                                  {/* Header */}
                                  <div className="flex items-center gap-3 flex-wrap">
                                    <h3 className="text-lg font-semibold text-foreground font-mono group-hover:text-primary transition-colors">
                                      {job.jobNumber}
                                    </h3>
                                    {job.hasHazmat && (
                                      <Badge variant={getHazmatColor(job.hazmatLevel)} dot dotColor="destructive">
                                        <AlertTriangle className="w-3 h-3 mr-1" />
                                        Hazmat {job.hazmatLevel && `(${job.hazmatLevel})`}
                                      </Badge>
                                    )}
                                    {job.technician && (
                                      <Badge variant="outline">
                                        {job.technician.fullName}
                                      </Badge>
                                    )}
                                  </div>

                                  {/* Info */}
                                  <div className="space-y-1">
                                    <p className="text-foreground">
                                      {job.client?.company || job.client?.name || 'Unknown Client'}
                                    </p>
                                    <p className="text-sm text-muted-foreground">
                                      {job.equipmentType}
                                      {job.manufacturer && ` - ${job.manufacturer}`}
                                      {job.model && ` ${job.model}`}
                                    </p>
                                  </div>

                                  {/* Progress */}
                                  <div className="space-y-2">
                                    <div className="flex items-center justify-between text-sm">
                                      <div className="flex items-center gap-2">
                                        <Badge variant="default">Step {stepInfo.number}</Badge>
                                        <span className="text-muted-foreground">
                                          {stepInfo.name}
                                        </span>
                                      </div>
                                      <span className="text-xs text-muted-foreground font-mono">
                                        {Math.round(progress)}%
                                      </span>
                                    </div>
                                    <Progress value={progress} variant="gradient" className="h-1.5" />
                                  </div>
                                </div>

                                {/* Action */}
                                <div className="flex flex-col items-end gap-2">
                                  <p className="text-xs text-muted-foreground">
                                    {new Date(job.createdAt).toLocaleDateString('en-ZA')}
                                  </p>
                                  <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center text-primary group-hover:bg-primary group-hover:text-primary-foreground transition-all">
                                    <ChevronRight className="w-4 h-4" />
                                  </div>
                                </div>
                              </div>
                            </CardContent>
                          </Card>
                        </Link>
                      </motion.div>
                    );
                  })}
                </motion.div>
              )}
            </AnimatePresence>
          </TabsContent>
        </Tabs>
      </motion.div>

      {/* QR Scanner Modal */}
      <Dialog open={showScanner} onOpenChange={setShowScanner}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>Scan Job QR Code</DialogTitle>
            <DialogDescription>
              Position the QR code within the camera view to load the job.
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            {/* Camera placeholder */}
            <div className="relative aspect-square rounded-lg bg-muted overflow-hidden">
              <div className="absolute inset-0 flex items-center justify-center">
                <QrCode className="w-24 h-24 text-muted-foreground/50" />
              </div>
              {/* Scanning animation */}
              <div className="absolute inset-x-4 top-1/2 h-0.5 bg-primary animate-pulse" />
              {/* Corner markers */}
              <div className="absolute top-4 left-4 w-8 h-8 border-l-2 border-t-2 border-primary" />
              <div className="absolute top-4 right-4 w-8 h-8 border-r-2 border-t-2 border-primary" />
              <div className="absolute bottom-4 left-4 w-8 h-8 border-l-2 border-b-2 border-primary" />
              <div className="absolute bottom-4 right-4 w-8 h-8 border-r-2 border-b-2 border-primary" />
            </div>
            <Button
              variant="secondary"
              className="w-full"
              onClick={() => setShowScanner(false)}
            >
              Cancel
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </motion.div>
  );
}
