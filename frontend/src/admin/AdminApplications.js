import React, { useEffect, useState } from "react";
import {
  Container,
  Typography,
  Table,
  TableHead,
  TableRow,
  TableCell,
  TableBody,
  Button,
  Box,
} from "@mui/material";

const AdminApplications = () => {
  const [applications, setApplications] = useState([]);

  useEffect(() => {
    fetch("http://localhost:8000/api/application/")
      .then((res) => res.json())
      .then((data) => setApplications(data));
  }, []);

  const handleEnroll = async (id) => {
    const res = await fetch(
      `http://localhost:8000/api/application/${id}/enroll/`,
      {
        method: "POST",
      }
    );
    if (res.ok) {
      setApplications((applications) =>
        applications.filter((app) => app.id !== id)
      );
      alert("Applicant enrolled and application deleted successfully!");
    } else {
      alert("Failed to enroll applicant.");
    }
  };

  const handleDelete = async (id) => {
    const res = await fetch(`http://localhost:8000/api/application/${id}/`, {
      method: "DELETE",
    });
    if (res.ok) {
      setApplications((applications) =>
        applications.filter((app) => app.id !== id)
      );
    }
  };

  return (
    <Container sx={{ py: 5 }}>
      <Typography variant="h4" gutterBottom>
        Applications Management
      </Typography>
      <Table>
        <TableHead>
          <TableRow>
            <TableCell>Reference</TableCell>
            <TableCell>Name</TableCell>
            <TableCell>Program</TableCell>
            <TableCell>Actions</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {applications.map((app) => (
            <TableRow key={app.id}>
              <TableCell>{app.reference_number}</TableCell>
              <TableCell>
                {app.first_name} {app.last_name}
              </TableCell>
              <TableCell>{app.program_name || app.program}</TableCell>
              <TableCell>
                <Box sx={{ display: "flex", gap: 1 }}>
                  <Button
                    variant="contained"
                    color="success"
                    size="small"
                    onClick={() => handleEnroll(app.id)}
                  >
                    Enroll
                  </Button>
                  <Button
                    variant="contained"
                    color="error"
                    size="small"
                    onClick={() => handleDelete(app.id)}
                  >
                    Delete
                  </Button>
                </Box>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </Container>
  );
};

export default AdminApplications;
