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
  Paper,
  Box,
  Chip,
  Tooltip,
  TextField,
  MenuItem,
  CircularProgress,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  InputAdornment,
  IconButton,
} from "@mui/material";
import { useNavigate } from "react-router-dom";
import PersonIcon from "@mui/icons-material/Person";
import EmailIcon from "@mui/icons-material/Email";
import PhoneIcon from "@mui/icons-material/Phone";
import SchoolIcon from "@mui/icons-material/School";
import DescriptionIcon from "@mui/icons-material/Description";
import DeleteIcon from "@mui/icons-material/Delete";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import SearchIcon from "@mui/icons-material/Search";
import ArrowUpwardIcon from "@mui/icons-material/ArrowUpward";
import ArrowDownwardIcon from "@mui/icons-material/ArrowDownward";

const AdminApplications = () => {
  const [applications, setApplications] = useState([]);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [sortField, setSortField] = useState("first_name");
  const [sortOrder, setSortOrder] = useState("asc");
  const [confirmOpen, setConfirmOpen] = useState(false);
  const [deleteId, setDeleteId] = useState(null);
  const [courses, setCourses] = useState([]);
  const [filterCourse, setFilterCourse] = useState("");
  const token = localStorage.getItem("adminToken");
  const navigate = useNavigate();

  useEffect(() => {
    if (!token) return navigate("/admin/login");

    const fetchApplications = async () => {
      setLoading(true);
      try {
        const res = await fetch(
          "https://sogwa-81485d33beca.herokuapp.com/api/applications/",
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );
        if (res.status === 401) {
          setError("Unauthorized: Please login as admin.");
          return navigate("/admin/login");
        }
        const data = await res.json();
        setApplications(Array.isArray(data) ? data : data.results || []);
      } catch {
        setError("Failed to load applications.");
      }
      setLoading(false);
    };

    const fetchCourses = async () => {
      try {
        const res = await fetch(
          "https://sogwa-81485d33beca.herokuapp.com/api/courses/",
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );
        const data = await res.json();
        setCourses(Array.isArray(data) ? data : data.results || []);
      } catch {
        setCourses([]);
      }
    };

    fetchApplications();
    fetchCourses();
  }, [token, navigate]);

  const handleDelete = async (id) => {
    setConfirmOpen(false);
    setLoading(true);
    const res = await fetch(
      `https://sogwa-81485d33beca.herokuapp.com/api/applications/${id}/`,
      {
        method: "DELETE",
        headers: { Authorization: `Bearer ${token}` },
      }
    );
    if (res.ok) setApplications(applications.filter((a) => a.id !== id));
    setLoading(false);
  };

  const handleEnroll = async (id) => {
    setLoading(true);
    const res = await fetch(
      `https://sogwa-81485d33beca.herokuapp.com/api/applications/${id}/enroll/`,
      { method: "POST", headers: { Authorization: `Bearer ${token}` } }
    );
    if (res.ok) setApplications(applications.filter((a) => a.id !== id));
    setLoading(false);
  };

  // --- Search, Sort, Filter Logic ---
  const filteredApplications = applications
    .filter((app) => {
      const searchText = search.toLowerCase();
      const matchesSearch =
        app.first_name?.toLowerCase().includes(searchText) ||
        app.middle_name?.toLowerCase().includes(searchText) ||
        app.surname?.toLowerCase().includes(searchText) ||
        app.email?.toLowerCase().includes(searchText) ||
        app.phone?.toLowerCase().includes(searchText);
      const matchesCourse =
        !filterCourse ||
        app.course_name === filterCourse ||
        app.course === filterCourse;
      return matchesSearch && matchesCourse;
    })
    .sort((a, b) => {
      let valA = a[sortField] || "";
      let valB = b[sortField] || "";
      if (typeof valA === "string") valA = valA.toLowerCase();
      if (typeof valB === "string") valB = valB.toLowerCase();
      return sortOrder === "asc"
        ? valA < valB
          ? -1
          : valA > valB
          ? 1
          : 0
        : valA > valB
        ? -1
        : valA < valB
        ? 1
        : 0;
    });

  if (error)
    return (
      <Box sx={{ color: "red", p: 3, textAlign: "center" }}>
        <Typography variant="h6">{error}</Typography>
      </Box>
    );

  return (
    <Container sx={{ py: 5 }}>
      <Typography variant="h4" gutterBottom sx={{ fontWeight: "bold" }}>
        <PersonIcon sx={{ mr: 1, verticalAlign: "middle" }} />
        Manage Applications
      </Typography>

      <Paper sx={{ p: 3, mb: 4, boxShadow: 3, borderRadius: 2 }}>
        <Typography variant="body1" color="text.secondary">
          Review, enroll, or delete training applications. Click document links
          to view files.
        </Typography>
      </Paper>

      {/* Search/Filter/Sort Row */}
      <Box
        sx={{
          display: "flex",
          flexWrap: "wrap",
          gap: 2,
          mb: 3,
          alignItems: "center",
        }}
      >
        <TextField
          label="Search"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          size="small"
          sx={{ minWidth: 200 }}
          InputProps={{
            endAdornment: (
              <InputAdornment position="end">
                <SearchIcon />
              </InputAdornment>
            ),
          }}
        />
        <TextField
          select
          label="Filter by Course"
          value={filterCourse}
          onChange={(e) => setFilterCourse(e.target.value)}
          size="small"
          sx={{ minWidth: 200 }}
        >
          <MenuItem value="">All Courses</MenuItem>
          {courses.map((course) => (
            <MenuItem key={course.id} value={course.name}>
              {course.name}
            </MenuItem>
          ))}
        </TextField>
        <TextField
          select
          label="Sort by"
          value={sortField}
          onChange={(e) => setSortField(e.target.value)}
          size="small"
          sx={{ minWidth: 150 }}
        >
          <MenuItem value="first_name">First Name</MenuItem>
          <MenuItem value="surname">Surname</MenuItem>
          <MenuItem value="email">Email</MenuItem>
          <MenuItem value="course_name">Course</MenuItem>
        </TextField>
        <IconButton
          onClick={() =>
            setSortOrder((prev) => (prev === "asc" ? "desc" : "asc"))
          }
          color="primary"
        >
          {sortOrder === "asc" ? <ArrowUpwardIcon /> : <ArrowDownwardIcon />}
        </IconButton>
      </Box>

      {loading ? (
        <Box sx={{ display: "flex", justifyContent: "center", py: 5 }}>
          <CircularProgress />
        </Box>
      ) : (
        <Paper sx={{ borderRadius: 2, overflowX: "auto", boxShadow: 3 }}>
          <Table sx={{ minWidth: 800 }}>
            <TableHead>
              <TableRow sx={{ backgroundColor: "#f5f5f5" }}>
                <TableCell>
                  <PersonIcon fontSize="small" /> Full Name
                </TableCell>
                <TableCell>
                  <EmailIcon fontSize="small" /> Email
                </TableCell>
                <TableCell>
                  <PhoneIcon fontSize="small" /> Phone
                </TableCell>
                <TableCell>
                  <SchoolIcon fontSize="small" /> Course
                </TableCell>
                <TableCell>Intake Month</TableCell>
                <TableCell>Application Date</TableCell>
                <TableCell>
                  <DescriptionIcon fontSize="small" /> CV
                </TableCell>
                <TableCell>
                  <DescriptionIcon fontSize="small" /> ID
                </TableCell>
                <TableCell>
                  <DescriptionIcon fontSize="small" /> Qualification
                </TableCell>
                <TableCell>Actions</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {filteredApplications.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={8} align="center">
                    <Chip label="No applications found." color="warning" />
                  </TableCell>
                </TableRow>
              ) : (
                filteredApplications.map((app) => (
                  <TableRow key={app.id} hover>
                    <TableCell>{`${app.first_name} ${app.middle_name} ${app.surname}`}</TableCell>
                    <TableCell>{app.email}</TableCell>
                    <TableCell>{app.phone}</TableCell>
                    <TableCell>
                      <Chip
                        label={app.course_name || app.course}
                        color="primary"
                        size="small"
                      />
                    </TableCell>
                    <TableCell>
                      <Chip
                        label={app.enrollment_month || "-"}
                        color="info"
                        size="small"
                      />
                    </TableCell>
                    <TableCell>
                      <Chip
                        label={
                          app.application_date
                            ? new Date(
                                app.application_date
                              ).toLocaleDateString()
                            : "-"
                        }
                        color="default"
                        size="small"
                      />
                    </TableCell>
                    <TableCell>
                      {app.cv_url ? (
                        <a
                          href={app.cv_url}
                          target="_blank"
                          rel="noopener noreferrer"
                          style={{ color: "#1976d2", fontWeight: 500 }}
                        >
                          View CV
                        </a>
                      ) : (
                        <Chip label="-" size="small" />
                      )}
                    </TableCell>
                    <TableCell>
                      {app.id_doc_url ? (
                        <a
                          href={app.id_doc_url}
                          target="_blank"
                          rel="noopener noreferrer"
                          style={{ color: "#1976d2", fontWeight: 500 }}
                        >
                          View ID
                        </a>
                      ) : (
                        <Chip label="-" size="small" />
                      )}
                    </TableCell>
                    <TableCell>
                      {app.qualification_doc_url ? (
                        <a
                          href={app.qualification_doc_url}
                          target="_blank"
                          rel="noopener noreferrer"
                          style={{ color: "#1976d2", fontWeight: 500 }}
                        >
                          View Qualification
                        </a>
                      ) : (
                        <Chip label="-" size="small" />
                      )}
                    </TableCell>
                    <TableCell>
                      <Button
                        variant="contained"
                        color="success"
                        size="small"
                        startIcon={<CheckCircleIcon />}
                        onClick={() => handleEnroll(app.id)}
                        sx={{ mr: 1 }}
                      >
                        Enroll
                      </Button>
                      <Button
                        variant="contained"
                        color="error"
                        size="small"
                        startIcon={<DeleteIcon />}
                        onClick={() => {
                          setDeleteId(app.id);
                          setConfirmOpen(true);
                        }}
                      >
                        Delete
                      </Button>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </Paper>
      )}

      {/* Confirm Delete Dialog */}
      <Dialog
        open={confirmOpen}
        onClose={() => setConfirmOpen(false)}
        maxWidth="xs"
      >
        <DialogTitle>Confirm Deletion</DialogTitle>
        <DialogContent>
          Are you sure you want to delete this application?
        </DialogContent>
        <DialogActions>
          <Button
            onClick={() => handleDelete(deleteId)}
            color="error"
            variant="contained"
            autoFocus
          >
            Yes, Delete
          </Button>
          <Button onClick={() => setConfirmOpen(false)}>Cancel</Button>
        </DialogActions>
      </Dialog>
    </Container>
  );
};

export default AdminApplications;
