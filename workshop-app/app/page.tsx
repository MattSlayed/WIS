'use client';

import Link from 'next/link';
import { motion } from 'framer-motion';
import {
  Wrench,
  LayoutDashboard,
  Users,
  Cpu,
  Sparkles,
  ArrowRight,
  ChevronRight,
  Activity,
  Shield,
  Zap,
} from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';

// Animation variants
const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
      delayChildren: 0.2,
    },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.5,
      ease: 'easeOut' as const,
    },
  },
};

const cardHoverVariants = {
  rest: { scale: 1 },
  hover: {
    scale: 1.02,
    transition: { duration: 0.3, ease: 'easeOut' as const },
  },
};

const glowVariants = {
  rest: { opacity: 0 },
  hover: { opacity: 1, transition: { duration: 0.3 } },
};

// Role card data
const roleCards = [
  {
    href: '/technician',
    icon: Wrench,
    title: 'Technician',
    description: 'Workshop floor interface for completing the 11-step service excellence process',
    color: 'primary',
    badge: 'Active Jobs',
    badgeValue: '12',
    features: ['QR Code Scanning', 'Photo Documentation', 'AI Defect Detection'],
  },
  {
    href: '/manager',
    icon: LayoutDashboard,
    title: 'Manager',
    description: 'Dashboard for quotes, job tracking, performance analytics, and report approval',
    color: 'success',
    badge: 'Pending Quotes',
    badgeValue: '5',
    features: ['Real-time Analytics', 'Quote Management', 'Team Performance'],
  },
  {
    href: '/client',
    icon: Users,
    title: 'Client Portal',
    description: 'View quotes, approve work orders, and track equipment repair status',
    color: 'warning',
    badge: 'Awaiting Approval',
    badgeValue: '3',
    features: ['Quote Approval', 'Status Tracking', 'Digital Signatures'],
  },
];

// Stats data
const stats = [
  { label: 'Jobs Completed', value: '1,234', icon: Activity },
  { label: 'AI Reports Generated', value: '856', icon: Cpu },
  { label: 'Client Satisfaction', value: '98%', icon: Shield },
  { label: 'Avg. Turnaround', value: '2.4d', icon: Zap },
];

