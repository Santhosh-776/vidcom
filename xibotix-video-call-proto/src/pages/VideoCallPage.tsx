import { useEffect, useState, useRef } from "react";
import { useParams, useNavigate } from "react-router-dom";
import {
    CallingState,
    StreamTheme,
    StreamVideoClient,
    useCallStateHooks,
    User,
    ToggleAudioPublishingButton,
    ToggleVideoPublishingButton,
    ScreenShareButton,
    StreamCall,
    StreamVideo,
    useCall,
} from "@stream-io/video-react-sdk";
import { useAuth } from "../context/AuthContext";
import { getStreamCredentials } from "../services/streamService";
import { CustomVideoLayout } from "../components/CustomVideoLayout";

import "@stream-io/video-react-sdk/dist/css/styles.css";

const CustomCallControls = () => {
    const navigate = useNavigate();
    const [isRecording, setIsRecording] = useState(false);
    const call = useCall();

    const handleEndCall = () => {
        navigate("/");
    };

    const toggleRecording = async () => {
        try {
            if (isRecording) {
                await call?.stopRecording();
            } else {
                await call?.startRecording();
            }
            setIsRecording(!isRecording);
        } catch (error) {
            console.error("Error toggling recording:", error);
        }
    };

    return (
        <div className="fixed bottom-20 sm:bottom-8 left-0 right-0 flex justify-center z-50">
            <div className="flex items-center justify-between max-w-md w-full gap-3 md:gap-5 bg-black/80 backdrop-blur-lg px-4 py-3 rounded-xl shadow-xl">
                <div className="flex-1 flex justify-center">
                    <ToggleAudioPublishingButton />
                </div>
                <div className="flex-1 flex justify-center">
                    <ToggleVideoPublishingButton />
                </div>
                <div className="flex-1 flex justify-center">
                    <ScreenShareButton />
                </div>
                <div className="flex-1 flex justify-center">
                    <button
                        onClick={toggleRecording}
                        className={`flex items-center justify-center w-11 h-11 rounded-full transition-all focus:outline-none ${
                            isRecording
                                ? "bg-red-500 text-white animate-pulse"
                                : "bg-white/10 text-white hover:bg-white/20"
                        }`}
                        aria-label={
                            isRecording ? "Stop recording" : "Start recording"
                        }>
                        <svg
                            xmlns="http://www.w3.org/2000/svg"
                            className="w-5 h-5"
                            fill="none"
                            viewBox="0 0 24 24"
                            stroke="currentColor">
                            <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z"
                            />
                        </svg>
                    </button>
                </div>
                <div className="flex-1 flex justify-center">
                    <button
                        onClick={handleEndCall}
                        className="flex items-center justify-center w-11 h-11 bg-red-600 text-white rounded-full hover:bg-red-700 transition-all focus:outline-none"
                        aria-label="End call">
                        <svg
                            xmlns="http://www.w3.org/2000/svg"
                            className="w-5 h-5"
                            fill="none"
                            viewBox="0 0 24 24"
                            stroke="currentColor">
                            <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"
                            />
                        </svg>
                    </button>
                </div>
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
    const [shareMenuOpen, setShareMenuOpen] = useState(false);

    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            const target = event.target as HTMLElement;
            if (!target.closest(".share-menu-container") && shareMenuOpen) {
                setShareMenuOpen(false);
            }
        };

        document.addEventListener("mousedown", handleClickOutside);
        return () => {
            document.removeEventListener("mousedown", handleClickOutside);
        };
    }, [shareMenuOpen]);

    useEffect(() => {
        const enableDevices = async () => {
            try {
                console.log("Enabling camera and microphone...");
                if (hasCameraPermission) {
                    await camera.enable();
                    console.log("Camera enabled successfully");
                }
                if (hasMicPermission) {
                    await microphone.enable();
                    console.log("Microphone enabled successfully");
                }
            } catch (err) {
                console.error("Error enabling devices:", err);
            }
        };

        enableDevices();
    }, [camera, microphone, hasCameraPermission, hasMicPermission]);

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
                {/* Enhanced Logo */}
                <div className="absolute top-4 left-4 z-40 flex flex-col bg-black/40 backdrop-blur-md px-4 py-2 rounded-lg shadow-lg border border-white/10 mobile-header">
                    <div className="flex items-center">
                        <span className="text-xl font-bold text-white bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-purple-500">
                            XiboTix
                        </span>
                        <span className="ml-2 px-2 py-0.5 text-xs font-semibold bg-white/10 rounded text-white">
                            LIVE
                        </span>
                    </div>
                    <div className="mt-2 w-full share-menu-container relative">
                        <button
                            onClick={() => setShareMenuOpen(!shareMenuOpen)}
                            className="w-full flex items-center justify-center gap-2 bg-black/60 hover:bg-black/80 backdrop-blur-md rounded-lg shadow-lg py-1.5 px-3 text-white text-sm transition-all">
                            <svg
                                xmlns="http://www.w3.org/2000/svg"
                                className="h-4 w-4"
                                fill="none"
                                viewBox="0 0 24 24"
                                stroke="currentColor">
                                <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth={1.5}
                                    d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.368 2.684 3 3 0 00-5.368-2.684z"
                                />
                            </svg>
                            <span className="mr-1">Share</span>
                            <svg
                                xmlns="http://www.w3.org/2000/svg"
                                className={`h-3 w-3 transition-transform duration-200 ${
                                    shareMenuOpen ? "rotate-180" : ""
                                }`}
                                fill="none"
                                viewBox="0 0 24 24"
                                stroke="currentColor">
                                <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth={2}
                                    d="M19 9l-7 7-7-7"
                                />
                            </svg>
                        </button>
                        <div
                            className={`absolute left-0 top-full mt-2 bg-black/80 backdrop-blur-md rounded-lg shadow-lg border border-white/10 p-2 w-52 transition-all z-50 ${
                                shareMenuOpen
                                    ? "opacity-100 scale-100"
                                    : "opacity-0 scale-95 pointer-events-none"
                            }`}>
                            <div className="flex flex-col gap-2">
                                <button
                                    onClick={() => {
                                        const url = `${window.location.origin}/call/${callId}`;
                                        const message = `Join my XiboTix video meeting: ${url}`;
                                        if (navigator.share) {
                                            navigator
                                                .share({
                                                    title: "XiboTix Video Meeting",
                                                    text: message,
                                                    url: url,
                                                })
                                                .catch((err) => {
                                                    console.error(
                                                        "Error sharing:",
                                                        err
                                                    );
                                                    navigator.clipboard.writeText(
                                                        message
                                                    );
                                                    alert(
                                                        "Invite link copied to clipboard!"
                                                    );
                                                });
                                        } else {
                                            navigator.clipboard.writeText(
                                                message
                                            );
                                            alert(
                                                "Invite link copied to clipboard!"
                                            );
                                        }
                                    }}
                                    className="flex items-center gap-2 text-white text-sm hover:bg-white/10 p-2 rounded transition-colors w-full text-left">
                                    <svg
                                        xmlns="http://www.w3.org/2000/svg"
                                        className="h-4 w-4"
                                        fill="none"
                                        viewBox="0 0 24 24"
                                        stroke="currentColor">
                                        <path
                                            strokeLinecap="round"
                                            strokeLinejoin="round"
                                            strokeWidth={1.5}
                                            d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z"
                                        />
                                    </svg>
                                    Share Invite Link
                                </button>
                                <button
                                    onClick={() => {
                                        navigator.clipboard.writeText(
                                            callInfo.id
                                        );
                                        alert("Call ID copied to clipboard!");
                                    }}
                                    className="flex items-center gap-2 text-white text-sm hover:bg-white/10 p-2 rounded transition-colors w-full text-left">
                                    <svg
                                        xmlns="http://www.w3.org/2000/svg"
                                        className="h-4 w-4"
                                        fill="none"
                                        viewBox="0 0 24 24"
                                        stroke="currentColor">
                                        <path
                                            strokeLinecap="round"
                                            strokeLinejoin="round"
                                            strokeWidth={1.5}
                                            d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"
                                        />
                                    </svg>
                                    Copy Call ID
                                </button>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Enhanced Call ID display */}
                <div className="absolute top-4 right-4 z-40 bg-black/50 backdrop-blur-md rounded-lg px-5 py-3 flex items-center shadow-lg border border-white/10 mobile-header">
                    <div className="flex items-center">
                        <div className="flex-shrink-0 h-3 w-3 bg-green-500 rounded-full animate-pulse mr-3"></div>
                        <div>
                            <p className="text-white text-xs font-medium uppercase tracking-wider mb-0.5 opacity-80">
                                Active Session
                            </p>
                            <p className="text-white text-sm font-bold tracking-wide">
                                {callInfo.id.substring(0, 12)}
                                <span className="text-white/50">...</span>
                            </p>
                        </div>
                    </div>
                </div>

                {/* Main video content - higher z-index to ensure it's above other elements */}
                <div className="absolute inset-0 z-5">
                    <CustomVideoLayout />
                </div>

                {/* Call Controls - highest z-index */}
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

                    try {
                        await callInstance.get();
                        console.log("Call exists, joining...");
                    } catch (err) {
                        console.log("Call doesn't exist, creating...");
                        await callInstance.getOrCreate();
                    }

                    await callInstance.join({ create: true });
                    console.log("Successfully joined call:", callId);

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
