'use client';

/**
 * QR Code Scanner Component
 * Uses html5-qrcode library (React 18 compatible)
 */

import { useEffect, useRef, useState } from 'react';
import { Html5Qrcode } from 'html5-qrcode';
import { qrScannerConfig, formatQRScanResult, type QRScanResult } from '@/lib/qr-code';
import { X, Camera } from 'lucide-react';

interface QRScannerProps {
  onScan: (result: QRScanResult) => void;
  onClose: () => void;
  width?: number;
  height?: number;
}

export default function QRScanner({ onScan, onClose, width = 300, height = 300 }: QRScannerProps) {
  const [isScanning, setIsScanning] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const scannerRef = useRef<Html5Qrcode | null>(null);
  const qrCodeRegionId = 'qr-reader-region';

  useEffect(() => {
    const scanner = new Html5Qrcode(qrCodeRegionId);
    scannerRef.current = scanner;

    return () => {
      if (scannerRef.current?.isScanning) {
        scannerRef.current.stop().catch(console.error);
      }
    };
  }, []);

  const startScanning = async () => {
    if (!scannerRef.current) return;

    try {
      setError(null);
      setIsScanning(true);

      await scannerRef.current.start(
        { facingMode: 'environment' },
        {
          ...qrScannerConfig,
          qrbox: { width, height },
        },
        (decodedText) => {
          // Success callback
          const result = formatQRScanResult(decodedText);
          onScan(result);

          // Stop scanning after successful scan
          if (scannerRef.current?.isScanning) {
            scannerRef.current.stop().catch(console.error);
            setIsScanning(false);
          }
        },
        (errorMessage) => {
          // Error callback (optional - runs on every frame with no QR code)
          // We don't set error here as it's expected when no QR code is visible
        }
      );
    } catch (err) {
      console.error('Scanner start error:', err);
      setError('Failed to start camera. Please check permissions.');
      setIsScanning(false);
    }
  };

  const stopScanning = async () => {
    if (scannerRef.current?.isScanning) {
      try {
        await scannerRef.current.stop();
        setIsScanning(false);
      } catch (err) {
        console.error('Scanner stop error:', err);
      }
    }
  };

  const handleClose = async () => {
    await stopScanning();
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 bg-black bg-opacity-75 flex items-center justify-center p-4">
      <div className="bg-white rounded-xl max-w-md w-full overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-gray-200">
          <h3 className="text-lg font-semibold text-gray-900">Scan QR Code</h3>
          <button
            onClick={handleClose}
            className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Scanner Area */}
        <div className="p-4">
          <div id={qrCodeRegionId} className="w-full" />

          {error && (
            <div className="mt-4 p-3 bg-danger-50 border border-danger-200 rounded-lg">
              <p className="text-sm text-danger-700">{error}</p>
            </div>
          )}

          {!isScanning && !error && (
            <div className="text-center py-8">
              <Camera className="w-16 h-16 mx-auto text-gray-400 mb-4" />
              <p className="text-gray-600 mb-4">
                Position the QR code within the camera view
              </p>
              <button onClick={startScanning} className="btn btn-primary">
                Start Scanning
              </button>
            </div>
          )}
        </div>

        {/* Instructions */}
        <div className="px-4 pb-4">
          <div className="bg-blue-50 p-3 rounded-lg">
            <p className="text-xs text-blue-900">
              <strong>Tip:</strong> Ensure the QR code is well-lit and within the frame.
              The scanner will automatically detect and read the code.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