export default function HomePage() {
  return (
    <div className="relative min-h-screen overflow-hidden">
      {/* Background grid pattern */}
      <div className="absolute inset-0 grid-bg" />

      {/* Gradient mesh overlay */}
      <div className="absolute inset-0 gradient-mesh" />

      {/* Animated orbs */}
      <div className="absolute top-20 left-10 w-72 h-72 bg-primary/20 rounded-full blur-3xl animate-float" />
      <div className="absolute bottom-20 right-10 w-96 h-96 bg-primary/10 rounded-full blur-3xl animate-float" style={{ animationDelay: '1s' }} />

      {/* Content */}
      <div className="relative z-10 container mx-auto px-4 py-12 md:py-20">
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className="space-y-16"
        >
          {/* Header Section */}
          <motion.header variants={itemVariants} className="text-center space-y-6">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 border border-primary/20 mb-4">
              <Sparkles className="w-4 h-4 text-primary" />
              <span className="text-sm font-medium text-primary">Powered by AI</span>
            </div>

            <h1 className="text-5xl md:text-7xl font-bold tracking-tight">
              <span className="text-foreground">Workshop</span>
              <br />
              <span className="text-gradient-cyan">Intelligence System</span>
            </h1>

            <p className="text-xl md:text-2xl text-muted-foreground max-w-2xl mx-auto">
              Precision Industrial Intelligence for the{' '}
              <span className="text-foreground font-medium">Brimis 11-Step</span>{' '}
              Service Excellence Process
            </p>

            {/* Quick Stats */}
            <motion.div
              variants={itemVariants}
              className="flex flex-wrap justify-center gap-4 md:gap-8 pt-4"
            >
              {stats.map((stat) => (
                <div
                  key={stat.label}
                  className="flex items-center gap-3 px-4 py-2 rounded-lg bg-card/50 border border-border/50"
                >
                  <stat.icon className="w-5 h-5 text-primary" />
                  <div className="text-left">
                    <p className="text-lg font-mono font-bold text-foreground">{stat.value}</p>
                    <p className="text-xs text-muted-foreground">{stat.label}</p>
                  </div>
                </div>
              ))}
            </motion.div>
          </motion.header>

          {/* Role Selection Cards */}
          <motion.section variants={itemVariants} className="space-y-6">
            <div className="text-center">
              <h2 className="text-2xl font-semibold text-foreground mb-2">Select Your Role</h2>
              <p className="text-muted-foreground">Choose your portal to access the system</p>
            </div>

            <div className="grid md:grid-cols-3 gap-6 max-w-6xl mx-auto">
              {roleCards.map((card, index) => (
                <motion.div
                  key={card.href}
                  variants={itemVariants}
                  custom={index}
                  initial="rest"
                  whileHover="hover"
                >
                  <Link href={card.href} className="block h-full">
                    <motion.div variants={cardHoverVariants}>
                      <Card variant="glass" className="h-full relative overflow-hidden group cursor-pointer">
                        {/* Glow effect on hover */}
                        <motion.div
                          variants={glowVariants}
                          className="absolute inset-0 bg-gradient-to-br from-primary/10 via-transparent to-transparent"
                        />

                        {/* Card border glow */}
                        <div className="absolute inset-0 rounded-xl opacity-0 group-hover:opacity-100 transition-opacity duration-500">
                          <div className="absolute inset-[-1px] rounded-xl bg-gradient-to-r from-primary/50 via-primary/20 to-primary/50 blur-sm" />
                        </div>

                        <CardContent className="relative p-8 space-y-6">
                          {/* Icon and Badge */}
                          <div className="flex items-start justify-between">
                            <div className={`
                              w-16 h-16 rounded-2xl flex items-center justify-center
                              bg-${card.color}/10 border border-${card.color}/20
                              group-hover:shadow-glow-sm transition-all duration-300
                            `}>
                              <card.icon className={`w-8 h-8 text-${card.color}`} />
                            </div>
                            <Badge variant="glow" className="font-mono">
                              {card.badgeValue} {card.badge}
                            </Badge>
                          </div>

                          {/* Title and Description */}
                          <div className="space-y-2">
                            <h3 className="text-2xl font-bold text-foreground group-hover:text-primary transition-colors">
                              {card.title}
                            </h3>
                            <p className="text-muted-foreground text-sm leading-relaxed">
                              {card.description}
                            </p>
                          </div>

                          {/* Features */}
                          <ul className="space-y-2">
                            {card.features.map((feature) => (
                              <li key={feature} className="flex items-center gap-2 text-sm text-muted-foreground">
                                <ChevronRight className="w-4 h-4 text-primary" />
                                {feature}
                              </li>
                            ))}
                          </ul>

                          {/* Action */}
                          <div className="flex items-center gap-2 text-primary font-medium pt-2 group-hover:gap-3 transition-all">
                            <span>Enter Portal</span>
                            <ArrowRight className="w-4 h-4" />
                          </div>
                        </CardContent>
                      </Card>
                    </motion.div>
                  </Link>
                </motion.div>
              ))}
            </div>
          </motion.section>

          {/* Features Section */}
          <motion.section variants={itemVariants} className="space-y-8">
            <div className="text-center">
              <h2 className="text-2xl font-semibold text-foreground mb-2">AI-Powered Capabilities</h2>
              <p className="text-muted-foreground">Intelligent automation at every step</p>
            </div>

            <div className="grid md:grid-cols-4 gap-4 max-w-5xl mx-auto">
              {[
                {
                  icon: Cpu,
                  title: 'Automated Reports',
                  description: 'AI generates detailed technical reports',
                },
                {
                  icon: Shield,
                  title: 'Defect Detection',
                  description: 'Computer vision identifies equipment issues',
                },
                {
                  icon: Activity,
                  title: 'Real-time Tracking',
                  description: 'Monitor job progress across all steps',
                },
                {
                  icon: Zap,
                  title: 'Smart Workflows',
                  description: 'Intelligent step gating and validation',
                },
              ].map((feature, index) => (
                <motion.div
                  key={feature.title}
                  variants={itemVariants}
                  custom={index}
                  className="text-center p-6 rounded-xl bg-card/30 border border-border/30 hover:border-primary/30 transition-colors"
                >
                  <div className="inline-flex items-center justify-center w-12 h-12 rounded-lg bg-primary/10 mb-4">
                    <feature.icon className="w-6 h-6 text-primary" />
                  </div>
                  <h3 className="font-semibold text-foreground mb-1">{feature.title}</h3>
                  <p className="text-sm text-muted-foreground">{feature.description}</p>
                </motion.div>
              ))}
            </div>
          </motion.section>

          {/* CTA Section */}
          <motion.section variants={itemVariants} className="text-center space-y-6">
            <Card variant="glass" className="max-w-2xl mx-auto p-8">
              <div className="space-y-4">
                <h3 className="text-xl font-semibold text-foreground">Ready to get started?</h3>
                <p className="text-muted-foreground">
                  Select your role above to access the Workshop Intelligence System
                </p>
                <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-2">
                  <Button variant="glow" size="lg" asChild>
                    <Link href="/technician">
                      <Wrench className="w-4 h-4 mr-2" />
                      Start Working
                    </Link>
                  </Button>
                  <Button variant="outline" size="lg" asChild>
                    <Link href="/manager">
                      View Dashboard
                    </Link>
                  </Button>
                </div>
              </div>
            </Card>
          </motion.section>

          {/* Footer */}
          <motion.footer variants={itemVariants} className="text-center pt-8 border-t border-border/30">
            <div className="flex items-center justify-center gap-2 text-muted-foreground">
              <span className="text-sm">Built by</span>
              <span className="font-semibold text-foreground">NOVATEK LLC</span>
              <span className="text-primary">|</span>
              <span className="text-sm">Precision Industrial Intelligence</span>
            </div>
            <p className="text-xs text-muted-foreground mt-2">
              www.novatek.co.za | matthew@novatek.co.za
            </p>
          </motion.footer>
        </motion.div>
      </div>
    </div>
  );
}
