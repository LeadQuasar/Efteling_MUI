
import { Container, CssBaseline, Avatar } from "@mui/material";
import AttractionTabs from "./components/AttractionTabs";
import eftelinglogo from "./assets/efteling.png"

export default function App() {
  return (
    <>
      <CssBaseline />
      <Container maxWidth={false}
        sx={{
          py: 4,
          px: 0
        }}
      >
          <Avatar
  src={eftelinglogo}
  sx={{
    width: 100,
    height: 100,
    mx: "auto", // 👈 auto margin on X axis centers in flex/blocks
    display: "block" // 👈 make sure it behaves like a block
  }}
/>
        <AttractionTabs />
      </Container>
    </>
  );
}
