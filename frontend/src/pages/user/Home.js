import React from "react";
import {
  Container,
  Grid,
  Card,
  CardContent,
  Typography,
  Button,
  Box,
} from "@mui/material";
import { FaChalkboardTeacher, FaTools } from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import PageWrapper from "../../components/PageWrapper";
import banner from "../../assets/banner.jpg";
import trainingBg from "../../assets/trainingBg.jpg";
import servicesBg from "../../assets/servicesBg.jpg";

const Home = () => {
  const navigate = useNavigate();

  return (
    <PageWrapper>
      {/* Hero Section */}
      <Box
        sx={{
          position: "relative",
          minHeight: { xs: 250, md: 400 },
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          overflow: "hidden",
          mb: 4,
        }}
      >
        <Box
          component="img"
          src={banner}
          alt="Banner"
          sx={{
            position: "absolute",
            top: 0,
            left: 0,
            width: "100%",
            height: "100%",
            objectFit: "cover",
            zIndex: 1,
            filter: "brightness(0.6)",
          }}
        />
        <Box
          sx={{
            position: "relative",
            zIndex: 2,
            width: "100%",
            textAlign: "center",
            color: "white",
          }}
        >
          <Typography
            variant="h2"
            sx={{
              fontSize: { xs: "2rem", md: "3rem" },
              fontWeight: "bold",
              letterSpacing: 1,
              animation: "fadeInDown 1s",
              "@keyframes fadeInDown": {
                from: { opacity: 0, transform: "translateY(-40px)" },
                to: { opacity: 1, transform: "translateY(0)" },
              },
            }}
          >
            Empowering Skills. Enabling Growth.
          </Typography>
          <Typography
            variant="h6"
            sx={{
              mt: 2,
              animation: "fadeInUp 1.2s",
              "@keyframes fadeInUp": {
                from: { opacity: 0, transform: "translateY(40px)" },
                to: { opacity: 1, transform: "translateY(0)" },
              },
            }}
          >
            Accredited Training & Professional Services for Community Growth
          </Typography>
        </Box>
      </Box>

      {/* Services Overview */}
      <Container sx={{ py: 5 }}>
        <Grid container spacing={4}>
          <Grid item xs={12} md={6}>
            <Card
              sx={{
                p: 3,
                textAlign: "center",
                boxShadow: 3,
                minHeight: { xs: 260, md: 320 },
                display: "flex",
                flexDirection: "column",
                justifyContent: "flex-end",
                backgroundImage: `url(${trainingBg})`,
                backgroundSize: "cover",
                backgroundPosition: "center",
                position: "relative",
                color: "white",
                overflow: "hidden",
                borderRadius: 3,
                transition: "all 0.3s cubic-bezier(.4,0,.2,1)",
                boxShadow: "0 4px 24px 0 rgba(25,118,210,0.15)",
                "&:hover": {
                  transform: "scale(1.04)",
                  boxShadow: "0 8px 32px 0 rgba(25,118,210,0.25)",
                },
              }}
            >
              <Box
                sx={{
                  position: "absolute",
                  inset: 0,
                  background:
                    "linear-gradient(120deg, rgba(25,118,210,0.7) 60%, rgba(25,118,210,0.4) 100%)",
                  zIndex: 1,
                }}
              />
              <CardContent sx={{ position: "relative", zIndex: 2 }}>
                <FaChalkboardTeacher
                  size={44}
                  color="#fff"
                  style={{ marginBottom: 8 }}
                />
                <Typography variant="h5" gutterBottom sx={{ fontWeight: 700 }}>
                  Training Programmes
                </Typography>
                <Typography sx={{ mb: 2 }}>
                  Accredited courses in Facilitator, Assessor, Moderator and
                  more.
                </Typography>
                <Button
                  variant="contained"
                  sx={{
                    mt: 1,
                    backgroundColor: "#fff",
                    color: "#1976d2",
                    fontWeight: "bold",
                    boxShadow: 1,
                    "&:hover": { backgroundColor: "#e3e3e3" },
                  }}
                  onClick={() => navigate("/training")}
                >
                  Explore Courses
                </Button>
              </CardContent>
            </Card>
          </Grid>
          <Grid item xs={12} md={6}>
            <Card
              sx={{
                p: 3,
                textAlign: "center",
                boxShadow: 3,
                minHeight: { xs: 260, md: 320 },
                display: "flex",
                flexDirection: "column",
                justifyContent: "flex-end",
                backgroundImage: `url(${servicesBg})`,
                backgroundSize: "cover",
                backgroundPosition: "center",
                position: "relative",
                color: "white",
                overflow: "hidden",
                borderRadius: 3,
                transition: "all 0.3s cubic-bezier(.4,0,.2,1)",
                boxShadow: "0 4px 24px 0 rgba(255,152,0,0.15)",
                "&:hover": {
                  transform: "scale(1.04)",
                  boxShadow: "0 8px 32px 0 rgba(255,152,0,0.25)",
                },
              }}
            >
              <Box
                sx={{
                  position: "absolute",
                  inset: 0,
                  background:
                    "linear-gradient(120deg, rgba(255,152,0,0.7) 60%, rgba(255,152,0,0.4) 100%)",
                  zIndex: 1,
                }}
              />
              <CardContent sx={{ position: "relative", zIndex: 2 }}>
                <FaTools size={44} color="#fff" style={{ marginBottom: 8 }} />
                <Typography variant="h5" gutterBottom sx={{ fontWeight: 700 }}>
                  Business Services
                </Typography>
                <Typography sx={{ mb: 2 }}>
                  From event planning to cellphone repair and custom products.
                </Typography>
                <Button
                  variant="contained"
                  color="secondary"
                  sx={{
                    mt: 1,
                    backgroundColor: "#fff",
                    color: "#FF9800",
                    fontWeight: "bold",
                    boxShadow: 1,
                    "&:hover": { backgroundColor: "#ffe0b2" },
                  }}
                  onClick={() => navigate("/services")}
                >
                  View Services
                </Button>
              </CardContent>
            </Card>
          </Grid>
        </Grid>
      </Container>
    </PageWrapper>
  );
};

export default Home;
