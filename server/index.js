const express = require('express');
const multer = require('multer');
const cors = require('cors');
const { spawn } = require('child_process');
const path = require('path');
const fs = require('fs');

const app = express();
app.use(cors());
app.use(express.json());

// Setup Multer for PDF uploads
const upload = multer({ dest: 'uploads/' });

app.post('/api/recover', upload.single('pdf'), (req, res) => {
    if (!req.file) return res.status(400).send('No file uploaded.');

    const filePath = req.file.path;

    // Call a Python helper script to handle the pikepdf logic
    const pythonProcess = spawn('python', ['recover_pdf.py', filePath]);

    pythonProcess.stdout.on('data', (data) => {
        const result = data.toString().trim();
        if (result.startsWith("SUCCESS")) {
            const password = result.split(":")[1];
            res.json({ success: true, password });
            // Clean up file after processing
            fs.unlinkSync(filePath);
        }
    });

    pythonProcess.stderr.on('data', (data) => {
        console.error(`Error: ${data}`);
        if (!res.headersSent) res.status(500).json({ error: "Processing failed" });
    });
});

app.listen(5000, () => console.log('Server running on port 5000'));