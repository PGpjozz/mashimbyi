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
  TextField,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
} from "@mui/material";
import { useNavigate } from "react-router-dom";

const AdminCourses = () => {
  const [courses, setCourses] = useState([]);
  const [open, setOpen] = useState(false);
  const [editOpen, setEditOpen] = useState(false);
  const [newCourse, setNewCourse] = useState({ name: "", description: "" });
  const [editCourse, setEditCourse] = useState(null);
  const [confirmDeleteOpen, setConfirmDeleteOpen] = useState(false);
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const API_URL = "http://localhost:8000/api/courses/";

  useEffect(() => {
    const fetchCourses = async () => {
      const token = localStorage.getItem("adminToken"); // <-- FIXED
      if (!token) {
        navigate("/admin/login");
        return;
      }
      try {
        const res = await fetch(API_URL, {
          headers: { Authorization: `Bearer ${token}` },
        });
        if (res.status === 401) {
          setError("Unauthorized: Please login as admin.");
          navigate("/admin/login");
          return;
        }
        const data = await res.json();
        setCourses(Array.isArray(data) ? data : data.results || []);
      } catch {
        setError("Failed to load courses.");
      }
    };
    fetchCourses();
  }, [navigate]);

  const handleChange = (e) =>
    setNewCourse({ ...newCourse, [e.target.name]: e.target.value });
  const handleEditChange = (e) =>
    setEditCourse({ ...editCourse, [e.target.name]: e.target.value });

  const handleAddCourse = async () => {
    const token = localStorage.getItem("adminToken"); // <-- FIXED
    if (!token) {
      navigate("/admin/login");
      return;
    }
    const res = await fetch(API_URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(newCourse),
    });
    if (res.status === 401) {
      setError("Unauthorized: Please login as admin.");
      navigate("/admin/login");
      return;
    }
    if (res.ok) {
      const added = await res.json();
      setCourses([...courses, added]);
      setOpen(false);
      setNewCourse({ name: "", description: "" });
    }
  };

  const handleEditCourse = async () => {
    const token = localStorage.getItem("adminToken"); // <-- FIXED
    if (!token) {
      navigate("/admin/login");
      return;
    }
    const res = await fetch(`${API_URL}${editCourse.id}/`, {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({
        name: editCourse.name,
        description: editCourse.description,
      }),
    });
    if (res.status === 401) {
      setError("Unauthorized: Please login as admin.");
      navigate("/admin/login");
      return;
    }
    if (res.ok) {
      const updated = await res.json();
      setCourses((prev) =>
        prev.map((c) => (c.id === editCourse.id ? updated : c))
      );
      setEditOpen(false);
      setEditCourse(null);
    }
  };

  const handleDeleteCourse = async () => {
    const token = localStorage.getItem("adminToken"); // <-- FIXED
    if (!token) {
      navigate("/admin/login");
      return;
    }
    const res = await fetch(`${API_URL}${editCourse.id}/`, {
      method: "DELETE",
      headers: { Authorization: `Bearer ${token}` },
    });
    if (res.status === 401) {
      setError("Unauthorized: Please login as admin.");
      navigate("/admin/login");
      return;
    }
    if (res.ok) {
      setCourses((prev) => prev.filter((c) => c.id !== editCourse.id));
      setEditOpen(false);
      setEditCourse(null);
      setConfirmDeleteOpen(false);
    }
  };

  if (error) return <div style={{ color: "red", padding: 20 }}>{error}</div>;

  return (
    <Container sx={{ py: 5 }}>
      <Typography variant="h4" gutterBottom>
        Manage Courses
      </Typography>
      <Button
        variant="contained"
        color="primary"
        sx={{ mb: 3 }}
        onClick={() => setOpen(true)}
      >
        Add New Course
      </Button>
      <Table>
        <TableHead>
          <TableRow>
            <TableCell>Name</TableCell>
            <TableCell>Description</TableCell>
            <TableCell>Enrolled Students</TableCell> {/* NEW COLUMN */}
            <TableCell>Actions</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {courses.map((course) => (
            <TableRow key={course.id}>
              <TableCell>{course.name}</TableCell>
              <TableCell>{course.description}</TableCell>
              <TableCell>{course.enrolled_count || 0}</TableCell>{" "}
              {/* SHOW COUNT */}
              <TableCell>
                <Button
                  variant="outlined"
                  color="primary"
                  size="small"
                  sx={{ mr: 1 }}
                  onClick={() => {
                    setEditCourse(course);
                    setEditOpen(true);
                  }}
                >
                  Edit
                </Button>
                <Button
                  variant="contained"
                  color="error"
                  size="small"
                  onClick={() => {
                    setEditCourse(course);
                    setConfirmDeleteOpen(true);
                  }}
                >
                  Delete
                </Button>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>

      {/* Add Course Dialog */}
      <Dialog open={open} onClose={() => setOpen(false)}>
        <DialogTitle>Add New Course</DialogTitle>
        <DialogContent>
          <TextField
            label="Name"
            name="name"
            value={newCourse.name}
            onChange={handleChange}
            fullWidth
            sx={{ mb: 2 }}
          />
          <TextField
            label="Description"
            name="description"
            value={newCourse.description}
            onChange={handleChange}
            fullWidth
            multiline
            rows={3}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpen(false)}>Cancel</Button>
          <Button onClick={handleAddCourse} variant="contained" color="primary">
            Add
          </Button>
        </DialogActions>
      </Dialog>

      {/* Edit Course Dialog */}
      <Dialog open={editOpen} onClose={() => setEditOpen(false)}>
        <DialogTitle>Edit Course</DialogTitle>
        <DialogContent>
          <TextField
            label="Name"
            name="name"
            value={editCourse?.name || ""}
            onChange={handleEditChange}
            fullWidth
            sx={{ mb: 2 }}
          />
          <TextField
            label="Description"
            name="description"
            value={editCourse?.description || ""}
            onChange={handleEditChange}
            fullWidth
            multiline
            rows={3}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setEditOpen(false)}>Cancel</Button>
          <Button
            onClick={handleEditCourse}
            variant="contained"
            color="primary"
          >
            Save
          </Button>
          <Button
            onClick={() => setConfirmDeleteOpen(true)}
            variant="contained"
            color="error"
          >
            Delete
          </Button>
        </DialogActions>
      </Dialog>

      {/* Confirm Delete Dialog */}
      <Dialog
        open={confirmDeleteOpen}
        onClose={() => setConfirmDeleteOpen(false)}
      >
        <DialogTitle>Confirm Delete</DialogTitle>
        <DialogContent>
          <Typography>
            Are you sure you want to delete this course? This action cannot be
            undone.
          </Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setConfirmDeleteOpen(false)}>Cancel</Button>
          <Button
            onClick={handleDeleteCourse}
            variant="contained"
            color="error"
          >
            Yes, Delete
          </Button>
        </DialogActions>
      </Dialog>
    </Container>
  );
};

export default AdminCourses;
