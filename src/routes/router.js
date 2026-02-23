import { jsx as _jsx } from "react/jsx-runtime";
import { Navigate, createBrowserRouter } from "react-router-dom";
import { AppLayout } from "@/components/layout/AppLayout";
import { LoginPage } from "./LoginPage";
import { RegisterPage } from "./RegisterPage";
import { VerifyEmailPage } from "./VerifyEmailPage";
import { HomeEmptyPage } from "./HomeEmptyPage";
import { ChatRoutePage } from "./ChatRoutePage";
import { SettingsPage } from "./SettingsPage";
import { RouteErrorPage } from "./RouteErrorPage";
import { UserProfilePage } from "./UserProfilePage";
import { GroupProfilePage } from "./GroupProfilePage";
export const router = createBrowserRouter([
    { path: "/login", element: _jsx(LoginPage, {}), errorElement: _jsx(RouteErrorPage, {}) },
    { path: "/register", element: _jsx(RegisterPage, {}), errorElement: _jsx(RouteErrorPage, {}) },
    { path: "/verify-email", element: _jsx(VerifyEmailPage, {}), errorElement: _jsx(RouteErrorPage, {}) },
    {
        path: "/",
        element: _jsx(AppLayout, {}),
        errorElement: _jsx(RouteErrorPage, {}),
        children: [
            { index: true, element: _jsx(HomeEmptyPage, {}) },
            { path: "chat/:id", element: _jsx(ChatRoutePage, {}) },
            { path: "settings", element: _jsx(SettingsPage, {}) },
            { path: "profile/:id", element: _jsx(UserProfilePage, {}) },
            { path: "group/:id", element: _jsx(GroupProfilePage, {}) }
        ]
    },
    { path: "*", element: _jsx(Navigate, { to: "/", replace: true }), errorElement: _jsx(RouteErrorPage, {}) }
]);
