import React from "react";
import { useState } from "react";
import { useNavigate } from "react-router-dom";

export default function DashboardPage() {
    const [callId, setCallId] = useState("");
    const [error, setError] = useState("");
    const navigate = useNavigate();

    const handleCreateCall = () => {
        const randomId = Math.random().toString(36).substring(2, 15);
        navigate(`/call/${randomId}`);
    };

    const handleJoinCall = (e: React.FormEvent) => {
        e.preventDefault();
        if (!callId.trim()) {
            setError("Please enter a call ID");
            return;
        }
        navigate(`/call/${callId}`);
    };

    return (
        <div>
            <header className="mb-8">
                <h1 className="text-3xl font-bold text-gray-900">
                    Welcome to XiTalk
                </h1>
                <p className="mt-2 text-gray-600 max-w-3xl">
                    Connect with others through high-quality, secure video
                    calls. Create a new call or join an existing one.
                </p>
            </header>

            <div className="grid md:grid-cols-2 gap-6">
                {/* Create Call Card */}
                <div className="bg-white shadow-md rounded-lg overflow-hidden">
                    <div className="bg-gradient-to-r from-blue-500 to-purple-600 px-6 py-4">
                        <h2 className="text-xl font-bold text-white">
                            Start a New Call
                        </h2>
                        <p className="text-blue-100 text-sm">
                            Create a new video call and share the ID with others
                        </p>
                    </div>

                    <div className="p-6">
                        <p className="text-gray-600 mb-6">
                            Click the button below to create a new video call.
                            You'll get a unique ID that you can share with
                            others to join your call.
                        </p>
                        <button
                            onClick={handleCreateCall}
                            className="w-full inline-flex justify-center items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500">
                            <svg
                                className="mr-2 h-5 w-5"
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
                            Create New Call
                        </button>
                    </div>
                </div>

                {/* Join Call Card */}
                <div className="bg-white shadow-md rounded-lg overflow-hidden">
                    <div className="bg-gradient-to-r from-purple-600 to-indigo-600 px-6 py-4">
                        <h2 className="text-xl font-bold text-white">
                            Join a Call
                        </h2>
                        <p className="text-purple-100 text-sm">
                            Enter a call ID to join an existing video call
                        </p>
                    </div>

                    <div className="p-6">
                        <form onSubmit={handleJoinCall}>
                            {error && (
                                <div className="mb-4 text-sm text-red-600 bg-red-50 p-2 rounded border border-red-200">
                                    {error}
                                </div>
                            )}
                            <div className="mb-4">
                                <label
                                    htmlFor="callId"
                                    className="block text-sm font-medium text-gray-700 mb-1">
                                    Call ID
                                </label>
                                <input
                                    type="text"
                                    id="callId"
                                    value={callId}
                                    onChange={(e) => setCallId(e.target.value)}
                                    placeholder="Enter call ID"
                                    className="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                                    required
                                />
                            </div>
                            <button
                                type="submit"
                                className="w-full inline-flex justify-center items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-purple-500">
                                <svg
                                    className="mr-2 h-5 w-5"
                                    fill="none"
                                    viewBox="0 0 24 24"
                                    stroke="currentColor">
                                    <path
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        strokeWidth={2}
                                        d="M17 8l4 4m0 0l-4 4m4-4H3"
                                    />
                                </svg>
                                Join Call
                            </button>
                        </form>
                    </div>
                </div>
            </div>

            <div className="mt-8 bg-blue-50 border border-blue-200 rounded-lg p-6">
                <div className="flex">
                    <div className="flex-shrink-0">
                        <svg
                            className="h-6 w-6 text-blue-600"
                            fill="none"
                            viewBox="0 0 24 24"
                            stroke="currentColor">
                            <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                            />
                        </svg>
                    </div>
                    <div className="ml-3">
                        <h3 className="text-lg font-medium text-blue-800">
                            Need Help?
                        </h3>
                        <div className="mt-2 text-sm text-blue-700">
                            <p>
                                For technical support or to report issues with
                                your video calls, please contact our support
                                team at{" "}
                                <a
                                    href="mailto:support@xibotix.com"
                                    className="font-medium underline">
                                    support.com
                                </a>
                                .
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
