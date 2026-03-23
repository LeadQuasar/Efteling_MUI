import { useState, useEffect, useMemo } from "react";
import { Box, Typography, Popover, CircularProgress, IconButton, Chip, Stack } from "@mui/material";
import ArrowForwardIosIcon from "@mui/icons-material/ArrowForwardIos";
import LocationPinIcon from '@mui/icons-material/LocationPin';
import axios from "axios";
import mapImg from "../assets/efteling_map.jpg";
import { attractionCoordinates, MAP_WIDTH, MAP_HEIGHT } from "../constants/mapData";

interface ParkMapProps {
  onSelectAttraction: (attraction: any) => void;
}

const CATEGORY_MAP: Record<string, string> = {
  all: "Alle",
  ride: "Attracties",
  show: "Shows",
  restaurant: "Eten & Drinken",
  shop: "Winkels"
};

export default function ParkMap({ onSelectAttraction }: ParkMapProps) {
  const [allData, setAllData] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState("all");
  
  const [anchorEl, setAnchorEl] = useState<HTMLElement | null>(null);
  const [activeAttraction, setActiveAttraction] = useState<any | null>(null);

  const eftelingRed = "rgb(170,24,44)";

  useEffect(() => {
    const endpoints = [
      { url: "https://tp.arendz.nl/parks/efteling/rides", tag: "ride" },
      { url: "https://tp.arendz.nl/parks/efteling/shows", tag: "show" },
      { url: "https://tp.arendz.nl/parks/efteling/restaurants", tag: "restaurant" },
      { url: "https://tp.arendz.nl/parks/efteling/shops", tag: "shop" }
    ];

    Promise.all(endpoints.map(endpoint => 
      axios.get(endpoint.url).then(res => 
        res.data.map((item: any) => ({ ...item, category: endpoint.tag }))
      )
    ))
      .then((results) => {
        const combined = results.flat();
        setAllData(combined);
        setLoading(false);
      })
      .catch((err) => {
        console.error("Fetch error:", err);
        setLoading(false);
      });
  }, []);

  const filteredData = useMemo(() => {
    if (filter === "all") return allData;
    return allData.filter(item => item.category === filter);
  }, [allData, filter]);

  const handleTogglePopover = (event: React.MouseEvent<HTMLElement>, attraction: any) => {
    setAnchorEl(event.currentTarget);
    setActiveAttraction(attraction);
  };

  const handleClosePopover = () => {
    setAnchorEl(null);
    setActiveAttraction(null);
  };

  if (loading) return <Box sx={{ display: 'flex', justifyContent: 'center', p: 10 }}><CircularProgress sx={{ color: eftelingRed }} /></Box>;

  return (
    <Box sx={{ width: "100%", maxWidth: 1400, mx: "auto" }}>
      
      {/* Filter Bar */}
      <Stack 
        direction="row" 
        spacing={1} 
        sx={{ 
          mb: 2, 
          overflowX: "auto", 
          pb: 1, 
          px: 1,
          '&::-webkit-scrollbar': { display: 'none' },
          scrollbarWidth: 'none',
        }}
      >
        {Object.entries(CATEGORY_MAP).map(([key, label]) => (
          <Chip
            key={key}
            label={label}
            onClick={() => {
              setFilter(key);
              handleClosePopover();
            }}
            sx={{
              bgcolor: filter === key ? eftelingRed + '!important' : "white",
              color: filter === key ? "white" : eftelingRed,
              border: `2px solid ${eftelingRed}`,
              fontWeight: "bold",
              fontSize: { xs: '0.7rem', md: '0.85rem' },
              height: { xs: 24, md: 32 },
            }}
          />
        ))}
      </Stack>

      {/* Map Container */}
      <Box sx={{ position: "relative", overflow: "hidden", borderRadius: 4, boxShadow: 5 }}>
        <img src={mapImg} alt="Efteling Map" style={{ width: "100%", display: "block" }} />

        {Object.entries(attractionCoordinates).map(([id, coord]) => {
          const attraction = filteredData.find(item => item.id === id);
          if (!attraction) return null;

          const isActive = activeAttraction?.id === id;

          return (
            <Box
              key={id}
              onClick={(e) => handleTogglePopover(e, attraction)}
              sx={{
                position: "absolute",
                left: `${(coord.x / MAP_WIDTH) * 100}%`,
                top: `${(coord.y / MAP_HEIGHT) * 100}%`,
                // Transform handles the positioning: 
                // Dots are centered, Pins are bottom-aligned to the coord
                transform: isActive ? "translate(-50%, -100%)" : "translate(-50%, -50%)",
                cursor: "pointer",
                zIndex: isActive ? 100 : 10,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                transition: "transform 0.2s ease-out",
              }}
            >
              {isActive ? (
                <LocationPinIcon 
                  sx={{ 
                    color: eftelingRed, 
                    fontSize: { xs: 24, md: 40 },
                    filter: "drop-shadow(0px 2px 4px rgba(0,0,0,0.4))",
                    // Keyframe animation for the "pop"
                    animation: "popIn 0.3s cubic-bezier(0.175, 0.885, 0.32, 1.275)",
                    "@keyframes popIn": {
                      "0%": { transform: "scale(0) translateY(20px)", opacity: 0 },
                      "100%": { transform: "scale(1) translateY(0)", opacity: 1 }
                    }
                  }} 
                />
              ) : (
                <Box
                  sx={{
                    width: { xs: '6px', md: '12px' }, 
                    height: { xs: '6px', md: '12px' },
                    bgcolor: eftelingRed,
                    border: { xs: "1px solid white", md: "2px solid white" },
                    borderRadius: "50%",
                    boxShadow: "0px 1px 3px rgba(0,0,0,0.3)",
                    '&:hover': { transform: 'scale(1.2)', transition: '0.2s' }
                  }}
                />
              )}
            </Box>
          );
        })}

        <Popover
          open={Boolean(anchorEl)}
          anchorEl={anchorEl}
          onClose={handleClosePopover}
          anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
          transformOrigin={{ vertical: 'bottom', horizontal: 'center' }}
          disableScrollLock disableAutoFocus disableEnforceFocus disableRestoreFocus
          PaperProps={{
            sx: { 
              borderRadius: { xs: 1.5, md: 4 }, 
              boxShadow: '0px 2px 8px rgba(0,0,0,0.15)',
              border: `1px solid ${eftelingRed}`,
              // Offset slightly so it doesn't cover the Pin head
              mt: -2.5, 
              maxWidth: { xs: '120px', md: '240px' }, 
              overflow: 'hidden'
            }
          }}
        >
          <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 0.5, p: { xs: 0.3, md: 0.8 }, bgcolor: "#fff" }}>
            <Box sx={{ flex: 1, minWidth: 0 }}>
              <Typography variant="caption" noWrap sx={{ fontWeight: 'bold', color: eftelingRed, fontSize: { xs: '0.45rem', md: '0.85rem' }, display: 'block', lineHeight: 1 }}>
                {activeAttraction?.title}
              </Typography>
              {activeAttraction?.currentWaitTime !== undefined && (
                <Typography sx={{ fontSize: { xs: '0.35rem', md: '0.65rem', fontWeight: 'bold' }, color: eftelingRed, mt: 0.1 }}>
                  {activeAttraction.currentWaitTime} min
                </Typography>
              )}
            </Box>
            <IconButton size="small" onClick={(e) => { e.stopPropagation(); handleClosePopover(); onSelectAttraction(activeAttraction); }}
              sx={{ bgcolor: eftelingRed, color: 'white', width: { xs: 12, md: 24 }, height: { xs: 12, md: 24 }, p: 0, '& .MuiSvgIcon-root': { fontSize: { xs: 6, md: 12 } } }}>
              <ArrowForwardIosIcon />
            </IconButton>
          </Box>
        </Popover>
      </Box>
    </Box>
  );
}