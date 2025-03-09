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

module.exports = {
  getDocument,
  createDocument,getAllDocuments
};