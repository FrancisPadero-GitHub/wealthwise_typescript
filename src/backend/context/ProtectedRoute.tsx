import type { ReactNode } from "react";
import { Navigate } from "react-router-dom";
import { useAuth } from "../context/AuthProvider";
import { Box, CircularProgress, Typography } from "@mui/material";
import { keyframes } from "@mui/system";

// Define props for the wrapper components
interface ProtectedRouteProps {
  children: ReactNode;
}

interface LoadingContainerProps {
  children: ReactNode;
}

// Animation keyframes (no type needed — `keyframes` returns correct type)
const fadeIn = keyframes`
  from {
    opacity: 0;
  }
  to {
    opacity: 1;
  }
`;

// Loading container with typing
const LoadingContainer = ({ children }: LoadingContainerProps) => (
  <Box
    sx={{
      display: "flex",
      flexDirection: "column",
      alignItems: "center",
      justifyContent: "center",
      minHeight: "100vh",
      gap: 2,
      animation: `${fadeIn} 0.5s ease-in`,
    }}
  >
    {children}
  </Box>
);

const ProtectedRoute = ({ children }: ProtectedRouteProps) => {
  const { user, loading } = useAuth();

  // Show loading screen while auth state is being determined
  if (loading) {
    return (
      <LoadingContainer>
        <CircularProgress size={60} thickness={4} />
        <Typography variant="h6" color="text.secondary">
          Loading...
        </Typography>
      </LoadingContainer>
    );
  }

  // If no user is authenticated, redirect to login
  if (!user) return <Navigate to="/login" replace />;

  // Otherwise, render protected content
  return children;
};

export default ProtectedRoute;
