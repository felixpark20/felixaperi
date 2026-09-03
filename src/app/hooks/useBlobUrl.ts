import { useState, useEffect } from "react";

/**
 * Convert a base64 data URL to a Blob URL.
 * Browsers block data: URLs inside iframes for security reasons;
 * Blob URLs created with URL.createObjectURL() are allowed.
 */
export function useBlobUrl(dataUrl: string | undefined): string {
  const [blobUrl, setBlobUrl] = useState<string>("");

  useEffect(() => {
    if (!dataUrl) { setBlobUrl(""); return; }
    if (!dataUrl.startsWith("data:")) { setBlobUrl(dataUrl); return; }

    try {
      const [meta, b64] = dataUrl.split(",");
      const mime = meta.match(/:(.*?);/)?.[1] ?? "application/pdf";
      const bytes = atob(b64);
      const arr = new Uint8Array(bytes.length);
      for (let i = 0; i < bytes.length; i++) arr[i] = bytes.charCodeAt(i);
      const blob = new Blob([arr], { type: mime });
      const url = URL.createObjectURL(blob);
      setBlobUrl(url);
      return () => URL.revokeObjectURL(url);
    } catch {
      setBlobUrl(dataUrl); // fall back
    }
  }, [dataUrl]);

  return blobUrl;
}
