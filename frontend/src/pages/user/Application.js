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
  CircularProgress,
  Paper,
} from "@mui/material";

const applicantNotice = (
  <Paper
    elevation={4}
    sx={{ p: 3, mb: 4, borderRadius: 2, background: "#f5f7fa" }}
  >
    <Typography variant="h6" sx={{ fontWeight: "bold", mb: 1 }} color="primary">
      Important Information for Applicants
    </Typography>
    <Typography variant="body1" sx={{ mb: 1 }}>
      You may pay your deposit at any time after submitting your application.
      However,{" "}
      <strong>
        full payment must be completed before the start of training
      </strong>
      .
    </Typography>
    <Typography variant="body1" sx={{ mb: 1 }}>
      <strong>Bank Details:</strong>
      <br />
      Capitec Bank
      <br />
      Account No: 10541111537
      <br />
      Account Holder: Sogwa Solutions Pty Ltd
    </Typography>
    <Typography variant="body1" sx={{ mb: 1 }}>
      <strong>
        Proof of payment must be forwarded via WhatsApp to 083 583 6842 in order
        for your application to be considered.
      </strong>
    </Typography>
    <Typography variant="body1">
      Your timetable will be communicated to you only after you have been
      accepted into a program.
    </Typography>
  </Paper>
);

const qualifications = [
  "Grade 11",
  "Grade 12",
  "Certificate",
  "Diploma",
  "Other",
];
const genders = ["Male", "Female", "Other", "Prefer not to say"];

function getNextThreeMonths() {
  const months = [];
  const now = new Date();
  for (let i = 1; i <= 3; i++) {
    const d = new Date(now.getFullYear(), now.getMonth() + i, 1);
    months.push(
      d.toLocaleString("default", { month: "long", year: "numeric" })
    );
  }
  return months;
}

const initialFormState = {
  first_name: "",
  middle_name: "",
  last_name: "",
  gender: "",
  email: "",
  phone: "",
  id_number: "",
  course: "",
  qualification: "",
  motivation: "",
  qualification_doc: null,
  id_doc: null,
  cv: null,
  enrollment_month: "",
};

const FileInput = ({ id, label, required = false, accept, handleChange }) => (
  <Box sx={{ width: "100%", mb: 2 }}>
    <InputLabel htmlFor={id} sx={{ mb: 1, fontWeight: 500 }}>
      {label}
    </InputLabel>
    <input
      type="file"
      id={id}
      name={id}
      accept={accept}
      onChange={handleChange}
      style={{
        display: "block",
        width: "100%",
        padding: "10px",
        borderRadius: "8px",
        border: "1px solid #ccc",
        cursor: "pointer",
      }}
      required={required}
    />
  </Box>
);

