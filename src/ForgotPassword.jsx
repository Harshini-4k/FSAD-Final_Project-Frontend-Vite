import React, { useState } from "react";
import { Container, TextField, Button, Typography, Box, Card, CardContent, Alert } from "@mui/material";
import { useNavigate } from "react-router-dom";
import axios from "axios";

function ForgotPassword() {
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleForgotPassword = async () => {
    setError("");
    setMessage("");

    if (!email) {
      setError("Email is required");
      return;
    }

    setLoading(true);

    try {
      // TODO: Implement forgot password API call
      // const response = await axios.post("http://localhost:8080/api/forgot-password", { email });

      // For now, show a placeholder message
      setMessage("If an account with that email exists, a password reset link has been sent.");
    } catch (error) {
      setError("An error occurred. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === "Enter") {
      handleForgotPassword();
    }
  };

  return (
    <Container maxWidth="sm" sx={{ mt: 8, mb: 8 }}>
      <Card
        sx={{
          boxShadow: 3,
          borderRadius: 2,
          background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)"
        }}
      >
        <CardContent sx={{ p: 4 }}>
          <Typography
            variant="h4"
            gutterBottom
            sx={{
              fontWeight: "bold",
              color: "white",
              textAlign: "center",
              mb: 3
            }}
          >
            Forgot Password
          </Typography>

          <Typography
            sx={{
              color: "white",
              textAlign: "center",
              mb: 3
            }}
          >
            Enter your email address and we'll send you a link to reset your password.
          </Typography>

          {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}
          {message && <Alert severity="success" sx={{ mb: 2 }}>{message}</Alert>}

          <Box sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
            <TextField
              label="Email"
              type="email"
              placeholder="Enter your email"
              fullWidth
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              onKeyPress={handleKeyPress}
              variant="outlined"
              sx={{
                "& .MuiOutlinedInput-root": {
                  color: "white",
                  "& fieldset": {
                    borderColor: "rgba(255, 255, 255, 0.5)",
                  },
                  "&:hover fieldset": {
                    borderColor: "rgba(255, 255, 255, 0.8)",
                  },
                },
                "& .MuiInputBase-input::placeholder": {
                  color: "rgba(255, 255, 255, 0.7)",
                },
                "& .MuiInputLabel-root": {
                  color: "rgba(255, 255, 255, 0.9)",
                },
              }}
              InputLabelProps={{
                style: { color: "rgba(255, 255, 255, 0.9)" },
              }}
            />

            <Button
              variant="contained"
              onClick={handleForgotPassword}
              disabled={loading}
              sx={{
                mt: 2,
                py: 1.5,
                fontSize: "16px",
                fontWeight: "bold",
                backgroundColor: "white",
                color: "#667eea",
                "&:hover": {
                  backgroundColor: "#f0f0f0",
                },
                textTransform: "none",
              }}
            >
              {loading ? "Sending..." : "Send Reset Link"}
            </Button>

            <Typography sx={{ textAlign: "center", color: "white", mt: 2 }}>
              Remember your password? <a href="/login" style={{ color: "#FFD700", textDecoration: "none", fontWeight: "bold" }}>Back to Login</a>
            </Typography>
          </Box>
        </CardContent>
      </Card>
    </Container>
  );
}

export default ForgotPassword;