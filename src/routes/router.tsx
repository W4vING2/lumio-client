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
  { path: "/login", element: <LoginPage />, errorElement: <RouteErrorPage /> },
  { path: "/register", element: <RegisterPage />, errorElement: <RouteErrorPage /> },
  { path: "/verify-email", element: <VerifyEmailPage />, errorElement: <RouteErrorPage /> },
  {
    path: "/",
    element: <AppLayout />,
    errorElement: <RouteErrorPage />,
    children: [
      { index: true, element: <HomeEmptyPage /> },
      { path: "chat/:id", element: <ChatRoutePage /> },
      { path: "settings", element: <SettingsPage /> },
      { path: "profile/:id", element: <UserProfilePage /> },
      { path: "group/:id", element: <GroupProfilePage /> }
    ]
  },
  { path: "*", element: <Navigate to="/" replace />, errorElement: <RouteErrorPage /> }
]);
