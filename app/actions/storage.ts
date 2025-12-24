'use server';

import { revalidatePath } from 'next/cache';

const STORAGE_API_KEY = process.env.BUNNY_STORAGE_API_KEY;
const STORAGE_ZONE_NAME = process.env.BUNNY_STORAGE_ZONE_NAME;
const STORAGE_HOST = process.env.BUNNY_STORAGE_HOST || 'storage.bunnycdn.com';
const PULL_ZONE_URL = process.env.BUNNY_PULL_ZONE_URL;

const BASE_URL = `https://${STORAGE_HOST}/${STORAGE_ZONE_NAME}/`;

export interface BunnyFile {
  Guid: string;
  StorageZoneName: string;
  Path: string;
  ObjectName: string;
  Length: number;
  LastChanged: string;
  IsDirectory: boolean;
  ServerId: number;
  UserId: string;
  DateCreated: string;
  StorageZoneId: number;
  Checksum: string | null;
  ReplicatedZones: string | null;
}

export interface ActionResult<T> {
  success: boolean;
  data?: T;
  error?: string;
}

function checkConfig() {
  if (!STORAGE_API_KEY || !STORAGE_ZONE_NAME) {
    throw new Error('Missing Bunny CDN configuration. Please check your .env.local file.');
  }
}

export async function listFiles(path = ''): Promise<ActionResult<BunnyFile[]>> {
  try {
    checkConfig();
    
    // Ensure path ends with / if not empty and doesn't already
    const normalizedPath = path ? (path.endsWith('/') ? path : `${path}/`) : '';
    const url = `${BASE_URL}${normalizedPath}`;

    const response = await fetch(url, {
      method: 'GET',
      headers: {
        AccessKey: STORAGE_API_KEY!,
        Accept: 'application/json',
      },
      cache: 'no-store',
    });

    if (!response.ok) {
      if (response.status === 404) {
        return { success: true, data: [] }; // Directory might be empty or not exist
      }
      throw new Error(`Failed to list files: ${response.statusText}`);
    }

    const data = await response.json();
    return { success: true, data };
  } catch (error) {
    console.error('List files error:', error);
    return { success: false, error: error instanceof Error ? error.message : 'Unknown error' };
  }
}

export async function uploadFile(formData: FormData): Promise<ActionResult<void>> {
  try {
    checkConfig();

    const file = formData.get('file') as File;
    if (!file) {
      throw new Error('No file provided');
    }

    // You can add logic to handle subdirectories here if needed
    const fileName = file.name;
    const url = `${BASE_URL}${fileName}`;

    const buffer = Buffer.from(await file.arrayBuffer());

    const response = await fetch(url, {
      method: 'PUT',
      headers: {
        AccessKey: STORAGE_API_KEY!,
        'Content-Type': 'application/octet-stream',
      },
      body: buffer,
    });

    if (!response.ok) {
      throw new Error(`Failed to upload file: ${response.statusText}`);
    }

    revalidatePath('/');
    return { success: true };
  } catch (error) {
    console.error('Upload file error:', error);
    return { success: false, error: error instanceof Error ? error.message : 'Unknown error' };
  }
}

export async function createFolder(path: string, folderName: string): Promise<ActionResult<void>> {
  try {
    checkConfig();

    const normalizedPath = path ? (path.endsWith('/') ? path : `${path}/`) : '';
    // Bunny CDN creates a folder when you end the URL with a slash
    const url = `${BASE_URL}${normalizedPath}${folderName}/`;

    const response = await fetch(url, {
      method: 'PUT',
      headers: {
        AccessKey: STORAGE_API_KEY!,
        'Content-Length': '0',
      },
    });

    if (!response.ok) {
      throw new Error(`Failed to create folder: ${response.statusText}`);
    }

    revalidatePath('/');
    return { success: true };
  } catch (error) {
    console.error('Create folder error:', error);
    return { success: false, error: error instanceof Error ? error.message : 'Unknown error' };
  }
}

export async function deleteFile(fileName: string): Promise<ActionResult<void>> {
  try {
    checkConfig();

    const url = `${BASE_URL}${fileName}`;

    const response = await fetch(url, {
      method: 'DELETE',
      headers: {
        AccessKey: STORAGE_API_KEY!,
      },
    });

    if (!response.ok) {
      throw new Error(`Failed to delete file: ${response.statusText}`);
    }

    revalidatePath('/');
    return { success: true };
  } catch (error) {
    console.error('Delete file error:', error);
    return { success: false, error: error instanceof Error ? error.message : 'Unknown error' };
  }
}

export async function getFileUrl(fileName: string): Promise<string> {
  if (!PULL_ZONE_URL) {
      return '#';
  }
  // Ensure no double slashes
  const baseUrl = PULL_ZONE_URL.endsWith('/') ? PULL_ZONE_URL.slice(0, -1) : PULL_ZONE_URL;
  return `${baseUrl}/${fileName}`;
}
