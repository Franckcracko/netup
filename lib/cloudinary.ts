import { CLOUDINARY_API_KEY, cloudName, CLOUDINARY_API_KEY_SECRET } from "@/config/cloudinary";
// import { ReponseUploadCloudinary } from "@/types/cloudinary";
import { v2 as cloudinary } from 'cloudinary'

// const baseURL = `https://api.cloudinary.com/v1_1/${cloudName}`
// const preset = 'coffeup'

cloudinary.config({
  cloud_name: cloudName,
  api_key: CLOUDINARY_API_KEY,
  api_secret: CLOUDINARY_API_KEY_SECRET
});

export const sendImageToCloudinary = async ({ image }: { image: string; }) => {
  const base64Img = `data:image/jpg;base64,${image}`;

  const uploadResult = await cloudinary.uploader
    .upload(base64Img);

  return uploadResult
}

export const deleteImageFromCloudinary = async ({ publicId }: { publicId: string; }) => {
  const deleteResult = await cloudinary.uploader
    .destroy(publicId);

  return deleteResult
}