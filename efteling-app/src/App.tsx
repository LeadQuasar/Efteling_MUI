import { useState } from "react";
import { Container, CssBaseline, Avatar, Fab, Box } from "@mui/material";
import MapIcon from "@mui/icons-material/Map";
import ListAltIcon from "@mui/icons-material/ListAlt";
import AttractionTabs from "./components/AttractionTabs";
import AttractionDetailPage from "./components/AttractionDetailPage";
import ParkMap from "./components/ParkMap"; // Import your ParkMap
import eftelinglogo from "./assets/efteling.png";

export default function App() {
  const [selectedAttraction, setSelectedAttraction] = useState<any | null>(null);
  const [isMapView, setIsMapView] = useState(false);

  const eftelingRed = "rgb(170,24,44)";

  // Helper to handle selection from either the list or the map
  const handleSelect = (attr: any) => {
    setSelectedAttraction(attr);
    setIsMapView(false); // Close map when looking at details
  };

  return (
    <>
      <CssBaseline />
      <Container 
        maxWidth="xl" 
        sx={{ 
          py: 4, 
          px: { xs: 0, sm: 2, md: 4 },
          minHeight: "100vh"
        }}
      >
        {!selectedAttraction && (
          <Avatar
            src={eftelinglogo}
            sx={{ width: 100, height: 100, mx: "auto", display: "block", mb: 4 }}
          />
        )}

        {/* 1. DETAIL PAGE VIEW */}
        {selectedAttraction ? (
          <AttractionDetailPage 
            attraction={selectedAttraction} 
            onBack={() => setSelectedAttraction(null)} 
          />
        ) : (
          /* 2. TOGGLE BETWEEN LIST AND MAP */
          <Box>
            {isMapView ? (
              <ParkMap onSelectAttraction={handleSelect} />
            ) : (
              <AttractionTabs onSelectAttraction={handleSelect} />
            )}
          </Box>
        )}

        {/* 3. FLOATING ACTION BUTTON (Only show if not in Detail View) */}
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
    </>
  );
}