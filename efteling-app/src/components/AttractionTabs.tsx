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
    const uniqueAreas = Array.from(new Set(data.map((item) => item.area).filter(Boolean)));
    return ["Alle", ...uniqueAreas.sort()];
  }, [data]);

  const groupedData = useMemo(() => {
    const filtered = areaTab === "Alle" 
      ? data 
      : data.filter(item => item.area === areaTab);

    return filtered.reduce((acc: Record<string, any[]>, item) => {
      const area = item.area || "Overige";
      if (!acc[area]) acc[area] = [];
      acc[area].push(item);
      return acc;
    }, {});
  }, [data, areaTab]);

  const sortedAreas = Object.keys(groupedData).sort();

  return (
    <Box sx={{ width: "100%", pb: 4 }}>
      {/* 1. Category Tabs */}
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
          "& .MuiTabs-flexContainer": {
            justifyContent: { xs: "flex-start", sm: "center" },
          },
          "& .MuiTab-root": {
            color: eftelingRed,
            fontWeight: 700,
            fontSize: "1rem",
            "&.Mui-selected": { color: eftelingRed },
          },
          "& .MuiTabs-indicator": { backgroundColor: eftelingRed },
        }}
      >
        {categories.map((category, idx) => (
          <Tab key={idx} label={category} />
        ))}
      </Tabs>

      {/* 2. Area Filter Pills */}
      {!loading && data.length > 0 && (
        <Tabs
          value={areaTab}
          onChange={(_, newValue) => setAreaTab(newValue)}
          variant="scrollable"
          scrollButtons="auto"
          allowScrollButtonsMobile
          sx={{
            mb: 4,
            "& .MuiTabs-flexContainer": {
              justifyContent: { xs: "flex-start", sm: "center" },
            },
            "& .MuiTab-root": {
              textTransform: "none",
              fontWeight: 600,
              color: "#fff",
              bgcolor: eftelingRed,
              margin: 0.5,
              padding: "6px 16px",
              borderRadius: "20px",
              minHeight: "36px",
              fontSize: "0.85rem",
              transition: "0.2s",
              "&.Mui-selected": { 
                color: eftelingRed, 
                bgcolor: "#fff",
                boxShadow: "0px 2px 4px rgba(0,0,0,0.1)" 
              },
            },
            "& .MuiTabs-indicator": { display: 'none' }
          }}
        >
          {areaList.map((area) => (
            <Tab key={area} label={area} value={area} />
          ))}
        </Tabs>
      )}

      {/* 3. Content Area - Matching your Detail Page padding logic */}
      <Box sx={{ px: { xs: 2, sm: 4, md: 8 } }}>
        {loading ? (
          <Box sx={{ display: "flex", justifyContent: "center", alignItems: "center", height: '40vh' }}>
            <CircularProgress sx={{ color: eftelingRed }} />
          </Box>
        ) : data.length > 0 ? (
          sortedAreas.map((area) => (
            <Box key={area} sx={{ mb: 6 }}>
              <Typography variant="h5" sx={{ mb: 3 }}>
                <Divider
                  sx={{
                    color: eftelingRed,
                    fontWeight: 'bold',
                    fontSize: { xs: "1rem", sm: "1.25rem" },
                    "&::before, &::after": { borderTop: `2px solid ${eftelingRed}` },
                  }}
                >
                  {area.toUpperCase()}
                </Divider>
              </Typography>
              
              <Grid container spacing={3}>
                {groupedData[area].map((item, idx) => (
                  <Grid 
                    key={idx} 
                    size={{ xs: 12, sm: 6, md: 4, lg: 3 }}
                  >
                    <AttractionCard 
                      attraction={item} 
                      onSelect={(selected) => onSelectAttraction(selected)}
                    />
                  </Grid>
                ))}
              </Grid>
            </Box>
          ))
        ) : (
          <Typography variant="body1" sx={{ mt: 2, textAlign: 'center' }}>
            Geen gegevens gevonden.
          </Typography>
        )}
      </Box>
    </Box>
  );
}