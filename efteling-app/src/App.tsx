
import { Container, CssBaseline, Typography } from "@mui/material";
import AttractionTabs from "./components/AttractionTabs";

export default function App() {
  return (
    <>
      <CssBaseline />
      <Container  maxWidth={false} 
      sx={{ 
        width: "100vw", 
        p: 4
      }}
    >
        <Typography variant="h3" align="center" gutterBottom>
          🎢 Efteling Park Guide
        </Typography>
        <AttractionTabs />
      </Container>
    </>
  );
}
