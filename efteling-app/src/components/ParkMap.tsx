import React, { useState, useEffect, useMemo } from "react";
import {
  Box,
  Typography,
  CircularProgress,
  IconButton,
  Chip,
  Stack,
  Tooltip,
  SwipeableDrawer,
  Popover,
  useMediaQuery,
  useTheme,
} from "@mui/material";
import {
  TransformWrapper,
  TransformComponent,
  useControls,
} from "react-zoom-pan-pinch";

// Icons
import ArrowForwardIosIcon from "@mui/icons-material/ArrowForwardIos";
import LocationPinIcon from "@mui/icons-material/LocationPin";
import AddIcon from "@mui/icons-material/Add";
import RemoveIcon from "@mui/icons-material/Remove";
import RestartAltIcon from "@mui/icons-material/RestartAlt";

import axios from "axios";
import mapImg from "../assets/efteling_map.jpg";
import {
  attractionCoordinates,
  MAP_WIDTH,
  MAP_HEIGHT,
} from "../constants/mapData";

interface ParkMapProps {
  onSelectAttraction: (attraction: any) => void;
}

const CATEGORY_MAP: Record<string, string> = {
  all: "Alle",
  Attractie: "Attracties",
  Show: "Shows",
  Restaurant: "Eten & Drinken",
  Winkel: "Winkels",
};

const eftelingRed = "rgb(170,24,44)";

/* ----------------------------- Map Controls ----------------------------- */
const MapControls = React.memo(() => {
  const { zoomIn, zoomOut, resetTransform } = useControls();

  return (
    <Stack
      direction="column"
      spacing={1}
      sx={{ position: "absolute", bottom: 16, right: 16, zIndex: 20 }}
    >
      <Tooltip title="Zoom In" placement="left">
        <IconButton
          onClick={() => zoomIn()}
          sx={{
            bgcolor: "white",
            boxShadow: 2,
            "&:hover": { bgcolor: "#f5f5f5" },
          }}
        >
          <AddIcon sx={{ color: eftelingRed }} />
        </IconButton>
      </Tooltip>

      <Tooltip title="Zoom Out" placement="left">
        <IconButton
          onClick={() => zoomOut()}
          sx={{
            bgcolor: "white",
            boxShadow: 2,
            "&:hover": { bgcolor: "#f5f5f5" },
          }}
        >
          <RemoveIcon sx={{ color: eftelingRed }} />
        </IconButton>
      </Tooltip>

      <Tooltip title="Reset Map" placement="left">
        <IconButton
          onClick={() => resetTransform()}
          sx={{
            bgcolor: "white",
            boxShadow: 2,
            "&:hover": { bgcolor: "#f5f5f5" },
          }}
        >
          <RestartAltIcon sx={{ color: eftelingRed }} />
        </IconButton>
      </Tooltip>
    </Stack>
  );
});

/* ----------------------------- Map Marker ----------------------------- */
interface MarkerProps {
  coord: { x: number; y: number };
  attraction: any;
  isActive: boolean;
  onClick: (attraction: any, event: React.MouseEvent<HTMLElement>) => void;
}

const MapMarker = React.memo(function MapMarker({
  coord,
  attraction,
  isActive,
  onClick,
}: MarkerProps) {
  if (!attraction) return null;

  return (
    <Box
      onClick={(e) => onClick(attraction, e)}
      sx={{
        position: "absolute",
        left: `${(coord.x / MAP_WIDTH) * 100}%`,
        top: `${(coord.y / MAP_HEIGHT) * 100}%`,
        transform: isActive
          ? "translate(-50%, -100%)"
          : "translate(-50%, -50%)",
        cursor: "pointer",
        zIndex: isActive ? 100 : 10,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        pointerEvents: "auto",
      }}
    >
      {isActive ? (
        <LocationPinIcon
          sx={{
            color: eftelingRed,
            fontSize: { xs: 12, md: 18 },
            filter: "drop-shadow(0px 2px 4px rgba(0,0,0,0.4))",
          }}
        />
      ) : (
        <Box
          sx={{
            width: 4,
            height: 4,
            bgcolor: eftelingRed,
            border: "1px solid white",
            borderRadius: "50%",
            boxShadow: "0px 1px 3px rgba(0,0,0,0.3)",
            transformOrigin: "center",
            transition: "transform 0.2s",
            transform: { xs: "scale(0.5)", sm: "scale(0.75)", md: "scale(1)" },
            "&:hover": { transform: "scale(1.5)" },
          }}
        />
      )}
    </Box>
  );
});

