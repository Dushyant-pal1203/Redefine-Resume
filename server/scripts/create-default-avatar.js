const fs = require("fs");
const path = require("path");

// Function to check if default avatar exists
function checkDefaultAvatar() {
  const uploadDir = path.join(__dirname, "../uploads/avatars");
  const defaultAvatarPath = path.join(uploadDir, "default-avatar.png");

  // Create uploads directory if it doesn't exist
  if (!fs.existsSync(uploadDir)) {
    fs.mkdirSync(uploadDir, { recursive: true });
  }

  // Check if default avatar already exists
  if (!fs.existsSync(defaultAvatarPath)) {
    // You can copy a default image from your assets folder or download one
    // For now, just log a message
    console.warn(`Default avatar not found at: ${defaultAvatarPath}`);
  }
}

checkDefaultAvatar();
