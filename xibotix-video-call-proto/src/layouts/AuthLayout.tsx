import { Outlet } from "react-router-dom";

export default function AuthLayout() {
    return (
        <div className="min-h-screen bg-gradient-to-br from-blue-600 to-purple-700 flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
            <div className="max-w-md w-full space-y-8">
                <div className="text-center">
                    <h1 className="text-4xl font-extrabold text-white tracking-tight">
                        Xibotix
                    </h1>
                    <p className="mt-2 text-white/80 text-lg">
                        Secure Video Conferencing
                    </p>
                </div>
                <div className="mt-8 bg-white py-8 px-6 shadow-xl rounded-xl backdrop-blur-sm bg-white/90 border border-white/10">
                    <Outlet />
                </div>
            </div>
        </div>
    );
}
