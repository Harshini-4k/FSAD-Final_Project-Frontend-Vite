import axios from "axios";
import { useState } from "react";
import { Container, TextField, Button, Typography, Box, Card, CardContent, Alert, FormControl, InputLabel, Select, MenuItem } from "@mui/material";
import { useNavigate } from "react-router-dom";

function Signup() {

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [role, setRole] = useState("USER");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleSignup = async () => {
    setError("");
    setSuccess("");

    // Enhanced Validation
    if (!name.trim()) {
      setError("Name is required");
      return;
    }

    if (name.trim().length < 2) {
      setError("Name must be at least 2 characters");
      return;
    }

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

    // Strong password validation
    const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;
    if (!passwordRegex.test(password)) {
      setError("Password must be at least 8 characters and contain at least one uppercase letter, one lowercase letter, one number, and one special character");
      return;
    }

    if (password !== confirmPassword) {
      setError("Passwords do not match");
      return;
    }

    if (!role) {
      setError("Please select a role");
      return;
    }

    const userData = {
      name: name,
      email: email,
      password: password,
      role: role
    };

    setLoading(true);

    try {
      const res = await axios.post("http://localhost:8080/api/signup", userData);
      setSuccess(res.data.message || "Signup successful!");
      setTimeout(() => {
        navigate("/login");
      }, 1500);
    } catch (err) {
      setError(err.response?.data?.message || "Signup failed. Please try again.");
      console.log(err);
    } finally {
      setLoading(false);
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
            Create Account
          </Typography>

          {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}
          {success && <Alert severity="success" sx={{ mb: 2 }}>{success}</Alert>}

          <Box sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
            <TextField
              label="Full Name"
              placeholder="Enter your full name"
              fullWidth
              value={name}
              onChange={(e) => setName(e.target.value)}
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
              label="Email"
              type="email"
              placeholder="Enter your email"
              fullWidth
              value={email}
              onChange={(e) => setEmail(e.target.value)}
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
              placeholder="Enter your password (min 6 chars)"
              fullWidth
              value={password}
              onChange={(e) => setPassword(e.target.value)}
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
              label="Confirm Password"
              type="password"
              placeholder="Confirm your password"
              fullWidth
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
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

            <FormControl 
              fullWidth
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
                "& .MuiInputLabel-root": {
                  color: "rgba(255, 255, 255, 0.9)",
                },
              }}
            >
              <InputLabel 
                sx={{ 
                  color: "rgba(255, 255, 255, 0.9) !important",
                  "&.Mui-focused": {
                    color: "rgba(255, 255, 255, 0.9) !important",
                  }
                }}
              >
                Select Role
              </InputLabel>
              <Select
                value={role}
                label="Select Role"
                onChange={(e) => setRole(e.target.value)}
                sx={{
                  color: "white",
                  "& .MuiOutlinedInput-notchedOutline": {
                    borderColor: "rgba(255, 255, 255, 0.5)",
                  },
                  "&:hover .MuiOutlinedInput-notchedOutline": {
                    borderColor: "rgba(255, 255, 255, 0.8)",
                  },
                  "&.Mui-focused .MuiOutlinedInput-notchedOutline": {
                    borderColor: "rgba(255, 255, 255, 0.9)",
                  },
                  "& .MuiSvgIcon-root": {
                    color: "rgba(255, 255, 255, 0.9)",
                  },
                }}
              >
                <MenuItem value="USER">
                  👤 User
                </MenuItem>
                <MenuItem value="ADMIN">
                  🛡️ Admin
                </MenuItem>
              </Select>
            </FormControl>

            <Typography 
              variant="caption" 
              sx={{ 
                color: "rgba(255, 255, 255, 0.8)",
                textAlign: "center",
                mt: -1
              }}
            >
              {role === "ADMIN" ? "Admin can manage users and certifications" : "User can track personal certifications"}
            </Typography>

            <Button 
              variant="contained" 
              onClick={handleSignup}
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
              {loading ? "Creating Account..." : "Sign Up"}
            </Button>

            <Typography sx={{ textAlign: "center", color: "white", mt: 2 }}>
              Already have an account? <a href="/login" style={{ color: "#FFD700", textDecoration: "none", fontWeight: "bold" }}>Login here</a>
            </Typography>
          </Box>
        </CardContent>
      </Card>
    </Container>
  );
}

export default Signup;