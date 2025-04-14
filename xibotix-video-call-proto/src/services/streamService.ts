import { auth } from "../utils/firebase";

const API_URL = "https://xibotix-server.onrender.com";

export interface StreamCredentials {
    token: string;
    streamUserId: string;
    apiKey: string;
}

export async function getStreamCredentials(): Promise<StreamCredentials> {
    try {
        const user = auth.currentUser;
        if (!user) {
            throw new Error("User must be logged in");
        }

        const idToken = await user.getIdToken(true); // Force token refresh
        const response = await fetch(`${API_URL}/token`, {
            method: "POST",
            headers: {
                "Authorization": `Bearer ${idToken}`,
                "Content-Type": "application/json"
            }
        });

        if (!response.ok) {
            const error = await response.json();
            throw new Error(error.error || "Failed to get Stream token");
        }

        return response.json();
    } catch (error: any) {
        console.error("Stream token error:", error);
        throw new Error(error.message || "Failed to get Stream token");
    }
} 