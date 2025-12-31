"use server";

import axios from "axios";

export async function uploadToImgBB(formData: FormData) {
  try {
    const file = formData.get("image") as File;
    if (!file) {
      return { error: "No file provided" };
    }

    const buffer = await file.arrayBuffer();
    const base64Image = Buffer.from(buffer).toString("base64");

    const apiKey = process.env.IMGBB_API_KEY; 
    if (!apiKey) {
      return { error: "ImgBB API key is not configured" };
    }

    const form = new FormData();
    form.append("image", base64Image);

    const response = await axios.post(
      `https://api.imgbb.com/1/upload?key=${apiKey}`,
      form
    );

    console.log("ImgBB response:", response.data.data);

    if (response.data && response.data.data && response.data.data?.url) {
      return response.data.data;
    } else {
      return { error: "Failed to get URL from ImgBB" };
    }

  } catch (error: any) {
    console.error("ImgBB upload error:", error?.response?.data || error.message);
    return { error: "Upload failed" };
  }
}
