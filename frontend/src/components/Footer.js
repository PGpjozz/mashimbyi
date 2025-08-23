import React from "react";
import { Box, Typography, Container, Grid } from "@mui/material";
import sogwaLogo from "../assets/logo.jpg";
import etdpLogo from "../assets/accreditation/etdp.png";
import saqaLogo from "../assets/accreditation/saqa.png";
import localSetaLogo from "../assets/accreditation/local_seta.jpg";
import constructionSetaLogo from "../assets/accreditation/construction_seta.jpg";
import cipcLogo from "../assets/accreditation/cipc.png";
import qctoLogo from "../assets/accreditation/qcto.png";

const Footer = () => (
  <Box
    sx={{
      py: { xs: 3, md: 4 },
      mt: { xs: 4, md: 6 },
      color: "white",
      position: "relative",
      overflow: "hidden",
      backgroundImage: `url(${sogwaLogo})`,
      backgroundRepeat: "no-repeat",
      backgroundSize: "cover",
      backgroundPosition: "center",
      "&:before": {
        content: '""',
        position: "absolute",
        inset: 0,
        background:
          "linear-gradient(120deg, rgba(25,118,210,0.92) 60%, rgba(25,118,210,0.85) 100%)",
        zIndex: 0,
      },
    }}
  >
    <Container sx={{ position: "relative", zIndex: 1 }}>
      <Box sx={{ textAlign: "center" }}>
        <Box
          sx={{
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            mb: 2,
            flexWrap: "wrap",
            gap: 1,
          }}
        >
          <Box
            component="img"
            src={sogwaLogo}
            alt="Sogwa Solutions Logo"
            sx={{
              height: 44,
              width: 44,
              borderRadius: "50%",
              mr: 2,
              background: "#fff",
              p: 1,
              boxShadow: 2,
            }}
          />
          <Typography
            variant="h6"
            sx={{
              fontWeight: "bold",
              fontSize: { xs: "1.1rem", md: "1.25rem" },
            }}
          >
            Sogwa Solutions
          </Typography>
        </Box>
        <Typography variant="body2" sx={{ mb: 2 }}>
          Accredited Skills Development & Community Services
        </Typography>
        <Typography variant="body2" sx={{ mb: 2 }}>
          📞 Babalwa Jack: 072 368 5430&nbsp;&nbsp;|&nbsp;&nbsp; 📞 Siya: 083
          521 3272&nbsp;&nbsp;|&nbsp;&nbsp; 📧 sogwasolutions@gmail.com
        </Typography>
        <Typography variant="body2" sx={{ fontWeight: "bold", mb: 2 }}>
          ETDP SETA Accreditation No: ETDP10492
        </Typography>
        <Box
          sx={{
            display: "flex",
            flexWrap: "wrap",
            justifyContent: "center",
            gap: { xs: 1, md: 2 },
            mb: 2,
          }}
        >
          {[
            etdpLogo,
            saqaLogo,
            localSetaLogo,
            constructionSetaLogo,
            cipcLogo,
            qctoLogo,
          ].map((logo, i) => (
            <Box
              key={i}
              component="img"
              src={logo}
              alt={"Accreditation Logo " + i}
              sx={{
                height: { xs: 26, md: 32 },
                mx: 0.5,
                background: "#fff",
                borderRadius: 1,
                p: 0.5,
                boxShadow: 1,
              }}
            />
          ))}
        </Box>
        <Typography
          variant="caption"
          sx={{ letterSpacing: 1, fontSize: "1rem", fontWeight: 500 }}
        >
          &copy; {new Date().getFullYear()} Sogwa Solutions &mdash; All rights
          reserved.
        </Typography>
      </Box>
    </Container>
  </Box>
);

export default Footer;
