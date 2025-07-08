// src/components/AttractionCard.tsx
import { Card, CardContent, CardMedia, Typography, Chip, Box, Avatar } from "@mui/material";

type Attraction = {
  title: string;
  subTitle: string;
  description: string;
  area: string;
  image_url: string;
  fastpass: boolean;
  photoPoint: boolean;
  currentWaitTime: number;
};

export default function AttractionCard({ attraction }: { attraction: Attraction }) {
  return (
    <Card sx={{ maxWidth: 345, borderRadius: 3, boxShadow: 3 }}>
      {attraction.image_url && (
        <CardMedia
          component="img"
          height="180"
          image={attraction.image_url}
          alt={attraction.title}
        />
      )}
      <CardContent>
        <Typography gutterBottom variant="h6" component="div" sx={{display: "flex", justifyContent: "space-between"}}>
          {attraction.title}
          <Avatar sx={{mt: "-2rem" , bgcolor: "rgb(170,24,44)"}}>{attraction.currentWaitTime ?? 0}</Avatar>
        </Typography>
        
        <Typography variant="subtitle2" color="text.secondary">
          {attraction.subTitle} – {attraction.area}
        </Typography>
        <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
          {stripHtml(attraction.description).slice(0, 100)}...
        </Typography>
        <Box sx={{ mt: 1, display: "flex", gap: 1, flexWrap: "wrap" }}>
          {attraction.fastpass && <Chip label="Fastpass" color="primary" size="small" />}
          {attraction.photoPoint && <Chip label="Photo Point" color="secondary" size="small" />}
        </Box>
      </CardContent>
    </Card>
  );
}

// Utility function to strip HTML tags from API description
function stripHtml(html: string): string {
  const tmp = document.createElement("div");
  tmp.innerHTML = html;
  return tmp.textContent || tmp.innerText || "";
}
