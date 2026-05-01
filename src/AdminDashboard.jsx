import React, { useState, useEffect } from "react";
import { Container, Typography, Card, CardContent, Grid, Button, Box, AppBar, Toolbar } from "@mui/material";
import { useNavigate } from "react-router-dom";

function AdminDashboard() {
  const [user, setUser] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    if (!storedUser) {
      navigate("/login");
      return;
    }
    
    const userData = JSON.parse(storedUser);
    if (userData.role !== "ADMIN") {
      navigate("/");
      return;
    }
    
    setUser(userData);
  }, [navigate]);

  if (!user) {
    return <Typography>Loading...</Typography>;
  }

  return (
    <div style={{ backgroundColor: "#f7f9fc", minHeight: "100vh" }}>
      {/* Admin Header */}
      <Box sx={{ backgroundColor: "#1976d2", color: "white", py: 3 }}>
        <Container>
          <Typography variant="h4" fontWeight="bold">
            🛡️ Admin Control Panel
          </Typography>
          <Typography variant="body2" sx={{ mt: 1 }}>
            Logged in as: {user.name} (Admin)
          </Typography>
        </Container>
      </Box>

      <Container sx={{ marginTop: "50px", marginBottom: "50px" }}>
        
        {/* Admin Stats */}
        <Grid container spacing={3} sx={{ mb: 4 }}>
          <Grid item xs={12} md={4}>
            <Card sx={{ borderRadius: "15px", boxShadow: 3, background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)" }}>
              <CardContent sx={{ color: "white", textAlign: "center" }}>
                <Typography variant="h3" fontWeight="bold">0</Typography>
                <Typography variant="h6">Total Users</Typography>
              </CardContent>
            </Card>
          </Grid>

          <Grid item xs={12} md={4}>
            <Card sx={{ borderRadius: "15px", boxShadow: 3, background: "linear-gradient(135deg, #f093fb 0%, #f5576c 100%)" }}>
              <CardContent sx={{ color: "white", textAlign: "center" }}>
                <Typography variant="h3" fontWeight="bold">0</Typography>
                <Typography variant="h6">Active Certifications</Typography>
              </CardContent>
            </Card>
          </Grid>

          <Grid item xs={12} md={4}>
            <Card sx={{ borderRadius: "15px", boxShadow: 3, background: "linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)" }}>
              <CardContent sx={{ color: "white", textAlign: "center" }}>
                <Typography variant="h3" fontWeight="bold">0</Typography>
                <Typography variant="h6">Expiring Soon</Typography>
              </CardContent>
            </Card>
          </Grid>
        </Grid>

        {/* Admin Features */}
        <Typography variant="h5" fontWeight="bold" sx={{ mb: 3 }}>
          Admin Features
        </Typography>

        <Grid container spacing={3}>
          <Grid item xs={12} md={6}>
            <Card sx={{ borderRadius: "15px", boxShadow: 3, transition: "transform 0.3s", "&:hover": { transform: "translateY(-5px)", boxShadow: 5 } }}>
              <CardContent>
                <Typography variant="h6" fontWeight="bold" sx={{ mb: 2 }}>
                  👥 Manage Users
                </Typography>
                <Typography sx={{ mb: 2 }}>
                  View all users, manage their roles, and control permissions.
                </Typography>
                <Button variant="contained" sx={{ backgroundColor: "#1976d2" }}>
                  Manage Users
                </Button>
              </CardContent>
            </Card>
          </Grid>

          <Grid item xs={12} md={6}>
            <Card sx={{ borderRadius: "15px", boxShadow: 3, transition: "transform 0.3s", "&:hover": { transform: "translateY(-5px)", boxShadow: 5 } }}>
              <CardContent>
                <Typography variant="h6" fontWeight="bold" sx={{ mb: 2 }}>
                  📜 Manage Certifications
                </Typography>
                <Typography sx={{ mb: 2 }}>
                  View, update, and delete user certifications from the system.
                </Typography>
                <Button variant="contained" sx={{ backgroundColor: "#1976d2" }}>
                  Manage Certifications
                </Button>
              </CardContent>
            </Card>
          </Grid>

          <Grid item xs={12} md={6}>
            <Card sx={{ borderRadius: "15px", boxShadow: 3, transition: "transform 0.3s", "&:hover": { transform: "translateY(-5px)", boxShadow: 5 } }}>
              <CardContent>
                <Typography variant="h6" fontWeight="bold" sx={{ mb: 2 }}>
                  ⏰ Monitor Expirations
                </Typography>
                <Typography sx={{ mb: 2 }}>
                  Track and monitor upcoming certificate expirations.
                </Typography>
                <Button variant="contained" sx={{ backgroundColor: "#1976d2" }}>
                  View Expirations
                </Button>
              </CardContent>
            </Card>
          </Grid>

          <Grid item xs={12} md={6}>
            <Card sx={{ borderRadius: "15px", boxShadow: 3, transition: "transform 0.3s", "&:hover": { transform: "translateY(-5px)", boxShadow: 5 } }}>
              <CardContent>
                <Typography variant="h6" fontWeight="bold" sx={{ mb: 2 }}>
                  📊 View Reports
                </Typography>
                <Typography sx={{ mb: 2 }}>
                  Generate and view comprehensive reports about user certifications.
                </Typography>
                <Button variant="contained" sx={{ backgroundColor: "#1976d2" }}>
                  View Reports
                </Button>
              </CardContent>
            </Card>
          </Grid>
        </Grid>
      </Container>
    </div>
  );
}

export default AdminDashboard;