/* ----------------------------- Main Component ----------------------------- */
export default function ParkMap({ onSelectAttraction }: ParkMapProps) {
  const [allData, setAllData] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState("all");
  const [activeAttraction, setActiveAttraction] = useState<any | null>(null);
  const [anchorEl, setAnchorEl] = useState<HTMLElement | null>(null);

  const theme = useTheme();
  const isLargeScreen = useMediaQuery(theme.breakpoints.up("md"));

  /* ----------------------------- Fetch Data ----------------------------- */
  useEffect(() => {
    const endpoints = [
      { url: "https://tp.arendz.nl/parks/efteling/rides", tag: "Attractie" },
      { url: "https://tp.arendz.nl/parks/efteling/shows", tag: "Show" },
      { url: "https://tp.arendz.nl/parks/efteling/restaurants", tag: "Restaurant" },
      { url: "https://tp.arendz.nl/parks/efteling/shops", tag: "Winkel" },
    ];

    Promise.all(
      endpoints.map((endpoint) =>
        axios.get(endpoint.url).then((res) =>
          res.data.map((item: any) => ({
            ...item,
            category: endpoint.tag,
          }))
        )
      )
    )
      .then((results) => {
        setAllData(results.flat());
        setLoading(false);
      })
      .catch((err) => {
        console.error("Fetch error:", err);
        setLoading(false);
      });
  }, []);

  /* ----------------------------- Preload Map Image ----------------------------- */
  useEffect(() => {
    const img = new Image();
    img.src = mapImg;
  }, []);

  /* ----------------------------- Filtered Map ----------------------------- */
  const filteredDataMap = useMemo(() => {
    const data =
      filter === "all"
        ? allData
        : allData.filter((item) => item.category === filter);

    const map = new Map();
    data.forEach((item) => map.set(item.id, item));

    return map;
  }, [allData, filter]);

  /* ----------------------------- Handlers ----------------------------- */
  const handleMarkerClick = (
    attraction: any,
    event: React.MouseEvent<HTMLElement>
  ) => {
    // Prevent the map zoom library from intercepting this click
    event.stopPropagation();
    event.preventDefault();

    setActiveAttraction(attraction);
    if (isLargeScreen && event.currentTarget instanceof HTMLElement) {
      setAnchorEl(event.currentTarget);
    } else {
      setAnchorEl(null);
    }
  };

  const handleClosePopover = () => {
    setActiveAttraction(null);
    setAnchorEl(null);
  };

  const handleCloseDrawer = () => {
    setActiveAttraction(null);
  };

  /* ----------------------------- Loading ----------------------------- */
  if (loading)
    return (
      <Box sx={{ display: "flex", justifyContent: "center", p: 10 }}>
        <CircularProgress sx={{ color: eftelingRed }} />
      </Box>
    );

  /* ----------------------------- Render ----------------------------- */
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
          "&::-webkit-scrollbar": { display: "none" },
          scrollbarWidth: "none",
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
              fontSize: { xs: "0.6rem", md: "0.85rem" },
              height: { xs: 24, md: 32 },
            }}
          />
        ))}
      </Stack>

      {/* Map */}
      <Box
        sx={{
          position: "relative",
          overflow: "hidden",
          borderRadius: 4,
          boxShadow: 5,
          bgcolor: "#f4f1ea",
          cursor: "grab",
          "&:active": { cursor: "grabbing" },
        }}
      >
        <TransformWrapper
          initialScale={1}
          minScale={1}
          maxScale={6}
          centerOnInit
          limitToBounds
          panning={{ velocityDisabled: true }}
          wheel={{ step: 0.1 }}
          // Close popover when starting to interact with map to prevent "contains" errors
          onZoomStart={handleClosePopover}
          onPanningStart={handleClosePopover}
        >
          <MapControls />

          <TransformComponent
            wrapperStyle={{ width: "100%", maxHeight: "80vh", overflow: "hidden" }}
            contentStyle={{ width: "100%", display: "flex", alignItems: "center" }}
          >
            <Box sx={{ position: "relative", width: "100%" }}>
              <img
                src={mapImg}
                alt="Efteling Map"
                loading="eager"
                decoding="async"
                style={{
                  width: "100%",
                  height: "auto",
                  display: "block",
                  userSelect: "none",
                  pointerEvents: "none",
                }}
              />

              {Object.entries(attractionCoordinates).map(([id, coord]) => (
                <MapMarker
                  key={id}
                  coord={coord}
                  attraction={filteredDataMap.get(id)}
                  isActive={activeAttraction?.id === id}
                  onClick={handleMarkerClick}
                />
              ))}
            </Box>
          </TransformComponent>
        </TransformWrapper>

        {/* Drawer for small screens */}
        {!isLargeScreen && (
          <SwipeableDrawer
    anchor="bottom"
    open={Boolean(activeAttraction)}
    onClose={handleCloseDrawer}
    onOpen={() => {}}
    disableDiscovery
    disableBackdropTransition
    ModalProps={{ hideBackdrop: true, keepMounted: true }}
    sx={{ pointerEvents: "none" }}
    PaperProps={{
      sx: {
        borderTopLeftRadius: 20,
        borderTopRightRadius: 20,
        border: `2px solid ${eftelingRed}`,
        maxHeight: "40vh",
        pointerEvents: "auto",
      },
    }}
  >
    {activeAttraction && (
      <Box sx={{ p: 2, pointerEvents: "auto", display: "flex", gap: 2 }}>
        <Box
          sx={{
            width: { xs: 100, sm: 120, md: 150 },
            height: { xs: 100, sm: 120, md: 150 },
            flexShrink: 0,
          }}
        >
          <img
            src={activeAttraction.image_url || "/placeholder.jpg"}
            alt={activeAttraction.title}
            style={{
              width: "100%",
              height: "100%",
              objectFit: "cover",
              borderRadius: 12,
            }}
          />
        </Box>

        <Box sx={{ flexGrow: 1, position: "relative" }}>
          {/* Centered Drag Handle / Visual Indicator */}
          <Box
            sx={{
              width: 40,
              bgcolor: "#ccc",
              borderRadius: 2,
              mx: "auto",
              mb: 1
            }}
          />

          <Stack direction="row" justifyContent="space-between" alignItems="center">
            <Typography variant="h6" sx={{ fontWeight: "bold", color: eftelingRed }}>
              {activeAttraction.title}
            </Typography>
            {/* Close button removed from here */}
          </Stack>

          {activeAttraction.currentWaitTime !== undefined && (
            <Typography sx={{ fontWeight: 500 }}>
              Wachttijd: {activeAttraction.currentWaitTime} minuten
            </Typography>
          )}

          <Stack direction="row" spacing={1} sx={{ mt: 1 }}>
            <Chip label={activeAttraction.category} size="small" />
          </Stack>
          

          <Box
            sx={{
              position: "absolute",
              right: 0,
              bottom: 0, // Changed from top 50% for a cleaner look without the X icon
            }}
          >
            <IconButton
              onClick={() => onSelectAttraction(activeAttraction)}
              sx={{
                bgcolor: eftelingRed,
                color: "white",
                "&:hover": { bgcolor: "#8e1424" },
              }}
            >
              <ArrowForwardIosIcon />
            </IconButton>
          </Box>
        </Box>
      </Box>
    )}
  </SwipeableDrawer>
        )}

        {/* Popover for large screens */}
        {isLargeScreen && activeAttraction && anchorEl instanceof HTMLElement && (
          <Popover
            open={Boolean(anchorEl)}
            anchorEl={anchorEl}
            onClose={handleClosePopover}
            anchorOrigin={{ vertical: "top", horizontal: "center" }}
            transformOrigin={{ vertical: "bottom", horizontal: "center" }}
            disableScrollLock
            // Robustness fixes for "contains" error
            disableRestoreFocus
            disableAutoFocus
            PaperProps={{
              sx: {
                borderRadius: 4,
                boxShadow: "0px 4px 12px rgba(0,0,0,0.2)",
                border: `2px solid ${eftelingRed}`,
                minWidth: "200px",
                overflow: "hidden",
              },
            }}
          >
            <Box
              sx={{
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
                gap: 1,
                p: 1,
                bgcolor: "#fff",
              }}
            >
              <Box sx={{ flex: 1, minWidth: 0 }}>
                <Typography
                  variant="body2"
                  noWrap
                  sx={{
                    fontWeight: "bold",
                    color: eftelingRed,
                    fontSize: "0.9rem",
                  }}
                >
                  {activeAttraction.title}
                </Typography>
                {activeAttraction.currentWaitTime !== undefined && (
                  <Typography
                    variant="caption"
                    sx={{ color: "#666", fontWeight: "600", display: "block" }}
                  >
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
                  color: "white",
                  "&:hover": { bgcolor: "#8e1424" },
                  width: 24,
                  height: 24,
                }}
              >
                <ArrowForwardIosIcon sx={{ fontSize: 12 }} />
              </IconButton>
            </Box>
          </Popover>
        )}
      </Box>
    </Box>
  );
}