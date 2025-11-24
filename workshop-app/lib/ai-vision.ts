/**
 * AI Visual Inspection using Google Cloud Vision API
 *
 * Analyzes photos of equipment to detect defects automatically
 */

import vision from '@google-cloud/vision';
import type { DefectType, AIAnalysisResult } from '@/types';

// Initialize Vision API client
const visionClient = new vision.ImageAnnotatorClient({
  keyFilename: process.env.GOOGLE_APPLICATION_CREDENTIALS,
});

/**
 * Analyze a photo to detect defects
 */
export async function analyzeDefectPhoto(imageUrl: string): Promise<AIAnalysisResult> {
  try {
    // Run multiple detections in parallel
    const [labelDetection, objectDetection, safetyDetection] = await Promise.all([
      detectLabels(imageUrl),
      detectObjects(imageUrl),
      detectSafetyIssues(imageUrl),
    ]);

    // Combine results and map to our defect types
    const detectedDefects = mapLabelsToDefects([
      ...labelDetection.labels,
      ...objectDetection.objects,
    ]);

    return {
      detected_defects: detectedDefects.types,
      confidence_scores: detectedDefects.scores,
      suggested_labels: labelDetection.labels,
      raw_analysis: JSON.stringify({
        labels: labelDetection,
        objects: objectDetection,
        safety: safetyDetection,
      }),
    };
  } catch (error) {
    console.error('Vision API Error:', error);
    throw new Error('Failed to analyze image');
  }
}

/**
 * Detect labels (general image categorization)
 */
async function detectLabels(imageUrl: string) {
  const [result] = await visionClient.labelDetection(imageUrl);
  const labels = result.labelAnnotations || [];

  return {
    labels: labels.slice(0, 10).map((label) => label.description || ''),
    scores: labels.slice(0, 10).map((label) => label.score || 0),
  };
}

/**
 * Detect specific objects in the image
 */
async function detectObjects(imageUrl: string) {
  const [result] = await visionClient.objectLocalization(imageUrl);
  const objects = result.localizedObjectAnnotations || [];

  return {
    objects: objects.map((obj) => obj.name || ''),
    scores: objects.map((obj) => obj.score || 0),
  };
}

/**
 * Detect potential safety issues
 */
async function detectSafetyIssues(imageUrl: string) {
  const [result] = await visionClient.safeSearchDetection(imageUrl);
  const safeSearch = result.safeSearchAnnotation;

  return {
    hasSafetyIssues: false, // We're looking at equipment, not content safety
    metadata: safeSearch,
  };
}

/**
 * Map Vision API labels to our defect types
 */
function mapLabelsToDefects(labels: string[]): {
  types: DefectType[];
  scores: Record<DefectType, number>;
} {
  const defectMapping: Record<string, DefectType> = {
    // Corrosion indicators
    rust: 'corrosion',
    corrosion: 'corrosion',
    oxidation: 'corrosion',
    'rust stain': 'corrosion',

    // Crack indicators
    crack: 'crack',
    fracture: 'crack',
    split: 'crack',
    break: 'crack',

    // Wear indicators
    wear: 'wear',
    abrasion: 'wear',
    erosion: 'wear',
    scratch: 'wear',

    // Pitting indicators
    pitting: 'pitting',
    pit: 'pitting',
    cavity: 'pitting',

    // Deformation indicators
    deformation: 'deformation',
    bent: 'deformation',
    warped: 'deformation',
    dent: 'deformation',

    // Seal failure indicators
    'seal damage': 'seal_failure',
    leak: 'seal_failure',
    'o-ring': 'seal_failure',
    gasket: 'seal_failure',

    // Bearing failure indicators
    bearing: 'bearing_failure',
    'ball bearing': 'bearing_failure',
    'roller bearing': 'bearing_failure',

    // Thread damage indicators
    thread: 'thread_damage',
    'stripped thread': 'thread_damage',
    'damaged thread': 'thread_damage',

    // Surface damage indicators
    scratch: 'surface_damage',
    gouge: 'surface_damage',
    score: 'surface_damage',
  };

  const detectedDefects = new Set<DefectType>();
  const confidenceScores: Record<DefectType, number> = {} as Record<DefectType, number>;

  // Check each label against our defect mapping
  labels.forEach((label) => {
    const lowerLabel = label.toLowerCase();

    for (const [key, defectType] of Object.entries(defectMapping)) {
      if (lowerLabel.includes(key)) {
        detectedDefects.add(defectType);

        // Use highest confidence score for each defect type
        if (!confidenceScores[defectType] || confidenceScores[defectType] < 0.7) {
          confidenceScores[defectType] = 0.7; // Default confidence
        }
      }
    }
  });

  return {
    types: Array.from(detectedDefects),
    scores: confidenceScores,
  };
}

/**
 * Analyze multiple photos and aggregate results
 */
export async function analyzeBatchPhotos(
  imageUrls: string[]
): Promise<AIAnalysisResult[]> {
  const analyses = await Promise.all(
    imageUrls.map((url) => analyzeDefectPhoto(url).catch(() => null))
  );

  return analyses.filter((a): a is AIAnalysisResult => a !== null);
}

/**
 * Get suggested defect labels for quick selection
 */
export function getSuggestedDefectLabels(analysis: AIAnalysisResult): string[] {
  const labels: string[] = [];

  // Add detected defects as suggestions
  analysis.detected_defects.forEach((defect) => {
    const confidence = analysis.confidence_scores[defect] || 0;
    if (confidence > 0.6) {
      labels.push(formatDefectLabel(defect));
    }
  });

  // Add generic labels from Vision API
  analysis.suggested_labels.slice(0, 5).forEach((label) => {
    if (!labels.includes(label)) {
      labels.push(label);
    }
  });

  return labels;
}

/**
 * Format defect type as human-readable label
 */
function formatDefectLabel(defect: DefectType): string {
  const labels: Record<DefectType, string> = {
    corrosion: 'Corrosion',
    crack: 'Crack',
    wear: 'Wear',
    pitting: 'Pitting',
    deformation: 'Deformation',
    seal_failure: 'Seal Failure',
    bearing_failure: 'Bearing Failure',
    thread_damage: 'Thread Damage',
    surface_damage: 'Surface Damage',
    other: 'Other',
  };

  return labels[defect] || 'Unknown';
}

/**
 * Get defect severity based on type and confidence
 */
export function getDefectSeverity(
  defectType: DefectType,
  confidence: number
): 'low' | 'medium' | 'high' {
  // Critical defects
  const criticalDefects: DefectType[] = ['crack', 'deformation', 'bearing_failure'];
  if (criticalDefects.includes(defectType) && confidence > 0.7) {
    return 'high';
  }

  // Moderate defects
  const moderateDefects: DefectType[] = [
    'corrosion',
    'pitting',
    'seal_failure',
    'thread_damage',
  ];
  if (moderateDefects.includes(defectType) && confidence > 0.6) {
    return 'medium';
  }

  return 'low';
}
