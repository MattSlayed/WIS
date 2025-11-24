/**
 * QR Code Generation and Scanning
 * Using qrcode for generation and html5-qrcode for scanning (React 18 compatible)
 */

import QRCode from 'qrcode';

/**
 * Generate a QR code as a data URL
 */
export async function generateQRCode(data: string, options?: QRCode.QRCodeToDataURLOptions): Promise<string> {
  try {
    const dataUrl = await QRCode.toDataURL(data, {
      errorCorrectionLevel: 'M',
      margin: 2,
      width: 300,
      ...options,
    });
    return dataUrl;
  } catch (error) {
    console.error('QR Code generation error:', error);
    throw new Error('Failed to generate QR code');
  }
}

/**
 * Generate a QR code as a canvas element
 */
export async function generateQRCodeCanvas(
  canvas: HTMLCanvasElement,
  data: string,
  options?: QRCode.QRCodeToCanvasOptions
): Promise<void> {
  try {
    await QRCode.toCanvas(canvas, data, {
      errorCorrectionLevel: 'M',
      margin: 2,
      width: 300,
      ...options,
    });
  } catch (error) {
    console.error('QR Code canvas generation error:', error);
    throw new Error('Failed to generate QR code on canvas');
  }
}

/**
 * Generate a QR code as a buffer (for server-side use)
 */
export async function generateQRCodeBuffer(data: string): Promise<Buffer> {
  try {
    const buffer = await QRCode.toBuffer(data, {
      errorCorrectionLevel: 'M',
      margin: 2,
      width: 300,
    });
    return buffer;
  } catch (error) {
    console.error('QR Code buffer generation error:', error);
    throw new Error('Failed to generate QR code buffer');
  }
}

/**
 * Generate a job-specific QR code
 */
export async function generateJobQRCode(jobNumber: string): Promise<string> {
  // Format: WIS://job/{jobNumber}
  const qrData = `WIS://job/${jobNumber}`;
  return generateQRCode(qrData);
}

/**
 * Parse QR code data to extract job number
 */
export function parseJobQRCode(qrData: string): string | null {
  // Expected format: WIS://job/{jobNumber}
  const match = qrData.match(/^WIS:\/\/job\/(.+)$/);
  return match ? match[1] : null;
}

/**
 * QR Scanner configuration
 * Note: html5-qrcode scanner must be initialized in a React component
 * This is just the configuration helper
 */
export const qrScannerConfig = {
  fps: 10,
  qrbox: { width: 250, height: 250 },
  aspectRatio: 1.0,
  disableFlip: false,
  videoConstraints: {
    facingMode: 'environment', // Use rear camera
  },
};

/**
 * Format QR scanner result
 */
export interface QRScanResult {
  text: string;
  jobNumber: string | null;
  isValid: boolean;
}

export function formatQRScanResult(decodedText: string): QRScanResult {
  const jobNumber = parseJobQRCode(decodedText);
  return {
    text: decodedText,
    jobNumber,
    isValid: jobNumber !== null,
  };
}
