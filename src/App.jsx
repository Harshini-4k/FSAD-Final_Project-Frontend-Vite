import React, { useState, useEffect, useCallback } from "react";
import { BrowserRouter as Router, Routes, Route, Link, useNavigate } from "react-router-dom";
import { AppBar, Toolbar, Typography, Button, Box, Select, MenuItem, Container, Dialog, DialogTitle, DialogContent, DialogActions } from "@mui/material";

import Dashboard from "./Dashboard"; // Landing page
import UserDashboard from "./UserDashboard"; // User certifications
import AdminDashboardPage from "./AdminDashboardPage"; // Admin certifications
import Login from "./Login";
import Signup from "./Signup";
import ForgotPassword from "./ForgotPassword";
import AddCertification from "./AddCertification";
import ProtectedRoute from "./ProtectedRoute";

function AppContent() {
  const [user, setUser] = useState(null);
  const [sessionWarning, setSessionWarning] = useState(false);
  const [timeLeft, setTimeLeft] = useState(0);
  const navigate = useNavigate();

  // Session timeout configuration
  const SESSION_TIMEOUT = 30 * 60 * 1000; // 30 minutes in milliseconds
  const WARNING_TIME = 5 * 60 * 1000; // Show warning 5 minutes before timeout

  // Update last activity timestamp
  const updateActivity = useCallback(() => {
    const now = Date.now();
    localStorage.setItem("lastActivity", now.toString());
  }, []);

  // Check session timeout
  const checkSessionTimeout = useCallback(() => {
    const storedUser = localStorage.getItem("user");
    const lastActivity = localStorage.getItem("lastActivity");

    if (storedUser && lastActivity) {
      const now = Date.now();
      const timeSinceActivity = now - parseInt(lastActivity);
      const timeUntilTimeout = SESSION_TIMEOUT - timeSinceActivity;

      if (timeSinceActivity >= SESSION_TIMEOUT) {
        // Session expired
        handleLogout();
        return;
      }

      if (timeUntilTimeout <= WARNING_TIME && timeUntilTimeout > 0) {
        // Show warning
        setTimeLeft(Math.ceil(timeUntilTimeout / 1000 / 60)); // minutes
        setSessionWarning(true);
      } else {
        setSessionWarning(false);
      }
    }
  }, [SESSION_TIMEOUT, WARNING_TIME]);

  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    if (storedUser) {
      setUser(JSON.parse(storedUser));
      updateActivity(); // Set initial activity
    }

    // Set up activity listeners
    const events = ['mousedown', 'mousemove', 'keypress', 'scroll', 'touchstart', 'click'];
    events.forEach(event => {
      document.addEventListener(event, updateActivity, true);
    });

    // Check session every minute
    const sessionCheck = setInterval(checkSessionTimeout, 60000);

    // Initial check
    checkSessionTimeout();

    return () => {
      events.forEach(event => {
        document.removeEventListener(event, updateActivity, true);
      });
      clearInterval(sessionCheck);
    };
  }, [updateActivity, checkSessionTimeout]);

  const handleLogout = () => {
    localStorage.removeItem("user");
    localStorage.removeItem("userRole");
    localStorage.removeItem("lastActivity");
    setUser(null);
    setSessionWarning(false);
    navigate("/");
  };

  const extendSession = () => {
    updateActivity();
    setSessionWarning(false);
  };

  const scrollToSection = (sectionId) => {
    const element = document.getElementById(sectionId);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    } else {
      // If not on home page, navigate to home with hash
      navigate(`/#${sectionId}`);
    }
  };

  return (
    <>
      <AppBar
        position="static"
        sx={{
          backgroundColor: "rgba(255, 255, 255, 0.95)",
          backdropFilter: "blur(10px)",
          color: "#1a1a1a",
          boxShadow: "0 2px 20px rgba(0,0,0,0.1)",
        }}
      >
        <Container maxWidth="lg">
          <Toolbar sx={{ justifyContent: "space-between" }}>
            <Box sx={{ display: "flex", alignItems: "center" }}>
              <Typography
                variant="h6"
                fontWeight="bold"
                sx={{ color: "#1976d2", textDecoration: "none" }}
              >
                <Link to="/" style={{ textDecoration: "none", color: "inherit" }}>
                  CertiTracker
                </Link>
              </Typography>
            </Box>

            <Box sx={{ display: { xs: "none", md: "flex" }, gap: 3 }}>
              <Button color="inherit" component={Link} to="/" sx={{ fontWeight: 500 }}>
                Home
              </Button>
              <Button color="inherit" onClick={() => scrollToSection('about')} sx={{ fontWeight: 500 }}>
                About
              </Button>
              <Button color="inherit" onClick={() => scrollToSection('features')} sx={{ fontWeight: 500 }}>
                Features
              </Button>
              {user ? (
                <>
                  <Button color="inherit" component={Link} to="/dashboard">
                    Dashboard
                  </Button>
                  <Button color="inherit" onClick={handleLogout}>
                    Logout
                  </Button>
                </>
              ) : (
                <>
                  <Button color="inherit" component={Link} to="/login">
                    Login
                  </Button>
                  <Button
                    component={Link}
                    to="/signup"
                    variant="contained"
                    sx={{ backgroundColor: "#1976d2", borderRadius: "25px", px: 3, fontWeight: 600 }}
                  >
                    Sign Up
                  </Button>
                </>
              )}
            </Box>

            <Box sx={{ display: { xs: "flex", md: "none" }, alignItems: "center" }}>
              <Select size="small" defaultValue="English">
                <MenuItem value="English">English</MenuItem>
                <MenuItem value="Telugu">Telugu</MenuItem>
                <MenuItem value="Hindi">Hindi</MenuItem>
              </Select>
            </Box>
          </Toolbar>
        </Container>
      </AppBar>

      <Routes>
        <Route path="*" element={<Dashboard />} />
        <Route
          path="/dashboard"
          element={
            <ProtectedRoute requiredRole="USER">
              <UserDashboard />
            </ProtectedRoute>
          }
        />
        <Route
          path="/admin"
          element={
            <ProtectedRoute requiredRole="ADMIN">
              <AdminDashboardPage />
            </ProtectedRoute>
          }
        />
        <Route path="/login" element={<Login setUser={setUser} />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/forgot-password" element={<ForgotPassword />} />
        <Route
          path="/add"
          element={
            <ProtectedRoute>
              <AddCertification />
            </ProtectedRoute>
          }
        />
      </Routes>

      {/* Session Timeout Warning Dialog */}
      <Dialog
        open={sessionWarning}
        onClose={extendSession}
        aria-labelledby="session-warning-title"
      >
        <DialogTitle id="session-warning-title">
          Session Timeout Warning
        </DialogTitle>
        <DialogContent>
          <Typography>
            Your session will expire in {timeLeft} minute{timeLeft !== 1 ? 's' : ''} due to inactivity.
            Click "Continue" to extend your session or "Logout" to end it now.
          </Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleLogout} color="secondary">
            Logout
          </Button>
          <Button onClick={extendSession} color="primary" variant="contained">
            Continue Session
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
}

function App() {
  return (
    <Router>
      <AppContent />
    </Router>
  );
}

export default App;
