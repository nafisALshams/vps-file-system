export const config = {
    port: Number(process.env.PORT) || 3000,
    uploadDir: process.env.UPLOAD_DIR || 'uploads',
    // Restrict to only .mp4 and .wav as requested
    // Include common WAV mime variants seen on Windows/Postman
    allowedMimeTypes: ['video/mp4', 'audio/wav', 'audio/x-wav', 'audio/wave', 'audio/vnd.wave', 'audio/x-pn-wav'],
};
