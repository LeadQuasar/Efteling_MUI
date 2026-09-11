// src/components/AttractionTabs.tsx
import { useState, useEffect, useMemo } from "react";
import {
  Tabs,
  Tab,
  Grid,
  Box,
  Divider,
  CircularProgress,
  Typography,
  Chip
} from "@mui/material";
import AttractionCard from "./AttractionCard";
import axios from "axios";

const endpoints = {
  rides: "https://tp.arendz.nl/parks/efteling/rides",
  shops: "https://tp.arendz.nl/parks/efteling/shops",
  shows: "https://tp.arendz.nl/parks/efteling/shows",
  restaurants: "https://tp.arendz.nl/parks/efteling/restaurants"
};

interface AttractionTabsProps {
  onSelectAttraction: (attraction: any) => void;
}

export default function AttractionTabs({ onSelectAttraction }: AttractionTabsProps) {
  const [tab, setTab] = useState(0);
  const [areaTab, setAreaTab] = useState("Alle");
  const [data, setData] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);

  const categories = ["Rides", "Shops", "Shows", "Restaurants"];
  const eftelingRed = "rgb(170,24,44)";

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const res = await axios.get(Object.values(endpoints)[tab]);
        setData(res.data);
        setAreaTab("Alle");
      } catch (err) {
        console.error("Error fetching data:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [tab]);

  const areaList = useMemo(() => {
    const uniqueAreas = Array.from(
      new Set(data.map((item) => item.area).filter(Boolean))
    );
    return ["Alle", ...uniqueAreas.sort()];
  }, [data]);

  const groupedData = useMemo(() => {
    const filtered =
      areaTab === "Alle" ? data : data.filter((item) => item.area === areaTab);

    return filtered.reduce((acc: Record<string, any[]>, item) => {
      const area = item.area || "Overige";
      if (!acc[area]) acc[area] = [];
      acc[area].push(item);
      return acc;
    }, {});
  }, [data, areaTab]);

  const sortedAreas = Object.keys(groupedData).sort();

  return (
    <Box
      sx={{
        width: "100%",
        pb: 4,
        display: "flex",
        flexDirection: "column",
        alignItems: "center"
      }}
    >
      {/* Category Tabs */}
      <Tabs
        value={tab}
        onChange={(_, newValue) => setTab(newValue)}
        variant="scrollable"
        scrollButtons="auto"
        allowScrollButtonsMobile
        sx={{
          mb: 2,
          borderBottom: 2,
          borderColor: eftelingRed,
          maxWidth: 600,
          width: "100%",
          mx: "auto",
          "& .MuiTabs-flexContainer": {
            justifyContent: "center"
          },
          "& .MuiTab-root": {
            color: eftelingRed,
            fontWeight: 700,
            fontSize: { xs: "0.8rem", sm: "1rem" },
            minHeight: { xs: 36, sm: 48 },
            padding: { xs: "6px 10px", sm: "12px 16px" },
            "&.Mui-selected": { color: eftelingRed },
            "&:focus": { outline: "none" },
    "&:focus-visible": { outline: "none" }
  },
          "& .MuiTabs-indicator": {
            backgroundColor: eftelingRed
          }
        }}
      >
        {categories.map((category, idx) => (
          <Tab key={idx} label={category} />
        ))}
      </Tabs>

      {/* Area Filter Pills (WRAPPED ROWS) */}
      {!loading && data.length > 0 && (
        <Box
          sx={{
            display: "flex",
            flexWrap: "wrap",
            justifyContent: "center",
            gap: 1,
            mb: 4,
            px: 1,
            maxWidth: {
              xs: 360,
              sm: 500,
              md: 800,
              lg: 1000
            },
            mx: "auto"
          }}
        >
          {areaList.map((area) => {
            const selected = areaTab === area;

            return (
              <Chip
                key={area}
                label={area}
                clickable
                onClick={() => setAreaTab(area)}
                sx={{
                  fontWeight: 600,
                  bgcolor: selected ? "#fff" : eftelingRed,
                  color: selected ? eftelingRed : "#fff",
                  border: selected ? `2px solid ${eftelingRed}` : "none",
                  height: { xs: 28, sm: 32 },
                  fontSize: { xs: "0.7rem", sm: "0.85rem" },
                  px: 1,
                  transition: "0.2s",
                  "&:hover": {
                    bgcolor: selected ? "#fff" : "rgb(140,20,35)"
                  }
                }}
              />
            );
          })}
        </Box>
      )}

      {/* Content Area */}
      <Box
        sx={{
          px: { xs: 2, sm: 4, md: 6, lg: 8 },
          maxWidth: 1400,
          mx: "auto"
        }}
      >
        {loading ? (
          <Box
            sx={{
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              height: "40vh"
            }}
          >
            <CircularProgress sx={{ color: eftelingRed }} />
          </Box>
        ) : data.length > 0 ? (
          sortedAreas.map((area) => (
            <Box key={area} sx={{ mb: 6 }}>
              <Typography variant="h5" sx={{ mb: 3 }}>
                <Divider
                  sx={{
                    color: eftelingRed,
                    fontWeight: "bold",
                    fontSize: { xs: "1rem", sm: "1.25rem" },
                    "&::before, &::after": {
                      borderTop: `2px solid ${eftelingRed}`
                    }
                  }}
                >
                  {area.toUpperCase()}
                </Divider>
              </Typography>

              <Grid
                container
                spacing={{ xs: 2, sm: 3 }}
                justifyContent="center"
              >
                {groupedData[area].map((item, idx) => (
                  <Grid
                    key={idx}
                    size={{ xs: 12, sm: 6, md: 4, lg: 3 }}
                    sx={{ display: "flex", justifyContent: "center" }}
                  >
                    <AttractionCard
                      attraction={item}
                      onSelect={(selected) =>
                        onSelectAttraction(selected)
                      }
                    />
                  </Grid>
                ))}
              </Grid>
            </Box>
          ))
        ) : (
          <Typography
            variant="body1"
            sx={{ mt: 2, textAlign: "center" }}
          >
            Geen gegevens gevonden.
          </Typography>
        )}
      </Box>
    </Box>
  );
}