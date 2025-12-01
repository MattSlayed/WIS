'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  Wrench,
  LayoutGrid,
  Settings,
  Bell,
  User,
  ChevronLeft,
  Menu,
} from 'lucide-react';
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from '@/components/ui/tooltip';
import { cn } from '@/lib/utils';

const navigation = [
  { name: 'My Jobs', href: '/technician', icon: LayoutGrid },
  { name: 'Settings', href: '/technician/settings', icon: Settings },
];

export default function TechnicianLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="nav-header">
        <div className="container mx-auto px-4">
          <div className="flex h-16 items-center justify-between">
            {/* Logo and Back */}
            <div className="flex items-center gap-4">
              <Tooltip>
                <TooltipTrigger asChild>
                  <Link
                    href="/"
                    className="flex items-center justify-center w-10 h-10 rounded-lg bg-primary/10 text-primary hover:bg-primary/20 transition-colors"
                  >
                    <ChevronLeft className="w-5 h-5" />
                  </Link>
                </TooltipTrigger>
                <TooltipContent side="bottom">Back to Home</TooltipContent>
              </Tooltip>

              <div className="hidden sm:block">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
                    <Wrench className="w-5 h-5 text-primary" />
                  </div>
                  <div>
                    <h1 className="text-lg font-semibold text-foreground">
                      Technician Portal
                    </h1>
                    <p className="text-xs text-muted-foreground">
                      Workshop Intelligence System
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Desktop Navigation */}
            <nav className="hidden md:flex items-center gap-1">
              {navigation.map((item) => {
                const isActive = pathname === item.href;
                return (
                  <Link
                    key={item.name}
                    href={item.href}
                    className={cn(
                      'nav-link flex items-center gap-2',
                      isActive && 'nav-link-active'
                    )}
                  >
                    <item.icon className="w-4 h-4" />
                    {item.name}
                  </Link>
                );
              })}
            </nav>

            {/* Right Side Actions */}
            <div className="flex items-center gap-2">
              {/* Notifications */}
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button variant="ghost" size="icon" className="relative">
                    <Bell className="w-5 h-5" />
                    <Badge
                      variant="destructive"
                      className="absolute -top-1 -right-1 w-5 h-5 p-0 flex items-center justify-center text-[10px]"
                    >
                      3
                    </Badge>
                  </Button>
                </TooltipTrigger>
                <TooltipContent>Notifications</TooltipContent>
              </Tooltip>

              {/* User Menu */}
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button variant="ghost" size="icon">
                    <User className="w-5 h-5" />
                  </Button>
                </TooltipTrigger>
                <TooltipContent>Profile</TooltipContent>
              </Tooltip>

              {/* Mobile Menu Toggle */}
              <Button
                variant="ghost"
                size="icon"
                className="md:hidden"
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              >
                <Menu className="w-5 h-5" />
              </Button>
            </div>
          </div>

          {/* Mobile Navigation */}
          {mobileMenuOpen && (
            <nav className="md:hidden py-4 border-t border-border/50">
              <div className="flex flex-col gap-1">
                {navigation.map((item) => {
                  const isActive = pathname === item.href;
                  return (
                    <Link
                      key={item.name}
                      href={item.href}
                      onClick={() => setMobileMenuOpen(false)}
                      className={cn(
                        'nav-link flex items-center gap-2',
                        isActive && 'nav-link-active'
                      )}
                    >
                      <item.icon className="w-4 h-4" />
                      {item.name}
                    </Link>
                  );
                })}
              </div>
            </nav>
          )}
        </div>
      </header>

      {/* Main Content */}
      <main className="pt-16">
        <div className="container mx-auto px-4 py-6">{children}</div>
      </main>
    </div>
  );
}
