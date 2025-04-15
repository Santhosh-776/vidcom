import { useEffect, useState } from "react";
import {
    useCallStateHooks,
    ParticipantView,
    useCall,
    StreamVideoParticipant,
} from "@stream-io/video-react-sdk";

export const CustomVideoLayout = () => {
    const { useParticipants, useLocalParticipant } = useCallStateHooks();
    const call = useCall();
    const localParticipant = useLocalParticipant();
    const participants = useParticipants();

    const [focusedParticipant, setFocusedParticipant] = useState<string | null>(
        null
    );
    const [isMobile, setIsMobile] = useState(window.innerWidth <= 768);

    useEffect(() => {
        const handleResize = () => {
            setIsMobile(window.innerWidth <= 768);
        };

        window.addEventListener("resize", handleResize);
        return () => window.removeEventListener("resize", handleResize);
    }, []);

    useEffect(() => {
        if (!focusedParticipant && participants.length > 0) {
            const remoteParticipant = participants.find(
                (p) => !p.isLocalParticipant
            );
            if (remoteParticipant) {
                setFocusedParticipant(remoteParticipant.sessionId);
            } else {
                setFocusedParticipant(localParticipant?.sessionId || null);
            }
        }
    }, [participants, focusedParticipant, localParticipant]);

    if (!call || !participants.length) return null;

    useEffect(() => {
        if (call) {
            call.setSortParticipantsBy(
                (a: StreamVideoParticipant, b: StreamVideoParticipant) => {
                    if (a.sessionId === focusedParticipant) return -1;
                    if (b.sessionId === focusedParticipant) return 1;

                    return 0;
                }
            );
        }
    }, [call, focusedParticipant]);

    const mainParticipant =
        participants.find((p) => p.sessionId === focusedParticipant) ||
        participants[0];

    const otherParticipants = participants.filter(
        (p) => p.sessionId !== focusedParticipant
    );

    const handleParticipantClick = (sessionId: string) => {
        setFocusedParticipant(sessionId);
    };

    return (
        <div className="video-participant-container">
            {mainParticipant && (
                <div className="w-full h-full relative">
                    <ParticipantView
                        participant={mainParticipant}
                        mirror={mainParticipant.isLocalParticipant}
                    />

                    {otherParticipants.length > 0 && (
                        <div className="absolute top-4 right-4 z-20">
                            <button
                                className="bg-black/60 hover:bg-black/80 text-white rounded-full p-2 flex items-center justify-center transition-all"
                                onClick={() => {
                                    if (otherParticipants.length > 0) {
                                        setFocusedParticipant(
                                            otherParticipants[0].sessionId
                                        );
                                    }
                                }}>
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
                                        d="M8 7h12m0 0l-4-4m4 4l-4 4m0 6H4m0 0l4 4m-4-4l4-4"
                                    />
                                </svg>
                            </button>
                        </div>
                    )}
                </div>
            )}

            <div
                className={
                    isMobile
                        ? "fixed bottom-36 left-0 right-0 flex justify-center gap-2 overflow-x-auto px-4 z-20"
                        : "flex flex-row absolute bottom-32 right-4 z-10 gap-2"
                }>
                {otherParticipants.map((participant) => (
                    <div
                        key={participant.sessionId}
                        className="bg-black/30 rounded-lg overflow-hidden relative shadow-lg"
                        onClick={() =>
                            handleParticipantClick(participant.sessionId)
                        }
                        style={{
                            width: isMobile ? "90px" : "240px",
                            height: isMobile ? "120px" : "180px",
                            flexShrink: 0,
                        }}>
                        <ParticipantView
                            participant={participant}
                            mirror={participant.isLocalParticipant}
                        />
                        <div className="absolute bottom-0 left-0 right-0 bg-black/60 p-1 text-center">
                            <span className="text-white text-xs">
                                Tap to swap
                            </span>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};
