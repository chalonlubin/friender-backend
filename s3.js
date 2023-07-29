require("dotenv").config();
const { S3 } = require("@aws-sdk/client-s3");
const sharp = require("sharp");

const bucketName = process.env.AWS_BUCKET_NAME;
const region = process.env.AWS_BUCKET_REGION;
const accessKeyId = process.env.AWS_ACCESS_KEY;
const secretAccessKey = process.env.AWS_SECRET_KEY;

const s3 = new S3({
  region,
  credentials: {
    accessKeyId,
    secretAccessKey,
  },
});

// Function to resize and compress the image using sharp
async function optimizeImage(fileBuffer) {
  try {
    const resizedImageBuffer = await sharp(fileBuffer)
      .resize({ width: 800 })
      .jpeg({ quality: 75 })
      .toBuffer();
    return resizedImageBuffer;
  } catch (error) {
    // If an error occurs during image processing, return the original file buffer
    console.error("Error optimizing image:", error);
    return fileBuffer;
  }
}

async function uploadFile(file) {
  // Optimize the image buffer using sharp
  const optimizedBuffer = await optimizeImage(file.buffer);

  const uploadParams = {
    Bucket: bucketName,
    Key: file.originalname,
    Body: optimizedBuffer, // Use the optimized buffer instead of the original file.buffer
  };

  try {
    const data = await s3.putObject(uploadParams);
    // If needed, you can access the uploaded object's details using data
    return data;
  } catch (error) {
    console.error("Error uploading file to S3:", error);
    throw error; // Rethrow the error or handle it as needed
  }
}

exports.uploadFile = uploadFile;
