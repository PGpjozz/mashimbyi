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
  Link,
} from "@mui/material";
import { useNavigate } from "react-router-dom";

const AdminApplications = () => {
  const [applications, setApplications] = useState([]);
  const [error, setError] = useState("");
  const token = localStorage.getItem("adminToken"); // JWT stored after admin login
  const navigate = useNavigate();

  useEffect(() => {
    const fetchApplications = async () => {
      if (!token) {
        navigate("/admin/login");
        return;
      }
      try {
        const res = await fetch("http://localhost:8000/api/applications/", {
          headers: {
            Authorization: `Bearer ${token}`, // token from localStorage
          },
        });
        if (res.status === 401) {
          setError("Unauthorized: Please login as admin.");
          navigate("/admin/login");
          return;
        }
        const data = await res.json();
        setApplications(Array.isArray(data) ? data : data.results || []);
      } catch {
        setError("Failed to load applications.");
      }
    };
    fetchApplications();
  }, [token, navigate]);

  const handleDelete = async (id) => {
    const res = await fetch(`http://localhost:8000/api/applications/${id}/`, {
      method: "DELETE",
      headers: { Authorization: `Bearer ${token}` },
    });
    if (res.ok) setApplications(applications.filter((a) => a.id !== id));
  };

  const handleEnroll = async (id) => {
    const res = await fetch(
      `http://localhost:8000/api/applications/${id}/enroll/`,
      {
        method: "POST",
        headers: { Authorization: `Bearer ${token}` },
      }
    );
    if (res.ok) {
      alert("Application enrolled as student!");
      // Remove application from the list after enrolling
      setApplications(applications.filter((a) => a.id !== id));
    }
  };

  if (error) return <div style={{ color: "red", padding: 20 }}>{error}</div>;

  return (
    <Container sx={{ py: 5 }}>
      <Typography variant="h4" gutterBottom>
        Manage Applications
      </Typography>
      <Table>
        <TableHead>
          <TableRow>
            <TableCell>Full Name</TableCell>
            <TableCell>Email</TableCell>
            <TableCell>Phone</TableCell>
            <TableCell>Course</TableCell>
            <TableCell>CV</TableCell>
            <TableCell>ID</TableCell>
            <TableCell>Qualification</TableCell>
            <TableCell>Actions</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {applications.length === 0 ? (
            <TableRow>
              <TableCell colSpan={8} align="center">
                No applications found.
              </TableCell>
            </TableRow>
          ) : (
            applications.map((app) => (
              <TableRow key={app.id}>
                <TableCell>{`${app.first_name} ${app.middle_name} ${app.surname}`}</TableCell>
                <TableCell>{app.email}</TableCell>
                <TableCell>{app.phone}</TableCell>
                <TableCell>{app.course_name || app.course}</TableCell>
                <TableCell>
                  {app.cv ? (
                    <a
                      href={app.cv} // use as-is, don’t prepend localhost:8000
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      View CV
                    </a>
                  ) : (
                    "-"
                  )}
                </TableCell>
                <TableCell>
                  {app.id_doc ? (
                    <a
                      href={app.id_doc} // use as-is, don’t prepend localhost:8000
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      View ID Document
                    </a>
                  ) : (
                    "-"
                  )}
                </TableCell>
                <TableCell>
                  {app.qualification_doc ? (
                    <a
                      href={app.qualification_doc} // use as-is, don’t prepend localhost:8000
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      View Qualification Document
                    </a>
                  ) : (
                    "-"
                  )}
                </TableCell>
                <TableCell>
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
                    sx={{ ml: 1 }}
                  >
                    Delete
                  </Button>
                </TableCell>
              </TableRow>
            ))
          )}
        </TableBody>
      </Table>
    </Container>
  );
};

export default AdminApplications;
