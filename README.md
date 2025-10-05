# Gemini AI Server

A comprehensive Express.js server for interacting with Google Gemini AI with multi-modal capabilities including text, image, audio, and document processing.

## Features

- **Text Generation**: Generate text responses from prompts
- **Image Analysis**: Process and analyze images with AI
- **Audio Transcription**: Transcribe audio files to text
- **Document Processing**: Extract and summarize content from various document formats
- **CORS Enabled**: Ready for cross-origin requests
- **File Upload Support**: Handle multiple file types with size limits

## Supported File Formats

### Images
- JPEG, JPG, PNG, GIF, WebP, HEIC, HEIF

### Audio
- MP3, WAV, OGG, FLAC, AAC

### Documents
- PDF, DOC, DOCX, XLS, XLSX, PPT, PPTX, TXT, CSV

### Playlists
- M3U, M3U8

## Installation

1. Clone the repository:
```bash
git clone <your-repo-url>
cd <project-directory>
```

2. Install dependencies:
```bash
npm install
```

3. Create a `.env` file and add your Gemini API key:
```env
GEMINI_API_KEY=your_api_key_here
```

4. Start the server:
```bash
npm start
```

The server will run on `http://localhost:3000`

## API Endpoints

### 1. Generate Text
**POST** `/generate-text`

Generate text from a prompt.

**Body:**
```json
{
  "prompt": "Your text prompt here"
}
```

**Response:**
```json
{
  "result": "Generated text response"
}
```

### 2. Generate From Image
**POST** `/generate-from-image`

Process and analyze images.

**Body:** (multipart/form-data)
- `image`: Image file
- `prompt`: Optional text prompt

### 3. Generate From Audio
**POST** `/generate-from-audio`

Transcribe and process audio files.

**Body:** (multipart/form-data)
- `audio`: Audio file
- `prompt`: Optional text prompt

### 4. Generate From Document
**POST** `/generate-from-document`

Process and summarize documents.

**Body:** (multipart/form-data)
- `document`: Document file
- `prompt`: Optional text prompt

## Configuration

- **Port**: 3000
- **Model**: gemini-2.5-flash
- **Max File Size**: 50MB
- **CORS**: Enabled

## Environment Variables

- `GEMINI_API_KEY`: Your Google Gemini API key (required)

## Error Handling

The server includes comprehensive error handling for:
- Missing API keys
- Invalid file formats
- File size limits
- API errors
- Missing required fields

## Example Usage

### Using curl for text generation:
```bash
curl -X POST http://localhost:3000/generate-text \
  -H "Content-Type: application/json" \
  -d '{"prompt": "Explain quantum computing in simple terms"}'
```

### Using curl for image analysis:
```bash
curl -X POST http://localhost:3000/generate-from-image \
  -F "image=@/path/to/your/image.jpg" \
  -F "prompt=Describe what you see in this image"
```

## Dependencies

- express: Web server framework
- cors: Cross-origin resource sharing
- body-parser: Request body parsing
- @google/genai: Google Gemini AI SDK
- dotenv: Environment variable management
- multer: File upload handling

## Development

The server uses:
- Express.js for the web framework
- Multer for file upload handling
- Google Gemini AI for AI capabilities
- CORS for cross-origin requests

## License

MIT