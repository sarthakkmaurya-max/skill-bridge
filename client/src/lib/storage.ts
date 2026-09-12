import { supabase, isSupabaseConfigured } from './supabase';

export interface UploadedDocumentResult {
  url: string;
  fileName: string;
  fileSize: string;
  fileSizeBytes: number;
  fileType: string;
  uploadedAt: string;
  isLocal: boolean;
}

export const MAX_FILE_SIZE_BYTES = 10 * 1024 * 1024; // 10MB limit

export const ALLOWED_MIME_TYPES = [
  'application/pdf',
  'application/msword',
  'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
  'image/png',
  'image/jpeg',
  'image/jpg',
  'image/webp'
];

export const ALLOWED_EXTENSIONS = ['.pdf', '.doc', '.docx', '.png', '.jpg', '.jpeg', '.webp'];

/**
 * Formats byte size into human readable string (e.g., 245 KB, 1.8 MB)
 */
export function formatFileSize(bytes: number): string {
  if (!bytes || bytes === 0) return '0 B';
  const k = 1024;
  const sizes = ['B', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return `${parseFloat((bytes / Math.pow(k, i)).toFixed(1))} ${sizes[i]}`;
}

/**
 * Validates file size
 */
export function isValidFileSize(file: File, maxBytes: number = MAX_FILE_SIZE_BYTES): boolean {
  return file.size <= maxBytes;
}

/**
 * Validates file MIME type / extension
 */
export function isValidFileType(file: File, allowed: string[] = ALLOWED_MIME_TYPES): boolean {
  if (allowed.includes(file.type)) return true;
  const ext = '.' + file.name.split('.').pop()?.toLowerCase();
  return ALLOWED_EXTENSIONS.includes(ext);
}

/**
 * Converts File to Base64 Data URL (useful for Sandbox mode and instant local previews)
 */
export function fileToDataUrl(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(reader.result as string);
    reader.onerror = (error) => reject(error);
    reader.readAsDataURL(file);
  });
}

/**
 * Core upload function: uploads to Supabase Storage if configured,
 * otherwise converts to Data URL and stores in localStorage for offline/sandbox mode.
 */
export async function uploadDocumentFile(
  file: File,
  options: {
    folder?: string;
    userId?: string;
    onProgress?: (percent: number) => void;
  } = {}
): Promise<UploadedDocumentResult> {
  const { folder = 'resumes', userId = 'demo', onProgress } = options;

  if (!isValidFileSize(file)) {
    throw new Error(`File is too large (${formatFileSize(file.size)}). Maximum allowed size is 10 MB.`);
  }

  if (!isValidFileType(file)) {
    throw new Error(
      `Unsupported file format (${file.type || file.name}). Please upload a PDF, Word document (.docx), or image (.png, .jpg).`
    );
  }

  onProgress?.(20);

  // If Supabase is configured and has session, attempt upload to Supabase Storage
  if (isSupabaseConfigured) {
    try {
      const sanitizedName = file.name.replace(/[^a-zA-Z0-9.-]/g, '_');
      const filePath = `${folder}/${userId}/${Date.now()}-${sanitizedName}`;

      onProgress?.(50);

      const { data, error } = await supabase.storage
        .from('documents')
        .upload(filePath, file, {
          cacheControl: '3600',
          upsert: true,
        });

      if (!error && data) {
        const { data: publicUrlData } = supabase.storage
          .from('documents')
          .getPublicUrl(data.path);

        onProgress?.(100);

        return {
          url: publicUrlData.publicUrl,
          fileName: file.name,
          fileSize: formatFileSize(file.size),
          fileSizeBytes: file.size,
          fileType: file.type || 'application/pdf',
          uploadedAt: new Date().toISOString(),
          isLocal: false,
        };
      } else {
        console.warn('[Storage] Supabase storage upload notice:', error?.message, '- using local storage fallback');
      }
    } catch (storageErr: any) {
      console.warn('[Storage] Supabase bucket unreachable, using sandbox local storage:', storageErr.message);
    }
  }

  // Sandbox / Local fallback mode
  onProgress?.(60);
  const dataUrl = await fileToDataUrl(file);
  onProgress?.(100);

  const result: UploadedDocumentResult = {
    url: dataUrl,
    fileName: file.name,
    fileSize: formatFileSize(file.size),
    fileSizeBytes: file.size,
    fileType: file.type || 'application/pdf',
    uploadedAt: new Date().toISOString(),
    isLocal: true,
  };

  // Cache in localStorage registry for demo session persistence
  try {
    const existing = localStorage.getItem('skillbridge_uploaded_documents');
    const list = existing ? JSON.parse(existing) : {};
    list[file.name] = result;
    localStorage.setItem('skillbridge_uploaded_documents', JSON.stringify(list));
  } catch (cacheErr) {
    // If quota exceeded due to large file base64, still return the dataUrl
    console.warn('[Storage] Local storage quota notice for large base64 file:', cacheErr);
  }

  return result;
}

/**
 * Triggers a browser download for a document URL
 */
export function downloadDocument(url: string, fileName: string = 'document.pdf') {
  try {
    const a = document.createElement('a');
    a.href = url;
    a.download = fileName;
    a.target = '_blank';
    a.rel = 'noopener noreferrer';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
  } catch (err) {
    // Fallback: open in new tab
    window.open(url, '_blank');
  }
}

/**
 * Detects if a document is a PDF
 */
export function isPdfDocument(url?: string, fileName?: string): boolean {
  if (!url && !fileName) return false;
  if (url?.startsWith('data:application/pdf')) return true;
  if (url?.toLowerCase().endsWith('.pdf')) return true;
  if (fileName?.toLowerCase().endsWith('.pdf')) return true;
  return false;
}

/**
 * Detects if a document is an image
 */
export function isImageDocument(url?: string, fileName?: string): boolean {
  if (!url && !fileName) return false;
  if (url?.startsWith('data:image/')) return true;
  const exts = ['.png', '.jpg', '.jpeg', '.webp'];
  const testUrl = (url || '').toLowerCase();
  const testName = (fileName || '').toLowerCase();
  return exts.some((ext) => testUrl.endsWith(ext) || testName.endsWith(ext));
}