const Application = () => {
  const [courses, setCourses] = useState([]);
  const [form, setForm] = useState(initialFormState);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const controller = new AbortController();
    const fetchCourses = async () => {
      try {
        const res = await fetch(
          "https://sogwa-81485d33beca.herokuapp.com/api/public-courses/",
          {
            signal: controller.signal,
          }
        );
        const data = await res.json();
        setCourses(Array.isArray(data) ? data : data.results || []);
      } catch {
        setCourses([]);
      }
    };
    fetchCourses();
    return () => controller.abort();
  }, []);

  const handleChange = (e) => {
    const { name, value, files } = e.target;
    setForm({ ...form, [name]: files?.[0] || value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    const formData = new FormData();
    Object.entries(form).forEach(([key, val]) => {
      if (val) formData.append(key, val);
    });

    try {
      const res = await fetch(
        "https://sogwa-81485d33beca.herokuapp.com/api/application/",
        {
          method: "POST",
          body: formData,
        }
      );
      const data = await res.json();

      if (!res.ok) {
        throw new Error(
          data?.message ||
            (typeof data === "object"
              ? JSON.stringify(data)
              : "Submission failed.")
        );
      }

      setOpen(true);
      setForm(initialFormState);
      ["qualification_doc", "id_doc", "cv"].forEach((id) => {
        const input = document.getElementById(id);
        if (input) input.value = "";
      });
    } catch (err) {
      setError(err.message || "Submission failed. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const commonTextFieldProps = {
    fullWidth: true,
    sx: { mb: 2 },
    InputProps: {
      style: { borderRadius: 8, textAlign: "center", padding: "10px" },
    },
  };

  return (
    <Box
      sx={{
        minHeight: "100vh",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        background: "linear-gradient(135deg, #a8edea 0%, #fed6e3 100%)",
        py: 5,
      }}
    >
      <Container maxWidth="sm">
        {applicantNotice}
        <Paper
          elevation={6}
          sx={{
            p: 4,
            borderRadius: 3,
            backgroundColor: "#fff",
            boxShadow: "0 8px 16px rgba(0,0,0,0.2)",
          }}
        >
          <Typography
            variant="h4"
            gutterBottom
            align="center"
            sx={{ fontWeight: "bold", mb: 3 }}
          >
            Training Application
          </Typography>

          <Box
            component="form"
            onSubmit={handleSubmit}
            encType="multipart/form-data"
          >
            <TextField
              label="First Name"
              name="first_name"
              value={form.first_name}
              onChange={handleChange}
              {...commonTextFieldProps}
              required
            />
            <TextField
              label="Middle Name (optional)"
              name="middle_name"
              value={form.middle_name}
              onChange={handleChange}
              {...commonTextFieldProps}
            />
            <TextField
              label="Last Name"
              name="last_name"
              value={form.last_name}
              onChange={handleChange}
              {...commonTextFieldProps}
              required
            />

            <TextField
              select
              label="Gender"
              name="gender"
              value={form.gender}
              onChange={handleChange}
              {...commonTextFieldProps}
              required
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
              {...commonTextFieldProps}
              required
            />
            <TextField
              label="Phone"
              name="phone"
              value={form.phone}
              onChange={handleChange}
              {...commonTextFieldProps}
              required
            />
            <TextField
              label="ID Number"
              name="id_number"
              value={form.id_number}
              onChange={handleChange}
              {...commonTextFieldProps}
              inputProps={{
                maxLength: 13,
                pattern: "\\d{13}",
                style: { textAlign: "center" },
              }}
              helperText="ID number must be exactly 13 digits"
              required
            />

            <TextField
              select
              label="Select Course"
              name="course"
              value={form.course}
              onChange={handleChange}
              {...commonTextFieldProps}
              required
            >
              {courses.map((c) => (
                <MenuItem key={c.id} value={c.id}>
                  {c.name}
                </MenuItem>
              ))}
            </TextField>
            <TextField
              select
              label="Enrollment Month"
              name="enrollment_month"
              value={form.enrollment_month}
              onChange={handleChange}
              {...commonTextFieldProps}
              required
            >
              <MenuItem value="" disabled>
                Select month
              </MenuItem>
              {getNextThreeMonths().map((m) => (
                <MenuItem key={m} value={m}>
                  {m}
                </MenuItem>
              ))}
            </TextField>

            <TextField
              select
              label="Highest Qualification (optional)"
              name="qualification"
              value={form.qualification}
              onChange={handleChange}
              {...commonTextFieldProps}
            >
              <MenuItem value="">None</MenuItem>
              {qualifications.map((q) => (
                <MenuItem key={q} value={q}>
                  {q}
                </MenuItem>
              ))}
            </TextField>

            <FileInput
              id="id_doc"
              label="Upload ID"
              accept=".pdf,.jpg,.jpeg,.png"
              handleChange={handleChange}
              required
            />
            <FileInput
              id="qualification_doc"
              label="Upload Qualification (optional)"
              accept=".pdf,.jpg,.jpeg,.png"
              handleChange={handleChange}
            />
            <FileInput
              id="cv"
              label="Upload CV (optional)"
              accept=".pdf,.doc,.docx"
              handleChange={handleChange}
            />

            <TextField
              label="Motivation (optional)"
              name="motivation"
              value={form.motivation}
              onChange={handleChange}
              multiline
              rows={4}
              {...commonTextFieldProps}
            />

            <Button
              type="submit"
              variant="contained"
              color="primary"
              fullWidth
              disabled={loading}
              sx={{
                mt: 2,
                py: 1.5,
                borderRadius: 3,
                fontWeight: "bold",
                fontSize: "16px",
              }}
            >
              {loading ? (
                <CircularProgress size={24} color="inherit" />
              ) : (
                "Submit Application"
              )}
            </Button>

            {error && (
              <Alert severity="error" sx={{ mt: 2 }}>
                {error}
              </Alert>
            )}
          </Box>
        </Paper>

        <Snackbar
          open={open}
          autoHideDuration={4000}
          onClose={() => setOpen(false)}
          anchorOrigin={{ vertical: "top", horizontal: "center" }}
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
    </Box>
  );
};

export default Application;
