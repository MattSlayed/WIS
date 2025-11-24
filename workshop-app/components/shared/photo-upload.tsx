'use client';

/**
 * Photo Upload Component
 * Handles image capture/upload with camera/gallery options
 * Integrates with AI Vision for defect detection
 */

import { useState, useRef } from 'react';
import { Camera, Upload, X, Loader, AlertCircle, CheckCircle } from 'lucide-react';
import type { JobPhoto } from '@/types';

interface PhotoUploadProps {
  jobId: string;
  stepNumber: number;
  photos: JobPhoto[];
  onPhotosChange: (photos: JobPhoto[]) => void;
  maxPhotos?: number;
  enableAIAnalysis?: boolean;
}

export default function PhotoUpload({
  jobId,
  stepNumber,
  photos,
  onPhotosChange,
  maxPhotos = 10,
  enableAIAnalysis = false,
}: PhotoUploadProps) {
  const [isUploading, setIsUploading] = useState(false);
  const [uploadError, setUploadError] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileSelect = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files;
    if (!files || files.length === 0) return;

    if (photos.length + files.length > maxPhotos) {
      setUploadError(`Maximum ${maxPhotos} photos allowed`);
      return;
    }

    setIsUploading(true);
    setUploadError(null);

    try {
      const newPhotos: JobPhoto[] = [];

      for (let i = 0; i < files.length; i++) {
        const file = files[i];

        // TODO: Upload to Google Cloud Storage
        const imageUrl = URL.createObjectURL(file); // Temporary preview

        // TODO: If enableAIAnalysis, call AI Vision API
        const aiAnalysis = enableAIAnalysis
          ? {
              detected_defects: ['corrosion', 'wear'] as any[],
              confidence_scores: { corrosion: 0.85, wear: 0.72 } as Record<string, number>,
              suggested_labels: ['Surface damage', 'Requires repair'],
              raw_analysis: 'AI detection results placeholder'
            }
          : undefined;

        const photo: JobPhoto = {
          id: `temp-${Date.now()}-${i}`,
          job_id: jobId,
          step_number: stepNumber,
          image_url: imageUrl,
          thumbnail_url: imageUrl, // TODO: Generate thumbnail
          caption: '',
          ai_analysis: aiAnalysis,
          taken_at: new Date().toISOString(),
          uploaded_by: 'current-user', // TODO: Get from auth
          created_at: new Date().toISOString(),
        };

        newPhotos.push(photo);
      }

      onPhotosChange([...photos, ...newPhotos]);
    } catch (error) {
      console.error('Photo upload error:', error);
      setUploadError('Failed to upload photos. Please try again.');
    } finally {
      setIsUploading(false);
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
    }
  };

  const handleRemovePhoto = (photoId: string) => {
    onPhotosChange(photos.filter((p) => p.id !== photoId));
  };

  const handleUpdateCaption = (photoId: string, caption: string) => {
    onPhotosChange(
      photos.map((p) => (p.id === photoId ? { ...p, caption } : p))
    );
  };

  return (
    <div className="space-y-4">
      {/* Upload Button */}
      <div>
        <input
          ref={fileInputRef}
          type="file"
          accept="image/*"
          multiple
          onChange={handleFileSelect}
          className="hidden"
        />

        <div className="flex gap-2">
          <button
            onClick={() => fileInputRef.current?.click()}
            disabled={isUploading || photos.length >= maxPhotos}
            className="btn btn-secondary flex-1"
          >
            {isUploading ? (
              <>
                <Loader className="w-5 h-5 animate-spin" />
                Uploading...
              </>
            ) : (
              <>
                <Camera className="w-5 h-5" />
                Take Photo
              </>
            )}
          </button>

          <button
            onClick={() => fileInputRef.current?.click()}
            disabled={isUploading || photos.length >= maxPhotos}
            className="btn btn-ghost"
          >
            <Upload className="w-5 h-5" />
            <span className="hidden sm:inline">Upload</span>
          </button>
        </div>

        {uploadError && (
          <div className="mt-2 text-sm text-danger-600 flex items-center gap-2">
            <AlertCircle className="w-4 h-4" />
            {uploadError}
          </div>
        )}

        <p className="mt-2 text-xs text-gray-500">
          {photos.length} / {maxPhotos} photos uploaded
          {enableAIAnalysis && ' • AI defect detection enabled'}
        </p>
      </div>

      {/* Photo Grid */}
      {photos.length > 0 && (
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
          {photos.map((photo) => (
            <div
              key={photo.id}
              className="relative group rounded-lg overflow-hidden border border-gray-200"
            >
              {/* Image */}
              <div className="aspect-square bg-gray-100">
                <img
                  src={photo.image_url || photo.url || ''}
                  alt={photo.caption || 'Job photo'}
                  className="w-full h-full object-cover"
                />
              </div>

              {/* Remove Button */}
              <button
                onClick={() => handleRemovePhoto(photo.id)}
                className="absolute top-2 right-2 p-1.5 bg-danger-500 text-white rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
              >
                <X className="w-4 h-4" />
              </button>

              {/* AI Analysis Badge */}
              {photo.ai_analysis && photo.ai_analysis.detected_defects && photo.ai_analysis.detected_defects.length > 0 && (
                <div className="absolute top-2 left-2">
                  <span className="badge badge-warning text-xs">
                    AI: {photo.ai_analysis.detected_defects.length} defects
                  </span>
                </div>
              )}

              {/* Caption Input */}
              <div className="p-2 bg-white">
                <input
                  type="text"
                  placeholder="Add caption..."
                  value={photo.caption}
                  onChange={(e) => handleUpdateCaption(photo.id, e.target.value)}
                  className="w-full text-xs border-none focus:ring-0 p-0 placeholder-gray-400"
                />
              </div>

              {/* AI Analysis Details */}
              {photo.ai_analysis && photo.ai_analysis.detected_defects && photo.ai_analysis.detected_defects.length > 0 && (
                <div className="p-2 bg-warning-50 border-t border-warning-200">
                  <div className="flex flex-wrap gap-1">
                    {photo.ai_analysis.detected_defects.map((defect, index) => (
                      <span key={index} className="text-xs badge badge-warning">
                        {defect}
                      </span>
                    ))}
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
