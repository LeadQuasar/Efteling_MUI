import { useState, useEffect } from "react";
import { Container, CssBaseline, Avatar, Fab, Box } from "@mui/material";
import MapIcon from "@mui/icons-material/Map";
import ListAltIcon from "@mui/icons-material/ListAlt";
import AttractionTabs from "./components/AttractionTabs";
import AttractionDetailPage from "./components/AttractionDetailPage";
import ParkMap from "./components/ParkMap";
import GlowingLogoLoader from "./components/GlowingLogoLoader";
import eftelinglogo from "./assets/efteling.png";
import grain from "./assets/grain-dark.png";

export default function App() {
  const [selectedAttraction, setSelectedAttraction] = useState<any | null>(null);
  const [isMapView, setIsMapView] = useState(false);
  const [loading, setLoading] = useState(true);
  const [showLoader, setShowLoader] = useState(true);

  const eftelingRed = "rgb(170,24,44)";

  // Simulate loading
  useEffect(() => {
    const timer = setTimeout(() => setLoading(false), 1500);
    return () => clearTimeout(timer);
  }, []);

  // Fade out loader
  useEffect(() => {
    if (!loading) {
      const fadeTimer = setTimeout(() => setShowLoader(false), 600);
      return () => clearTimeout(fadeTimer);
    }
  }, [loading]);

  const handleSelect = (attr: any) => setSelectedAttraction(attr);

  return (
    <>
      <CssBaseline />

      {/* Loader Overlay */}
{showLoader && (
  <Box
    sx={{
      position: "fixed",
      inset: 0,
      display: "flex",
      justifyContent: "center",
      alignItems: "center",
      backgroundColor: "#fcf5ed",
      zIndex: 2000,
      transition: "opacity 0.6s ease-in-out",
      opacity: loading ? 1 : 0,

      // grain overlay
      "&::before": {
        content: '""',
        position: "absolute",
        inset: 0,
        backgroundImage: `url(${grain})`,
        backgroundSize: "10rem",
        opacity: 0.06,
        pointerEvents: "none",
        zIndex: 0,
      },
    }}
  >
    <Box sx={{ position: "relative", zIndex: 1 }}>
      <GlowingLogoLoader />
    </Box>
  </Box>
)}

      {!loading && (
        <Container
          maxWidth="xl"
          sx={{
            py: 4,
            px: { xs: 0, sm: 2, md: 4 },
            minHeight: "100vh",
          }}
        >
          {!selectedAttraction && (
            <Avatar
              src={eftelinglogo}
              sx={{
                width: 100,
                height: 100,
                mx: "auto",
                display: "block",
                mb: 4,
              }}
            />
          )}

          {/* DETAIL PAGE */}
          {selectedAttraction ? (
            <AttractionDetailPage
              attraction={selectedAttraction}
              onBack={() => setSelectedAttraction(null)}
            />
          ) : (
            <Box>
              {isMapView ? (
                <ParkMap onSelectAttraction={handleSelect} />
              ) : (
                <AttractionTabs onSelectAttraction={handleSelect} />
              )}
            </Box>
          )}

          {/* FLOATING BUTTON */}
          {!selectedAttraction && (
            <Fab
              color="primary"
              aria-label="toggle map"
              onClick={() => setIsMapView(!isMapView)}
              sx={{
                position: "fixed",
                bottom: 32,
                right: 32,
                bgcolor: eftelingRed,
                "&:hover": { bgcolor: "rgb(140, 20, 35)" },
                zIndex: 1000,
              }}
            >
              {isMapView ? <ListAltIcon /> : <MapIcon />}
            </Fab>
          )}
        </Container>
      )}
    </>
  );
}