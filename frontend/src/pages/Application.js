import React, { useState, useEffect } from "react";
import {
  Container,
  Typography,
  Box,
  TextField,
  MenuItem,
  Button,
  Snackbar,
  Alert,
  InputLabel,
} from "@mui/material";

const qualifications = [
  "Grade 11",
  "Grade 12",
  "Certificate",
  "Diploma",
  "Other",
];

const genders = ["Male", "Female", "Other", "Prefer not to say"];

const Application = () => {
  const [programs, setPrograms] = useState([]);
  const [form, setForm] = useState({
    firstName: "",
    middleName: "",
    lastName: "",
    gender: "",
    email: "",
    phone: "",
    program: "",
    qualification: "",
    motivation: "",
    qualificationFile: null,
    idFile: null,
    cvFile: null,
  });
  const [open, setOpen] = useState(false);

  // Fetch programs from backend
  useEffect(() => {
    fetch("http://localhost:8000/api/programs/")
      .then((res) => res.json())
      .then((data) => setPrograms(data));
  }, []);

  const handleChange = (e) => {
    const { name, value, files } = e.target;
    if (files) {
      setForm({ ...form, [name]: files[0] });
    } else {
      setForm({ ...form, [name]: value });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const formData = new FormData();
    formData.append("first_name", form.firstName);
    formData.append("middle_name", form.middleName);
    formData.append("last_name", form.lastName);
    formData.append("gender", form.gender);
    formData.append("email", form.email);
    formData.append("phone", form.phone);
    formData.append("qualification", form.qualification);
    formData.append("motivation", form.motivation);
    formData.append("qualification_file", form.qualificationFile);
    formData.append("id_file", form.idFile);
    formData.append("cv_file", form.cvFile);
    formData.append("program", form.program); // This is the ID

    try {
      const res = await fetch("http://localhost:8000/api/application/", {
        method: "POST",
        body: formData,
      });
      if (res.ok) {
        setOpen(true);
        setForm({
          firstName: "",
          middleName: "",
          lastName: "",
          gender: "",
          email: "",
          phone: "",
          program: "",
          qualification: "",
          motivation: "",
          qualificationFile: null,
          idFile: null,
          cvFile: null,
        });
        document.getElementById("qualificationFile").value = "";
        document.getElementById("idFile").value = "";
        document.getElementById("cvFile").value = "";
      } else {
        const errorData = await res.json();
        console.log("Error:", errorData); // <-- See which field failed
      }
    } catch (err) {
      // handle error
    }
  };

  return (
    <Container sx={{ py: 5 }}>
      <Typography variant="h3" gutterBottom>
        Training Application
      </Typography>
      <Typography variant="body1" sx={{ mb: 3 }}>
        Please complete the application form below to apply for your chosen
        training programme. We will contact you with further details after
        receiving your application.
      </Typography>
      <Box
        component="form"
        onSubmit={handleSubmit}
        sx={{
          maxWidth: 500,
          mx: "auto",
          background: "#fff",
          p: 3,
          borderRadius: 2,
          boxShadow: 2,
        }}
        encType="multipart/form-data"
      >
        <TextField
          label="First Name"
          name="firstName"
          value={form.firstName}
          onChange={handleChange}
          fullWidth
          required
          sx={{ mb: 2 }}
        />
        <TextField
          label="Middle Name"
          name="middleName"
          value={form.middleName}
          onChange={handleChange}
          fullWidth
          sx={{ mb: 2 }}
        />
        <TextField
          label="Last Name"
          name="lastName"
          value={form.lastName}
          onChange={handleChange}
          fullWidth
          required
          sx={{ mb: 2 }}
        />
        <TextField
          select
          label="Gender"
          name="gender"
          value={form.gender}
          onChange={handleChange}
          fullWidth
          required
          sx={{ mb: 2 }}
        >
          {genders.map((g) => (
            <MenuItem key={g} value={g}>
              {g}
            </MenuItem>
          ))}
        </TextField>
        <TextField
          label="Email"
          name="email"
          type="email"
          value={form.email}
          onChange={handleChange}
          fullWidth
          required
          sx={{ mb: 2 }}
        />
        <TextField
          label="Phone"
          name="phone"
          value={form.phone}
          onChange={handleChange}
          fullWidth
          required
          sx={{ mb: 2 }}
        />
        <TextField
          select
          label="Select Course"
          name="program"
          value={form.program}
          onChange={handleChange}
          fullWidth
          required
          sx={{ mb: 2 }}
        >
          {programs.map((p) => (
            <MenuItem key={p.id} value={p.id}>
              {p.name}
            </MenuItem>
          ))}
        </TextField>
        <TextField
          select
          label="Highest Qualification"
          name="qualification"
          value={form.qualification}
          onChange={handleChange}
          fullWidth
          required
          sx={{ mb: 2 }}
        >
          {qualifications.map((q) => (
            <MenuItem key={q} value={q}>
              {q}
            </MenuItem>
          ))}
        </TextField>
        <InputLabel sx={{ mt: 2 }}>Upload Qualification</InputLabel>
        <input
          type="file"
          name="qualificationFile"
          id="qualificationFile"
          accept=".pdf,.jpg,.jpeg,.png"
          onChange={handleChange}
          style={{ marginBottom: "16px", width: "100%" }}
        />
        <InputLabel>Upload ID</InputLabel>
        <input
          type="file"
          name="idFile"
          id="idFile"
          accept=".pdf,.jpg,.jpeg,.png"
          onChange={handleChange}
          style={{ marginBottom: "16px", width: "100%" }}
        />
        <InputLabel>Upload CV</InputLabel>
        <input
          type="file"
          name="cvFile"
          id="cvFile"
          accept=".pdf,.doc,.docx"
          onChange={handleChange}
          style={{ marginBottom: "16px", width: "100%" }}
        />
        <TextField
          label="Motivation (Why do you want to join?)"
          name="motivation"
          value={form.motivation}
          onChange={handleChange}
          fullWidth
          multiline
          rows={4}
          required
          sx={{ mb: 2 }}
        />
        <Button type="submit" variant="contained" color="primary" fullWidth>
          Submit Application
        </Button>
      </Box>
      <Snackbar
        open={open}
        autoHideDuration={4000}
        onClose={() => setOpen(false)}
      >
        <Alert
          onClose={() => setOpen(false)}
          severity="success"
          sx={{ width: "100%" }}
        >
          Application submitted successfully!
        </Alert>
      </Snackbar>
    </Container>
  );
};

export default Application;
