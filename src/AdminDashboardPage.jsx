import React, { useState, useEffect } from "react";
import {
  Container,
  Typography,
  Card,
  CardContent,
  Grid,
  Button,
  Box,
  TextField,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Chip,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
} from "@mui/material";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import CertificateCard from "./components/CertificateCard";

function AdminDashboardPage() {
  const [user, setUser] = useState(null);
  const [certificates, setCertificates] = useState([]);
  const [loading, setLoading] = useState(false);
  const [viewMode, setViewMode] = useState("cards"); // cards or table
  const [stats, setStats] = useState({
    total: 0,
    active: 0,
    expiring: 0,
    expired: 0,
  });
  const [filterStatus, setFilterStatus] = useState("ALL");
  const [openDialog, setOpenDialog] = useState(false);
  const [editingCert, setEditingCert] = useState(null);
  const [formData, setFormData] = useState({
    userId: "",
    certificationName: "",
    organization: "",
    issueDate: "",
    expiryDate: "",
    status: "ACTIVE",
  });

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
    fetchAllCertifications();
  }, [navigate]);

  const fetchAllCertifications = async () => {
    setLoading(true);
    try {
      console.log("Fetching all certifications from admin dashboard");
      const response = await axios.get("http://localhost:8080/api/certifications");
      console.log("Certifications fetched:", response.data);
      setCertificates(response.data);
      calculateStats(response.data);
    } catch (error) {
      console.error("Error fetching certifications:", error);
      if (error.response) {
        console.error("Response error:", error.response.data);
        alert("Error: " + (error.response.data?.message || "Failed to fetch certifications"));
      } else {
        alert("Network error: Check if backend is running on port 8081");
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
    const userIds = new Set();

    certs.forEach((cert) => {
      if (cert.userId != null) {
        userIds.add(cert.userId);
      }

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

    setStats((prevStats) => ({
      ...prevStats,
      total: certs.length,
      active,
      expiring,
      expired,
    }));
  };

  const getDerivedStatus = (cert) => {
    const expiryDate = cert.expiryDate ? new Date(cert.expiryDate) : null;
    if (!expiryDate) return "UNKNOWN";

    const today = new Date();
    const daysUntilExpiry = Math.ceil((expiryDate - today) / (1000 * 60 * 60 * 24));

    if (daysUntilExpiry < 0) return "EXPIRED";
    if (daysUntilExpiry <= 30) return "EXPIRING_SOON";
    return "ACTIVE";
  };

  const getFilteredCertificates = () => {
    if (filterStatus === "ALL") {
      return certificates;
    }
    return certificates.filter((cert) => getDerivedStatus(cert) === filterStatus);
  };

  const getStatusColor = (status) => {
    switch (status) {
      case "ACTIVE":
        return "#4caf50";
      case "EXPIRING_SOON":
        return "#ff9800";
      case "EXPIRED":
        return "#f44336";
      default:
        return "#9e9e9e";
    }
  };

  const getStatusLabel = (status) => {
    switch (status) {
      case "ACTIVE":
        return "✓ Active";
      case "EXPIRING_SOON":
        return "⚠️ Expiring Soon";
      case "EXPIRED":
        return "✗ Expired";
      default:
        return "Unknown";
    }
  };

  const handleInitializeSampleData = async () => {
    if (window.confirm("Are you sure? This will add sample certification data.")) {
      try {
        const response = await axios.post("http://localhost:8080/api/certifications/sample/init");
        alert(response.data.message);
        fetchAllCertifications();
      } catch (error) {
        console.error("Error initializing sample data:", error);
        alert("Error initializing sample data");
      }
    }
  };

  const handleOpenDialog = (cert = null) => {
    if (cert) {
      setEditingCert(cert);
      setFormData({
        userId: cert.userId,
        certificationName: cert.certificationName,
        organization: cert.organization,
        issueDate: cert.issueDate,
        expiryDate: cert.expiryDate,
        status: cert.status,
      });
    } else {
      setEditingCert(null);
      setFormData({
        userId: "",
        certificationName: "",
        organization: "",
        issueDate: "",
        expiryDate: "",
        status: "ACTIVE",
      });
    }
    setOpenDialog(true);
  };

  const handleCloseDialog = () => {
    setOpenDialog(false);
    setEditingCert(null);
  };

  const handleSaveCertification = async () => {
    if (!formData.userId || !formData.certificationName || !formData.organization) {
      alert("Please fill in all required fields");
      return;
    }

    try {
      if (editingCert) {
        await axios.put(`http://localhost:8080/api/certifications/${editingCert.id}`, formData);
        alert("Certification updated successfully!");
      } else {
        await axios.post("http://localhost:8080/api/certifications", formData);
        alert("Certification added successfully!");
      }
      handleCloseDialog();
      fetchAllCertifications();
    } catch (error) {
      console.error("Error saving certification:", error);
      alert("Error saving certification");
    }
  };

  const handleDeleteCertification = async (certId) => {
    if (window.confirm("Are you sure you want to delete this certification?")) {
      try {
        await axios.delete(`http://localhost:8080/api/certifications/${certId}`);
        alert("Certification deleted successfully!");
        fetchAllCertifications();
      } catch (error) {
        console.error("Error deleting certification:", error);
        alert("Error deleting certification");
      }
    }
  };

  if (!user) {
    return <Typography>Loading...</Typography>;
  }

  const filteredCerts = getFilteredCertificates();

  return (
    <div style={{ backgroundColor: "#f7f9fc", minHeight: "100vh", pb: 4 }}>
      {/* Header */}
      <Box sx={{ backgroundColor: "#1976d2", color: "white", py: 3 }}>
        <Container>
          <Typography variant="h4" fontWeight="bold">
            🛡️ Admin Certification Management
          </Typography>
          <Typography variant="body2" sx={{ mt: 1 }}>
            Logged in as: {user.name} (Admin)
          </Typography>
        </Container>
      </Box>

      <Container sx={{ mt: 4, mb: 4 }}>
        {/* Statistics Cards */}
        <Grid container spacing={3} sx={{ mb: 4 }}>
          <Grid item xs={12} sm={6} md={3}>
            <Card sx={{ borderRadius: 2, background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)" }}>
              <CardContent sx={{ color: "white", textAlign: "center" }}>
                <Typography variant="h3" fontWeight="bold">
                  {stats.total}
                </Typography>
                <Typography variant="h6">Total Certifications</Typography>
              </CardContent>
            </Card>
          </Grid>

          <Grid item xs={12} sm={6} md={3}>
            <Card sx={{ borderRadius: 2, background: "linear-gradient(135deg, #4caf50 0%, #45a049 100%)" }}>
              <CardContent sx={{ color: "white", textAlign: "center" }}>
                <Typography variant="h3" fontWeight="bold">
                  {stats.active}
                </Typography>
                <Typography variant="h6">✓ Active</Typography>
              </CardContent>
            </Card>
          </Grid>

          <Grid item xs={12} sm={6} md={3}>
            <Card sx={{ borderRadius: 2, background: "linear-gradient(135deg, #ff9800 0%, #f57c00 100%)" }}>
              <CardContent sx={{ color: "white", textAlign: "center" }}>
                <Typography variant="h3" fontWeight="bold">
                  {stats.expiring}
                </Typography>
                <Typography variant="h6">⚠️ Expiring Soon</Typography>
              </CardContent>
            </Card>
          </Grid>

          <Grid item xs={12} sm={6} md={3}>
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

        {/* Actions Bar */}
        <Box sx={{ display: "flex", gap: 2, mb: 3, flexWrap: "wrap" }}>
          <Button
            variant="contained"
            sx={{ backgroundColor: "#1976d2" }}
            onClick={() => handleOpenDialog()}
          >
            ➕ Add Certification
          </Button>

          <Button
            variant="outlined"
            onClick={handleInitializeSampleData}
          >
            📊 Load Sample Data
          </Button>

          <FormControl sx={{ minWidth: 150 }}>
            <InputLabel>Filter by Status</InputLabel>
            <Select
              value={filterStatus}
              label="Filter by Status"
              onChange={(e) => setFilterStatus(e.target.value)}
            >
              <MenuItem value="ALL">All Certifications</MenuItem>
              <MenuItem value="ACTIVE">✓ Active</MenuItem>
              <MenuItem value="EXPIRING_SOON">⚠️ Expiring Soon</MenuItem>
              <MenuItem value="EXPIRED">✗ Expired</MenuItem>
            </Select>
          </FormControl>

          <FormControl sx={{ minWidth: 150 }}>
            <InputLabel>View Mode</InputLabel>
            <Select
              value={viewMode}
              label="View Mode"
              onChange={(e) => setViewMode(e.target.value)}
            >
              <MenuItem value="cards">📇 Card View</MenuItem>
              <MenuItem value="table">📋 Table View</MenuItem>
            </Select>
          </FormControl>
        </Box>

        {/* Certificates Display */}
        {loading ? (
          <Typography>Loading certifications...</Typography>
        ) : filteredCerts.length === 0 ? (
          <Card sx={{ p: 3, textAlign: "center" }}>
            <Typography variant="h6">No certifications found</Typography>
            <Typography variant="body2" sx={{ color: "#666", mt: 1 }}>
              {filterStatus === "ALL" ? "Add new certifications or load sample data" : "No certifications with this status"}
            </Typography>
          </Card>
        ) : viewMode === "cards" ? (
          <Grid container spacing={3}>
            {filteredCerts.map((cert) => (
              <Grid item xs={12} md={6} lg={4} key={cert.id}>
                <CertificateCard
                  certificate={cert}
                  onEdit={handleOpenDialog}
                  onDelete={handleDeleteCertification}
                  isAdmin={true}
                />
              </Grid>
            ))}
          </Grid>
        ) : (
          <TableContainer component={Card} sx={{ width: "100%", overflowX: "auto" }}>
            <Table>
              <TableHead sx={{ backgroundColor: "#f5f5f5" }}>
                <TableRow>
                  <TableCell sx={{ fontWeight: "bold" }}>Certification Name</TableCell>
                  <TableCell sx={{ fontWeight: "bold" }}>Organization</TableCell>
                  <TableCell sx={{ fontWeight: "bold" }}>User ID</TableCell>
                  <TableCell sx={{ fontWeight: "bold" }}>Issue Date</TableCell>
                  <TableCell sx={{ fontWeight: "bold" }}>Expiry Date</TableCell>
                  <TableCell sx={{ fontWeight: "bold" }}>Status</TableCell>
                  <TableCell sx={{ fontWeight: "bold" }} align="center">
                    Actions
                  </TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {filteredCerts.map((cert) => (
                  <TableRow key={cert.id} hover>
                    <TableCell>{cert.certificationName}</TableCell>
                    <TableCell>{cert.organization}</TableCell>
                    <TableCell>{cert.userId}</TableCell>
                    <TableCell>{new Date(cert.issueDate).toLocaleDateString()}</TableCell>
                    <TableCell>{new Date(cert.expiryDate).toLocaleDateString()}</TableCell>
                    <TableCell>
                      <Chip
                        label={getStatusLabel(getDerivedStatus(cert))}
                        sx={{
                          backgroundColor: getStatusColor(getDerivedStatus(cert)),
                          color: "white",
                        }}
                      />
                    </TableCell>
                    <TableCell align="center">
                      <Button
                        size="small"
                        onClick={() => handleOpenDialog(cert)}
                        sx={{ mr: 1 }}
                      >
                        Edit
                      </Button>
                      <Button
                        size="small"
                        color="error"
                        onClick={() => handleDeleteCertification(cert.id)}
                      >
                        Delete
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        )}
      </Container>

      {/* Add/Edit Dialog */}
      <Dialog open={openDialog} onClose={handleCloseDialog} maxWidth="sm" fullWidth>
        <DialogTitle sx={{ fontWeight: "bold" }}>
          {editingCert ? "Edit Certification" : "Add New Certification"}
        </DialogTitle>
        <DialogContent sx={{ pt: 2 }}>
          <TextField
            label="User ID"
            type="number"
            fullWidth
            value={formData.userId}
            onChange={(e) => setFormData({ ...formData, userId: e.target.value })}
            sx={{ mb: 2 }}
          />

          <TextField
            label="Certification Name"
            fullWidth
            value={formData.certificationName}
            onChange={(e) => setFormData({ ...formData, certificationName: e.target.value })}
            sx={{ mb: 2 }}
          />

          <TextField
            label="Organization"
            fullWidth
            value={formData.organization}
            onChange={(e) => setFormData({ ...formData, organization: e.target.value })}
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
            sx={{ mb: 2 }}
          />

          <FormControl fullWidth>
            <InputLabel>Status</InputLabel>
            <Select
              value={formData.status}
              label="Status"
              onChange={(e) => setFormData({ ...formData, status: e.target.value })}
            >
              <MenuItem value="ACTIVE">✓ Active</MenuItem>
              <MenuItem value="EXPIRING_SOON">⚠️ Expiring Soon</MenuItem>
              <MenuItem value="EXPIRED">✗ Expired</MenuItem>
            </Select>
          </FormControl>
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

export default AdminDashboardPage;
