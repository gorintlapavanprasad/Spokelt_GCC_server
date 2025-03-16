const admin = require('./firebase-utils'); // Import the admin instance

const bucket = admin.storage().bucket();
const CONSENT_FORM_FOLDER = 'PlayerConsentForms'; // Define the folder as a constant

async function uploadPdfToFirebaseStorage(pdfBuffer, fileName) {
  try {
    // Construct the file path using the constant folder name
    const filePath = `${CONSENT_FORM_FOLDER}/${fileName}`;
    const file = bucket.file(filePath);

    await file.save(pdfBuffer, {
      metadata: {
        contentType: 'application/pdf',
      },
    });
    console.log(`PDF uploaded to Firebase Storage: ${filePath}`);

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