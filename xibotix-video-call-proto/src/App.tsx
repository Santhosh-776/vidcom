import { Navigate, Route, Routes } from "react-router-dom";

// Layout components
import AuthLayout from "./layouts/AuthLayout";
import DashboardLayout from "./layouts/DashboardLayout";

// Page components
import LoginPage from "./pages/LoginPage";
import SignupPage from "./pages/SignupPage";
import DashboardPage from "./pages/DashboardPage";
import VideoCallPage from "./pages/VideoCallPage";
import NotFoundPage from "./pages/NotFoundPage";
import { useAuth } from "./context/AuthContext";
// Protected route component
const ProtectedRoute = ({ children }: { children: React.ReactNode }) => {
    const { currentUser } = useAuth();

    if (!currentUser) {
        return (
            <Navigate
                to="/login"
                replace
            />
        );
    }

    return <>{children}</>;
};

export default function App() {
    return (
        <Routes>
            {/* Public routes */}
            <Route element={<AuthLayout />}>
                <Route
                    path="/login"
                    element={<LoginPage />}
                />
                <Route
                    path="/signup"
                    element={<SignupPage />}
                />
            </Route>

            {/* Protected routes */}
            <Route element={<DashboardLayout />}>
                <Route
                    path="/"
                    element={
                        <ProtectedRoute>
                            <DashboardPage />
                        </ProtectedRoute>
                    }
                />

                <Route
                    path="/call/:callId"
                    element={
                        <ProtectedRoute>
                            <VideoCallPage />
                        </ProtectedRoute>
                    }
                />
            </Route>

            {/* 404 route */}
            <Route
                path="*"
                element={<NotFoundPage />}
            />
        </Routes>
    );
}
