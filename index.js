const express = require('express');
const cors = require('cors');
require('dotenv').config();
 
const multer = require('multer');
const fs = require('fs');
const path = require('path');
const app = express();
const port = process.env.SERVICE_PORT || 8080;
const bodyParser = require('body-parser');
const { uploadPdfToGCS } = require('./storage');
const { spokeitDigitalSignature } = require('./doc-gen');
const { uploadPdfToFirebaseStorage } = require('./firebase-storage');
const { getDocument, getAllDocuments, createDocument } = require('./firebase-firestore');
const { convertAudioToM4A } = require('./audio-convert');
 

app.use(bodyParser.urlencoded({ extended: true }));
app.use(cors());
app.use(express.json());
 
// app.use(express.json({ limit: '50mb' })); // Adjust the limit as needed
// app.use(express.urlencoded({ extended: true, limit: '50mb' })); // Adjust the limit as needed
// const upload = multer({ dest: 'uploads/' }); // Temporary upload directory

const outputDir = path.join(__dirname, 'converted-audio'); // Directory to save M4A files

 
app.get('/', (req, res) => {
  res.send('This server is for spokeit.');
});

app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).send('Something broke!');
});

app.post('/document-generation', async (req, res) => {
  const { name, signature, date } = req.body;

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
 
      // const firebaseStorageUrl = await uploadPdfToFirebaseStorage(pdfBuffer, fileName);
      // res.send(`Document generated and uploaded successfully to: ${firebaseStorageUrl}`);
 
      const gcsUrl = await uploadPdfToGCS(pdfBuffer, fileName);
      res.send(`Document generated and uploaded successfully to: ${gcsUrl}`);
  
 
  } catch (error) {
    console.error(error);
    res.status(500).send('Error generating or uploading document');
  }
});


app.get('/firestore', async (req, res) => {
  try {
    await createDocument('users', 'user1', { name: 'John Doe', email: 'john.doe@example.com' });
    res.status(200).send('Document created successfully'); // Send a success response with a 200 status code
  } catch (error) {
    console.error(error);
    res.status(500).send('Error generating or uploading document');
  }
});
app.get('/get-user/:userId', async (req, res) => {
  try {
    const userId = req.params.userId; // Get the userId from the URL parameter
    console.log(userId)
    const doc = await getDocument('users', userId); // Fetch the document

    if (doc) {
      console.log('User data:', doc);
      res.send(doc); // Send the user data as a response
    } else {
      res.status(404).send('User not found'); // Send a 404 response if the user is not found
    }
  } catch (error) {
    console.error('Error fetching user data:', error);
    res.status(500).send('Error fetching user data');
  }
});
app.get('/get-all-users', async (req, res) => {
  try {
    const usersData = await getAllDocuments('users');
    console.log('All users data:', usersData);
    res.json(usersData); // Send the usersData as JSON response
  } catch (error) {
    console.error('Error fetching all users data:', error);
    res.status(500).send('Error fetching all users data');
  }
});


//  app.post('/convert', upload.single('wavFile'), async (req, res) => {
//     if (!req.file) {
//         return res.status(400).send('No WAV file uploaded.');
//     }
// Create the output directory if it doesn't exist
// if (!fs.existsSync(outputDir)) {
//     fs.mkdirSync(outputDir);
// }

//     const wavFilePath = req.file.path;
//     const sampleRate = parseInt(req.body.sampleRate);
//     const channels = parseInt(req.body.channels);

//     try {
//         const originalFileName = path.parse(req.file.originalname).name; // Get original filename without extension
//         const outputFileName = `${originalFileName}.m4a`;
//         const outputFilePath = path.join(outputDir, outputFileName); // Save to the output directory

//         await convertAudioToM4A(wavFilePath, outputFilePath);

//         res.send(`M4A file saved successfully: ${outputFileName}`); // Send a success message

//         try {
//             await fs.promises.unlink(wavFilePath); // Delete the temporary WAV file
//         } catch (unlinkErr) {
//             console.error('Error deleting temporary WAV file:', unlinkErr);
//         }

//     } catch (error) {
//         console.error('Error processing WAV file:', error);
//         res.status(500).send('Error processing WAV file.');
//     }
// });
 

app.use((req, res, next) => {
  res.status(404).send('Not Found!');
});

app.listen(port, () => {
  console.log(`Server started on port ${port}`);
});