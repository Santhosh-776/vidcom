import { useEffect, useState, useRef } from "react";
import { useParams, useNavigate } from "react-router-dom";
import {
    CallingState,
    SpeakerLayout,
    StreamTheme,
    StreamVideoClient,
    useCallStateHooks,
    User,
    ToggleAudioPublishingButton,
    ToggleVideoPublishingButton,
    ScreenShareButton,
    StreamCall,
    StreamVideo,
} from "@stream-io/video-react-sdk";
import { useAuth } from "../context/AuthContext";
import { getStreamCredentials } from "../services/streamService";

import "@stream-io/video-react-sdk/dist/css/styles.css";

const CustomCallControls = () => {
    const navigate = useNavigate();

    const handleEndCall = () => {
        navigate("/");
    };

    return (
        <div className="fixed bottom-8 left-1/2 transform -translate-x-1/2 z-10">
            <div className="flex items-center gap-4 bg-black/30 backdrop-blur-lg px-6 py-4 rounded-full shadow-lg">
                <ToggleAudioPublishingButton />
                <ToggleVideoPublishingButton />
                <ScreenShareButton />
                <button
                    onClick={handleEndCall}
                    className="p-3 bg-red-600 text-white rounded-full hover:bg-red-700 transition-colors focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2"
                    aria-label="End call">
                    <svg
                        className="w-5 h-5"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor">
                        <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M6 18L18 6M6 6l12 12"
                        />
                    </svg>
                </button>
            </div>
        </div>
    );
};

const CallContent = ({ callId }: { callId: string }) => {
    const { useCallCallingState, useCameraState, useMicrophoneState } =
        useCallStateHooks();
    const callingState = useCallCallingState();
    const { camera, hasBrowserPermission: hasCameraPermission } =
        useCameraState();
    const { microphone, hasBrowserPermission: hasMicPermission } =
        useMicrophoneState();
    const [callInfo, _setCallInfo] = useState({ id: callId });
    const [copySuccess, setCopySuccess] = useState(false);

    useEffect(() => {
        const enableDevices = async () => {
            try {
                await camera.enable();
                await microphone.enable();
            } catch (err) {
                console.error("Error enabling devices:", err);
            }
        };

        enableDevices();
    }, [camera, microphone]);

    const copyCallLink = () => {
        const callLink = `${window.location.origin}/call/${callId}`;
        navigator.clipboard
            .writeText(callLink)
            .then(() => {
                setCopySuccess(true);
                setTimeout(() => setCopySuccess(false), 2000);
            })
            .catch((err) => {
                console.error("Failed to copy: ", err);
            });
    };

    if (callingState !== CallingState.JOINED) {
        return (
            <div className="flex flex-col items-center justify-center h-screen bg-gray-900">
                <div className="w-16 h-16 relative">
                    {" "}
                    // Cleanup on unmount
                    <div className="absolute inset-0 rounded-full border-t-2 border-b-2 border-blue-500 animate-spin"></div>
                    <div className="absolute inset-0 rounded-full border-l-2 border-r-2 border-purple-500 animate-spin animation-delay-500"></div>
                </div>
                <p className="text-white text-xl mt-6">Joining video call...</p>
                {!hasCameraPermission && (
                    <p className="text-yellow-300 text-sm mt-2">
                        Please allow camera access when prompted
                    </p>
                )}
                {!hasMicPermission && (
                    <p className="text-yellow-300 text-sm mt-2">
                        Please allow microphone access when prompted
                    </p>
                )}
            </div>
        );
    }

    return (
        <StreamTheme>
            <div className="relative h-screen bg-gradient-to-b from-gray-900 to-black">
                {/* Logo */}
                <div className="absolute top-4 left-4 z-10 flex items-center">
                    <span className="text-xl font-bold text-white bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-purple-500">
                        XiboTix
                    </span>
                </div>

                <div className="absolute top-4 right-4 z-10 bg-black/30 backdrop-blur-md rounded-full px-4 py-2 flex items-center">
                    <div className="flex items-center">
                        <span className="w-2 h-2 bg-green-500 rounded-full mr-2"></span>
                        <p className="text-white text-sm font-medium">
                            Call ID: {callInfo.id.substring(0, 8)}...
                        </p>
                    </div>
                </div>

                {/* Copy Link Button */}
                <div className="absolute top-4 left-1/2 transform -translate-x-1/2 z-10">
                    <button
                        onClick={copyCallLink}
                        className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-full flex items-center gap-2 transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2">
                        <svg
                            xmlns="http://www.w3.org/2000/svg"
                            className="h-5 w-5"
                            fill="none"
                            viewBox="0 0 24 24"
                            stroke="currentColor">
                            <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M8 5H6a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2v-1M8 5a2 2 0 002 2h2a2 2 0 002-2M8 5a2 2 0 012-2h2a2 2 0 012 2m0 0h2a2 2 0 012 2v3m2 4H10m0 0l3-3m-3 3l3 3"
                            />
                        </svg>
                        {copySuccess ? "Copied!" : "Copy Link"}
                    </button>
                </div>

                <div className="absolute inset-0">
                    <SpeakerLayout participantsBarPosition="bottom" />
                </div>

                <CustomCallControls />
            </div>
        </StreamTheme>
    );
};

