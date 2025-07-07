import { Link, Outlet, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

export default function DashboardLayout() {
    const navigate = useNavigate();
    const { logout, currentUser } = useAuth();

    const handleLogout = async () => {
        try {
            await logout();
            navigate("/login");
        } catch (error) {
            console.error("Failed to log out", error);
        }
    };

    return (
        <div className="min-h-screen bg-gray-50 flex flex-col">
            {/* Header */}
            <header className="bg-white border-b border-gray-200">
                <div className="mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex justify-between items-center h-16">
                        <div className="flex items-center">
                            <Link
                                to="/"
                                className="flex-shrink-0">
                                <span className="text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-purple-600">
                                    XiTalk
                                </span>
                            </Link>
                        </div>

                        <div className="flex items-center space-x-6">
                            <Link
                                to="/"
                                className="text-gray-600 hover:text-blue-600 transition-colors font-medium">
                                Dashboard
                            </Link>
                            {currentUser && (
                                <div className="text-sm text-gray-500 flex items-center">
                                    <div className="h-8 w-8 rounded-full bg-gradient-to-r from-blue-500 to-purple-500 flex items-center justify-center text-white font-medium mr-2">
                                        {currentUser.email
                                            ?.charAt(0)
                                            .toUpperCase()}
                                    </div>
                                    <span className="hidden md:inline">
                                        {currentUser.email}
                                    </span>
                                </div>
                            )}
                            <button
                                onClick={handleLogout}
                                className="text-gray-600 hover:text-red-600 transition-colors font-medium">
                                Logout
                            </button>
                        </div>
                    </div>
                </div>
            </header>

            {/* Main Content */}
            <main className="flex-grow container mx-auto px-4 sm:px-6 lg:px-8 py-8">
                <Outlet />
            </main>

            {/* Footer */}
            <footer className="bg-white border-t border-gray-200 py-6">
                <div className="container mx-auto px-4 sm:px-6 lg:px-8 text-center text-gray-500">
                    <p>
                        © {new Date().getFullYear()} XiboTix. All rights
                        reserved.
                    </p>
                </div>
            </footer>
        </div>
    );
}
