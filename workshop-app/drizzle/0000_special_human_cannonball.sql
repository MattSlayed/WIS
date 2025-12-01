CREATE TYPE "public"."hazmat_level" AS ENUM('none', 'low', 'medium', 'high', 'extreme');--> statement-breakpoint
CREATE TYPE "public"."job_status" AS ENUM('received', 'logged', 'stripped', 'assessed', 'awaiting_quote_approval', 'po_received', 'in_repair', 'assembled', 'tested', 'qc_passed', 'ready_for_dispatch', 'dispatched', 'on_hold', 'cancelled');--> statement-breakpoint
CREATE TYPE "public"."notification_status" AS ENUM('pending', 'sent', 'failed');--> statement-breakpoint
CREATE TYPE "public"."notification_type" AS ENUM('sms', 'email', 'in_app');--> statement-breakpoint
CREATE TYPE "public"."part_condition" AS ENUM('good', 'repairable', 'replace');--> statement-breakpoint
CREATE TYPE "public"."qc_status" AS ENUM('passed', 'failed', 'conditional');--> statement-breakpoint
CREATE TYPE "public"."report_status" AS ENUM('draft', 'final', 'sent');--> statement-breakpoint
CREATE TYPE "public"."user_role" AS ENUM('technician', 'manager', 'admin');--> statement-breakpoint
CREATE TYPE "public"."workflow_step" AS ENUM('step_1_receiving', 'step_2_logging', 'step_3_strip_assess', 'step_4_document_faults', 'step_5_technical_report', 'step_6_await_po', 'step_7_repair', 'step_8_reassemble', 'step_9_function_test', 'step_10_qc_inspection', 'step_11_dispatch');--> statement-breakpoint
CREATE TABLE "clients" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"name" text NOT NULL,
	"email" text NOT NULL,
	"phone" text NOT NULL,
	"company" text NOT NULL,
	"address" text,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "digital_signatures" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"job_id" uuid NOT NULL,
	"magic_link_id" uuid NOT NULL,
	"signature_data" text NOT NULL,
	"signer_name" text NOT NULL,
	"signer_email" text NOT NULL,
	"signed_at" timestamp with time zone DEFAULT now() NOT NULL,
	"ip_address" text NOT NULL
);
--> statement-breakpoint
CREATE TABLE "job_parts" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"job_id" uuid NOT NULL,
	"part_name" text NOT NULL,
	"part_number" text,
	"quantity" integer DEFAULT 1 NOT NULL,
	"condition" "part_condition" DEFAULT 'good' NOT NULL,
	"defects" text[] DEFAULT '{}',
	"defect_notes" text,
	"cost" numeric(10, 2),
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "job_photos" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"job_id" uuid NOT NULL,
	"step" "workflow_step",
	"step_number" integer,
	"url" text,
	"image_url" text,
	"thumbnail_url" text,
	"caption" text,
	"taken_at" timestamp with time zone,
	"ai_analysis" jsonb,
	"uploaded_by" uuid NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "jobs" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"job_number" text NOT NULL,
	"client_id" uuid NOT NULL,
	"equipment_type" text NOT NULL,
	"serial_number" text NOT NULL,
	"manufacturer" text,
	"model" text,
	"model_number" text,
	"current_step" "workflow_step" DEFAULT 'step_1_receiving' NOT NULL,
	"status" "job_status" DEFAULT 'received' NOT NULL,
	"has_hazmat" boolean DEFAULT false NOT NULL,
	"hazmat_level" "hazmat_level",
	"hazmat_notes" text,
	"hazmat_details" text,
	"hazmat_cleaned" boolean DEFAULT false NOT NULL,
	"hazmat_cleaned_at" timestamp with time zone,
	"hazmat_cleaned_by" uuid,
	"quote_sent_at" timestamp with time zone,
	"quote_amount" numeric(10, 2),
	"quote_approved_at" timestamp with time zone,
	"po_number" text,
	"po_received_at" timestamp with time zone,
	"assigned_technician_id" uuid,
	"qr_code_url" text,
	"receiving_notes" text,
	"received_at" timestamp with time zone DEFAULT now() NOT NULL,
	"target_completion_date" timestamp with time zone,
	"actual_completion_date" timestamp with time zone,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL,
	CONSTRAINT "jobs_job_number_unique" UNIQUE("job_number")
);
--> statement-breakpoint
CREATE TABLE "magic_links" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"token" text NOT NULL,
	"job_id" uuid NOT NULL,
	"client_email" text NOT NULL,
	"expires_at" timestamp with time zone NOT NULL,
	"used_at" timestamp with time zone,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	CONSTRAINT "magic_links_token_unique" UNIQUE("token")
);
--> statement-breakpoint
CREATE TABLE "notifications" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"user_id" uuid,
	"email" text,
	"phone" text,
	"type" "notification_type" NOT NULL,
	"subject" text NOT NULL,
	"message" text NOT NULL,
	"status" "notification_status" DEFAULT 'pending' NOT NULL,
	"sent_at" timestamp with time zone,
	"error_message" text,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "qc_inspections" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"job_id" uuid NOT NULL,
	"inspector_id" uuid NOT NULL,
	"measurements" jsonb NOT NULL,
	"visual_inspection_passed" boolean NOT NULL,
	"function_test_passed" boolean NOT NULL,
	"leak_test_passed" boolean NOT NULL,
	"documentation_complete" boolean NOT NULL,
	"overall_status" "qc_status" NOT NULL,
	"notes" text,
	"failed_items" text[] DEFAULT '{}',
	"inspected_at" timestamp with time zone DEFAULT now() NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "step_completions" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"job_id" uuid NOT NULL,
	"step" "workflow_step" NOT NULL,
	"completed_at" timestamp with time zone DEFAULT now() NOT NULL,
	"completed_by" uuid NOT NULL,
	"notes" text,
	"measurements" jsonb,
	"checklist_data" jsonb
);
--> statement-breakpoint
CREATE TABLE "technical_reports" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"job_id" uuid NOT NULL,
	"executive_summary" text,
	"findings" text,
	"recommendations" text,
	"ai_generated" boolean DEFAULT false NOT NULL,
	"ai_draft" text,
	"pdf_url" text,
	"status" "report_status" DEFAULT 'draft' NOT NULL,
	"sent_at" timestamp with time zone,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL,
	CONSTRAINT "technical_reports_job_id_unique" UNIQUE("job_id")
);
--> statement-breakpoint
CREATE TABLE "users" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"email" text NOT NULL,
	"full_name" text NOT NULL,
	"role" "user_role" DEFAULT 'technician' NOT NULL,
	"phone" text,
	"avatar_url" text,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL,
	CONSTRAINT "users_email_unique" UNIQUE("email")
);
--> statement-breakpoint
ALTER TABLE "digital_signatures" ADD CONSTRAINT "digital_signatures_job_id_jobs_id_fk" FOREIGN KEY ("job_id") REFERENCES "public"."jobs"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "digital_signatures" ADD CONSTRAINT "digital_signatures_magic_link_id_magic_links_id_fk" FOREIGN KEY ("magic_link_id") REFERENCES "public"."magic_links"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "job_parts" ADD CONSTRAINT "job_parts_job_id_jobs_id_fk" FOREIGN KEY ("job_id") REFERENCES "public"."jobs"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "job_photos" ADD CONSTRAINT "job_photos_job_id_jobs_id_fk" FOREIGN KEY ("job_id") REFERENCES "public"."jobs"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "job_photos" ADD CONSTRAINT "job_photos_uploaded_by_users_id_fk" FOREIGN KEY ("uploaded_by") REFERENCES "public"."users"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "jobs" ADD CONSTRAINT "jobs_client_id_clients_id_fk" FOREIGN KEY ("client_id") REFERENCES "public"."clients"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "jobs" ADD CONSTRAINT "jobs_hazmat_cleaned_by_users_id_fk" FOREIGN KEY ("hazmat_cleaned_by") REFERENCES "public"."users"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "jobs" ADD CONSTRAINT "jobs_assigned_technician_id_users_id_fk" FOREIGN KEY ("assigned_technician_id") REFERENCES "public"."users"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "magic_links" ADD CONSTRAINT "magic_links_job_id_jobs_id_fk" FOREIGN KEY ("job_id") REFERENCES "public"."jobs"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "notifications" ADD CONSTRAINT "notifications_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "qc_inspections" ADD CONSTRAINT "qc_inspections_job_id_jobs_id_fk" FOREIGN KEY ("job_id") REFERENCES "public"."jobs"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "qc_inspections" ADD CONSTRAINT "qc_inspections_inspector_id_users_id_fk" FOREIGN KEY ("inspector_id") REFERENCES "public"."users"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "step_completions" ADD CONSTRAINT "step_completions_job_id_jobs_id_fk" FOREIGN KEY ("job_id") REFERENCES "public"."jobs"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "step_completions" ADD CONSTRAINT "step_completions_completed_by_users_id_fk" FOREIGN KEY ("completed_by") REFERENCES "public"."users"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "technical_reports" ADD CONSTRAINT "technical_reports_job_id_jobs_id_fk" FOREIGN KEY ("job_id") REFERENCES "public"."jobs"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
CREATE INDEX "clients_company_idx" ON "clients" USING btree ("company");--> statement-breakpoint
CREATE INDEX "digital_signatures_job_id_idx" ON "digital_signatures" USING btree ("job_id");--> statement-breakpoint
CREATE INDEX "job_parts_job_id_idx" ON "job_parts" USING btree ("job_id");--> statement-breakpoint
CREATE INDEX "job_photos_job_id_idx" ON "job_photos" USING btree ("job_id");--> statement-breakpoint
CREATE INDEX "job_photos_step_idx" ON "job_photos" USING btree ("step");--> statement-breakpoint
CREATE UNIQUE INDEX "jobs_job_number_idx" ON "jobs" USING btree ("job_number");--> statement-breakpoint
CREATE INDEX "jobs_client_id_idx" ON "jobs" USING btree ("client_id");--> statement-breakpoint
CREATE INDEX "jobs_status_idx" ON "jobs" USING btree ("status");--> statement-breakpoint
CREATE INDEX "jobs_current_step_idx" ON "jobs" USING btree ("current_step");--> statement-breakpoint
CREATE INDEX "jobs_assigned_technician_idx" ON "jobs" USING btree ("assigned_technician_id");--> statement-breakpoint
CREATE INDEX "jobs_created_at_idx" ON "jobs" USING btree ("created_at");--> statement-breakpoint
CREATE UNIQUE INDEX "magic_links_token_idx" ON "magic_links" USING btree ("token");--> statement-breakpoint
CREATE INDEX "magic_links_job_id_idx" ON "magic_links" USING btree ("job_id");--> statement-breakpoint
CREATE INDEX "notifications_user_id_idx" ON "notifications" USING btree ("user_id");--> statement-breakpoint
CREATE INDEX "notifications_status_idx" ON "notifications" USING btree ("status");--> statement-breakpoint
CREATE INDEX "qc_inspections_job_id_idx" ON "qc_inspections" USING btree ("job_id");--> statement-breakpoint
CREATE INDEX "qc_inspections_inspector_id_idx" ON "qc_inspections" USING btree ("inspector_id");--> statement-breakpoint
CREATE INDEX "step_completions_job_id_idx" ON "step_completions" USING btree ("job_id");--> statement-breakpoint
CREATE UNIQUE INDEX "step_completions_job_step_unique" ON "step_completions" USING btree ("job_id","step");--> statement-breakpoint
CREATE UNIQUE INDEX "technical_reports_job_id_idx" ON "technical_reports" USING btree ("job_id");--> statement-breakpoint
CREATE UNIQUE INDEX "users_email_idx" ON "users" USING btree ("email");