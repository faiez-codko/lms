import { NextRequest, NextResponse } from 'next/server';
import { hashPassword, verifyAuthToken, AUTH_COOKIE_NAME } from "@/lib/auth";
import { cookies } from "next/headers";

const STORAGE_API_KEY = process.env.BUNNY_STORAGE_API_KEY;
const STORAGE_ZONE_NAME = process.env.BUNNY_STORAGE_ZONE_NAME;
const STORAGE_HOST = process.env.BUNNY_STORAGE_HOST || 'storage.bunnycdn.com';

const BASE_URL = `https://${STORAGE_HOST}/${STORAGE_ZONE_NAME}/`;

export async function POST(req: NextRequest) {
  try {

    const token = (await cookies()).get(AUTH_COOKIE_NAME)?.value;
    const payload = token ? verifyAuthToken(token) : null;

    if (payload?.role !== "SUPER_ADMIN") {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    if (!STORAGE_API_KEY || !STORAGE_ZONE_NAME) {
      return NextResponse.json(
        { error: 'Missing Bunny CDN configuration' },
        { status: 500 }
      );
    }

    const fileName = req.headers.get('x-file-name');
    const filePath = req.headers.get('x-file-path') || ''; // Get the path from headers

    if (!fileName) {
      return NextResponse.json(
        { error: 'Missing x-file-name header' },
        { status: 400 }
      );
    }

    // Ensure path ends with / if it exists and doesn't already
    const normalizedPath = filePath ? (filePath.endsWith('/') ? filePath : `${filePath}/`) : '';

    // Bunny CDN Storage API URL for the file
    const url = `${BASE_URL}${normalizedPath}${fileName}`;

    // Stream the request body directly to Bunny CDN

    const response = await fetch(url, {
      method: 'PUT',
      headers: {
        AccessKey: STORAGE_API_KEY,
        'Content-Type': 'application/octet-stream',
      },
      body: req.body, // Pass the ReadableStream directly
      //@ts-ignore
      duplex: 'half', // Required for streaming uploads in fetch
    });

    if (!response.ok) {
      const errorText = await response.text();
      return NextResponse.json(
        { error: `Bunny CDN Upload Failed: ${response.status} ${errorText}` },
        { status: response.status }
      );
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Upload error:', error);
    return NextResponse.json(
      { error: 'Internal Server Error' },
      { status: 500 }
    );
  }
}
