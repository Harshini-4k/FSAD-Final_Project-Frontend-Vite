import React, { useState, useEffect } from "react";
import {
  Container,
  Box,
  Card,
  CardContent,
  Grid,
  Typography,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  MenuItem,
} from "@mui/material";
import axios from "axios";
import CertificateCard from "./components/CertificateCard";
import { useNavigate } from "react-router-dom";

function UserDashboard() {
  const [user, setUser] = useState(null);
  const [certificates, setCertificates] = useState([]);
  const [loading, setLoading] = useState(false);
  const [openDialog, setOpenDialog] = useState(false);
  const [editingCert, setEditingCert] = useState(null);
  const [stats, setStats] = useState({ active: 0, expiring: 0, expired: 0 });
  const [suggestions, setSuggestions] = useState([]);
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    certificationName: "",
    organization: "",
    course: "",
    issueDate: "",
    expiryDate: "",
  });

  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    if (!storedUser) {
      navigate("/login");
      return;
    }

    const userData = JSON.parse(storedUser);
    if (userData.role !== "USER") {
      navigate("/");
      return;
    }

    setUser(userData);
    fetchUserCertifications(userData.id);
  }, [navigate]);

  const fetchUserCertifications = async (userId) => {
    setLoading(true);
    try {
      console.log("Fetching certifications for user:", userId);
      const response = await axios.get(`http://localhost:8080/api/certifications/user/${userId}`);
      console.log("Certifications fetched:", response.data);
      setCertificates(response.data);
      calculateStats(response.data);
      // Only fetch suggested certificates if user has added at least one
      if (response.data.length > 0) {
        fetchSuggestedCertificates();
      } else {
        setSuggestions([]); // Clear suggestions if no certificates
      }
    } catch (error) {
      console.error("Error fetching certifications:", error);
      if (error.response) {
        console.error("Response error:", error.response.data);
        alert("Error: " + (error.response.data?.message || "Failed to fetch certifications"));
      } else {
        alert("Network error: Check if backend is running on port 8080");
      }
      setCertificates([]);
    } finally {
      setLoading(false);
    }
  };

  const calculateStats = (certs) => {
    let active = 0,
      expiring = 0,
      expired = 0;

    certs.forEach((cert) => {
      // Calculate status based on expiry date to ensure accuracy
      const expiryDate = new Date(cert.expiryDate);
      const today = new Date();
      const daysUntilExpiry = Math.ceil((expiryDate - today) / (1000 * 60 * 60 * 24));

      if (daysUntilExpiry < 0) {
        expired++;
      } else if (daysUntilExpiry <= 30) {
        expiring++;
      } else {
        active++;
      }
    });

    setStats({ active, expiring, expired });
  };

  const fetchSuggestedCertificates = async () => {
    try {
      const response = await axios.get("http://localhost:8080/api/certifications/recommended/harshini");
      setSuggestions(response.data);
    } catch (error) {
      console.error("Error fetching Suggested Certificates:", error);
      setSuggestions([]);
    }
  };

  const handleOpenDialog = (cert = null) => {
    if (cert) {
      setEditingCert(cert);
      setFormData({
        certificationName: cert.certificationName,
        organization: cert.organization,
        course: cert.course || "",
        issueDate: cert.issueDate,
        expiryDate: cert.expiryDate,
      });
    } else {
      setEditingCert(null);
      setFormData({
        certificationName: "",
        organization: "",
        course: "",
        issueDate: "",
        expiryDate: "",
      });
    }
    setOpenDialog(true);
  };

  const handleCloseDialog = () => {
    setOpenDialog(false);
    setEditingCert(null);
  };

  const handleSaveCertification = async () => {
    if (!formData.certificationName || !formData.organization) {
      alert("Please fill in all required fields");
      return;
    }

    if (!formData.issueDate || !formData.expiryDate) {
      alert("Please select both issue and expiry dates");
      return;
    }

    try {
      console.log("Saving certification for user:", user.id, "Data:", formData);
      
      if (editingCert) {
        // Update existing
        const response = await axios.put(`http://localhost:8080/api/certifications/${editingCert.id}`, {
          ...formData,
          userId: user.id,
        });
        console.log("Update response:", response.data);
        alert("Certification updated successfully!");
      } else {
        // Add new
        const response = await axios.post("http://localhost:8080/api/certifications", {
          ...formData,
          userId: user.id,
          status: "ACTIVE",
        });
        console.log("Add response:", response.data);
        alert("Certification added successfully!");
      }

      handleCloseDialog();
      fetchUserCertifications(user.id);
    } catch (error) {
      console.error("Error saving certification:", error);
      console.error("Error details:", error.response?.data);
      const errorMsg = error.response?.data?.message || error.message || "Unknown error";
      alert("Error saving certification: " + errorMsg);
    }
  };

  const handleDeleteCertification = async (certId) => {
    if (window.confirm("Are you sure you want to delete this certification?")) {
      try {
        await axios.delete(`http://localhost:8080/api/certifications/${certId}`);
        alert("Certification deleted successfully!");
        fetchUserCertifications(user.id);
      } catch (error) {
        console.error("Error deleting certification:", error);
        alert("Error deleting certification");
      }
    }
  };

  const handleRenewCertification = (cert) => {
    alert(`Renewal process for "${cert.certificationName}" initiated!`);
    // In a real app, this would trigger a renewal workflow
  };

  if (!user) {
    return <Typography>Loading...</Typography>;
  }

  return (
    <div style={{ backgroundColor: "#f7f9fc", minHeight: "100vh", pb: 4 }}>
      {/* Header */}
      <Box sx={{ backgroundColor: "#1976d2", color: "white", py: 3 }}>
        <Container>
          <Typography variant="h4" fontWeight="bold">
            📜 My Certifications
          </Typography>
          <Typography variant="body2" sx={{ mt: 1 }}>
            Welcome, {user.name}! Manage and track your professional certifications
          </Typography>
        </Container>
      </Box>

      <Container sx={{ mt: 4, mb: 4 }}>
        {/* Statistics */}
        <Grid container spacing={3} sx={{ mb: 4 }}>
          <Grid item xs={12} md={4}>
            <Card sx={{ borderRadius: 2, background: "linear-gradient(135deg, #4caf50 0%, #45a049 100%)" }}>
              <CardContent sx={{ color: "white", textAlign: "center" }}>
                <Typography variant="h3" fontWeight="bold">
                  {stats.active}
                </Typography>
                <Typography variant="h6">✓ Active</Typography>
              </CardContent>
            </Card>
          </Grid>

          <Grid item xs={12} md={4}>
            <Card sx={{ borderRadius: 2, background: "linear-gradient(135deg, #ff9800 0%, #f57c00 100%)" }}>
              <CardContent sx={{ color: "white", textAlign: "center" }}>
                <Typography variant="h3" fontWeight="bold">
                  {stats.expiring}
                </Typography>
                <Typography variant="h6">⚠️ Expiring Soon</Typography>
              </CardContent>
            </Card>
          </Grid>

          <Grid item xs={12} md={4}>
            <Card sx={{ borderRadius: 2, background: "linear-gradient(135deg, #f44336 0%, #da190b 100%)" }}>
              <CardContent sx={{ color: "white", textAlign: "center" }}>
                <Typography variant="h3" fontWeight="bold">
                  {stats.expired}
                </Typography>
                <Typography variant="h6">✗ Expired</Typography>
              </CardContent>
            </Card>
          </Grid>
        </Grid>

        {/* Add Button */}
        <Box sx={{ mb: 3 }}>
          <Button
            variant="contained"
            sx={{
              backgroundColor: "#1976d2",
              color: "white",
              padding: "10px 20px",
              fontSize: "16px",
              fontWeight: "bold",
            }}
            onClick={() => handleOpenDialog()}
          >
            ➕ Add New Certification
          </Button>
        </Box>

        {/* My Certificates Section */}
        <Box sx={{ mb: 3, mt: 2 }}>
          <Typography variant="h5" sx={{ mb: 2, fontWeight: "bold", color: "#1976d2" }}>
            My Certificates
          </Typography>
          {loading ? (
            <Typography>Loading your certificates...</Typography>
          ) : certificates.length === 0 ? (
            <Card sx={{ p: 3, textAlign: "center", boxShadow: 2 }}>
              <Typography variant="h6">No certificates added yet</Typography>
              <Typography variant="body2" sx={{ color: "#666", mt: 1 }}>
                Click "Add New Certification" to get started!
              </Typography>
            </Card>
          ) : (
            <Grid container spacing={3}>
              {certificates.map((cert) => (
                <Grid item xs={12} md={6} lg={4} key={cert.id}>
                  <CertificateCard
                    certificate={cert}
                    onEdit={handleOpenDialog}
                    onDelete={handleDeleteCertification}
                    onRenew={handleRenewCertification}
                    isAdmin={false}
                  />
                </Grid>
              ))}
            </Grid>
          )}
        </Box>

        {/* Suggested Certificates - Only show when user has added certificates */}
        {certificates.length > 0 && suggestions.length > 0 && (
          <Box sx={{ mt: 4 }}>
            <Typography variant="h5" sx={{ mb: 2, fontWeight: "bold", color: "#1976d2" }}>
              Suggested Certificates
            </Typography>
            <Typography variant="body2" sx={{ mb: 3, color: "#666" }}>
              Based on your certifications, here are other courses you may want to consider:
            </Typography>
            <Grid container spacing={3}>
              {suggestions.slice(0, 6).map((cert) => (
                <Grid item xs={12} md={6} lg={4} key={cert.id}>
                  <Card sx={{ borderRadius: 2, boxShadow: 2, border: "1px solid #e0e0e0" }}>
                    <CardContent>
                      <Typography variant="h6" fontWeight="bold" sx={{ color: "#1976d2" }}>
                        {cert.certificationName}
                      </Typography>
                      <Typography variant="body2" sx={{ color: "#666", mt: 1 }}>
                        {cert.organization}
                      </Typography>
                      <Typography variant="body2" sx={{ color: "#666" }}>
                        Course: {cert.course}
                      </Typography>
                      <Typography variant="body2" sx={{ color: "#666" }}>
                        Expires: {cert.expiryDate}
                      </Typography>
                    </CardContent>
                  </Card>
                </Grid>
              ))}
            </Grid>
          </Box>
        )}
      </Container>

      {/* Add/Edit Dialog */}
      <Dialog open={openDialog} onClose={handleCloseDialog} maxWidth="sm" fullWidth>
        <DialogTitle sx={{ fontWeight: "bold" }}>
          {editingCert ? "Edit Certification" : "Add New Certification"}
        </DialogTitle>
        <DialogContent sx={{ pt: 2 }}>
          <TextField
            label="Certification Name"
            placeholder="e.g., AWS Certified Solutions Architect"
            fullWidth
            value={formData.certificationName}
            onChange={(e) => setFormData({ ...formData, certificationName: e.target.value })}
            sx={{ mb: 2 }}
          />

          <TextField
            label="Organization"
            placeholder="e.g., Amazon Web Services"
            fullWidth
            value={formData.organization}
            onChange={(e) => setFormData({ ...formData, organization: e.target.value })}
            sx={{ mb: 2 }}
          />

          <TextField
            label="Course"
            placeholder="e.g., Cloud Computing"
            fullWidth
            value={formData.course}
            onChange={(e) => setFormData({ ...formData, course: e.target.value })}
            sx={{ mb: 2 }}
          />

          <TextField
            label="Issue Date"
            type="date"
            fullWidth
            InputLabelProps={{ shrink: true }}
            value={formData.issueDate}
            onChange={(e) => setFormData({ ...formData, issueDate: e.target.value })}
            sx={{ mb: 2 }}
          />

          <TextField
            label="Expiry Date"
            type="date"
            fullWidth
            InputLabelProps={{ shrink: true }}
            value={formData.expiryDate}
            onChange={(e) => setFormData({ ...formData, expiryDate: e.target.value })}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseDialog}>Cancel</Button>
          <Button
            onClick={handleSaveCertification}
            variant="contained"
            sx={{ backgroundColor: "#1976d2" }}
          >
            {editingCert ? "Update" : "Add"} Certification
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  );
}

export default UserDashboard;