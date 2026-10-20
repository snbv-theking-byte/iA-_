/**
 * KINGDOM OF MURABBA™ | SNBV™ COMMAND CORE
 * Google Drive API Client (v3)
 * Provides comprehensive file exploration, structured telemetry uploads, and sovereign archiving
 */

export interface DriveFile {
  id: string;
  name: string;
  mimeType: string;
  size?: string;
  modifiedTime: string;
  createdTime?: string;
  iconLink?: string;
  webViewLink?: string;
  webContentLink?: string;
  thumbnailLink?: string;
  parents?: string[];
  trashed?: boolean;
  shared?: boolean;
  description?: string;
}

export interface DriveStorageQuota {
  limit?: string;
  usage?: string;
  usageInDrive?: string;
  usageInDriveTrash?: string;
}

export interface DriveAboutInfo {
  storageQuota: DriveStorageQuota;
  user: {
    displayName: string;
    emailAddress: string;
    photoLink?: string;
  };
}

export interface ListFilesResponse {
  files: DriveFile[];
  nextPageToken?: string;
}

const DRIVE_API_BASE = 'https://www.googleapis.com/drive/v3';
const DRIVE_UPLOAD_BASE = 'https://www.googleapis.com/upload/drive/v3';

/**
 * Fetch Drive user profile and quota usage
 */
export async function getDriveAbout(token: string): Promise<DriveAboutInfo> {
  const response = await fetch(`${DRIVE_API_BASE}/about?fields=storageQuota,user`, {
    headers: { Authorization: `Bearer ${token}` }
  });

  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(`Google Drive API Error (${response.status}): ${errorText}`);
  }

  return response.json();
}

/**
 * List files in Google Drive with parent filtering and text search
 */
