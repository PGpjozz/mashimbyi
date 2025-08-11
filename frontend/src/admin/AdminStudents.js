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
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Link,
  Grid,
  Divider,
} from "@mui/material";

const AdminStudents = () => {
  const [students, setStudents] = useState([]);
  const [selectedStudent, setSelectedStudent] = useState(null);
  const [open, setOpen] = useState(false);
  const [confirmOpen, setConfirmOpen] = useState(false);

  useEffect(() => {
    fetch("http://localhost:8000/api/students/")
      .then((res) => res.json())
      .then((data) => setStudents(data));
  }, []);

  const handleView = (student) => {
    setSelectedStudent(student);
    setOpen(true);
  };

  const handleChange = (e) => {
    setSelectedStudent({ ...selectedStudent, [e.target.name]: e.target.value });
  };

  const handleSave = async () => {
    const { id, first_name, last_name, email } = selectedStudent;
    const res = await fetch(`http://localhost:8000/api/students/${id}/`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ first_name, last_name, email }),
    });
    if (res.ok) {
      setStudents((students) =>
        students.map((s) =>
          s.id === id ? { ...s, first_name, last_name, email } : s
        )
      );
      setOpen(false);
    }
  };

  const handleDelete = async (id) => {
    const res = await fetch(`http://localhost:8000/api/students/${id}/`, {
      method: "DELETE",
    });
    if (res.ok) {
      setStudents((students) => students.filter((s) => s.id !== id));
      setOpen(false);
      setConfirmOpen(false);
    }
  };

  const handleDismissClick = () => {
    setConfirmOpen(true);
  };

  return (
    <Container sx={{ py: 5 }}>
      <Typography variant="h4" gutterBottom>
        Enrolled Students
      </Typography>
      <Table>
        <TableHead>
          <TableRow>
            <TableCell>Student Number</TableCell>
            <TableCell>Name</TableCell>
            <TableCell>Email</TableCell>
            <TableCell>Actions</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {students.map((student) => (
            <TableRow key={student.id}>
              <TableCell>{student.student_number}</TableCell>
              <TableCell>
                {student.first_name} {student.last_name}
              </TableCell>
              <TableCell>{student.email}</TableCell>
              <TableCell>
                <Box sx={{ display: "flex", gap: 1 }}>
                  <Button
                    variant="outlined"
                    color="primary"
                    size="small"
                    onClick={() => handleView(student)}
                  >
                    View/Edit
                  </Button>
                  <Button
                    variant="contained"
                    color="error"
                    size="small"
                    onClick={() => {
                      setSelectedStudent(student);
                      setConfirmOpen(true);
                    }}
                  >
                    Dismiss
                  </Button>
                </Box>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
      <Dialog
        open={open}
        onClose={() => setOpen(false)}
        maxWidth="md"
        fullWidth
        PaperProps={{
          sx: { borderRadius: 3, p: 2 },
        }}
      >
        <DialogTitle sx={{ fontWeight: "bold", textAlign: "center" }}>
          Student Details
        </DialogTitle>
        <Divider sx={{ mb: 2 }} />
        <DialogContent>
          <Grid container spacing={3}>
            <Grid item xs={12} md={6}>
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
              <TextField
                label="Student Number"
                name="student_number"
                value={selectedStudent?.student_number || ""}
                onChange={handleChange}
                fullWidth
                sx={{ mb: 2 }}
                disabled
              />
            </Grid>
            <Grid item xs={12} md={6}>
              <Box sx={{ mb: 2 }}>
                <Typography variant="subtitle2" sx={{ mb: 1 }}>
                  Qualification Document:
                </Typography>
                {selectedStudent?.qualification_file ? (
                  <Link
                    href={selectedStudent.qualification_file}
                    target="_blank"
                    rel="noopener"
                  >
                    View Document
                  </Link>
                ) : (
                  <Typography variant="body2" color="text.secondary">
                    Not submitted
                  </Typography>
                )}
              </Box>
              <Box sx={{ mb: 2 }}>
                <Typography variant="subtitle2" sx={{ mb: 1 }}>
                  ID Document:
                </Typography>
                {selectedStudent?.id_file ? (
                  <Link
                    href={selectedStudent.id_file}
                    target="_blank"
                    rel="noopener"
                  >
                    View Document
                  </Link>
                ) : (
                  <Typography variant="body2" color="text.secondary">
                    Not submitted
                  </Typography>
                )}
              </Box>
              <Box sx={{ mb: 2 }}>
                <Typography variant="subtitle2" sx={{ mb: 1 }}>
                  CV Document:
                </Typography>
                {selectedStudent?.cv_file ? (
                  <Link
                    href={selectedStudent.cv_file}
                    target="_blank"
                    rel="noopener"
                  >
                    View Document
                  </Link>
                ) : (
                  <Typography variant="body2" color="text.secondary">
                    Not submitted
                  </Typography>
                )}
              </Box>
            </Grid>
          </Grid>
        </DialogContent>
        <DialogActions sx={{ justifyContent: "center", pb: 2 }}>
          <Button onClick={() => setOpen(false)} variant="outlined">
            Cancel
          </Button>
          <Button onClick={handleSave} variant="contained" color="primary">
            Save
          </Button>
          <Button
            onClick={handleDismissClick}
            variant="contained"
            color="error"
          >
            Dismiss
          </Button>
        </DialogActions>
      </Dialog>
      <Dialog
        open={confirmOpen}
        onClose={() => setConfirmOpen(false)}
        PaperProps={{
          sx: { borderRadius: 2, p: 2, minWidth: 300 },
        }}
      >
        <DialogTitle sx={{ fontWeight: "bold", textAlign: "center" }}>
          Confirm Dismissal
        </DialogTitle>
        <DialogContent>
          <Typography>
            Are you sure you want to permanently delete this student?
          </Typography>
        </DialogContent>
        <DialogActions sx={{ justifyContent: "center", pb: 2 }}>
          <Button onClick={() => setConfirmOpen(false)} variant="outlined">
            Cancel
          </Button>
          <Button
            onClick={() => handleDelete(selectedStudent.id)}
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

export default AdminStudents;
