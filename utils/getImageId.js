// Utility to extract public_id from the Cloudinary image URL
const extractPublicId = (imagePath) => {
    const parts = imagePath.split('/');
    const publicIdWithExtension = parts.slice(-2).join('/'); // Folder + filename
    return publicIdWithExtension.split('.')[0]; // Remove extension
  };

module.exports = extractPublicId;