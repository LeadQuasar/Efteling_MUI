// src/components/AttractionTabs.tsx
import  { useState, useEffect } from "react";
import Grid from '@mui/material/Grid';
import {
  Tabs,
  Tab,
  Box,
  CircularProgress,
  Typography
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

  return (
    <Box sx={{ width: "100%" }}>
      <Tabs
        value={tab}
        onChange={(_, newValue) => setTab(newValue)}
        variant="scrollable"
        scrollButtons="auto"
      >
        {categories.map((category, idx) => (
          <Tab key={idx} label={category} />
        ))}
      </Tabs>
      <Box sx={{ width: "100vw", p: 2 }}>
        {loading ? (
          <Box sx={{ display: "flex", justifyContent: "center", mt: 4 }}>
            <CircularProgress />
          </Box>
        ) : data.length > 0 ? (
<Grid container spacing={{ xs: 2, md: 3 }} columns={{ xs: 4, sm: 8, md: 12 }}>
  {data.map((item, idx) => (
    <Grid key={idx} size={3}>
      <AttractionCard attraction={item} />
    </Grid>
  ))}
</Grid>
        ) : (
          <Typography variant="body1" sx={{ mt: 2 }}>
            No data found for {categories[tab]}.
          </Typography>
        )}
      </Box>
    </Box>
  );
}
