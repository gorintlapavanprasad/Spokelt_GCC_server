const express = require('express');
const cors = require('cors');
require('dotenv').config();
 
const multer = require('multer');
 
const path = require('path');
const app = express();
const port = process.env.SERVICE_PORT || 8080;
const bodyParser = require('body-parser');
const { uploadPdfToGCS } = require('./storage');
const { spokeitDigitalSignature } = require('./doc-gen');
const { uploadPdfToFirebaseStorage } = require('./firebase-storage');
const { getDocument, getAllDocuments, createDocument, sendDocument } = require('./firebase-firestore');
const { convertAudioToM4A } = require('./audio-convert');
 

app.use(bodyParser.urlencoded({ extended: true }));
app.use(cors());
app.use(express.json());
 
 
app.get('/', (req, res) => {
  res.send('This server is for spokeit.');
});

app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).send('Something broke!');
});

app.post('/document-generation', async (req, res) => {
  const { name, email, signature, date,storage_folder } = req.body;

  if (!name || !date) {
    return res.status(400).send('Please provide all required fields');
  }

  try {
    const pdfBuffer = await spokeitDigitalSignature({
      user: {
        Name: name,
        Date: date,
      },
      photograph: signature,
    });

    const fileName = `${name}-${(new Date().getMonth() + 1).toString().padStart(2, '0')}-${new Date().getFullYear()}.pdf`;
 
      const firebaseStorageUrl = await uploadPdfToFirebaseStorage(pdfBuffer, fileName, storage_folder);
      await sendDocument(email, firebaseStorageUrl);
      res.status(200).json({
        message: "Document generated and uploaded successfully.",
        signedUrl: firebaseStorageUrl 
      });

      // email pdfBuffer to user
 
      // const gcsUrl = await uploadPdfToGCS(pdfBuffer, fileName);
      // res.send(`Document generated and uploaded successfully to: ${gcsUrl}`);

  
 
  } catch (error) {
    console.error(error);
    res.status(500).send('Error generating or uploading document');
  }
});


 

 

app.use((req, res, next) => {
  res.status(404).send('Not Found!');
});

app.listen(port, () => {
  console.log(`Server started on port ${port}`);
});

