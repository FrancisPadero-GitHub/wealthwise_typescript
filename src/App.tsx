import { createBrowserRouter, RouterProvider, Outlet } from "react-router";
import { Box } from "@mui/material";
import { useState } from "react";

// Context imports
import { AuthProvider } from "./backend/context/AuthProvider";
import ProtectedRoute from "./backend/context/ProtectedRoute";

// Pages imports
import WelcomePage from "./app/pages/auth/WelcomePage";
import Login from "./app/pages/auth/Login";
import Register from "./app/pages/auth/Register";
import PageNotFound from "./app/components/PageNotFound";

// Layout Pages
import Topbar from "./app/layout/Topbar";
import Sidebar from "./app/layout/Sidebar";
import Footer from "./app/layout/Footer";

// Main Pages
import Dashboard from "./app/pages/Dashboard";
import Transactions from "./app/pages/Transactions";

// TanStack Query
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";

const queryClient = new QueryClient();

// Drawer width constants
const drawerWidth = 240;
const minimizedDrawerWidth = 60;

/** Layout for protected routes */
function Layout() {
  const [open, setOpen] = useState<boolean>(false);

  const handleToggleDrawer = () => {
    setOpen((prev) => !prev);
  };

  return (
    <>
      <Topbar onDrawerToggle={handleToggleDrawer} />
      <Sidebar open={open} />
      <Box
        component="main"
        sx={{
          transition: "margin 0.2s",
          marginLeft: open ? `${drawerWidth}px` : `${minimizedDrawerWidth}px`,
          padding: 2,
          marginTop: "64px",
          minHeight: "calc(100vh - 64px - 48px)", // space for topbar and footer
          backgroundColor: "#f5f5f5",
        }}
      >
        <Outlet />
      </Box>
      <Footer />
    </>
  );
}

function App() {
  const router = createBrowserRouter([
    // Protected routes (requires login)
    {
      path: "/",
      element: (
        <ProtectedRoute>
          <Layout />
        </ProtectedRoute>
      ),
      children: [
        { path: "/", element: <Dashboard /> },
        { path: "/transactions", element: <Transactions /> },
      ],
    },

    // Public routes
    { path: "/welcome", element: <WelcomePage /> },
    { path: "/login", element: <Login /> },
    { path: "/register", element: <Register /> },

    // 404
    { path: "*", element: <PageNotFound /> },
  ]);

  return (
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <RouterProvider router={router} />
      </AuthProvider>
    </QueryClientProvider>
  );
}

export default App;
