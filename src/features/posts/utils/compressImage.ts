import imageCompression from 'browser-image-compression';

export async function compressImage(file: File): Promise<File> {
  const options = {
    maxSizeMB: 1, // Aim for ~1MB max
    maxWidthOrHeight: 1920,
    useWebWorker: true,
    fileType: 'image/webp',
    initialQuality: 0.85,
  };

  try {
    const compressedFile = await imageCompression(file, options);
    // browser-image-compression might not change extension if it's already small,
    // but we want webp specifically as per requirements.
    // If it doesn't return webp, we might need manual canvas conversion if strictly needed,
    // but the library usually handles it if fileType is specified.
    return compressedFile;
  } catch (error) {
    console.error('Compression failed:', error);
    return file; // Fallback to original
  }
}
