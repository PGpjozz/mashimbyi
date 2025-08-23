import React from "react";
import {
  Container,
  Typography,
  Grid,
  Card,
  CardContent,
  CardMedia,
  Box,
  Button,
} from "@mui/material";
import { useNavigate } from "react-router-dom";

// Example images (add your own images in src/assets/ and update filenames)
import event from "../../assets/event.jpg";
import soap from "../../assets/soap.jpg";
import candle from "../../assets/candle.jpg";
import bread from "../../assets/bread.jpg";
import charcoal from "../../assets/charcoal.jpg";
import cake from "../../assets/cake.jpg";
import juice from "../../assets/juice.jpg";
import cellphone from "../../assets/cellphone.jpg";

const services = [
  {
    title: "Event Planning & Management",
    description:
      "Professional planning and management for all types of events. Let us make your occasion memorable and stress-free.",
    image: event,
  },
  {
    title: "Soap Making",
    description:
      "We produce high-quality, handcrafted soaps for personal and commercial use.",
    image: soap,
  },
  {
    title: "Candle Making",
    description:
      "Beautiful, custom candles for gifts, decor, and special occasions.",
    image: candle,
  },
  {
    title: "Bread Making",
    description: "Freshly baked bread available for orders and events.",
    image: bread,
  },
  {
    title: "Charcoal Making",
    description:
      "Reliable charcoal production for cooking and commercial needs.",
    image: charcoal,
  },
  {
    title: "Cake Baking",
    description:
      "Delicious cakes for birthdays, weddings, and all celebrations.",
    image: cake,
  },
  {
    title: "Juice Production",
    description: "Healthy and tasty juices made from fresh ingredients.",
    image: juice,
  },
  {
    title: "Cellphone Repair",
    description: "Expert repair and maintenance services for mobile phones.",
    image: cellphone,
  },
];

const Services = () => {
  const navigate = useNavigate();

  return (
    <Container sx={{ py: 5 }}>
      <Typography
        variant="h3"
        gutterBottom
        sx={{
          fontWeight: 700,
          letterSpacing: 1,
          textAlign: { xs: "center", md: "left" },
          animation: "fadeInDown 1s",
          "@keyframes fadeInDown": {
            from: { opacity: 0, transform: "translateY(-40px)" },
            to: { opacity: 1, transform: "translateY(0)" },
          },
        }}
      >
        Our Services
      </Typography>
      <Typography
        variant="body1"
        sx={{
          mb: 3,
          textAlign: { xs: "center", md: "left" },
          animation: "fadeInUp 1.2s",
          "@keyframes fadeInUp": {
            from: { opacity: 0, transform: "translateY(40px)" },
            to: { opacity: 1, transform: "translateY(0)" },
          },
        }}
      >
        Sogwa Solutions offers a wide range of practical and business services
        to individuals, organizations, and communities. Contact us for quality,
        reliability, and professionalism in every service we deliver.
      </Typography>
      <Grid container spacing={4}>
        {services.map((service) => (
          <Grid item xs={12} sm={12} md={6} key={service.title}>
            <Card
              sx={{
                boxShadow: 3,
                borderRadius: 3,
                minHeight: { xs: 220, md: 260 },
                display: "flex",
                flexDirection: "column",
                justifyContent: "flex-end",
                position: "relative",
                overflow: "hidden",
                transition: "all 0.3s cubic-bezier(.4,0,.2,1)",
                boxShadow: "0 4px 24px 0 rgba(25,118,210,0.10)",
                "&:hover": {
                  transform: "scale(1.03)",
                  boxShadow: "0 8px 32px 0 rgba(25,118,210,0.18)",
                },
              }}
            >
              <CardMedia
                component="img"
                height="180"
                image={service.image}
                alt={service.title}
                sx={{ objectFit: "cover", filter: "brightness(0.92)" }}
              />
              <CardContent>
                <Typography variant="h5" sx={{ fontWeight: 700 }}>
                  {service.title}
                </Typography>
                <Typography variant="body2" sx={{ mb: 2 }}>
                  {service.description}
                </Typography>
                <Button
                  variant="contained"
                  color="primary"
                  sx={{ fontWeight: 700, boxShadow: 1, mt: 1, borderRadius: 2 }}
                  onClick={() => navigate("/contact")}
                >
                  Enquire
                </Button>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>
    </Container>
  );
};

export default Services;
