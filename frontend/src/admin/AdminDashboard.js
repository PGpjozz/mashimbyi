import React from "react";
import { Container, Typography, Box, Button } from "@mui/material";
import { useNavigate } from "react-router-dom";

const AdminDashboard = () => {
  const navigate = useNavigate();

  return (
    <Container sx={{ py: 5, textAlign: "center" }}>
      <Typography variant="h3" gutterBottom>
        Admin Dashboard
      </Typography>
      <Typography variant="body1" sx={{ mb: 4 }}>
        Welcome to the administration panel. Here you can manage applications,
        enroll students, and review program details.
      </Typography>
      <Box sx={{ display: "flex", justifyContent: "center", gap: 3 }}>
        <Button
          variant="contained"
          color="primary"
          size="large"
          onClick={() => navigate("/admin/applications")}
        >
          Manage Applications
        </Button>
        <Button
          variant="outlined"
          color="secondary"
          size="large"
          onClick={() => navigate("/admin/programs")}
        >
          View Programs
        </Button>
      </Box>
    </Container>
  );
};

export default AdminDashboard;
