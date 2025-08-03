import { Button, Box, Typography } from "@mui/material";
import { Link } from "react-router";
function WelcomePage() {
  return (
    <div
      style={{
        justifyContent: "center",
        textAlign: "center",
      }}
    >
      <h1 style={{ textAlign: "center" }}>Welcome Page</h1>

      <Box mt={2} textAlign="center">
        <Typography variant="body2">
          Already have an account?
          <Button
            component={Link}
            to="/register"
            size="small"
            sx={{ textTransform: "none", padding: 0 }}
          >
            Login ✨
          </Button>
        </Typography>
      </Box>

      <Box mt={2} textAlign="center">
        <Typography variant="body2">
          Don&apos;t have an account?{" "}
          <Button
            component={Link}
            to="/register"
            size="small"
            sx={{ textTransform: "none", padding: 0 }}
          >
            Create an account ✨
          </Button>
        </Typography>
      </Box>
    </div>
  );
}

export default WelcomePage;