export default function VideoCallPage() {
    const { callId } = useParams<{ callId: string }>();
    const [client, setClient] = useState<StreamVideoClient | null>(null);
    const [call, setCall] = useState<any | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const navigate = useNavigate();
    const clientRef = useRef<StreamVideoClient | null>(null);
    const { currentUser } = useAuth();

    useEffect(() => {
        if (!callId) {
            setError("Invalid call ID");
            setIsLoading(false);
            return;
        }

        if (!currentUser) {
            setError("You must be logged in to join a call");
            setIsLoading(false);
            return;
        }

        const initializeCall = async () => {
            try {
                const credentials = await getStreamCredentials();

                const user: User = {
                    id: credentials.streamUserId,
                    name: currentUser.email || "Anonymous User",
                    image: `https://getstream.io/random_svg/?id=${credentials.streamUserId}&name=${currentUser.email}`,
                };

                let streamClient: StreamVideoClient;

                try {
                    streamClient = new StreamVideoClient({
                        apiKey: credentials.apiKey,
                        user,
                        token: credentials.token,
                    });

                    setClient(streamClient);
                    clientRef.current = streamClient;

                    const callInstance = streamClient.call("default", callId);

                    await callInstance.join({ create: true });

                    setCall(callInstance);
                    setIsLoading(false);
                } catch (err: any) {
                    console.error("Error initializing client:", err);
                    setError(
                        `Failed to initialize video call client: ${
                            err.message || "Unknown error"
                        }`
                    );
                    setIsLoading(false);
                    return;
                }
            } catch (err: any) {
                console.error("Error in call setup:", err);
                setError(
                    `An unexpected error occurred: ${
                        err.message || "Unknown error"
                    }`
                );
                setIsLoading(false);
            }
        };

        initializeCall();

        return () => {
            if (clientRef.current) {
                try {
                    clientRef.current.disconnectUser();
                } catch (err) {
                    console.error("Error disconnecting user:", err);
                }
            }
        };
    }, [callId, currentUser]);

    if (isLoading) {
        return (
            <div className="flex flex-col items-center justify-center h-screen bg-gradient-to-b from-gray-900 to-black">
                <div className="w-16 h-16 relative">
                    <div className="absolute inset-0 rounded-full border-t-4 border-blue-500 animate-spin"></div>
                </div>
                <p className="text-white text-xl mt-6">
                    Initializing video call...
                </p>
                <p className="text-gray-400 mt-2">
                    This may take a few moments
                </p>
            </div>
        );
    }

    if (error) {
        return (
            <div className="flex flex-col items-center justify-center h-screen bg-gradient-to-b from-gray-900 to-black">
                <div className="bg-black/40 backdrop-blur-md p-8 rounded-xl max-w-md text-center">
                    <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-red-100 text-red-500 mb-4">
                        <svg
                            className="w-8 h-8"
                            fill="currentColor"
                            viewBox="0 0 20 20">
                            <path
                                fillRule="evenodd"
                                d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z"
                                clipRule="evenodd"
                            />
                        </svg>
                    </div>
                    <h2 className="text-2xl font-bold text-white mb-2">
                        Connection Error
                    </h2>
                    <p className="text-gray-300 mb-6">{error}</p>
                    <button
                        onClick={() => navigate("/")}
                        className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2">
                        Return to Dashboard
                    </button>
                </div>
            </div>
        );
    }

    if (!client || !call) {
        return null;
    }

    return (
        <StreamVideo client={client}>
            <StreamCall call={call}>
                <CallContent callId={callId!} />
            </StreamCall>
        </StreamVideo>
    );
}
