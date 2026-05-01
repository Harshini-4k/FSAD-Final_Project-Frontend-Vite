import React from "react";
import { Container, Typography, Box } from "@mui/material";
import certificateImg from "./assets/certificate_page-0001.jpg";

function About() {
  return (
    <Box
      sx={{
        backgroundColor: "#e3f2fd", // light blue background
        padding: "60px 0",
      }}
    >
      <Container>
        <Box
          sx={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            flexWrap: "wrap",
          }}
        >
          {/* LEFT SIDE TEXT */}
          <Box sx={{ flex: 1, paddingRight: "30px", minWidth: "300px" }}>
            <Typography
              variant="h3"
              fontWeight="bold"
              gutterBottom
            >
              Manage Certifications Easily
            </Typography>

            <Typography sx={{ marginBottom: "15px", fontSize: "18px" }}>
              Certification Tracker is a web application designed to help
              students and professionals manage all their certifications in one place.
            </Typography>

            <Typography sx={{ marginBottom: "15px", fontSize: "18px" }}>
              Users can store certification details, track expiration dates,
              and receive reminders for renewals so they never miss deadlines.
            </Typography>

            <Typography sx={{ marginBottom: "15px", fontSize: "18px" }}>
              The platform also allows users to securely store certificates and
              access them anytime for verification and professional use.
            </Typography>

            <Typography sx={{ marginBottom: "15px", fontSize: "18px" }}>
              Admins can manage certification records, monitor user progress,
              and ensure smooth certification lifecycle management.
            </Typography>
          </Box>

          {/* RIGHT SIDE IMAGE */}
          <Box
            sx={{
              flex: 1,
              textAlign: "center",
              minWidth: "300px",
              marginTop: { xs: "30px", md: "0" },
            }}
          >
            <img
              src={certificateImg}
              alt="Certificate"
              style={{
                width: "100%",
                maxWidth: "400px",
                borderRadius: "10px",
                boxShadow: "0 4px 15px rgba(0,0,0,0.2)",
              }}
            />
          </Box>
        </Box>
      </Container>
    </Box>
  );
}

export default About;