import React, { useEffect, useState } from "react";
import { Container, Typography, Paper, Grid, Button, Box } from "@mui/material";
import AssignmentIcon from "@mui/icons-material/Assignment";
import SchoolIcon from "@mui/icons-material/School";
import MenuBookIcon from "@mui/icons-material/MenuBook";
import { useNavigate } from "react-router-dom";

const cardStyles = {
  display: "flex",
  flexDirection: "column",
  alignItems: "center",
  justifyContent: "center",
  p: 4,
  minWidth: 220,
  borderRadius: 3,
  color: "#fff",
  transition: "transform 0.2s, box-shadow 0.2s",
  "&:hover": {
    transform: "scale(1.05)",
    boxShadow: "0 12px 24px rgba(0,0,0,0.2)",
  },
};

const AdminDashboard = () => {
  const navigate = useNavigate();
  const [stats, setStats] = useState({
    applications: 0,
    students: 0,
    courses: 0,
  });
  const [error, setError] = useState("");

  useEffect(() => {
    const token = localStorage.getItem("adminToken");
    if (!token) return navigate("/admin/login");

    const fetchStats = async () => {
      try {
        const [appsRes, studentsRes, coursesRes] = await Promise.all([
          fetch("http://localhost:8000/api/applications/", {
            headers: { Authorization: `Bearer ${token}` },
          }),
          fetch("http://localhost:8000/api/students/", {
            headers: { Authorization: `Bearer ${token}` },
          }),
          fetch("http://localhost:8000/api/courses/", {
            headers: { Authorization: `Bearer ${token}` },
          }),
        ]);

        if (
          [appsRes, studentsRes, coursesRes].some((res) => res.status === 401)
        ) {
          setError("Unauthorized: Please login as admin.");
          return navigate("/admin/login");
        }

        const apps = await appsRes.json();
        const students = await studentsRes.json();
        const courses = await coursesRes.json();

        setStats({
          applications: Array.isArray(apps)
            ? apps.length
            : apps.results?.length || 0,
          students: Array.isArray(students)
            ? students.length
            : students.results?.length || 0,
          courses: Array.isArray(courses)
            ? courses.length
            : courses.results?.length || 0,
        });
      } catch {
        setError("Failed to load dashboard stats.");
      }
    };

    fetchStats();
  }, [navigate]);

  if (error)
    return (
      <Box sx={{ color: "red", p: 3, textAlign: "center" }}>
        <Typography variant="h6">{error}</Typography>
      </Box>
    );

  return (
    <Box
      sx={{
        minHeight: "100vh",
        background: "linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%)",
        py: 6,
      }}
    >
      <Container maxWidth="lg" sx={{ textAlign: "center" }}>
        <Typography
          variant="h3"
          gutterBottom
          sx={{ fontWeight: "bold", mb: 2 }}
        >
          Admin Dashboard
        </Typography>
        <Typography variant="body1" sx={{ mb: 5, maxWidth: 600, mx: "auto" }}>
          Welcome to the administration panel. Manage applications, enroll
          students, and review courses efficiently.
        </Typography>

        <Grid container spacing={4} justifyContent="center">
          {/* Applications Card */}
          <Grid item>
            <Paper
              sx={{
                ...cardStyles,
                background: "linear-gradient(135deg, #667eea, #764ba2)",
              }}
            >
              <AssignmentIcon sx={{ fontSize: 50, mb: 1 }} />
              <Typography variant="h6" sx={{ mb: 1 }}>
                Applications
              </Typography>
              <Typography variant="h3" sx={{ fontWeight: "bold", mb: 2 }}>
                {stats.applications}
              </Typography>
              <Button
                variant="contained"
                color="secondary"
                sx={{ borderRadius: 3, px: 4 }}
                onClick={() => navigate("/admin/applications")}
              >
                Manage Applications
              </Button>
            </Paper>
          </Grid>

          {/* Students Card */}
          <Grid item>
            <Paper
              sx={{
                ...cardStyles,
                background: "linear-gradient(135deg, #43cea2, #185a9d)",
              }}
            >
              <SchoolIcon sx={{ fontSize: 50, mb: 1 }} />
              <Typography variant="h6" sx={{ mb: 1 }}>
                Students
              </Typography>
              <Typography variant="h3" sx={{ fontWeight: "bold", mb: 2 }}>
                {stats.students}
              </Typography>
              <Button
                variant="contained"
                color="secondary"
                sx={{ borderRadius: 3, px: 4 }}
                onClick={() => navigate("/admin/students")}
              >
                View Students
              </Button>
            </Paper>
          </Grid>

          {/* Courses Card */}
          <Grid item>
            <Paper
              sx={{
                ...cardStyles,
                background: "linear-gradient(135deg, #f7971e, #ffd200)",
                color: "#333",
              }}
            >
              <MenuBookIcon sx={{ fontSize: 50, mb: 1 }} />
              <Typography variant="h6" sx={{ mb: 1 }}>
                Courses
              </Typography>
              <Typography variant="h3" sx={{ fontWeight: "bold", mb: 2 }}>
                {stats.courses}
              </Typography>
              <Button
                variant="contained"
                color="secondary"
                sx={{ borderRadius: 3, px: 4 }}
                onClick={() => navigate("/admin/courses")}
              >
                View Courses
              </Button>
            </Paper>
          </Grid>
        </Grid>
      </Container>
    </Box>
  );
};

export default AdminDashboard;
