require('dotenv').config();

const { S3Client, PutObjectCommand } = require('@aws-sdk/client-s3');

const bucketName = process.env.AWS_BUCKET_NAME;
const region = process.env.AWS_BUCKET_REGION;
const accessKeyId = process.env.AWS_ACCESS_KEY;
const secretAccessKey = process.env.AWS_SECRET_KEY;

const s3 = new S3Client({
  region,
  credentials: {
    accessKeyId,
    secretAccessKey,
  },
});

// uploads a file to s3
async function uploadFile(file) {
  const uploadParams = {
    Bucket: bucketName,
    Body: file.buffer,
    Key: file.originalname,
  };

  const command = new PutObjectCommand(uploadParams);

  try {
    const response = await s3.send(command);
    return response;
  } catch (error) {
    throw error;
  }
}

exports.uploadFile = uploadFile;
