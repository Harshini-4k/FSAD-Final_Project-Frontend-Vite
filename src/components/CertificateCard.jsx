import React from "react";
import { Card, CardContent, Typography, Box, Chip, Button } from "@mui/material";

function CertificateCard({ certificate, onEdit, onDelete, onRenew, isAdmin }) {
  // Calculate days until expiry
  const getExpiryStatus = (expiryDate) => {
    if (!expiryDate) return "UNKNOWN";
    
    const expiry = new Date(expiryDate);
    const today = new Date();
    const daysUntilExpiry = Math.ceil((expiry - today) / (1000 * 60 * 60 * 24));

    if (daysUntilExpiry < 0) return "EXPIRED";
    if (daysUntilExpiry <= 30) return "EXPIRING_SOON";
    return "ACTIVE";
  };

  const getStatusColor = (status) => {
    switch (status) {
      case "ACTIVE":
        return "#4caf50"; // Green
      case "EXPIRING_SOON":
        return "#ff9800"; // Orange
      case "EXPIRED":
        return "#f44336"; // Red
      default:
        return "#9e9e9e"; // Gray
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

  const status = getExpiryStatus(certificate.expiryDate);
  const daysLeft = Math.ceil((new Date(certificate.expiryDate) - new Date()) / (1000 * 60 * 60 * 24));

  return (
    <Card
      sx={{
        borderLeft: `4px solid ${getStatusColor(status)}`,
        borderRadius: 2,
        boxShadow: 2,
        transition: "transform 0.3s, boxShadow 0.3s",
        "&:hover": {
          transform: "translateY(-5px)",
          boxShadow: 4,
        },
      }}
    >
      <CardContent>
        <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "start", mb: 1 }}>
          <Typography variant="h6" sx={{ fontWeight: "bold", flex: 1 }}>
            {certificate.certificationName}
          </Typography>
          <Chip
            label={getStatusLabel(status)}
            sx={{
              backgroundColor: getStatusColor(status),
              color: "white",
              fontWeight: "bold",
            }}
          />
        </Box>

        <Typography variant="body2" sx={{ color: "#666", mb: 1 }}>
          by {certificate.organization}
        </Typography>

        <Box sx={{ mb: 2, backgroundColor: "#f5f5f5", p: 1.5, borderRadius: 1 }}>
          <Box sx={{ display: "flex", justifyContent: "space-between", mb: 0.5 }}>
            <Typography variant="caption">📅 Issue Date:</Typography>
            <Typography variant="caption" sx={{ fontWeight: "bold" }}>
              {new Date(certificate.issueDate).toLocaleDateString()}
            </Typography>
          </Box>
          <Box sx={{ display: "flex", justifyContent: "space-between", mb: 0.5 }}>
            <Typography variant="caption">⏰ Expiry Date:</Typography>
            <Typography variant="caption" sx={{ fontWeight: "bold", color: getStatusColor(status) }}>
              {new Date(certificate.expiryDate).toLocaleDateString()}
            </Typography>
          </Box>
          <Box sx={{ display: "flex", justifyContent: "space-between" }}>
            <Typography variant="caption">📊 Days Left:</Typography>
            <Typography variant="caption" sx={{ fontWeight: "bold", color: getStatusColor(status) }}>
              {daysLeft > 0 ? `${daysLeft} days` : "Expired"}
            </Typography>
          </Box>
        </Box>

        {isAdmin && (
          <Typography variant="caption" sx={{ color: "#999" }}>
            👤 User ID: {certificate.userId}
          </Typography>
        )}

        <Box sx={{ display: "flex", gap: 1, mt: 2 }}>
          {onEdit && (
            <Button
              size="small"
              variant="outlined"
              onClick={() => onEdit(certificate)}
              sx={{ flex: 1 }}
            >
              Edit
            </Button>
          )}
          {onRenew && status === "EXPIRING_SOON" && (
            <Button
              size="small"
              variant="contained"
              sx={{ flex: 1, backgroundColor: "#ff9800" }}
              onClick={() => onRenew(certificate)}
            >
              Renew
            </Button>
          )}
          {onDelete && (
            <Button
              size="small"
              variant="outlined"
              color="error"
              onClick={() => onDelete(certificate.id)}
              sx={{ flex: 1 }}
            >
              Delete
            </Button>
          )}
        </Box>
      </CardContent>
    </Card>
  );
}

export default CertificateCard;
