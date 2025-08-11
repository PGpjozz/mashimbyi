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

const AdminPrograms = () => {
  const [programs, setPrograms] = useState([]);
  const [open, setOpen] = useState(false);
  const [editOpen, setEditOpen] = useState(false);
  const [newProgram, setNewProgram] = useState({ name: "", description: "" });
  const [editProgram, setEditProgram] = useState(null);
  const [confirmDeleteOpen, setConfirmDeleteOpen] = useState(false);

  useEffect(() => {
    fetch("http://localhost:8000/api/programs/")
      .then((res) => res.json())
      .then((data) => setPrograms(data));
  }, []);

  const handleChange = (e) => {
    setNewProgram({ ...newProgram, [e.target.name]: e.target.value });
  };

  const handleEditChange = (e) => {
    setEditProgram({ ...editProgram, [e.target.name]: e.target.value });
  };

  const handleAddProgram = async () => {
    const res = await fetch("http://localhost:8000/api/programs/", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(newProgram),
    });
    if (res.ok) {
      const added = await res.json();
      setPrograms([...programs, added]);
      setOpen(false);
      setNewProgram({ name: "", description: "" });
    }
  };

  const handleEditProgram = async () => {
    const res = await fetch(
      `http://localhost:8000/api/programs/${editProgram.id}/`,
      {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: editProgram.name,
          description: editProgram.description,
        }),
      }
    );
    if (res.ok) {
      const updated = await res.json();
      setPrograms((programs) =>
        programs.map((p) => (p.id === editProgram.id ? updated : p))
      );
      setEditOpen(false);
      setEditProgram(null);
    } else {
      const error = await res.text();
      alert("Failed to save changes: " + error);
    }
  };

  const handleEditClick = (program) => {
    setEditProgram(program);
    setEditOpen(true);
  };

  // Only delete when confirmed in the modal
  const handleDeleteProgram = async () => {
    if (!editProgram) return;
    const id = editProgram.id;
    const res = await fetch(`http://localhost:8000/api/programs/${id}/`, {
      method: "DELETE",
    });
    if (res.ok) {
      setPrograms((programs) => programs.filter((p) => p.id !== id));
      setEditOpen(false);
      setEditProgram(null);
      setConfirmDeleteOpen(false);
    } else {
      const error = await res.text();
      alert("Failed to delete program: " + error);
    }
  };

  return (
    <Container sx={{ py: 5 }}>
      <Typography variant="h4" gutterBottom>
        Manage Programs
      </Typography>
      <Button
        variant="contained"
        color="primary"
        sx={{ mb: 3 }}
        onClick={() => setOpen(true)}
      >
        Add New Program
      </Button>
      <Table>
        <TableHead>
          <TableRow>
            <TableCell>Name</TableCell>
            <TableCell>Description</TableCell>
            <TableCell>Actions</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {programs.map((program) => (
            <TableRow key={program.id}>
              <TableCell>{program.name}</TableCell>
              <TableCell>{program.description}</TableCell>
              <TableCell>
                <Button
                  variant="outlined"
                  color="primary"
                  size="small"
                  onClick={() => handleEditClick(program)}
                  sx={{ mr: 1 }}
                >
                  Edit
                </Button>
                <Button
                  variant="contained"
                  color="error"
                  size="small"
                  onClick={() => {
                    setEditProgram(program);
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
      {/* Add Program Dialog */}
      <Dialog open={open} onClose={() => setOpen(false)}>
        <DialogTitle>Add New Program</DialogTitle>
        <DialogContent>
          <TextField
            label="Name"
            name="name"
            value={newProgram.name}
            onChange={handleChange}
            fullWidth
            sx={{ mb: 2 }}
          />
          <TextField
            label="Description"
            name="description"
            value={newProgram.description}
            onChange={handleChange}
            fullWidth
            multiline
            rows={3}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpen(false)}>Cancel</Button>
          <Button
            onClick={handleAddProgram}
            variant="contained"
            color="primary"
          >
            Add
          </Button>
        </DialogActions>
      </Dialog>
      {/* Edit Program Dialog */}
      <Dialog open={editOpen} onClose={() => setEditOpen(false)}>
        <DialogTitle>Edit Program</DialogTitle>
        <DialogContent>
          <TextField
            label="Name"
            name="name"
            value={editProgram?.name || ""}
            onChange={handleEditChange}
            fullWidth
            sx={{ mb: 2 }}
          />
          <TextField
            label="Description"
            name="description"
            value={editProgram?.description || ""}
            onChange={handleEditChange}
            fullWidth
            multiline
            rows={3}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setEditOpen(false)}>Cancel</Button>
          <Button
            onClick={handleEditProgram}
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
            Are you sure you want to delete this program? This action cannot be
            undone.
          </Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setConfirmDeleteOpen(false)}>Cancel</Button>
          <Button
            onClick={handleDeleteProgram}
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

export default AdminPrograms;
