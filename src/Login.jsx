import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { Container, TextField, Button, Typography, Box, Card, CardContent, Alert } from "@mui/material";

function Login({ setUser }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleLogin = async () => {
    setError("");

    if (!email.trim()) {
      setError("Email is required");
      return;
    }

    // Email validation regex
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      setError("Please enter a valid email address");
      return;
    }

    if (!password) {
      setError("Password is required");
      return;
    }

    setLoading(true);

    try {
      const response = await axios.post("http://localhost:8080/api/login", {
        email,
        password
      });

      if (response.data.success) {
        // Store user info in localStorage
        const userData = {
          id: response.data.id,
          name: response.data.name,
          email: email,
          role: response.data.role
        };
        localStorage.setItem("user", JSON.stringify(userData));
        localStorage.setItem("userRole", response.data.role);
        localStorage.setItem("lastActivity", Date.now().toString());

        // Update app state so navbar reflects login immediately
        if (setUser) {
          setUser(userData);
        }

        // Redirect based on role
        if (response.data.role === "ADMIN") {
          navigate("/admin");
        } else {
          navigate("/dashboard");
        }
      } else {
        setError(response.data.message || "Login failed");
      }
    } catch (error) {
      console.error(error);
      setError(error.response?.data?.message || "Login failed. Please check your credentials.");
    } finally {
      setLoading(false);
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === "Enter") {
      handleLogin();
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
            Welcome Back
          </Typography>

          {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}

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

            <TextField
              label="Password"
              type="password"
              placeholder="Enter your password"
              fullWidth
              value={password}
              onChange={(e) => setPassword(e.target.value)}
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
              onClick={handleLogin}
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
              {loading ? "Logging in..." : "Login"}
            </Button>

            <Typography sx={{ textAlign: "center", color: "white", mt: 2 }}>
              Don't have an account? <a href="/signup" style={{ color: "#FFD700", textDecoration: "none", fontWeight: "bold" }}>Sign up here</a>
            </Typography>
          </Box>
        </CardContent>
      </Card>
    </Container>
  );
}

export default Login;