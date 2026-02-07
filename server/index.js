const express = require('express');
const multer = require('multer');
const cors = require('cors');
const { spawn } = require('child_process');
const fs = require('fs');
const path = require('path'); // Required for handling file paths
const mongoose = require('mongoose');
require('dotenv').config();

const app = express(); // Defined first to avoid ReferenceError
app.use(cors());
app.use(express.json());

// 1. MongoDB Connection
mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log("MongoDB Connected: Logging Active"))
  .catch(err => console.error("Database connection failed:", err));

// 2. Logging Schema
const logSchema = new mongoose.Schema({
    fileName: String,
    status: String,
    timestamp: { type: Date, default: Date.now }
});
const RecoveryLog = mongoose.model('RecoveryLog', logSchema);

// 3. Multer Configuration
const upload = multer({ dest: 'uploads/' });

// 4. Create PDF Route
app.post('/api/create', async (req, res) => {
    const { password } = req.body;
    const fileName = `protected_${Date.now()}.pdf`;
    const filePath = path.join(__dirname, 'uploads', fileName);

    // Spawn Python to create the file
    const pythonProcess = spawn('python', ['create_pdf.py', filePath, password]);

    pythonProcess.stdout.on('data', (data) => {
        if (data.toString().includes("SUCCESS")) {
            res.json({ success: true, fileName });
        }
    });

    pythonProcess.stderr.on('data', (data) => {
        console.error(`Creation Error: ${data}`);
        res.status(500).json({ error: "Creation failed" });
    });
});

// 5. Recovery Route
app.post('/api/recover', upload.single('pdf'), async (req, res) => {
    if (!req.file) return res.status(400).send('No file uploaded.');

    const filePath = req.file.path;
    const pythonProcess = spawn('python', ['recover_pdf.py', filePath]);
    
    let responseSent = false;

    pythonProcess.stdout.on('data', async (data) => {
        const result = data.toString().trim();
        
        if (result.startsWith("SUCCESS") || result.startsWith("FAILURE")) {
            const isSuccess = result.startsWith("SUCCESS");
            const foundPassword = isSuccess ? result.split(":")[1] : null;

            try {
                const newLog = new RecoveryLog({
                    fileName: req.file.originalname,
                    status: isSuccess ? "Success" : "Failed"
                });
                await newLog.save();
            } catch (logError) {
                console.error("Failed to save log:", logError);
            }

            if (!responseSent) {
                responseSent = true;
                if (isSuccess) {
                    res.json({ success: true, password: foundPassword });
                } else {
                    res.status(404).json({ success: false, message: "Password not found" });
                }
                if (fs.existsSync(filePath)) fs.unlinkSync(filePath);
            }
        }
    });

    pythonProcess.stderr.on('data', (data) => {
        console.error(`Python Error: ${data}`);
        if (!responseSent) {
            responseSent = true;
            res.status(500).json({ error: "Internal processing error" });
            if (fs.existsSync(filePath)) fs.unlinkSync(filePath);
        }
    });
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));