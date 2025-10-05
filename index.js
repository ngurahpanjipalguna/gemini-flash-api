import express from "express";
import cors from "cors";
import bodyParser from "body-parser";
import { GoogleGenAI } from "@google/genai";
import dotenv from "dotenv";
import multer from "multer";
import path from "path";

// Load environment variables
dotenv.config();

const app = express();
app.use(cors());
app.use(bodyParser.json());

// Configure multer for file uploads
const storage = multer.memoryStorage(); // Simpan file di memory
const upload = multer({
  storage: storage,
  fileFilter: (req, file, cb) => {
    const allowedMimes = [
      // Image formats
      'image/jpeg',
      'image/jpg', 
      'image/png',
      'image/gif',
      'image/webp',
      'image/heic',
      'image/heif',
      
      // Audio formats
      'audio/mpeg',
      'audio/mp3',
      'audio/wav',
      'audio/ogg',
      'audio/flac',
      'audio/aac',
      
      // Document formats - TAMBAHAN BARU
      'application/pdf',
      'application/msword',
      'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
      'application/vnd.ms-excel',
      'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
      'application/vnd.ms-powerpoint',
      'application/vnd.openxmlformats-officedocument.presentationml.presentation',
      'text/plain',
      'text/csv',
      
      // Playlist formats
      'audio/x-mpegurl', // M3U
      'application/mpegurl', // M3U8
      'application/vnd.apple.mpegurl', // M3U8
    ];
    
    if (allowedMimes.includes(file.mimetype)) {
      cb(null, true);
    } else {
      cb(new Error(`Format file tidak didukung. Gunakan format: gambar, audio, dokumen (PDF, DOC, DOCX, XLS, XLSX, PPT, PPTX, TXT, CSV), atau playlist M3U`), false);
    }
  },
  limits: {
    fileSize: 50 * 1024 * 1024, // Maksimal 50MB untuk dokumen
  }
});

const PORT = 3000;
const API_KEY = process.env.GEMINI_API_KEY;
const GEMINI_MODEL = "gemini-2.5-flash";

if (!API_KEY) {
    console.error("ERROR: GEMINI_API_KEY tidak ditemukan!");
    process.exit(1);
}

const ai = new GoogleGenAI({ apiKey: API_KEY });

function extractText(resp) {
  try {
    const text =
      resp?.response?.candidates?.[0]?.content?.parts?.[0]?.text ??
      resp?.candidates?.[0]?.content?.parts?.[0]?.text ??
      resp?.response?.candidates?.[0]?.content?.text;

    return text ?? JSON.stringify(resp, null, 2);
  } catch (err) {
    console.error("Error extracting text:", err);
    return JSON.stringify(resp, null, 2);
  }
}

// 1. Generate Text dari prompt teks
app.post('/generate-text', async (req, res) => {
    try {
        const { prompt } = req.body;
        
        if (!prompt) {
            return res.status(400).json({ error: "Prompt is required" });
        }

        const resp = await ai.models.generateContent({
            model: GEMINI_MODEL,
            contents: [{ parts: [{ text: prompt }] }]
        });
        
        res.json({ result: extractText(resp) });
    } catch (err) {
        console.error("API Error:", err);
        res.status(500).json({ error: err.message });
    }
});

// 2. Generate From Image
app.post('/generate-from-image', upload.single('image'), async (req, res) => {
    try {
        const { prompt } = req.body;
        const imageBase64 = req.file.buffer.toString('base64');
        
        const resp = await ai.models.generateContent({
            model: GEMINI_MODEL,
            contents: [
                {
                    parts: [
                        { text: prompt },
                        {
                            inlineData: {
                                mimeType: req.file.mimetype,
                                data: imageBase64
                            }
                        }
                    ]
                }
            ]
        });
        
        res.json({ result: extractText(resp) });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// 3. Generate From Audio
app.post('/generate-from-audio', upload.single('audio'), async (req, res) => {
    try {
        const { prompt } = req.body;
        const audioBase64 = req.file.buffer.toString('base64');
        const resp = await ai.models.generateContent({
            model: GEMINI_MODEL,
            contents: [
                {
                    text: prompt || "Transkrip audio berikut:"
                },
                {
                    inlineData: { mimeType: req.file.mimetype, data: audioBase64 }
                }
            ]
        });
        res.json({ result: extractText(resp) });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// 4. Generate From Document
app.post('/generate-from-document', upload.single('document'), async (req, res) => {
    try {
        const { prompt } = req.body;
        const docBase64 = req.file.buffer.toString('base64');
        const resp = await ai.models.generateContent({
            model: GEMINI_MODEL,
            contents: [
                { text: prompt || "Ringkas dokumen berikut:" },
                { inlineData: { mimeType: req.file.mimetype, data: docBase64 } }
            ]
        });
        res.json({ result: extractText(resp) });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// Jalankan server
app.listen(PORT, () => {
    console.log(`Server berjalan di http://localhost:${PORT}`);
    console.log(`Menggunakan model: ${GEMINI_MODEL}`);
});