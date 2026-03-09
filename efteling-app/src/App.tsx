import { useState } from "react";
import { Container, CssBaseline, Avatar } from "@mui/material";
import AttractionTabs from "./components/AttractionTabs";
import AttractionDetailPage from "./components/AttractionDetailPage"; // Import this!
import eftelinglogo from "./assets/efteling.png";

export default function App() {
  // State to track which attraction (if any) is currently selected
  const [selectedAttraction, setSelectedAttraction] = useState<any | null>(null);

  return (
    <>
      <CssBaseline />
      <Container 
        maxWidth={false} 
        sx={{ 
          py: 4, 
          px: { xs: 0, sm: 2, md: 4 } // Responsive padding
        }}
      >
        {/* Only show the logo if we aren't looking at a detail page (optional) */}
        {!selectedAttraction && (
          <Avatar
            src={eftelinglogo}
            sx={{
              width: 100,
              height: 100,
              mx: "auto",
              display: "block",
              mb: 4
            }}
          />
        )}

        {/* Conditional Rendering: 
            If selectedAttraction is NOT null, show the Detail Page.
            Otherwise, show the main Tabs list.
        */}
        {selectedAttraction ? (
          <AttractionDetailPage 
            attraction={selectedAttraction} 
            onBack={() => setSelectedAttraction(null)} 
          />
        ) : (
          <AttractionTabs 
            onSelectAttraction={(attr) => setSelectedAttraction(attr)} 
          />
        )}
      </Container>
    </>
  );
}