export async function listFiles(
  token: string,
  options: {
    folderId?: string;
    searchQuery?: string;
    pageSize?: number;
    pageToken?: string;
    orderBy?: string;
  } = {}
): Promise<ListFilesResponse> {
  const { folderId = 'root', searchQuery = '', pageSize = 50, pageToken, orderBy = 'folder,modifiedTime desc' } = options;

  const queryParts: string[] = ['trashed = false'];

  if (folderId && !searchQuery) {
    queryParts.push(`'${folderId}' in parents`);
  }

  if (searchQuery.trim()) {
    // Escape single quotes in query
    const escaped = searchQuery.replace(/'/g, "\\'");
    queryParts.push(`(name contains '${escaped}' or fullText contains '${escaped}')`);
  }

  const q = queryParts.join(' and ');
  const params = new URLSearchParams({
    q,
    pageSize: pageSize.toString(),
    fields: 'nextPageToken, files(id, name, mimeType, size, modifiedTime, createdTime, iconLink, webViewLink, webContentLink, thumbnailLink, parents, trashed, shared, description)',
    orderBy
  });

  if (pageToken) {
    params.set('pageToken', pageToken);
  }

  const response = await fetch(`${DRIVE_API_BASE}/files?${params.toString()}`, {
    headers: { Authorization: `Bearer ${token}` }
  });

  if (!response.ok) {
    const errorData = await response.text();
    throw new Error(`Drive list error (${response.status}): ${errorData}`);
  }

  return response.json();
}

/**
 * Create a new Folder in Google Drive
 */
export async function createFolder(
  token: string,
  name: string,
  parentFolderId: string = 'root'
): Promise<DriveFile> {
  const metadata = {
    name,
    mimeType: 'application/vnd.google-apps.folder',
    parents: parentFolderId ? [parentFolderId] : ['root']
  };

  const response = await fetch(`${DRIVE_API_BASE}/files`, {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${token}`,
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(metadata)
  });

  if (!response.ok) {
    const err = await response.text();
    throw new Error(`Failed to create folder: ${err}`);
  }

  return response.json();
}

/**
 * Upload arbitrary file content (Blob, File, text) via multipart/related
 */
export async function uploadFile(
  token: string,
  content: Blob | File | string,
  name: string,
  mimeType: string,
  parentFolderId: string = 'root'
): Promise<DriveFile> {
  const boundary = '-------314159265358979323846';
  const delimiter = `\r\n--${boundary}\r\n`;
  const closeDelimiter = `\r\n--${boundary}--`;

  const metadata = {
    name,
    mimeType,
    parents: parentFolderId ? [parentFolderId] : ['root']
  };

  let bodyBlob: Blob;

  if (typeof content === 'string') {
    const multipartRequestBody =
      delimiter +
      'Content-Type: application/json; charset=UTF-8\r\n\r\n' +
      JSON.stringify(metadata) +
      delimiter +
      `Content-Type: ${mimeType}\r\n\r\n` +
      content +
      closeDelimiter;
    bodyBlob = new Blob([multipartRequestBody], { type: `multipart/related; boundary=${boundary}` });
  } else {
    // Content is Blob or File
    const metaPart = new Blob([
      delimiter +
      'Content-Type: application/json; charset=UTF-8\r\n\r\n' +
      JSON.stringify(metadata) +
      delimiter +
      `Content-Type: ${mimeType}\r\n\r\n`
    ], { type: 'text/plain' });

    const endPart = new Blob([closeDelimiter], { type: 'text/plain' });
    bodyBlob = new Blob([metaPart, content, endPart], { type: `multipart/related; boundary=${boundary}` });
  }

  const response = await fetch(
    `${DRIVE_UPLOAD_BASE}/files?uploadType=multipart&fields=id,name,mimeType,size,modifiedTime,webViewLink,webContentLink`,
    {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': `multipart/related; boundary=${boundary}`
      },
      body: bodyBlob
    }
  );

  if (!response.ok) {
    const err = await response.text();
    throw new Error(`Upload failed: ${err}`);
  }

  return response.json();
}

/**
 * Upload JSON formatted data (e.g. Sovereign mission reports, Telemetry captures)
 */
export async function uploadJsonData(
  token: string,
  filename: string,
  data: unknown,
  parentFolderId: string = 'root'
): Promise<DriveFile> {
  const jsonString = JSON.stringify(data, null, 2);
  return uploadFile(token, jsonString, filename, 'application/json', parentFolderId);
}

/**
 * Download or read text content of a file
 */
export async function downloadFileContent(token: string, file: DriveFile): Promise<string> {
  let url = `${DRIVE_API_BASE}/files/${file.id}?alt=media`;

  // For native Google Docs, export as plain text
  if (file.mimeType === 'application/vnd.google-apps.document') {
    url = `${DRIVE_API_BASE}/files/${file.id}/export?mimeType=text/plain`;
  } else if (file.mimeType === 'application/vnd.google-apps.spreadsheet') {
    url = `${DRIVE_API_BASE}/files/${file.id}/export?mimeType=text/csv`;
  }

  const response = await fetch(url, {
    headers: { Authorization: `Bearer ${token}` }
  });

  if (!response.ok) {
    throw new Error(`Failed to download file: ${response.statusText}`);
  }

  return response.text();
}

/**
 * Rename or update file metadata
 */
export async function renameFile(token: string, fileId: string, newName: string): Promise<DriveFile> {
  const response = await fetch(`${DRIVE_API_BASE}/files/${fileId}`, {
    method: 'PATCH',
    headers: {
      Authorization: `Bearer ${token}`,
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({ name: newName })
  });

  if (!response.ok) {
    const err = await response.text();
    throw new Error(`Rename failed: ${err}`);
  }

  return response.json();
}

/**
 * Move file to trash (Safe Delete)
 */
export async function trashFile(token: string, fileId: string): Promise<DriveFile> {
  const response = await fetch(`${DRIVE_API_BASE}/files/${fileId}`, {
    method: 'PATCH',
    headers: {
      Authorization: `Bearer ${token}`,
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({ trashed: true })
  });

  if (!response.ok) {
    const err = await response.text();
    throw new Error(`Failed to move file to trash: ${err}`);
  }

  return response.json();
}

/**
 * Permanently delete file from Google Drive
 */
export async function permanentlyDeleteFile(token: string, fileId: string): Promise<void> {
  const response = await fetch(`${DRIVE_API_BASE}/files/${fileId}`, {
    method: 'DELETE',
    headers: { Authorization: `Bearer ${token}` }
  });

  if (!response.ok) {
    const err = await response.text();
    throw new Error(`Failed to delete file: ${err}`);
  }
}
