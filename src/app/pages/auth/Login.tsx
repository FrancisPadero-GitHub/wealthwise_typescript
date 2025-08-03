import { useState, type ChangeEvent, type FormEvent } from "react";
import wealthwise from "../../../assets/img/wealthwise.png";
import { useNavigate, Link } from "react-router-dom";
import {
  Card,
  Box,
  Button,
  Typography,
  InputAdornment,
  IconButton,
  CircularProgress,
  Alert,
  FormControl,
  InputLabel,
  OutlinedInput,
  FormHelperText,
} from "@mui/material";
import { Visibility, VisibilityOff } from "@mui/icons-material";
import { supabase } from "../../../backend/supabase";

export default function Login() {
  const navigate = useNavigate();

  // State with explicit types
  const [email, setEmail] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [showPassword, setShowPassword] = useState<boolean>(false);
  const [emailError, setEmailError] = useState<string>("");
  const [passwordError, setPasswordError] = useState<string>("");

  // Validate email format
  const validateEmail = (email: string): boolean => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  // Handle email input change
  const handleEmailChange = (e: ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setEmail(value);

    if (!value) {
      setEmailError("Email is required");
    } else if (!validateEmail(value)) {
      setEmailError("Please enter a valid email address");
    } else {
      setEmailError("");
    }
  };

  // Handle password input change
  const handlePasswordChange = (e: ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setPassword(value);

    if (!value) {
      setPasswordError("Password is required");
    } else {
      setPasswordError("");
    }
  };

  // Submit login form
  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    // If there are validation errors, prevent submission
    if (emailError || passwordError) {
      return;
    }

    setLoading(true);
    setErrorMsg(null);

    // Sign in with Supabase
    const { error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    setLoading(false);

    if (error) {
      setErrorMsg(error.message);
    } else {
      navigate("/");
    }
  }

  return (
    <Box
      display="flex"
      justifyContent="center"
      alignItems="center"
      height="80vh"
    >
      <Card
        elevation={3}
        sx={{
          maxWidth: 380,
          p: 3,
          borderRadius: 2,
          bgcolor: "#ffffff",
          "& .MuiTextField-root": {
            bgcolor: "#ffffff",
          },
        }}
        component="form"
        onSubmit={handleSubmit}
      >
        <Box display="flex" alignItems="center" justifyContent="center">
          <img
            src={wealthwise}
            alt="logo"
            style={{
              width: "90px",
              height: "90px",
              marginRight: "10px",
              marginBottom: "10px",
            }}
          />
          <Typography variant="h2" color="primary" sx={{ marginTop: "6%" }}>
            WealthWise
          </Typography>
        </Box>
        <Typography variant="body1" fontWeight="bold" align="center">
          🔐 Login
        </Typography>

        {/* Email */}
        <FormControl fullWidth margin="normal" error={!!emailError}>
          <InputLabel htmlFor="email-input">📧 Email</InputLabel>
          <OutlinedInput
            id="email-input"
            type="email"
            value={email}
            onChange={handleEmailChange}
            label="📧 Email"
            disabled={loading}
            required
          />
          {emailError && <FormHelperText>{emailError}</FormHelperText>}
        </FormControl>

        {/* Password */}
        <FormControl fullWidth margin="normal" error={!!passwordError}>
          <InputLabel htmlFor="password-input">🔑 Password</InputLabel>
          <OutlinedInput
            id="password-input"
            type={showPassword ? "text" : "password"}
            value={password}
            onChange={handlePasswordChange}
            label="🔑 Password"
            disabled={loading}
            required
            endAdornment={
              <InputAdornment position="end">
                <IconButton
                  onClick={() => setShowPassword(!showPassword)}
                  edge="end"
                  disabled={loading}
                  aria-label={showPassword ? "Hide password" : "Show password"}
                >
                  {showPassword ? <VisibilityOff /> : <Visibility />}
                </IconButton>
              </InputAdornment>
            }
          />
          {passwordError && <FormHelperText>{passwordError}</FormHelperText>}
        </FormControl>

        {/* Error message */}
        {errorMsg && (
          <Alert severity="error" sx={{ mt: 2 }}>
            {errorMsg}
          </Alert>
        )}

        {/* Submit */}
        <Box mt={2} textAlign="center">
          <Button
            type="submit"
            variant="contained"
            color="primary"
            disabled={loading || !!emailError || !!passwordError}
            fullWidth
            size="large"
            startIcon={loading ? <CircularProgress size={20} /> : null}
          >
            {loading ? "Logging in..." : "Login 🔑"}
          </Button>
        </Box>

        {/* Redirect to Register */}
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
      </Card>
    </Box>
  );
}
