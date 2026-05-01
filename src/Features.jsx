import React from "react";
import { Container, Typography, Grid, Card, CardContent } from "@mui/material";

function Features() {
  return (
    <Container sx={{ marginTop: "50px" }}>
      <Typography variant="h4" fontWeight="bold">
        Features of Certification Tracker
      </Typography>

      <Grid container spacing={3} sx={{ marginTop: "20px" }}>
        <Grid item xs={12} md={4}>
          <Card><CardContent>
            <Typography variant="h6">Add Certifications</Typography>
            <Typography>Users can add certifications easily.</Typography>
          </CardContent></Card>
        </Grid>

        <Grid item xs={12} md={4}>
          <Card><CardContent>
            <Typography variant="h6">Track Expiry Dates</Typography>
            <Typography>Users can track certification expiry.</Typography>
          </CardContent></Card>
        </Grid>

        <Grid item xs={12} md={4}>
          <Card><CardContent>
            <Typography variant="h6">Simple Dashboard</Typography>
            <Typography>All certifications in one place.</Typography>
          </CardContent></Card>
        </Grid>
      </Grid>
    </Container>
  );
}

export default Features;