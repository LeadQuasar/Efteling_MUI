// src/components/AttractionTabs.tsx
import { useState, useEffect } from "react";
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

// Define the endpoints for the different categories
const endpoints = {
  rides: "https://tp.arendz.nl/parks/efteling/rides",
  shops: "https://tp.arendz.nl/parks/efteling/shops",
  shows: "https://tp.arendz.nl/parks/efteling/shows",
  restaurants: "https://tp.arendz.nl/parks/efteling/restaurants"
};

// Define the Props type for the component
interface AttractionTabsProps {
  onSelectAttraction: (attraction: any) => void;
}

export default function AttractionTabs({ onSelectAttraction }: AttractionTabsProps) {
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
        console.error("Error fetching data:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [tab]);

  // Group attractions by area
  const groupByArea = (items: any[]) => {
    return items.reduce((acc: Record<string, any[]>, item) => {
      const area = item.area || "Overige"; // fallback if no area
      if (!acc[area]) acc[area] = [];
      acc[area].push(item);
      return acc;
    }, {});
  };

  const groupedData = groupByArea(data);
  const sortedAreas = Object.keys(groupedData).sort();

  return (
    <Box sx={{ width: "100%" }}>
      <Tabs
        value={tab}
        onChange={(_, newValue) => setTab(newValue)}
        variant="scrollable"
        scrollButtons="auto"
        centered={false}
        sx={{
          mb: 2,
          display: 'flex',
          placeSelf: "center",
          borderBottom: 2,
          borderColor: "rgb(170,24,44)",
          "& .MuiTab-root": {
            color: "rgb(170,24,44)",
            fontWeight: 700,
            fontSize: "1rem",
            "&.Mui-selected": {
              color: "rgb(170,24,44)",
              fontWeight: 700,
            },
          },
          "& .MuiTabs-indicator": {
            backgroundColor: "rgb(170,24,44)",
          },
        }}
      >
        {categories.map((category, idx) => (
          <Tab key={idx} label={category} />
        ))}
      </Tabs>

      <Box sx={{ p: 2 }}>
        {loading ? (
          <Box sx={{ display: "flex", justifyContent: "center", mt: 4, height: '50vh', alignItems: 'center' }}>
            <CircularProgress sx={{ color: "rgb(170,24,44)" }} />
          </Box>
        ) : data.length > 0 ? (
          sortedAreas.map((area) => (
            <Box key={area} sx={{ mb: 6 }}>
              <Typography variant="h5" sx={{ mb: 3 }}>
                <Divider
                  sx={{
                    color: "rgb(170,24,44)",
                    fontWeight: 'bold',
                    "&::before, &::after": {
                      borderTop: "2px solid rgb(170,24,44)",
                    },
                  }}
                >
                  {area.toUpperCase()}
                </Divider>
              </Typography>
              
              <Grid
                container
                spacing={4}
                columns={{ xs: 12, sm: 12, md: 12 }}
                sx={{placeContent: "center"}}
              >
                {groupedData[area].map((item, idx) => (
                  <Grid key={idx} size={{ xs: 12, sm: 6, md: 4, lg: 3 }}>
                    {/* We pass the item to the onSelect function when clicked */}
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
            Geen gegevens gevonden voor {categories[tab]}.
          </Typography>
        )}
      </Box>
    </Box>
  );
}