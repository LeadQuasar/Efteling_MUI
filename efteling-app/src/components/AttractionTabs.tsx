// src/components/AttractionTabs.tsx
import { useState, useEffect } from "react";
import Grid from '@mui/material/Grid';
import {
  Tabs,
  Tab,
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

export default function AttractionTabs() {
  const [tab, setTab] = useState(0);
  const [data, setData] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);

  const categories = ["Rides", "Shops", "Shows", "Restaurants"];

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const res = await axios.get(Object.values(endpoints)[tab]);
        setData(res.data);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [tab]);

  // Group attractions by area
  const groupByArea = (items: any[]) => {
    return items.reduce((acc: Record<string, any[]>, item) => {
      const area = item.area || "Unknown Area"; // fallback if no area
      if (!acc[area]) acc[area] = [];
      acc[area].push(item);
      return acc;
    }, {});
  };

  const groupedData = groupByArea(data);
  const sortedAreas = Object.keys(groupedData).sort(); // alphabetically sort areas

  return (
    <Box sx={{ width: "100%" }}>
      <Tabs
        value={tab}
        onChange={(_, newValue) => setTab(newValue)}
        variant="scrollable"
        scrollButtons="auto"
        sx={{
          mb: 2, justifySelf: "center", borderBottom: 2, borderColor: "rgb(170,24,44)", "& .MuiTab-root": {
            color: "rgb(170,24,44)", // 👈 default tab text color
            fontWeight: 700,
            fontSize: "1rem",
            "&.Mui-selected": {
              color: "rgb(170,24,44)", // 👈 selected tab text color
              fontWeight: 700,
            },
          },
          "& .MuiTabs-indicator": {
            backgroundColor: "rgb(170,24,44)", // 👈 custom indicator color
          },
        }}
      >
        {categories.map((category, idx) => (
          <Tab key={idx} label={category} />
        ))}
      </Tabs>
      <Box sx={{ p: 2 }}>
        {loading ? (
          <Box sx={{ display: "flex", justifyContent: "center", mt: 4 }}>
            <CircularProgress />
          </Box>
        ) : data.length > 0 ? (
          sortedAreas.map((area) => (
            <Box key={area} sx={{ mb: 4 }}>
              <Typography variant="h5" sx={{ mb: 2 }}>
                <Divider
                  sx={{
                    color: "rgb(170,24,44)",// text color of area
                    "&::before, &::after": {
                      borderTop: "2px solid rgb(170,24,44)", // change line color + thickness
                    },
                  }}
                >
                  {area}
                </Divider>
              </Typography>
              <Grid
                container
                spacing={{ xs: 4, md: 4 }}
                columns={{ xs: 3, sm: 8, md: 12 }}
                sx={{ justifyContent: "space-evenly" }}
              >
                {groupedData[area].map((item, idx) => (
                  <Grid key={idx} size={3}>
                    <AttractionCard attraction={item} />
                  </Grid>
                ))}
              </Grid>
            </Box>
          ))
        ) : (
          <Typography variant="body1" sx={{ mt: 2 }}>
            No data found for {categories[tab]}.
          </Typography>
        )}
      </Box>
    </Box>
  );
}
