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
import { useEffect } from "react";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import AccessTimeIcon from "@mui/icons-material/AccessTime";
import FamilyRestroomIcon from "@mui/icons-material/FamilyRestroom";
import PersonIcon from "@mui/icons-material/Person";
import LocationOnIcon from "@mui/icons-material/LocationOn";
import RestaurantIcon from "@mui/icons-material/Restaurant";
import StorefrontIcon from "@mui/icons-material/Storefront";

import map from "../assets/efteling_map.jpg";

const MAP_WIDTH = 6777;
const MAP_HEIGHT = 7208;

function stripHtml(html: string): string {
  const tmp = document.createElement("div");
  tmp.innerHTML = html;
  return tmp.textContent || tmp.innerText || "";
}

interface AttractionDetailPageProps {
  attraction: any;
  onBack: () => void;
}

const attractionCoordinates: Record<string, { x: number; y: number }> = {
  dansemacabre: { x: 3386, y: 3134 }, fatamorgana: { x: 4228, y: 4044 }, jorisendedraak: { x: 4330, y: 1869 }, devliegendehollander: { x: 3902, y: 2061 }, python: { x: 4083, y: 1465 }, carnavalfestival: { x: 1621, y: 2024 }, vogelrok: { x: 1744, y: 1896 }, droomvlucht: { x: 1475, y: 3742 }, villavolta: { x: 1221, y: 3524 }, fabula: { x: 3388, y: 3699 }, maxmoritz: { x: 3712, y: 3337 }, halvemaen: { x: 3397, y: 1652 }, symbolica: { x: 2760, y: 2812 }, gondoletta: { x: 2493, y: 2354 }, archipel: { x: 2065, y: 2080 }, baron1898: { x: 3797, y: 2575 }, sirocco: { x: 1941, y: 2080 }, stoomcarrousel: { x: 2170, y: 3042 }, vermolenmolen: { x: 1579, y: 2863 }, doudetuffer: { x: 3331, y: 1509 }, diorama: { x: 2341, y: 3147 }, hetpostkantoor: { x: 1424, y: 2642 }, eftelingmuseum: { x: 1717, y: 2827 }, gamegallery: { x: 3637, y: 1829 }, kinderspoor: { x: 2907, y: 1650 }, kleuterhof: { x: 1950, y: 1602 }, kindervreugd: { x: 1262, y: 3390 }, volkvanlaafmonorail: { x: 1316, y: 3061 }, pagode: { x: 2554, y: 2491 }, pirana: { x: 4151, y: 2981 }, speelbosnest: { x: 3810, y: 1866 }, sprookjesbos: { x: 2458, y: 3716 }, carrouselsantonpieckplein: { x: 1543, y: 2803 }, stoomtreinr: { x: 3780, y: 1385 }, stoomtreinm: { x: 1693, y: 3539 }, volkvanlaaf: { x: 1190, y: 3054 }, brasserie7: { x: 3103, y: 4182 }, cafebiscuit: { x: 3103, y: 4194 }, mystique: { x: 3205, y: 4176 }, backereikrumel: { x: 3952, y: 3608 }, burgerbackerij: { x: 3844, y: 3757 }, delikkebaerd: { x: 3922, y: 1686 }, carrouselbar: { x: 2356, y: 3126 }, casacaracol: { x: 3969, y: 2977 }, braadworstchalet: { x: 3862, y: 3592 }, debrutaleaap: { x: 3874, y: 1429 }, degebrandeboon: { x: 2810, y: 3162 }, gelaarsdekat: { x: 1890, y: 3186 }, denguldengaarde: { x: 1699, y: 3951 }, dehongerigemachinist: { x: 3707, y: 1506 }, dekombuys: { x: 4143, y: 1853 }, demeermin: { x: 3461, y: 1968 }, deparlevinker: { x: 4023, y: 1836 }, wafelsalondensuykerbuyk: { x: 1621, y: 2678 }, derustendereiziger: { x: 3898, y: 1477 }, desoeteinval: { x: 1878, y: 2899 }, yoghurtbarbijbaron1898: { x: 3748, y: 2689 }, desmaeckmaker: { x: 2619, y: 2874 }, deverleiding: { x: 3587, y: 1780 }, deverseoogst: { x: 3844, y: 1426 }, flierefluiter: { x: 2989, y: 1624 }, fraubolteskuche: { x: 3736, y: 3757 }, happinessstationpk: { x: 2798, y: 3129 }, happinessstationwp: { x: 1693, y: 3230 }, hollandsegebakskraam: { x: 3276, y: 4521 }, indenswartekat: { x: 3742, y: 3111 }, kaiserschmarnn: { x: 3754, y: 3631 }, kleyneklaroen: { x: 2386, y: 4073 }, hetwittepaard: { x: 1740, y: 3216 }, kogeloog: { x: 2995, y: 3388 }, hoorndesovervloeds: { x: 1561, y: 2940 }, melkhuysje: { x: 3792, y: 2590 }, oase: { x: 4043, y: 3917 }, theaterrestaurantapplaus: { x: 3415, y: 4808 }, restaurantkashba: { x: 1884, y: 1880 }, fabulasavannebar: { x: 3265, y: 3708 }, rondjevandemolen: { x: 2619, y: 3152 }, tpoffertje: { x: 1860, y: 3074 }, polleskeuken: { x: 2667, y: 3033 }, hetsuykerhuys: { x: 1937, y: 2889 }, restaurantfabula: { x: 3391, y: 3728 }, grootmoederskeuken: { x: 1866, y: 3225 }, tkoetshuys: { x: 3546, y: 3225 }, speelkwartier: { x: 1800, y: 1588 }, tokopagode: { x: 2416, y: 2418 }, smulpaap: { x: 1573, y: 2596 }, wachtruimteeersteklas: { x: 3726, y: 1413 }, verwendenest: { x: 3732, y: 1813 }, eigenheymerbijstationdeoost: { x: 3517, y: 1693 }, eigenheymertonvandevenplein: { x: 1608, y: 3391 }, dndorstlesserfraubolteskuche: { x: 3756, y: 3752 }, dndorstlesserhongerigemachinist: { x: 3732, y: 1505 }, dndorstlesserwittepaard: { x: 1776, y: 3195 }, dndorstlessertkoetshuys: { x: 3570, y: 3206 }, unoxkraampiraaplein: { x: 3846, y: 3159 }, unoxkraamtonvandevenplein: { x: 1453, y: 3511 }, unoxkraamvliegendehollanderplein: { x: 3929, y: 1869 }, unoxkraamvogelrokplein: { x: 1794, y: 2298 }
  , aquanura: { x: 3756, y: 4151 },
  caro: { x: 3475, y: 4672 },
  dehuyveraars: { x: 3487, y: 3207 },
  drcharlatanscabaretmacabre: { x: 3624, y: 3099 },
  ontmoeteftelingbewoners: { x: 3062, y: 4379 },
  jokieenjet: { x: 1758, y: 2063 },
  pardoesdetovernar: { x: 2829, y: 3098 },
  sprookjesboomerwaseens: { x: 2225, y: 3785 },
  magicaluna: { x: 3469, y: 4693 },
  sprookjessprokkelaar: { x: 2111, y: 3325 }, arcadeau: { x: 3116, y: 4228 },
  cascada: { x: 4145, y: 3002 },
  degevoeligheplaet: { x: 3732, y: 2542 },
  tboeghbeeld: { x: 3995, y: 2104 },
  confetti: { x: 1674, y: 2063 },
  debazaar: { x: 4163, y: 3999 },
  dromerijen: { x: 1620, y: 3928 },
  fotopuntdejoligejutter: { x: 3881, y: 1758 },
  fotopuntdnblikvanger: { x: 3092, y: 4497 },
  drcharlatanskwalyckezaken: { x: 3457, y: 3176 },
  efteldingen: { x: 3158, y: 4628 },
  indenoudenmarskramer: { x: 1985, y: 3312 },
  jokieswereld: { x: 1686, y: 2179 },
  loetiek: { x: 1555, y: 3056 },
  symbolicasouvenirs: { x: 2697, y: 2841 },
  souvenirexpress: { x: 2302, y: 4717 },
};

