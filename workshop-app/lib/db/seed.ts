/**
 * Database Seed Script
 * Run with: npm run db:seed (requires tsx)
 * Or: npx tsx lib/db/seed.ts
 */

import { neon } from '@neondatabase/serverless';
import { drizzle } from 'drizzle-orm/neon-http';
import * as dotenv from 'dotenv';
import {
  users,
  clients,
  jobs,
  jobParts,
  jobPhotos,
  stepCompletions,
} from './schema';

// Load environment variables
dotenv.config({ path: '.env.local' });

const connectionString = process.env.DATABASE_URL;

if (!connectionString) {
  console.error('❌ DATABASE_URL is not set in .env.local');
  process.exit(1);
}

const sql = neon(connectionString);
const db = drizzle(sql);

async function seed() {
  console.log('🌱 Starting database seed...\n');

  try {
    // =========================================================================
    // SEED USERS
    // =========================================================================
    console.log('👤 Creating users...');

    const [admin] = await db
      .insert(users)
      .values({
        email: 'admin@brimis.co.za',
        fullName: 'System Administrator',
        role: 'admin',
        phone: '+27 11 123 4567',
      })
      .onConflictDoNothing()
      .returning();

    const [manager] = await db
      .insert(users)
      .values({
        email: 'manager@brimis.co.za',
        fullName: 'Johan van der Berg',
        role: 'manager',
        phone: '+27 82 555 1234',
      })
      .onConflictDoNothing()
      .returning();

    const [tech1] = await db
      .insert(users)
      .values({
        email: 'sipho@brimis.co.za',
        fullName: 'Sipho Ndlovu',
        role: 'technician',
        phone: '+27 83 666 7890',
      })
      .onConflictDoNothing()
      .returning();

    const [tech2] = await db
      .insert(users)
      .values({
        email: 'thabo@brimis.co.za',
        fullName: 'Thabo Molefe',
        role: 'technician',
        phone: '+27 84 777 1234',
      })
      .onConflictDoNothing()
      .returning();

    const [tech3] = await db
      .insert(users)
      .values({
        email: 'pieter@brimis.co.za',
        fullName: 'Pieter Botha',
        role: 'technician',
        phone: '+27 85 888 5678',
      })
      .onConflictDoNothing()
      .returning();

    console.log(`   ✅ Created ${5} users\n`);

    // =========================================================================
    // SEED CLIENTS
    // =========================================================================
    console.log('🏢 Creating clients...');

    const [client1] = await db
      .insert(clients)
      .values({
        name: 'David Pretorius',
        email: 'david@anglogold.com',
        phone: '+27 11 637 6000',
        company: 'AngloGold Ashanti',
        address: '76 Rahima Moosa St, Newtown, Johannesburg',
      })
      .returning();

    const [client2] = await db
      .insert(clients)
      .values({
        name: 'Sarah Mitchell',
        email: 'sarah@sasol.com',
        phone: '+27 17 610 2111',
        company: 'Sasol Mining',
        address: '1 Sturdee Ave, Rosebank, Johannesburg',
      })
      .returning();

    const [client3] = await db
      .insert(clients)
      .values({
        name: 'Michael Khumalo',
        email: 'michael@implats.co.za',
        phone: '+27 14 569 0000',
        company: 'Impala Platinum Holdings',
        address: '2 Fricker Road, Illovo, Johannesburg',
      })
      .returning();

    const [client4] = await db
      .insert(clients)
      .values({
        name: 'Nomsa Dlamini',
        email: 'nomsa@harmony.co.za',
        phone: '+27 11 411 2000',
        company: 'Harmony Gold Mining',
        address: '100 Grayston Drive, Morningside, Johannesburg',
      })
      .returning();

    console.log(`   ✅ Created ${4} clients\n`);

    // =========================================================================
    // SEED JOBS
    // =========================================================================
    console.log('📋 Creating jobs...');

    const year = new Date().getFullYear();

    // Job 1: Active job in repair phase
    const [job1] = await db
      .insert(jobs)
      .values({
        jobNumber: `BRIM-${year}-001`,
        clientId: client1.id,
        equipmentType: 'Hydraulic Cylinder',
        serialNumber: 'HC-2024-8876',
        manufacturer: 'Caterpillar',
        model: 'CAT 390F',
        currentStep: 'step_7_repair',
        status: 'in_repair',
        hasHazmat: true,
        hazmatLevel: 'medium',
        hazmatNotes: 'Hydraulic oil contamination - requires proper disposal',
        hazmatCleaned: true,
        hazmatCleanedAt: new Date(),
        hazmatCleanedBy: tech1?.id,
        assignedTechnicianId: tech1?.id,
        receivingNotes: 'Cylinder showing signs of seal wear and minor pitting',
        quoteAmount: '45000.00',
        quoteSentAt: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000),
        quoteApprovedAt: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000),
        poNumber: 'PO-AG-2024-5567',
        poReceivedAt: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000),
        receivedAt: new Date(Date.now() - 10 * 24 * 60 * 60 * 1000),
        targetCompletionDate: new Date(Date.now() + 5 * 24 * 60 * 60 * 1000),
      })
      .returning();

    // Job 2: Just received - awaiting strip
    const [job2] = await db
      .insert(jobs)
      .values({
        jobNumber: `BRIM-${year}-002`,
        clientId: client2.id,
        equipmentType: 'Mining Pump Assembly',
        serialNumber: 'MPA-2023-4421',
        manufacturer: 'Weir Minerals',
        model: 'Warman AH',
        currentStep: 'step_2_logging',
        status: 'logged',
        hasHazmat: true,
        hazmatLevel: 'high',
        hazmatNotes: 'Contains slurry residue - hazardous material handling required',
        hazmatCleaned: false,
        assignedTechnicianId: tech2?.id,
        receivingNotes: 'Pump making grinding noise, suspected bearing failure',
        receivedAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000),
        targetCompletionDate: new Date(Date.now() + 14 * 24 * 60 * 60 * 1000),
      })
      .returning();

    // Job 3: QC inspection phase
    const [job3] = await db
      .insert(jobs)
      .values({
        jobNumber: `BRIM-${year}-003`,
        clientId: client3.id,
        equipmentType: 'Gearbox',
        serialNumber: 'GB-2022-9901',
        manufacturer: 'Flender',
        model: 'B3SH 08',
        currentStep: 'step_10_qc_inspection',
        status: 'tested',
        hasHazmat: false,
        assignedTechnicianId: tech3?.id,
        receivingNotes: 'Complete gearbox overhaul requested',
        quoteAmount: '125000.00',
        quoteSentAt: new Date(Date.now() - 15 * 24 * 60 * 60 * 1000),
        quoteApprovedAt: new Date(Date.now() - 12 * 24 * 60 * 60 * 1000),
        poNumber: 'PO-IMP-2024-3312',
        poReceivedAt: new Date(Date.now() - 12 * 24 * 60 * 60 * 1000),
        receivedAt: new Date(Date.now() - 20 * 24 * 60 * 60 * 1000),
        targetCompletionDate: new Date(Date.now() + 2 * 24 * 60 * 60 * 1000),
      })
      .returning();

    // Job 4: New job - just received
    const [job4] = await db
      .insert(jobs)
      .values({
        jobNumber: `BRIM-${year}-004`,
        clientId: client4.id,
        equipmentType: 'Conveyor Drive Unit',
        serialNumber: 'CDU-2024-1123',
        manufacturer: 'SEW-Eurodrive',
        model: 'MC2PVSH08',
        currentStep: 'step_1_receiving',
        status: 'received',
        hasHazmat: false,
        assignedTechnicianId: tech1?.id,
        receivingNotes: 'Unit overheating during operation',
        receivedAt: new Date(),
        targetCompletionDate: new Date(Date.now() + 21 * 24 * 60 * 60 * 1000),
      })
      .returning();

    // Job 5: Awaiting PO
    const [job5] = await db
      .insert(jobs)
      .values({
        jobNumber: `BRIM-${year}-005`,
        clientId: client1.id,
        equipmentType: 'Rock Drill',
        serialNumber: 'RD-2023-7788',
        manufacturer: 'Epiroc',
        model: 'FlexiROC T40',
        currentStep: 'step_6_await_po',
        status: 'awaiting_quote_approval',
        hasHazmat: true,
        hazmatLevel: 'low',
        hazmatNotes: 'Diesel residue present',
        hazmatCleaned: true,
        hazmatCleanedAt: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000),
        hazmatCleanedBy: tech2?.id,
        assignedTechnicianId: tech2?.id,
        receivingNotes: 'Reduced drilling performance, needs full assessment',
        quoteAmount: '78000.00',
        quoteSentAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000),
        receivedAt: new Date(Date.now() - 8 * 24 * 60 * 60 * 1000),
        targetCompletionDate: new Date(Date.now() + 10 * 24 * 60 * 60 * 1000),
      })
      .returning();

    console.log(`   ✅ Created ${5} jobs\n`);

    // =========================================================================
    // SEED JOB PARTS
    // =========================================================================
    console.log('🔩 Creating job parts...');

    // Parts for Job 1 (Hydraulic Cylinder)
    await db.insert(jobParts).values([
      {
        jobId: job1.id,
        partName: 'Piston Seal Kit',
        partNumber: 'PSK-390F-01',
        quantity: 1,
        condition: 'replace',
        defects: ['seal_failure', 'wear'],
        defectNotes: 'Complete seal replacement required',
        cost: '4500.00',
      },
      {
        jobId: job1.id,
        partName: 'Rod Seal',
        partNumber: 'RS-CAT-02',
        quantity: 2,
        condition: 'replace',
        defects: ['wear'],
        cost: '2800.00',
      },
      {
        jobId: job1.id,
        partName: 'Cylinder Barrel',
        partNumber: 'CB-390F-03',
        quantity: 1,
        condition: 'repairable',
        defects: ['pitting', 'surface_damage'],
        defectNotes: 'Minor pitting - can be honed',
        cost: '0.00',
      },
    ]);

    // Parts for Job 3 (Gearbox)
    await db.insert(jobParts).values([
      {
        jobId: job3.id,
        partName: 'Input Shaft Bearing',
        partNumber: 'ISB-B3SH-01',
        quantity: 2,
        condition: 'replace',
        defects: ['bearing_failure'],
        cost: '18500.00',
      },
      {
        jobId: job3.id,
        partName: 'Output Shaft Seal',
        partNumber: 'OSS-B3SH-02',
        quantity: 1,
        condition: 'replace',
        defects: ['seal_failure'],
        cost: '3200.00',
      },
      {
        jobId: job3.id,
        partName: 'Gear Set - Stage 2',
        partNumber: 'GS2-B3SH-03',
        quantity: 1,
        condition: 'replace',
        defects: ['wear', 'surface_damage'],
        defectNotes: 'Significant wear on gear teeth',
        cost: '45000.00',
      },
    ]);

    console.log(`   ✅ Created ${6} job parts\n`);

    // =========================================================================
    // SEED STEP COMPLETIONS
    // =========================================================================
    console.log('✅ Creating step completions...');

    // Completions for Job 1 (up to step 7)
    const job1Steps = [
      'step_1_receiving',
      'step_2_logging',
      'step_3_strip_assess',
      'step_4_document_faults',
      'step_5_technical_report',
      'step_6_await_po',
    ] as const;

    for (let i = 0; i < job1Steps.length; i++) {
      await db.insert(stepCompletions).values({
        jobId: job1.id,
        step: job1Steps[i],
        completedBy: tech1?.id || admin?.id,
        completedAt: new Date(Date.now() - (10 - i) * 24 * 60 * 60 * 1000),
        notes: `Step ${i + 1} completed successfully`,
      });
    }

    // Completions for Job 3 (up to step 9)
    const job3Steps = [
      'step_1_receiving',
      'step_2_logging',
      'step_3_strip_assess',
      'step_4_document_faults',
      'step_5_technical_report',
      'step_6_await_po',
      'step_7_repair',
      'step_8_reassemble',
      'step_9_function_test',
    ] as const;

    for (let i = 0; i < job3Steps.length; i++) {
      await db.insert(stepCompletions).values({
        jobId: job3.id,
        step: job3Steps[i],
        completedBy: tech3?.id || admin?.id,
        completedAt: new Date(Date.now() - (20 - i * 2) * 24 * 60 * 60 * 1000),
        notes: `Step ${i + 1} completed`,
        ...(job3Steps[i] === 'step_9_function_test' && {
          measurements: {
            inputSpeed: 1450,
            outputSpeed: 48.3,
            temperature: 62,
            noiseLevel: 78,
          },
          checklistData: {
            noVibration: true,
            properLubrication: true,
            sealIntegrity: true,
            torqueTest: true,
          },
        }),
      });
    }

    // Completion for Job 2 (step 1)
    await db.insert(stepCompletions).values({
      jobId: job2.id,
      step: 'step_1_receiving',
      completedBy: tech2?.id || admin?.id,
      completedAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000),
      notes: 'Equipment received and logged',
    });

    console.log(`   ✅ Created ${16} step completions\n`);

    console.log('✨ Database seeded successfully!\n');
    console.log('📊 Summary:');
    console.log('   - 5 users (1 admin, 1 manager, 3 technicians)');
    console.log('   - 4 clients (mining companies)');
    console.log('   - 5 jobs (various stages)');
    console.log('   - 6 job parts');
    console.log('   - 16 step completions\n');

  } catch (error) {
    console.error('❌ Error seeding database:', error);
    process.exit(1);
  }
}

seed();
