import { useState, useEffect, useMemo } from "react";
import { 
  Box, 
  Typography, 
  Popover, 
  CircularProgress, 
  IconButton, 
  Chip, 
  Stack, 
  Tooltip 
} from "@mui/material";
import { 
  TransformWrapper, 
  TransformComponent, 
  useControls 
} from "react-zoom-pan-pinch";

// Icons
import ArrowForwardIosIcon from "@mui/icons-material/ArrowForwardIos";
import LocationPinIcon from '@mui/icons-material/LocationPin';
import AddIcon from '@mui/icons-material/Add';
import RemoveIcon from '@mui/icons-material/Remove';
import RestartAltIcon from '@mui/icons-material/RestartAlt';

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

const eftelingRed = "rgb(170,24,44)";

/**
 * Custom Controls Overlay
 * These buttons appear on top of the map to allow manual zooming
 */
const MapControls = () => {
  const { zoomIn, zoomOut, resetTransform } = useControls();
  return (
    <Stack 
      direction="column" 
      spacing={1} 
      sx={{ 
        position: 'absolute', 
        bottom: 16, 
        right: 16, 
        zIndex: 20,
      }}
    >
      <Tooltip title="Zoom In" placement="left">
        <IconButton 
          onClick={() => zoomIn()} 
          sx={{ bgcolor: 'white', boxShadow: 2, '&:hover': { bgcolor: '#f5f5f5' } }}
        >
          <AddIcon sx={{ color: eftelingRed }} />
        </IconButton>
      </Tooltip>
      <Tooltip title="Zoom Out" placement="left">
        <IconButton 
          onClick={() => zoomOut()} 
          sx={{ bgcolor: 'white', boxShadow: 2, '&:hover': { bgcolor: '#f5f5f5' } }}
        >
          <RemoveIcon sx={{ color: eftelingRed }} />
        </IconButton>
      </Tooltip>
      <Tooltip title="Reset Map" placement="left">
        <IconButton 
          onClick={() => resetTransform()} 
          sx={{ bgcolor: 'white', boxShadow: 2, '&:hover': { bgcolor: '#f5f5f5' } }}
        >
          <RestartAltIcon sx={{ color: eftelingRed }} />
        </IconButton>
      </Tooltip>
    </Stack>
  );
};

export default function ParkMap({ onSelectAttraction }: ParkMapProps) {
  const [allData, setAllData] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState("all");
  
  const [anchorEl, setAnchorEl] = useState<HTMLElement | null>(null);
  const [activeAttraction, setActiveAttraction] = useState<any | null>(null);

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

  if (loading) return (
    <Box sx={{ display: 'flex', justifyContent: 'center', p: 10 }}>
      <CircularProgress sx={{ color: eftelingRed }} />
    </Box>
  );

  return (
    <Box sx={{ width: "100%", maxWidth: 1400, mx: "auto", p: 2 }}>
      
      {/* Filter Bar */}
      <Stack 
        direction="row" 
        spacing={1} 
        sx={{ 
          mb: 2, 
          overflowX: "auto", 
          pb: 1, 
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
              bgcolor: filter === key ? `${eftelingRed} !important` : "white",
              color: filter === key ? "white" : eftelingRed,
              border: `2px solid ${eftelingRed}`,
              fontWeight: "bold",
              fontSize: { xs: '0.7rem', md: '0.85rem' },
              height: { xs: 24, md: 32 },
            }}
          />
        ))}
      </Stack>

      {/* Main Map Container */}
      <Box sx={{ 
        position: "relative", 
        overflow: "hidden", 
        borderRadius: 4, 
        boxShadow: 5,
        bgcolor: '#f4f1ea', 
        cursor: 'grab',
        '&:active': { cursor: 'grabbing' }
      }}>
        
        <TransformWrapper
          initialScale={1}
          minScale={1}
          maxScale={6}
          centerOnInit={true}
          limitToBounds={true}          // Essential for preventing white space dragging
          centerZoomedOut={true}        // Keeps the map in the middle at 1x scale
          doubleClick={{ disabled: false }}
          panning={{ velocityDisabled: true }}
        >
          <MapControls />

          <TransformComponent 
            wrapperStyle={{ 
              width: "100%", 
              maxHeight: '80vh', // Adjust this based on your design
              overflow: 'hidden' 
            }}
            contentStyle={{ 
              width: '100%',
              display: 'flex',
              alignItems: 'center'
            }}
          >
            {/* The coordinate container */}
            <Box sx={{ position: "relative", width: "100%" }}>
              <img 
                src={mapImg} 
                alt="Efteling Map" 
                style={{ 
                  width: "100%", 
                  height: "auto", 
                  display: "block", 
                  userSelect: 'none', 
                  pointerEvents: 'none' 
                }} 
              />

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
                      // Pivot the pin so the tip is at the exact coordinate
                      transform: isActive ? "translate(-50%, -100%)" : "translate(-50%, -50%)",
                      cursor: "pointer",
                      zIndex: isActive ? 100 : 10,
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      transition: "transform 0.2s ease-out",
                      pointerEvents: 'auto'
                    }}
                  >
                    {isActive ? (
                      <LocationPinIcon 
                        sx={{ 
                          color: eftelingRed, 
                          fontSize: { xs: 20, md: 40 },
                          filter: "drop-shadow(0px 2px 4px rgba(0,0,0,0.4))",
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
                          width: { xs: '4px', md: '12px' }, 
                          height: { xs: '4px', md: '12px' },
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
            </Box>
          </TransformComponent>
        </TransformWrapper>

        {/* Popover stays fixed to the viewport relative to the pin */}
        <Popover
          open={Boolean(anchorEl)}
          anchorEl={anchorEl}
          onClose={handleClosePopover}
          anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
          transformOrigin={{ vertical: 'bottom', horizontal: 'center' }}
          disableScrollLock
          PaperProps={{
            sx: { 
              borderRadius: { xs: 1.5, md: 2 }, 
              boxShadow: '0px 4px 12px rgba(0,0,0,0.2)',
              border: `2px solid ${eftelingRed}`,
              // Responsive margin to keep it perfectly above the pin head
              mt: { xs: -0.5, md: -6 }, 
              minWidth: { xs: '120px', md: '200px' }, 
              overflow: 'hidden'
            }
          }}
        >
          <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 1, p: 1, bgcolor: "#fff" }}>
            <Box sx={{ flex: 1, minWidth: 0 }}>
              <Typography variant="body2" noWrap sx={{ fontWeight: 'bold', color: eftelingRed, fontSize: { xs: '0.75rem', md: '0.9rem' } }}>
                {activeAttraction?.title}
              </Typography>
              {activeAttraction?.currentWaitTime !== undefined && (
                <Typography variant="caption" sx={{ color: '#666', fontWeight: '600', display: 'block' }}>
                  {activeAttraction.currentWaitTime} min wachttijd
                </Typography>
              )}
            </Box>
            <IconButton 
              size="small" 
              onClick={(e) => { 
                e.stopPropagation(); 
                handleClosePopover(); 
                onSelectAttraction(activeAttraction); 
              }}
              sx={{ 
                bgcolor: eftelingRed, 
                color: 'white', 
                '&:hover': { bgcolor: '#8e1424' },
                width: 24, height: 24 
              }}
            >
              <ArrowForwardIosIcon sx={{ fontSize: 12 }} />
            </IconButton>
          </Box>
        </Popover>
      </Box>
    </Box>
  );
}