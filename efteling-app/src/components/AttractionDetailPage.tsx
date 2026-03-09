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
import RestaurantIcon from "@mui/icons-material/Restaurant";
import StorefrontIcon from "@mui/icons-material/Storefront";

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

  // Helper to determine the label based on category
  const getCategoryLabel = (cat: string) => {
    switch (cat) {
      case "RESTAURANT": return "Restaurant";
      case "SHOP": return "Winkel";
      case "SHOW": return "Parkshow";
      default: return "Attractie";
    }
  };

  return (
    <Box sx={{ pb: 8, width: "100%" }}>
      {/* 1. Full-Width Hero Section */}
      <Box sx={{ position: "relative", width: "100%", height: { xs: 300, md: 500 } }}>
        <IconButton
          onClick={onBack}
          sx={{
            position: "absolute",
            top: 20,
            left: 20,
            bgcolor: "rgba(255,255,255,0.9)",
            "&:hover": { bgcolor: "#fff" },
            zIndex: 10,
            boxShadow: 2
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
            display: "block",
            borderRadius: 4
          }}
        />
      </Box>

      {/* 2. Content Container */}
      <Box sx={{ px: { xs: 2, sm: 4, md: 8, lg: 20 }, mt: -5, position: "relative" }}>
        <Paper elevation={6} sx={{ p: { xs: 3, md: 5 }, borderRadius: 4 }}>
          
          <Typography variant="h3" sx={{ fontWeight: "bold", color: eftelingRed, fontSize: { xs: '1.8rem', md: '3rem' } }}>
            {attraction.title}
          </Typography>
          
          {attraction.subTitle && (
            <Typography variant="h6" sx={{ color: "text.secondary",  mb: 1 }}>
              {attraction.subTitle}
            </Typography>
          )}

          <Stack direction="row" spacing={1} alignItems="center" sx={{ color: "text.secondary", mt: 1, mb: 3 }}>
            <LocationOnIcon fontSize="small" sx={{color: eftelingRed}} />
            <Typography variant="h6" sx={{ fontWeight: 400, color: eftelingRed }}>{attraction.area || "Efteling"}</Typography>
          </Stack>

          {/* Badges for Wait Times or Status */}
          <Stack direction="row" spacing={2} sx={{ mb: 3 }} useFlexGap flexWrap="wrap">
            {attraction.category === "ATTRACTION" && attraction.state === "OPEN" && attraction.currentWaitTime !== undefined && (
              <Chip
                icon={<AccessTimeIcon sx={{color: "#fff !important"}} />}
                label={`${attraction.currentWaitTime} min wachttijd`}
                sx={{ bgcolor: eftelingRed, color: "#fff", fontWeight: "bold" }}
              />
            )}
            
            <Chip 
              icon={attraction.category === "RESTAURANT" ? <RestaurantIcon sx={{color: "#fff !important"}} /> : attraction.category === "SHOP" ? <StorefrontIcon sx={{color: "#fff !important"}} /> : undefined}
              label={getCategoryLabel(attraction.category)} 
              variant="outlined" 
              sx={{ fontWeight: "bold", bgcolor: eftelingRed, color: "#fff", }} 
            />

            <Chip 
              label={attraction.state === "OPEN" ? "Geopend" : "Gesloten"} 
              color={attraction.state === "OPEN" ? "success" : "error"}
              sx={{ fontWeight: "bold" }}
            />
          </Stack>

          <Divider sx={{ my: 4 }} />

          {/* Dynamic Description Header */}
          <Typography variant="h5" gutterBottom sx={{ fontWeight: "bold" }}>
            Over deze {getCategoryLabel(attraction.category).toLowerCase()}
          </Typography>
          <Typography variant="body1" sx={{ lineHeight: 1.8, color: "text.secondary", fontSize: "1.1rem" }}>
            {stripHtml(attraction.description)}
          </Typography>

          {/* 3. RESTAURANT Specific: Opening Times */}
          {attraction.category === "RESTAURANT" && attraction.openingTimes && (
            <Box sx={{ mt: 5 }}>
              <Typography variant="h6" gutterBottom sx={{ fontWeight: "bold" }}>
                Openingstijden vandaag:
              </Typography>
              {attraction.openingTimes.map((time: any, index: number) => (
                <Paper key={index} variant="outlined" sx={{ p: 0.5, display: 'inline-block', borderRadius: 4, bgcolor: eftelingRed, color: "#fff " }}>
                  <Typography variant="body1">
                    <strong>{time.openTime.slice(0, 5)}</strong> tot <strong>{time.closeTime.slice(0, 5)}</strong>
                  </Typography>
                  {time.comments && (
                    <Typography variant="caption" color="text.secondary">
                      ({time.comments})
                    </Typography>
                  )}
                </Paper>
              ))}
            </Box>
          )}

          {/* 4. ATTRACTION Specific: Requirements */}
          {attraction.category === "ATTRACTION" && (
            <Box sx={{ mt: 5 }}>
              <Typography variant="h6" gutterBottom sx={{ fontWeight: "bold" }}>
                Toegankelijkheid
              </Typography>
              <Stack spacing={2}>
                {attraction.minSizeWithEscort > 0 && (
                  <Stack direction="row" alignItems="center" spacing={2}>
                    <FamilyRestroomIcon sx={{ color: eftelingRed }} />
                    <Typography>Onder begeleiding: <strong>min. {attraction.minSizeWithEscort} cm</strong></Typography>
                  </Stack>
                )}
                {attraction.minSizeWithoutEscort > 0 && (
                  <Stack direction="row" alignItems="center" spacing={2}>
                    <PersonIcon sx={{ color: eftelingRed }} />
                    <Typography>Zelfstandig: <strong>min. {attraction.minSizeWithoutEscort} cm</strong></Typography>
                  </Stack>
                )}
              </Stack>
            </Box>
          )}

          {/* 5. SHOW Specific: Times */}
          {attraction.category === "SHOW" && attraction.showTimes?.showTimes && (
            <Box sx={{ mt: 5 }}>
              <Typography variant="h6" gutterBottom sx={{ fontWeight: "bold" }}>
                Showtijden:
              </Typography>
              <Box sx={{ display: "flex", flexWrap: "wrap", gap: 1.5 }}>
                {attraction.showTimes.showTimes.map((show: any, i: number) => (
                  <Chip 
                    key={i} 
                    label={show.localFromTime} 
                    disabled={show.isPassed}
                    variant={show.isPassed ? "outlined" : "filled"}
                    sx={{ bgcolor: show.isPassed ? "transparent" : eftelingRed, color: show.isPassed ? "text.disabled" : "#fff" }}
                  />
                ))}
              </Box>
            </Box>
          )}
        </Paper>

        <Button
          fullWidth
          variant="contained"
          onClick={onBack}
          sx={{
            mt: 4,
            bgcolor: eftelingRed,
            py: 2,
            fontSize: "1.1rem",
            fontWeight: "bold",
            borderRadius: 3,
            "&:hover": { bgcolor: "rgb(140, 20, 35)" },
          }}
        >
          Terug naar overzicht
        </Button>
      </Box>
    </Box>
  );
}