const { Storage } = require('@google-cloud/storage');
const path = require('path');
const fs = require('fs');
require('dotenv').config();

// Replace with your bucket name and service account key file path
const bucketName = 'signature_pdf'; // Make sure this matches your actual bucket name
const keyFilename = JSON.parse(process.env.CLOUD_STORAGE);
const storage = new Storage({ credentials: keyFilename });

// Initialize the Storage client
 
const bucket = storage.bucket(bucketName);

async function uploadPdfToGCS(pdfBuffer, fileName) {
  try {
    const file = bucket.file(fileName);

    await file.save(pdfBuffer, {
      metadata: {
        contentType: 'application/pdf',
      },
    });

    console.log(`PDF uploaded to gs://${bucketName}/${fileName}`);
    return `gs://${bucketName}/${fileName}`; // Return the GCS URL
  } catch (error) {
    console.error('Error uploading PDF to GCS:', error);
    throw error;
  }
}

// Example usage with a buffer
async function uploadBufferExample(pdfBuffer) {
  const fileName = `example-${Date.now()}.pdf`;
  try {
    const storageUrl = await uploadPdfToGCS(pdfBuffer, fileName);
    // console.log(`File available at: ${storageUrl}`);
    return storageUrl;
  } catch (error) {
    console.error('Upload failed:', error);
    throw error;
  }
}

// Example Usage with a local file.
async function uploadLocalFileExample(localFilePath, fileName) {
  try {
    const pdfBuffer = fs.readFileSync(localFilePath);
    const storageUrl = await uploadPdfToGCS(pdfBuffer, fileName);
    console.log(`File available at: ${storageUrl}`);
    return storageUrl;
  } catch (error) {
    console.error('Upload failed:', error);
    throw error;
  }
}

// Example usage with a stream
async function uploadPdfStreamToGCS(pdfStream, fileName) {
  try {
    const file = bucket.file(fileName);
    const uploadStream = file.createWriteStream({
      metadata: {
        contentType: 'application/pdf',
      },
    });

    pdfStream.pipe(uploadStream);

    await new Promise((resolve, reject) => {
      uploadStream.on('finish', resolve);
      uploadStream.on('error', reject);
    });

    console.log(`PDF uploaded to gs://${bucketName}/${fileName}`);
    return `gs://${bucketName}/${fileName}`;
  } catch (error) {
    console.error('Error uploading PDF to GCS:', error);
    throw error;
  }
}

//Example of how to use the function with the spokeitDigitalSignature function.
//... your other code...
// app.post('/document-generation', async (req, res) => {
//     //... your code...
//     try{
//         const pdfBuffer = await spokeitDigitalSignature(data);
//         const fileName = `merge-${Date.now()}.pdf`;
//         const url = await uploadPdfToGCS(pdfBuffer, fileName);
//         res.send(`Document uploaded successfully to google cloud storage with url: ${url}`);
//     } catch (error) {
//         //... error handling...
//     }

// });

module.exports = {
  uploadPdfToGCS,
  uploadBufferExample,
  uploadLocalFileExample,
  uploadPdfStreamToGCS,
};