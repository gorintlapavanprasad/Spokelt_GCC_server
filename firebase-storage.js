const admin = require('./firebase-utils'); // Import the admin instance

const bucket = admin.storage().bucket();

async function uploadPdfToFirebaseStorage(pdfBuffer, fileName) {
  try {
    const file = bucket.file(fileName);
    await file.save(pdfBuffer, {
      metadata: {
        contentType: 'application/pdf',
      },
    });
    console.log(`PDF uploaded to Firebase Storage: ${fileName}`);
    // Get the download URL for the uploaded file
    const [url] = await file.getSignedUrl({
      action: 'read',
      expires: '03-09-2491', // Set an appropriate expiration date
    });
    return url;
  } catch (error) {
    console.error('Error uploading PDF to Firebase Storage:', error);
    throw error;
  }
}

module.exports = {
  uploadPdfToFirebaseStorage,
};