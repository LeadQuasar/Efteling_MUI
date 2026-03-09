// src/components/AttractionDetailPage.tsx
import {
  Box,
  Typography,
  Button,
  Chip,
  Divider,
  Stack,
  Paper,
  IconButton,
} from "@mui/material";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import AccessTimeIcon from "@mui/icons-material/AccessTime";
import FamilyRestroomIcon from "@mui/icons-material/FamilyRestroom";
import PersonIcon from "@mui/icons-material/Person";
import LocationOnIcon from "@mui/icons-material/LocationOn";

// Re-using your utility to clean up the API description
function stripHtml(html: string): string {
  const tmp = document.createElement("div");
  tmp.innerHTML = html;
  return tmp.textContent || tmp.innerText || "";
}

interface AttractionDetailPageProps {
  attraction: any;
  onBack: () => void;
}

export default function AttractionDetailPage({ attraction, onBack }: AttractionDetailPageProps) {
  const eftelingRed = "rgb(170,24,44)";

  return (
    <Box sx={{ pb: 8 }}>
      {/* 1. Header / Hero Image */}
      <Box sx={{ position: "relative", width: "100%", height: { xs: 250, md: 400 } }}>
        <IconButton
          onClick={onBack}
          sx={{
            position: "absolute",
            top: 16,
            left: 16,
            bgcolor: "rgba(255,255,255,0.8)",
            "&:hover": { bgcolor: "#fff" },
            zIndex: 10,
          }}
        >
          <ArrowBackIcon sx={{ color: eftelingRed }} />
        </IconButton>
        
        <Box
          component="img"
          src={attraction.image_url}
          alt={attraction.title}
          sx={{
            width: "100%",
            height: "100%",
            objectFit: "cover",
            
          }}
        />
      </Box>

      {/* 2. Content Container */}
      <Box sx={{ px: 3, mt: -4, position: "relative" }}>
        <Paper elevation={4} sx={{ p: 3, borderRadius: 4 }}>
          {/* Title & Area */}
          <Typography variant="h4" sx={{ fontWeight: "bold", color: eftelingRed }}>
            {attraction.title}
          </Typography>
          <Stack direction="row" spacing={1} alignItems="center" sx={{ color: "text.secondary", mb: 2 }}>
            <LocationOnIcon fontSize="small" />
            <Typography variant="subtitle1">{attraction.area}</Typography>
          </Stack>

          {/* Quick Stats Row */}
          <Stack direction="row" spacing={2} sx={{ mb: 3 }} useFlexGap flexWrap="wrap">
            {attraction.category === "ATTRACTION" && attraction.state === "OPEN" && (
              <Chip
                icon={<AccessTimeIcon style={{ color: "#fff" }} />}
                label={`${attraction.currentWaitTime} min wachttijd`}
                sx={{ bgcolor: eftelingRed, color: "#fff", fontWeight: "bold" }}
              />
            )}
            
          </Stack>

          <Divider sx={{ my: 3 }} />

          {/* Description */}
          <Typography variant="h6" gutterBottom>
            Over deze attractie
          </Typography>
          <Typography variant="body1" sx={{ lineHeight: 1.7, color: "text.secondary" }}>
            {stripHtml(attraction.description)}
          </Typography>

          {/* 3. Conditional Info Sections */}
          
          {/* Height Requirements for Rides */}
          {attraction.category === "ATTRACTION" && (
            <Box sx={{ mt: 4 }}>
              <Typography variant="h6" gutterBottom>
                Toegankelijkheid
              </Typography>
              <Stack direction="column" spacing={2}>
                {attraction.minSizeWithEscort > 0 && (
                  <Stack direction="row" alignItems="center" spacing={2}>
                    <FamilyRestroomIcon sx={{ color: eftelingRed }} />
                    <Typography>
                      Onder begeleiding: <strong>min. {attraction.minSizeWithEscort} cm</strong>
                    </Typography>
                  </Stack>
                )}
                {attraction.minSizeWithoutEscort > 0 && (
                  <Stack direction="row" alignItems="center" spacing={2}>
                    <PersonIcon sx={{ color: eftelingRed }} />
                    <Typography>
                      Zelfstandig: <strong>min. {attraction.minSizeWithoutEscort} cm</strong>
                    </Typography>
                  </Stack>
                )}
              </Stack>
            </Box>
          )}

          {/* Show Times for Shows */}
          {attraction.category === "SHOW" && attraction.showTimes?.showTimes && (
            <Box sx={{ mt: 4 }}>
              <Typography variant="h6" gutterBottom>
                Vandaag te zien om:
              </Typography>
              <Stack direction="row" spacing={1} flexWrap="wrap" useFlexGap>
                {attraction.showTimes.showTimes.map((show: any, i: number) => (
                  <Chip 
                    key={i} 
                    label={show.localFromTime} 
                    disabled={show.isPassed}
                    variant={show.isPassed ? "outlined" : "filled"}
                    sx={{ mb: 1 }}
                  />
                ))}
              </Stack>
            </Box>
          )}
        </Paper>

        {/* Back Button at Bottom for Mobile convenience */}
        <Button
          fullWidth
          variant="contained"
          onClick={onBack}
          sx={{
            mt: 4,
            bgcolor: eftelingRed,
            py: 1.5,
            borderRadius: 2,
            "&:hover": { bgcolor: "rgb(140, 20, 35)" },
          }}
        >
          Terug naar overzicht
        </Button>
      </Box>
    </Box>
  );
}