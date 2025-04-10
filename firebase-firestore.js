const admin = require('./firebase-utils'); // Import the admin instance

const firestore = admin.firestore();

// Helper functions to interact with Firestore
 const getDocument = async (collectionName, documentId) => {
  try {
    const docSnapshot = await firestore.collection(collectionName).doc(documentId).get();
    return docSnapshot.exists ? docSnapshot.data() : null;
  } catch (error) {
    console.error(`Error fetching document ${collectionName}/${documentId}:`, error);
    throw error;
  }
};

const createDocument = async (collectionName, documentId, data) => {
  try {
    const documentRef = firestore.collection(collectionName).doc(documentId);
    await documentRef.set(data);
    console.log('Document created successfully');
  } catch (error) {
    console.error('Error creating document:', error);
    throw error;
  }
};

const getAllDocuments = async (collectionName) => {
  try {
    const collectionRef = firestore.collection(collectionName);
    const collectionSnapshot = await collectionRef.get();
    return collectionSnapshot.docs.map(doc => doc.data());
  } catch (error) {
    console.error('Error getting all documents:', error);
    throw error;
  }
};

const sendDocument = async (email, fileUrl) => {
  try {
    await firestore.collection('mail').add({
      to: email,
      message: {
        subject: 'Thank you for registering with SpokeIt',
        html: `<div style="font-family: Arial, sans-serif; line-height: 1.6; color: #333;">
  <h2 style="color:rgb(0, 0, 0);">Welcome to SpokeIt!</h2>
  <p>Hi there,</p>
  <p>Thank you for registering with <strong>SpokeIt</strong>, our speech therapy app designed to make learning fun and engaging for kids.</p>
  <p>As part of our onboarding process, we&apos;re sharing your signed consent form for your records. You can download it using the link below:</p>
  <p><a href="${fileUrl}" target="_blank" style="color: #007bff;">Download Consent Form (PDF)</a></p>
  <p>If you have any questions or need help, feel free to reply to this email.</p>
  <p>We&apos;re excited to have you on board!</p>
  <p>Warm regards,<br>The SpokeIt Team</p>
  <hr style="margin-top: 20px; border: none; border-top: 1px solid #ccc;">
  <small style="color: #888;">This email was sent automatically. If you believe you received it in error, please contact our support team.</small>
</div>`,
        text: `Hi there,

Thank you for registering with SpokeIt, our speech therapy app designed to make learning fun and engaging for kids.

As part of our onboarding process, we're sharing your signed consent form for your records. You can download it here: ${fileUrl}

If you have any questions or need help, feel free to reply to this email.

We're excited to have you on board!

Warm regards,
The SpokeIt Team

This email was sent automatically. If you believe you received it in error, please contact our support team.`
      }
    })
  } catch (error) {
    console.log(error)
    throw error;
  }
}

module.exports = {
  getDocument,
  createDocument,getAllDocuments,
  sendDocument
};