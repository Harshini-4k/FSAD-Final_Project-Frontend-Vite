import React from "react";
import {
  Container,
  Typography,
  Grid,
  Card,
  CardContent,
  Button,
  Box,
} from "@mui/material";
import { Link } from "react-router-dom";
import certificateImg from "./assets/certificate_page-0001.jpg";

function Dashboard() {
  return (
    <Box sx={{ minHeight: "100vh", background: "#f3f4f6" }}>
      
      {/* HERO SECTION */}
      <Box
        sx={{
          minHeight: "80vh",
          backgroundImage:
            "url('https://images.unsplash.com/photo-1519389950473-47ba0277781c?auto=format&fit=crop&w=1950&q=80')",
          backgroundSize: "cover",
          backgroundPosition: "center",
          position: "relative",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          color: "white",
          textAlign: "center",
        }}
      >
        <Box
          sx={{
            position: "absolute",
            top: 0,
            left: 0,
            width: "100%",
            height: "100%",
            backgroundColor: "rgba(0,0,0,0.55)",
          }}
        />

        <Container maxWidth="md" sx={{ position: "relative", zIndex: 1 }}>
          <Typography variant="h2" sx={{ fontWeight: 700, mb: 2 }}>
            Certification Tracker
          </Typography>

          <Typography variant="h5" sx={{ mb: 4, opacity: 0.9 }}>
            Store, manage, and track all your certifications in one place
          </Typography>

          <Button
            component={Link}
            to="/signup"
            variant="contained"
            sx={{
              backgroundColor: "#1d4ed8",
              px: 5,
              py: 1.5,
              borderRadius: "999px",
              fontWeight: 700,
              "&:hover": { backgroundColor: "#2563eb" },
            }}
          >
            GET STARTED
          </Button>
        </Container>
      </Box>

      {/* ABOUT SECTION */}
      <Box id="about" sx={{ backgroundColor: "#ffffff", py: 8 }}>
        <Container>
          <Box
            sx={{
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              flexWrap: "wrap",
            }}
          >
            {/* LEFT TEXT */}
            <Box sx={{ flex: 1, pr: 3, minWidth: "300px" }}>
              <Typography variant="h3" fontWeight="bold" gutterBottom>
                Manage Certifications Easily
              </Typography>

              <Typography sx={{ mb: 2, fontSize: "18px" }}>
                Certification Tracker helps students and professionals manage all certifications in one place.
              </Typography>

              <Typography sx={{ mb: 2, fontSize: "18px" }}>
                Track expiration dates and get reminders for renewals.
              </Typography>

              <Typography sx={{ mb: 2, fontSize: "18px" }}>
                Store certificates securely and access them anytime.
              </Typography>

              <Typography sx={{ mb: 2, fontSize: "18px" }}>
                Admins can monitor and manage certification records efficiently.
              </Typography>
            </Box>

            {/* RIGHT IMAGE */}
            <Box
              sx={{
                flex: 1,
                textAlign: "center",
                minWidth: "300px",
                mt: { xs: 4, md: 0 },
              }}
            >
              <img
                src={certificateImg}
                alt="Certificate"
                style={{
                  width: "100%",
                  maxWidth: "400px",
                  borderRadius: "12px",
                  boxShadow: "0 6px 20px rgba(0,0,0,0.2)",
                }}
              />
            </Box>
          </Box>
        </Container>
      </Box>

      {/* ✅ FEATURES SECTION (LIGHT BLUE ADDED HERE) */}
      <Box
        id="features"
        sx={{
          py: 8,
          backgroundColor: "#e3f2fd", // 💙 light blue
        }}
      >
        <Container>
          <Typography variant="h4" align="center" fontWeight={700} mb={4}>
            Features
          </Typography>

          <Grid container spacing={4}>
            {[
              "Add Certifications",
              "Expiry Tracking",
              "Role-Based Access",
              "Dashboard Analytics",
              "Notifications",
              "Search and Filter",
            ].map((title, index) => (
              <Grid item xs={12} md={4} key={index}>
                <Card sx={{ borderRadius: 3, boxShadow: 3 }}>
                  <CardContent>
                    <Typography variant="h6" fontWeight={700} mb={2}>
                      {title}
                    </Typography>
                    <Typography>
                      Manage and track certifications efficiently with modern tools.
                    </Typography>
                  </CardContent>
                </Card>
              </Grid>
            ))}
          </Grid>
        </Container>
      </Box>

      {/* CONTACT SECTION */}
      <Box
        id="contact"
        sx={{
          backgroundColor: "#ffffff",
          color: "#000",
          py: 8,
        }}
      >
        <Container maxWidth="md">
          <Typography variant="h4" align="center" fontWeight={700} mb={4}>
            Contact Us
          </Typography>

          <Typography align="center" sx={{ mb: 3, fontSize: "18px" }}>
            Have questions or need help? Reach out to us anytime.
          </Typography>

          <Box sx={{ textAlign: "center", lineHeight: "2" }}>
            <Typography>📧 Email: support@certitracker.com</Typography>
            <Typography>📞 Phone: +91 98765 43210</Typography>
            <Typography>📍 Address: Andhra Pradesh, India</Typography>
          </Box>
        </Container>
      </Box>

      {/* FOOTER */}
      <Box sx={{ background: "#0f172a", color: "white", py: 4 }}>
        <Container>
          <Typography align="center" fontWeight={600}>
            © 2026 CertiTracker | All rights reserved
          </Typography>
        </Container>
      </Box>
    </Box>
  );
}

export default Dashboard;