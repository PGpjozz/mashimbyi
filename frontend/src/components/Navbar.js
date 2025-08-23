import React, { useState } from "react";
import {
  AppBar,
  Toolbar,
  IconButton,
  Typography,
  Drawer,
  List,
  ListItem,
  ListItemText,
  Box,
  Button,
} from "@mui/material";
import { FaBars } from "react-icons/fa";
import { Link, useNavigate, useLocation } from "react-router-dom";
import logo from "../assets/logo.jpg";

const Navbar = () => {
  const [mobileOpen, setMobileOpen] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();
  const navItems = [
    { label: "Home", path: "/" },
    { label: "About", path: "/about" },
    { label: "Training", path: "/training" },
    { label: "Services", path: "/services" },
    { label: "Gallery", path: "/gallery" },
    { label: "Contact", path: "/contact" },
  ];

  // Show Apply Now button only on Home and Training pages
  const showApplyNow =
    location.pathname === "/" || location.pathname === "/training";

  return (
    <>
      <AppBar position="sticky" color="primary">
        <Toolbar>
          <Box
            component={Link}
            to="/"
            sx={{
              display: "flex",
              alignItems: "center",
              textDecoration: "none",
              color: "inherit",
              mr: 2,
            }}
          >
            <Box
              component="img"
              src={logo}
              alt="Logo"
              sx={{
                height: { xs: 56, md: 64 },
                width: { xs: 56, md: 64 },
                mr: 2,
                borderRadius: "50%",
                background: "#fff",
                p: 1,
                boxShadow: 3,
                objectFit: "cover",
                border: "2px solid #1976d2",
                transition: "all 0.2s",
              }}
            />
            <Typography
              variant="h6"
              sx={{
                fontWeight: "bold",
                fontSize: { xs: "1.1rem", md: "1.35rem" },
                letterSpacing: 1,
              }}
            >
              Sogwa Solutions
            </Typography>
          </Box>
          <Box sx={{ flexGrow: 1 }} />
          <Button
            variant="contained"
            color="secondary"
            sx={{
              mr: 2,
              display: { xs: "none", md: "inline-flex" },
            }}
            onClick={() => navigate("/contact")}
          >
            Enquire Now
          </Button>
          {showApplyNow && (
            <Button
              variant="contained"
              color="success"
              sx={{
                mr: 2,
                display: { xs: "none", md: "inline-flex" },
                boxShadow: "0 0 8px 2px #43ea7d",
                animation: "glow 1.5s infinite alternate",
                "@keyframes glow": {
                  from: { boxShadow: "0 0 8px 2px #43ea7d" },
                  to: { boxShadow: "0 0 20px 6px #43ea7d" },
                },
              }}
              onClick={() => navigate("/application")}
            >
              Apply Now
            </Button>
          )}
          <IconButton
            color="inherit"
            onClick={() => setMobileOpen(!mobileOpen)}
          >
            <FaBars />
          </IconButton>
        </Toolbar>
      </AppBar>

      <Drawer
        anchor="right"
        open={mobileOpen}
        onClose={() => setMobileOpen(false)}
        PaperProps={{
          sx: {
            background: "linear-gradient(120deg, #1976d2 70%, #43ea7d 100%)",
            color: "white",
          },
        }}
      >
        <Box sx={{ width: 250, py: 2 }} role="presentation">
          <Box
            sx={{
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              mb: 2,
            }}
          >
            <Box
              component="img"
              src={logo}
              alt="Logo"
              sx={{
                height: 40,
                width: 40,
                borderRadius: "50%",
                background: "#fff",
                p: 1,
                boxShadow: 2,
                mr: 1,
              }}
            />
            <Typography
              variant="h6"
              sx={{ fontWeight: "bold", fontSize: "1.1rem", color: "white" }}
            >
              Sogwa Solutions
            </Typography>
          </Box>
          <List>
            {navItems.map((item) => (
              <ListItem
                button
                component={Link}
                to={item.path}
                key={item.label}
                onClick={() => setMobileOpen(false)}
                sx={{
                  color: "white",
                  "&:hover": { background: "rgba(255,255,255,0.08)" },
                }}
              >
                <ListItemText primary={item.label} />
              </ListItem>
            ))}
            <ListItem
              button
              component={Link}
              to="/contact"
              onClick={() => setMobileOpen(false)}
              sx={{
                color: "white",
                "&:hover": { background: "rgba(255,255,255,0.08)" },
              }}
            >
              <ListItemText primary="Enquire Now" />
            </ListItem>
            {showApplyNow && (
              <ListItem
                button
                component={Link}
                to="/application"
                onClick={() => setMobileOpen(false)}
                sx={{
                  color: "#43ea7d",
                  fontWeight: 700,
                  mt: 1,
                  "&:hover": { background: "rgba(67,234,125,0.12)" },
                }}
              >
                <ListItemText primary="Apply Now" />
              </ListItem>
            )}
          </List>
        </Box>
      </Drawer>
    </>
  );
};

export default Navbar;
