const cloudinary = require("cloudinary").v2;

const isConfigured = Boolean(
  process.env.CLOUDINARY_CLOUD_NAME &&
    process.env.CLOUDINARY_API_KEY &&
    process.env.CLOUDINARY_API_SECRET
);

if (isConfigured) {
  cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET,
  });
}

const PLACEHOLDER_AVATAR = "https://placehold.co/600x400/e2e4e7/6b7280?text=No+Photo";

/**
 * Uploads a file buffer to Cloudinary.
 * If Cloudinary is not configured, returns a placeholder URL instead of throwing,
 * so the app remains fully runnable without an account during local development.
 *
 * @param {Buffer} fileBuffer
 * @param {string} folder - e.g. "oru-aka/avatars" or "oru-aka/verification-ids"
 * @returns {Promise<{url: string, publicId: string|null}>}
 */
async function uploadBuffer(fileBuffer, folder = "oru-aka/misc") {
  if (!isConfigured) {
    console.warn(
      "[cloudinary] Not configured \u2014 returning placeholder image URL. Add CLOUDINARY_* keys to .env to enable real uploads."
    );
    return { url: PLACEHOLDER_AVATAR, publicId: null };
  }

  return new Promise((resolve, reject) => {
    const uploadStream = cloudinary.uploader.upload_stream(
      { folder, resource_type: "image" },
      (error, result) => {
        if (error) return reject(error);
        resolve({ url: result.secure_url, publicId: result.public_id });
      }
    );
    uploadStream.end(fileBuffer);
  });
}

async function destroyImage(publicId) {
  if (!isConfigured || !publicId) return;
  try {
    await cloudinary.uploader.destroy(publicId);
  } catch (err) {
    console.error("[cloudinary] Failed to delete image:", err.message);
  }
}

module.exports = { uploadBuffer, destroyImage, isConfigured };
