require("dotenv").config();
const express = require("express");
const cors = require("cors");
const { StreamChat } = require("stream-chat");
const admin = require("firebase-admin");

const { initializeApp, cert } = require("firebase-admin/app"); // Use this import for initializing Firebase

const app = express();

// Define serviceAccount using environment variables
const serviceAccount = {
    type: process.env.FIREBASE_TYPE,
    project_id: process.env.FIREBASE_PROJECT_ID,
    private_key_id: process.env.FIREBASE_PRIVATE_KEY_ID,
    private_key: process.env.FIREBASE_PRIVATE_KEY?.replace(/\\n/g, "\n"),
    client_email: process.env.FIREBASE_CLIENT_EMAIL,
    client_id: process.env.FIREBASE_CLIENT_ID,
    auth_uri: process.env.FIREBASE_AUTH_URI,
    token_uri: process.env.FIREBASE_TOKEN_URI,
    auth_provider_x509_cert_url:
        process.env.FIREBASE_AUTH_PROVIDER_X509_CERT_URL,
    client_x509_cert_url: process.env.FIREBASE_CLIENT_X509_CERT_URL,
};

// Initialize Firebase with environment variables (ensure this is called only once)
initializeApp({
    credential: cert(serviceAccount),
});

// Configure CORS
app.use(
    cors({
        origin: "http://localhost:5173", // Vite's default port
        methods: ["POST", "OPTIONS"],
        allowedHeaders: ["Content-Type", "Authorization"],
    })
);

app.use(express.json());

// Initialize StreamChat
const serverClient = StreamChat.getInstance(
    process.env.STREAM_API_KEY,
    process.env.STREAM_API_SECRET
);

// Authentication middleware
const authenticateToken = async (req, res, next) => {
    try {
        const authHeader = req.headers.authorization;
        if (!authHeader) {
            return res.status(401).json({ error: "No token provided" });
        }

        const token = authHeader.split(" ")[1];
        const decodedToken = await admin.auth().verifyIdToken(token);
        req.user = decodedToken;
        next();
    } catch (error) {
        console.error("Error verifying token:", error);
        res.status(401).json({ error: "Invalid token" });
    }
};

// Token generation route
app.post("/token", authenticateToken, async (req, res) => {
    try {
        const { uid, email } = req.user;
        const streamUserId = `firebase_${uid}`;

        const token = serverClient.createToken(streamUserId);

        res.json({
            token,
            streamUserId,
            apiKey: process.env.STREAM_API_KEY,
        });
    } catch (error) {
        console.error("Error generating token:", error);
        res.status(500).json({ error: "Failed to generate token" });
    }
});

// Start the server
const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
