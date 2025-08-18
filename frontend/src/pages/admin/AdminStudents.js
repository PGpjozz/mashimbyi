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
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
} from "@mui/material";
import { useNavigate } from "react-router-dom";

const AdminStudents = () => {
  const [students, setStudents] = useState([]);
  const [selectedStudent, setSelectedStudent] = useState(null);
  const [open, setOpen] = useState(false);
  const [confirmOpen, setConfirmOpen] = useState(false);
  const [error, setError] = useState("");
  const token = localStorage.getItem("adminToken");
  const navigate = useNavigate();

  useEffect(() => {
    const fetchStudents = async () => {
      if (!token) {
        navigate("/admin/login");
        return;
      }
      try {
        const res = await fetch("http://localhost:8000/api/students/", {
          headers: { Authorization: `Bearer ${token}` },
        });
        if (res.status === 401) {
          setError("Unauthorized: Please login as admin.");
          navigate("/admin/login");
          return;
        }
        const data = await res.json();
        setStudents(Array.isArray(data) ? data : data.results || []);
      } catch {
        setError("Failed to load students.");
      }
    };
    fetchStudents();
  }, [token, navigate]);

  const handleView = (student) => {
    setSelectedStudent(student);
    setOpen(true);
  };

  const handleChange = (e) => {
    setSelectedStudent({
      ...selectedStudent,
      [e.target.name]: e.target.value,
    });
  };

  const handleSave = async () => {
    const res = await fetch(
      `http://localhost:8000/api/students/${selectedStudent.id}/`,
      {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(selectedStudent),
      }
    );
    if (res.ok) {
      setStudents(
        students.map((s) => (s.id === selectedStudent.id ? selectedStudent : s))
      );
      setOpen(false);
    }
  };

  const handleDelete = async () => {
    const res = await fetch(
      `http://localhost:8000/api/students/${selectedStudent.id}/`,
      {
        method: "DELETE",
        headers: { Authorization: `Bearer ${token}` },
      }
    );
    if (res.ok) {
      setStudents(students.filter((s) => s.id !== selectedStudent.id));
      setConfirmOpen(false);
      setOpen(false);
    }
  };

  if (error) return <div style={{ color: "red", padding: 20 }}>{error}</div>;

  return (
    <Container sx={{ py: 5 }}>
      <Typography variant="h4" gutterBottom>
        Enrolled Students
      </Typography>
      <Table>
        <TableHead>
          <TableRow>
            <TableCell>Student #</TableCell>
            <TableCell>Name</TableCell>
            <TableCell>Email</TableCell>
            <TableCell>Courses</TableCell>
            <TableCell>Actions</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {students.length === 0 ? (
            <TableRow>
              <TableCell colSpan={6} align="center">
                No students found.
              </TableCell>
            </TableRow>
          ) : (
            students.map((student) => (
              <TableRow key={student.id}>
                <TableCell>{student.student_number || student.id}</TableCell>
                <TableCell>
                  {student.first_name} {student.last_name}
                </TableCell>
                <TableCell>{student.email}</TableCell>
                <TableCell>
                  {student.enrolled_courses
                    ? student.enrolled_courses.join(", ")
                    : "-"}
                </TableCell>
                <TableCell>
                  <Button
                    variant="contained"
                    size="small"
                    onClick={() => handleView(student)}
                  >
                    View/Edit
                  </Button>
                  <Button
                    variant="contained"
                    color="error"
                    size="small"
                    sx={{ ml: 1 }}
                    onClick={() => {
                      setSelectedStudent(student);
                      setConfirmOpen(true);
                    }}
                  >
                    Dismiss
                  </Button>
                </TableCell>
              </TableRow>
            ))
          )}
        </TableBody>
      </Table>

      {/* View/Edit Dialog */}
      <Dialog
        open={open}
        onClose={() => setOpen(false)}
        maxWidth="sm"
        fullWidth
      >
        <DialogTitle>Student Details</DialogTitle>
        <DialogContent>
          <TextField
            label="First Name"
            name="first_name"
            value={selectedStudent?.first_name || ""}
            onChange={handleChange}
            fullWidth
            sx={{ mb: 2 }}
          />
          <TextField
            label="Last Name"
            name="last_name"
            value={selectedStudent?.last_name || ""}
            onChange={handleChange}
            fullWidth
            sx={{ mb: 2 }}
          />
          <TextField
            label="Email"
            name="email"
            value={selectedStudent?.email || ""}
            onChange={handleChange}
            fullWidth
            sx={{ mb: 2 }}
          />
          <Typography variant="subtitle1" sx={{ mt: 2 }}>
            Documents:
          </Typography>
          <div>
            <strong>Qualification:</strong>{" "}
            {selectedStudent?.qualification_file ? (
              <a
                href={selectedStudent.qualification_file}
                target="_blank"
                rel="noopener noreferrer"
                style={{ textDecoration: "none", color: "#1976d2" }}
              >
                View/Download
              </a>
            ) : (
              <Typography variant="body2" color="text.secondary">
                Not submitted
              </Typography>
            )}
          </div>
          <div>
            <strong>ID:</strong>{" "}
            {selectedStudent?.id_file ? (
              <a
                href={selectedStudent.id_file}
                target="_blank"
                rel="noopener noreferrer"
                style={{ textDecoration: "none", color: "#1976d2" }}
              >
                View/Download
              </a>
            ) : (
              <Typography variant="body2" color="text.secondary">
                Not submitted
              </Typography>
            )}
          </div>
          <div>
            <strong>CV:</strong>{" "}
            {selectedStudent?.cv_file ? (
              <a
                href={selectedStudent.cv_file}
                target="_blank"
                rel="noopener noreferrer"
                style={{ textDecoration: "none", color: "#1976d2" }}
              >
                View/Download
              </a>
            ) : (
              <Typography variant="body2" color="text.secondary">
                Not submitted
              </Typography>
            )}
          </div>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleSave} variant="contained">
            Save
          </Button>
          <Button onClick={() => setOpen(false)}>Close</Button>
        </DialogActions>
      </Dialog>

      {/* Confirm Delete Dialog */}
      <Dialog
        open={confirmOpen}
        onClose={() => setConfirmOpen(false)}
        maxWidth="xs"
      >
        <DialogTitle>Confirm Dismissal</DialogTitle>
        <DialogContent>
          Are you sure you want to dismiss this student?
        </DialogContent>
        <DialogActions>
          <Button
            onClick={handleDelete}
            color="error"
            variant="contained"
            autoFocus
          >
            Yes, Dismiss
          </Button>
          <Button onClick={() => setConfirmOpen(false)}>Cancel</Button>
        </DialogActions>
      </Dialog>
    </Container>
  );
};

export default AdminStudents;