export default function AttractionDetailPage({ attraction, onBack }: AttractionDetailPageProps) {
  const eftelingRed = "rgb(170,24,44)";
  const coord = attractionCoordinates[attraction.id];

  useEffect(() => {
    window.scrollTo({ top: 0, left: 0, behavior: "smooth" });
  }, []);

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
      {/* HERO */}
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
            borderRadius: 4
          }}
        />
      </Box>

      {/* CONTENT */}
      <Box sx={{ px: { xs: 2, sm: 4, md: 8, lg: 20 }, mt: -5, position: "relative" }}>
        <Paper elevation={6} sx={{ p: { xs: 3, md: 5 }, borderRadius: 4 }}>

          <Typography
            variant="h3"
            sx={{ fontWeight: "bold", color: eftelingRed, fontSize: { xs: "1.8rem", md: "3rem" } }}
          >
            {attraction.title}
          </Typography>

          {attraction.subTitle && (
            <Typography variant="h6" sx={{ color: "text.secondary", mb: 1 }}>
              {attraction.subTitle}
            </Typography>
          )}

          <Stack direction="row" spacing={1} alignItems="center" sx={{ mt: 1, mb: 3 }}>
            <LocationOnIcon fontSize="small" sx={{ color: eftelingRed }} />
            <Typography variant="h6" sx={{ fontWeight: 400, color: eftelingRed }}>
              {attraction.area || "Efteling"}
            </Typography>
          </Stack>

          {/* Status badges */}
          <Stack direction="row" spacing={2} sx={{ mb: 3 }} useFlexGap flexWrap="wrap">

            {attraction.category === "ATTRACTION" &&
              attraction.state === "OPEN" &&
              attraction.currentWaitTime !== undefined && (
                <Chip
                  icon={<AccessTimeIcon sx={{ color: "#fff !important" }} />}
                  label={`${attraction.currentWaitTime} min wachttijd`}
                  sx={{ bgcolor: eftelingRed, color: "#fff", fontWeight: "bold" }}
                />
              )}

            <Chip
              icon={
                attraction.category === "RESTAURANT"
                  ? <RestaurantIcon sx={{ color: "#fff !important" }} />
                  : attraction.category === "SHOP"
                    ? <StorefrontIcon sx={{ color: "#fff !important" }} />
                    : undefined
              }
              label={getCategoryLabel(attraction.category)}
              sx={{ bgcolor: eftelingRed, color: "#fff", fontWeight: "bold" }}
            />

            <Chip
              label={attraction.state === "OPEN" ? "Geopend" : "Gesloten"}
              color={attraction.state === "OPEN" ? "success" : "error"}
              sx={{ fontWeight: "bold" }}
            />
          </Stack>

          <Divider sx={{ my: 4 }} />

          <Typography variant="h5" gutterBottom sx={{ fontWeight: "bold" }}>
            Over deze {getCategoryLabel(attraction.category).toLowerCase()}
          </Typography>

          <Typography variant="body1" sx={{ lineHeight: 1.8, color: "text.secondary", fontSize: "1.1rem" }}>
            {stripHtml(attraction.description)}
          </Typography>

          {/* RESTAURANT TIMES */}
          {attraction.category === "RESTAURANT" && attraction.openingTimes && (
            <Box sx={{ mt: 5 }}>
              <Typography variant="h6" gutterBottom sx={{ fontWeight: "bold" }}>
                Openingstijden vandaag:
              </Typography>

              {attraction.openingTimes.map((time: any, index: number) => (
                <Paper
                  key={index}
                  variant="outlined"
                  sx={{
                    p: 1,
                    display: "inline-block",
                    borderRadius: 4,
                    bgcolor: eftelingRed,
                    color: "#fff",
                    mr: 1
                  }}
                >
                  <Typography>
                    <strong>{time.openTime.slice(0, 5)}</strong> tot{" "}
                    <strong>{time.closeTime.slice(0, 5)}</strong>
                  </Typography>
                </Paper>
              ))}
            </Box>
          )}

          {/* ATTRACTION REQUIREMENTS */}
          {attraction.category === "ATTRACTION" && (
            <Box sx={{ mt: 5 }}>
              <Typography variant="h6" gutterBottom sx={{ fontWeight: "bold" }}>
                Toegankelijkheid
              </Typography>

              <Stack spacing={2}>
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

          {/* SHOW TIMES */}
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
                    sx={{
                      bgcolor: show.isPassed ? "transparent" : eftelingRed,
                      color: show.isPassed ? "text.disabled" : "#fff"
                    }}
                  />
                ))}
              </Box>
            </Box>
          )}

          {/* PARK MAP */}
          {coord && (
            <Box sx={{ mt: 6 }}>
              <Typography variant="h6" sx={{ fontWeight: "bold", mb: 2 }}>
                Locatie in het park
              </Typography>

              <Box sx={{ position: "relative", width: "100%", maxWidth: 900, mx: "auto" }}>
                <Box
                  component="img"
                  src={map}
                  alt="Efteling park map"
                  sx={{ width: "100%", borderRadius: 3 }}
                />

                <Box
                  sx={{
                    position: "absolute",
                    left: `${(coord.x / MAP_WIDTH) * 100}%`,
                    top: `${(coord.y / MAP_HEIGHT) * 100}%`,
                    transform: "translate(-50%, -50%)",
                    width: 15,
                    height: 15,
                    borderRadius: "50%",
                    bgcolor: eftelingRed,
                    border: "3px solid white",
                    boxShadow: 4
                  }}
                />
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
            fontWeight: "bold",
            borderRadius: 3,
            "&:hover": { bgcolor: "rgb(140, 20, 35)" }
          }}
        >
          Terug naar overzicht
        </Button>

      </Box>
    </Box>
  );
}

