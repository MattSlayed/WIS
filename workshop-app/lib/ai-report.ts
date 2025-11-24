/**
 * AI Report Generation using Anthropic Claude 3.5 Sonnet
 *
 * Converts technician bullet points into formal technical reports
 */

import Anthropic from '@anthropic-ai/sdk';
import type { Job, JobPart, JobPhoto, TechnicalReport } from '@/types';

const anthropic = new Anthropic({
  apiKey: process.env.ANTHROPIC_API_KEY,
});

export interface ReportGenerationInput {
  job: Job;
  parts: JobPart[];
  photos: JobPhoto[];
  technicianNotes: string;
}

export interface ReportGenerationResult {
  executive_summary: string;
  findings: string;
  recommendations: string;
  fullReport: string;
}

/**
 * Generate a technical report using Claude AI
 */
export async function generateTechnicalReport(
  input: ReportGenerationInput
): Promise<ReportGenerationResult> {
  const { job, parts, photos, technicianNotes } = input;

  // Build context for Claude
  const context = buildReportContext(job, parts, photos, technicianNotes);

  // Call Claude API
  const message = await anthropic.messages.create({
    model: 'claude-3-5-sonnet-20241022',
    max_tokens: 4096,
    temperature: 0.3, // Lower temperature for more consistent, factual output
    system: REPORT_GENERATION_SYSTEM_PROMPT,
    messages: [
      {
        role: 'user',
        content: context,
      },
    ],
  });

  // Parse the response
  const content = message.content[0];
  if (content.type !== 'text') {
    throw new Error('Unexpected response type from Claude');
  }

  return parseReportFromClaude(content.text);
}

/**
 * System prompt for Claude - defines the technical report format
 */
const REPORT_GENERATION_SYSTEM_PROMPT = `You are a technical report writer for an industrial equipment repair workshop. Your role is to transform technician notes and findings into professional, detailed technical reports.

Your reports must follow this structure:

**EXECUTIVE SUMMARY**
- 2-3 sentences summarizing the equipment condition and primary findings
- State the overall severity (Minor, Moderate, Severe)

**FINDINGS**
- Detailed technical description of each defect found
- Reference specific components, measurements, and observations
- Use proper engineering terminology
- Organize findings by severity (Critical → Minor)

**RECOMMENDATIONS**
- Clear, actionable repair recommendations
- List required parts with quantities
- Estimated scope of work
- Any safety or operational considerations

**OUTPUT FORMAT**
Return your response as a structured text with these three sections clearly marked with headers.

Guidelines:
- Be concise but comprehensive
- Use professional engineering language
- Be specific about defects and measurements
- Avoid speculation - only report what was observed
- If photos show defects, reference them explicitly
- Maintain an objective, factual tone`;

/**
 * Build context from job data for Claude
 */
function buildReportContext(
  job: Job,
  parts: JobPart[],
  photos: JobPhoto[],
  technicianNotes: string
): string {
  let context = `# Technical Report Generation Request

## Equipment Information
- Type: ${job.equipment_type}
- Serial Number: ${job.serial_number}
- Manufacturer: ${job.manufacturer || 'Not specified'}
- Model: ${job.model || 'Not specified'}
- Client: ${job.client?.company || 'N/A'}

## Technician Notes
${technicianNotes}

## Parts Assessment
${parts
  .map(
    (part) => `
### ${part.part_name} (${part.part_number || 'No PN'})
- Quantity: ${part.quantity}
- Condition: ${part.condition}
- Defects: ${part.defects.join(', ') || 'None'}
- Notes: ${part.defect_notes || 'No additional notes'}
`
  )
  .join('\n')}

## Photo Evidence
${photos.length} photos available showing:
${photos
  .map(
    (photo, idx) => `
${idx + 1}. ${photo.caption || 'Defect documentation'}
   ${photo.ai_analysis ? `   AI Analysis: ${photo.ai_analysis.suggested_labels.join(', ')}` : ''}
`
  )
  .join('\n')}

Please generate a professional technical report based on this information.`;

  return context;
}

/**
 * Parse Claude's response into structured report sections
 */
function parseReportFromClaude(text: string): ReportGenerationResult {
  // Extract sections using regex
  const executiveSummaryMatch = text.match(
    /\*\*EXECUTIVE SUMMARY\*\*\n([\s\S]*?)(?=\n\*\*FINDINGS\*\*|$)/i
  );
  const findingsMatch = text.match(
    /\*\*FINDINGS\*\*\n([\s\S]*?)(?=\n\*\*RECOMMENDATIONS\*\*|$)/i
  );
  const recommendationsMatch = text.match(/\*\*RECOMMENDATIONS\*\*\n([\s\S]*?)$/i);

  const executive_summary = executiveSummaryMatch
    ? executiveSummaryMatch[1].trim()
    : 'Executive summary not generated';
  const findings = findingsMatch ? findingsMatch[1].trim() : 'Findings not generated';
  const recommendations = recommendationsMatch
    ? recommendationsMatch[1].trim()
    : 'Recommendations not generated';

  return {
    executive_summary,
    findings,
    recommendations,
    fullReport: text,
  };
}

/**
 * Refine a technical report based on user feedback
 */
export async function refineReport(
  originalReport: string,
  feedback: string
): Promise<string> {
  const message = await anthropic.messages.create({
    model: 'claude-3-5-sonnet-20241022',
    max_tokens: 4096,
    temperature: 0.3,
    system: REPORT_GENERATION_SYSTEM_PROMPT,
    messages: [
      {
        role: 'user',
        content: `Here is a technical report that needs refinement:

${originalReport}

User Feedback:
${feedback}

Please update the report based on this feedback while maintaining professional technical writing standards.`,
      },
    ],
  });

  const content = message.content[0];
  if (content.type === 'text') {
    return content.text;
  }

  throw new Error('Failed to refine report');
}

/**
 * Generate a quick summary for a quote email
 */
export async function generateQuoteSummary(job: Job, parts: JobPart[]): Promise<string> {
  const message = await anthropic.messages.create({
    model: 'claude-3-5-sonnet-20241022',
    max_tokens: 512,
    temperature: 0.3,
    messages: [
      {
        role: 'user',
        content: `Generate a brief, client-friendly summary (3-4 sentences) for a repair quote email.

Equipment: ${job.equipment_type} (${job.serial_number})
Parts Needed: ${parts.map((p) => p.part_name).join(', ')}

The summary should be professional but accessible to non-technical clients.`,
      },
    ],
  });

  const content = message.content[0];
  return content.type === 'text' ? content.text : '';
}
