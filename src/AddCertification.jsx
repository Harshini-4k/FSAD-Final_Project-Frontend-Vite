import React, { useState } from "react";
import axios from "axios";
import { Container, TextField, Button, Typography, Paper, Alert } from "@mui/material";

function AddCertification() {
  const [certificationName, setCertificationName] = useState("");
  const [organization, setOrganization] = useState("");
  const [course, setCourse] = useState("");
  const [issueDate, setIssueDate] = useState("");
  const [expiryDate, setExpiryDate] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    // Validation
    if (!certificationName.trim()) {
      setError("Certification name is required");
      return;
    }

    if (!organization.trim()) {
      setError("Organization is required");
      return;
    }

    if (!issueDate) {
      setError("Issue date is required");
      return;
    }

    if (!expiryDate) {
      setError("Expiry date is required");
      return;
    }

    // Date validation
    const issue = new Date(issueDate);
    const expiry = new Date(expiryDate);
    const today = new Date();

    if (issue > today) {
      setError("Issue date cannot be in the future");
      return;
    }

    if (expiry <= issue) {
      setError("Expiry date must be after the issue date");
      return;
    }

    // Get user ID from localStorage
    const userStr = localStorage.getItem("user");
    if (!userStr) {
      setError("User session expired. Please login again.");
      return;
    }

    const user = JSON.parse(userStr);

    const certification = {
      userId: user.id,
      certificationName: certificationName.trim(),
      organization: organization.trim(),
      course: course.trim(),
      issueDate,
      expiryDate,
      status: "ACTIVE"
    };

    setLoading(true);

    try {
      await axios.post("http://localhost:8080/api/certifications", certification);

      alert("Certification added successfully!");

      // Reset form
      setCertificationName("");
      setOrganization("");
      setCourse("");
      setIssueDate("");
      setExpiryDate("");
    } catch (error) {
      console.error("Error adding certification:", error);
      setError("Failed to add certification. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Container maxWidth="sm" style={{ marginTop: "40px" }}>
      <Paper style={{ padding: "30px" }}>
        <Typography variant="h4" gutterBottom>
          Add Certification
        </Typography>

        {error && (
          <Alert severity="error" sx={{ mb: 2 }}>
            {error}
          </Alert>
        )}

        <form onSubmit={handleSubmit}>
          <TextField
            label="Certification Name"
            fullWidth
            margin="normal"
            value={certificationName}
            onChange={(e) => setCertificationName(e.target.value)}
            required
          />

          <TextField
            label="Organization"
            fullWidth
            margin="normal"
            value={organization}
            onChange={(e) => setOrganization(e.target.value)}
            required
          />

          <TextField
            label="Course"
            fullWidth
            margin="normal"
            value={course}
            onChange={(e) => setCourse(e.target.value)}
          />

          <TextField
            label="Issue Date"
            type="date"
            fullWidth
            margin="normal"
            InputLabelProps={{ shrink: true }}
            value={issueDate}
            onChange={(e) => setIssueDate(e.target.value)}
            required
          />

          <TextField
            label="Expiry Date"
            type="date"
            fullWidth
            margin="normal"
            InputLabelProps={{ shrink: true }}
            value={expiryDate}
            onChange={(e) => setExpiryDate(e.target.value)}
            required
          />

          <Button
            type="submit"
            variant="contained"
            color="primary"
            fullWidth
            style={{ marginTop: "20px" }}
            disabled={loading}
          >
            {loading ? "Saving..." : "Save Certification"}
          </Button>
        </form>
      </Paper>
    </Container>
  );
}

export default AddCertification;