import { useState, type ChangeEvent, type FormEvent } from "react";
import { useNavigate, Link } from "react-router-dom";
import wealthwise from "../../../assets/img/wealthwise.png";
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

// Import the Supabase types you generated
import type { Database } from "../../../types/supabase_types"; // adjust path if different

// Extract the profiles Row type for use if needed
// For now wala pani gamit ang ge gamit sa profile kay full name instead of the split fname and lname
// and ang authentication kay built in sa supabase dli pa specify or pull ang row sa types for it
// so temporary lng ni for examples
type ProfileRow = Database["public"]["Tables"]["profiles"]["Row"];

export default function Register() {
  // const navigate = useNavigate();

  // State with explicit types
  const [firstname, setFirstname] = useState<string>("");
  const [lastname, setLastname] = useState<string>("");
  const [email, setEmail] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [cpassword, setCPassword] = useState<string>("");
  const [showPassword, setShowPassword] = useState<boolean>(false);

  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(false);

  // Form validation errors
  const [firstnameError, setFirstnameError] = useState<string>("");
  const [lastnameError, setLastnameError] = useState<string>("");
  const [emailError, setEmailError] = useState<string>("");
  const [passwordError, setPasswordError] = useState<string>("");
  const [cpasswordError, setCPasswordError] = useState<string>("");

  const validateEmail = (email: string): boolean => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  // Handlers with event typing
  const handleFirstnameChange = (event: ChangeEvent<HTMLInputElement>) => {
    const value = event.target.value;
    setFirstname(value);
    if (!value) {
      setFirstnameError("First name is required");
    } else if (value.length < 2) {
      setFirstnameError("First name must be at least 2 characters");
    } else {
      setFirstnameError("");
    }
  };

  const handleLastnameChange = (event: ChangeEvent<HTMLInputElement>) => {
    const value = event.target.value;
    setLastname(value);
    if (!value) {
      setLastnameError("Last name is required");
    } else if (value.length < 2) {
      setLastnameError("Last name must be at least 2 characters");
    } else {
      setLastnameError("");
    }
  };

  const handleEmailChange = (event: ChangeEvent<HTMLInputElement>) => {
    const value = event.target.value;
    setEmail(value);
    if (!value) {
      setEmailError("Email is required");
    } else if (!validateEmail(value)) {
      setEmailError("Please enter a valid email address");
    } else {
      setEmailError("");
    }
  };

  const handlePasswordChange = (event: ChangeEvent<HTMLInputElement>) => {
    const value = event.target.value;
    setPassword(value);
    if (!value) {
      setPasswordError("Password is required");
    } else if (value.length < 6) {
      setPasswordError("Password must be at least 6 characters");
    } else {
      setPasswordError("");
    }
    // Check confirm password match
    if (cpassword && value !== cpassword) {
      setCPasswordError("Passwords do not match");
    } else {
      setCPasswordError("");
    }
  };

  const handleConfirmPasswordChange = (
    event: ChangeEvent<HTMLInputElement>
  ) => {
    const value = event.target.value;
    setCPassword(value);
    if (!value) {
      setCPasswordError("Please confirm your password");
    } else if (value !== password) {
      setCPasswordError("Passwords do not match");
    } else {
      setCPasswordError("");
    }
  };

  const handleRegistration = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    // Check for any validation errors
    if (
      firstnameError ||
      lastnameError ||
      emailError ||
      passwordError ||
      cpasswordError
    ) {
      return;
    }

    setLoading(true);
    setErrorMsg(null);
    setSuccessMsg(null);

    // Sign up user with Supabase
    const {
      data: { session, user },
      error,
    } = await supabase.auth.signUp({
      email: email,
      password: password,
      options: {
        data: {
          full_name: `${firstname} ${lastname}`,
        },
      },
    });

    if (error) {
      setErrorMsg(error.message);
      setLoading(false);
      return;
    }

    // Insert initial balance row (assuming BalanceTbl exists)
    if (user) {
      const { error: balanceError } = await supabase.from("balances").insert([
        {
          user_id: user.id,
          amount: 0,
          cash_balance: "cash",
        },
      ]);

      if (balanceError) {
        setErrorMsg(
          "User created, but failed to create initial balance: " +
            balanceError.message
        );
        setLoading(false);
        return;
      }
    }

    setLoading(false);
    setSuccessMsg("Account created successfully!");

    // if (session) {
    //   navigate("/");
    // } else {
    //   setTimeout(() => {
    //     navigate("/login");
    //   }, 2500);
    // }
  };

  return (
    <Box
      display="flex"
      justifyContent="center"
      alignItems="center"
      height="100vh"
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
        onSubmit={handleRegistration}
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
          ✨ Create Account
        </Typography>
        {errorMsg && (
          <Alert severity="error" sx={{ mb: 2 }}>
            {errorMsg}
          </Alert>
        )}
        {successMsg && (
          <Alert severity="success" sx={{ mb: 2 }}>
            {successMsg}
          </Alert>
        )}

        {/* First Name */}
        <FormControl fullWidth margin="normal" error={!!firstnameError}>
          <InputLabel htmlFor="firstname-input">👤 First Name</InputLabel>
          <OutlinedInput
            id="firstname-input"
            value={firstname}
            onChange={handleFirstnameChange}
            label="👤 First Name"
            disabled={loading}
            required
          />
          {firstnameError && <FormHelperText>{firstnameError}</FormHelperText>}
        </FormControl>

        {/* Last Name */}
        <FormControl fullWidth margin="normal" error={!!lastnameError}>
          <InputLabel htmlFor="lastname-input">👤 Last Name</InputLabel>
          <OutlinedInput
            id="lastname-input"
            value={lastname}
            onChange={handleLastnameChange}
            label="👤 Last Name"
            disabled={loading}
            required
          />
          {lastnameError && <FormHelperText>{lastnameError}</FormHelperText>}
        </FormControl>

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
                >
                  {showPassword ? <VisibilityOff /> : <Visibility />}
                </IconButton>
              </InputAdornment>
            }
          />
          {passwordError && <FormHelperText>{passwordError}</FormHelperText>}
        </FormControl>

        {/* Confirm Password */}
        <FormControl fullWidth margin="normal" error={!!cpasswordError}>
          <InputLabel htmlFor="cpassword-input">Confirm Password</InputLabel>
          <OutlinedInput
            id="cpassword-input"
            type={showPassword ? "text" : "password"}
            value={cpassword}
            onChange={handleConfirmPasswordChange}
            label="Confirm Password"
            disabled={loading}
            required
            endAdornment={
              <InputAdornment position="end">
                <IconButton
                  onClick={() => setShowPassword(!showPassword)}
                  edge="end"
                  disabled={loading}
                >
                  {showPassword ? <VisibilityOff /> : <Visibility />}
                </IconButton>
              </InputAdornment>
            }
          />
          {cpasswordError && <FormHelperText>{cpasswordError}</FormHelperText>}
        </FormControl>

        {/* Submit */}
        <Box mt={3} textAlign="center">
          <Button
            type="submit"
            variant="contained"
            color="primary"
            disabled={
              loading ||
              !!firstnameError ||
              !!lastnameError ||
              !!emailError ||
              !!passwordError ||
              !!cpasswordError
            }
            fullWidth
            size="large"
            startIcon={loading ? <CircularProgress size={20} /> : null}
          >
            {loading ? "Creating..." : "Register ✨"}
          </Button>
        </Box>

        {/* Login Redirect */}
        <Box mt={2} textAlign="center">
          <Typography variant="body2">
            Already have an account?{" "}
             {/*
              Wala pani kay need ug router dom sa pikas
              
             <Button
              component={Link}
              to="/login"
              size="small"
              sx={{ textTransform: "none", padding: 0 }}
            >
              Login 🔐
            </Button> */}
          </Typography>
        </Box>
      </Card>
    </Box>
  );
}
