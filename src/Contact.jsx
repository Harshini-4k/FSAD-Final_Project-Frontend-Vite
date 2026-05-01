import React from "react";
import { Container, Typography } from "@mui/material";

function Contact() {
  return (
    <Container sx={{ marginTop: "50px" }}>
      <Typography variant="h4" fontWeight="bold">
        Contact Us
      </Typography>

      <Typography sx={{ marginTop: "20px" }}>
        Email: certitracker@gmail.com
      </Typography>

      <Typography>
        Phone: +91 9876543210
      </Typography>
    </Container>
  );
}

export default Contact;