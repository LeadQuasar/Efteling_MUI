// src/components/AttractionCard.tsx
import { Card, CardContent, CardMedia, Typography, Box, Avatar, Chip, IconButton } from "@mui/material";
import FamilyRestroomIcon from '@mui/icons-material/FamilyRestroom';
import PersonIcon from '@mui/icons-material/Person';
import ArrowForwardIosIcon from '@mui/icons-material/ArrowForwardIos';

// ... (Keep your ShowTime and OpeningTime types the same)
type ShowTime = {
  localFromDate: string;
  localFromTime: string;
  duration: number;
  isPassed: boolean;
};

type OpeningTime = {
  date: string;
  open: string;
  close: string;
  openTime: string;
  closeTime: string;
  isPassed: boolean;
};

type Attraction = {
  title: string;
  subTitle: string;
  description: string;
  area: string;
  image_url: string;
  currentWaitTime: number;
  category: string;
  state: string;
  showTimes?: { showTimes: ShowTime[] };
  openingTimes?: OpeningTime[];
  minSizeWithEscort: number;
  minSizeWithoutEscort: number;
};

// 1. ADD onSelect TO THE PROPS INTERFACE
interface AttractionCardProps {
  attraction: Attraction;
  onSelect: (attraction: Attraction) => void;
}

// 2. DESTRUCTURE onSelect HERE
export default function AttractionCard({ attraction, onSelect }: AttractionCardProps) {
  const firstShow = attraction.showTimes?.showTimes[0];
  const firstOpening = attraction.openingTimes?.[0];

  const handleCardClick = () => {
    if (typeof onSelect === "function") {
      onSelect(attraction);
    } else {
      console.error("Critical: onSelect prop is missing or not a function!", { attraction });
    }
  };

  const formatDuration = (minutes: number) => {
    const hrs = Math.floor(minutes / 60);
    const mins = minutes % 60;
    return `${hrs > 0 ? `${hrs}h ` : ""}${mins}min`;
  };

  const formatTimeRange = (open: string, close: string) => {
    return `${open.slice(0, 5)} - ${close.slice(0, 5)}`;
  };

  return (
    <Card
  onClick={handleCardClick}
  sx={{
    width: "100%",
    maxWidth: 420,
    borderRadius: 3,
    boxShadow: 3,
    cursor: "pointer",
    transition: "0.3s",
    "&:hover": { transform: "scale(1.02)" }
  }}
>
      {attraction.image_url && (
        <CardMedia
          component="img"
          height="180"
          image={attraction.image_url}
          alt={attraction.title}
        />
      )}
      <CardContent>
        <Typography
          gutterBottom
          variant="h6"
          component="div"
          sx={{ display: "flex", justifyContent: "end" }}
        >
          {attraction.category === "ATTRACTION" && attraction.currentWaitTime > 0 && (
            <Avatar sx={{ mt: "-2.2rem", mr: "1rem", bgcolor: "rgb(170,24,44)" }}>
              {attraction.currentWaitTime ?? 0}
            </Avatar>
          )}
          {attraction.state !== "OPEN" && (
            <Chip
              label="Gesloten"
              sx={{ mt: "-2rem", mr: "1rem", bgcolor: "rgb(170,24,44)", color: "#fff", fontSize: "16px" }}
            />
          )}
          {attraction.category === "SHOW" && firstShow && (
            <Chip
              label={`Duur ${formatDuration(firstShow.duration)}`}
              sx={{ mt: "-2rem", bgcolor: "rgb(170,24,44)", color: "#fff", fontSize: "16px" }}
            />
          )}
          {attraction.category === "RESTAURANT" && firstOpening && (
            <Chip
              label={`${formatTimeRange(firstOpening.openTime, firstOpening.closeTime)}`}
              sx={{ mt: "-2rem", bgcolor: "rgb(170,24,44)", color: "#fff", fontSize: "16px" }}
            />
          )}
        </Typography>

        <Typography gutterBottom component="div" sx={{ fontWeight: 'bold' }}>
          {attraction.title}
        </Typography>

        <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
          {stripHtml(attraction.description).slice(0, 100)}...
        </Typography>

        <Typography gutterBottom variant="h6" component="div" sx={{ display: "flex" }}>
          {attraction.category === "ATTRACTION" && attraction.minSizeWithEscort > 90 && (
            <Chip
              label={`${attraction.minSizeWithEscort} cm`}
              icon={<FamilyRestroomIcon sx={{ color: "#fff !important" }} />}
              sx={{ mt: "1rem", mr: "0.5rem", bgcolor: "rgb(170,24,44)", color: "#fff", fontSize: "14px" }}
            />
          )}
          {attraction.category === "ATTRACTION" && attraction.minSizeWithoutEscort > 90 && (
            <Chip
              label={`${attraction.minSizeWithoutEscort} cm`}
              icon={<PersonIcon sx={{ color: "#fff !important" }} />}
              sx={{ mt: "1rem", bgcolor: "rgb(170,24,44)", color: "#fff", fontSize: "14px" }}
            />
          )}
          
          <IconButton sx={{ mt: "1rem", padding: "5px", bgcolor: "rgb(170,24,44)", marginLeft: "auto", "&:hover": { bgcolor: "rgb(140,20,35)" } }}>
            <ArrowForwardIosIcon sx={{ color: "#fff", }}/>
          </IconButton>
        </Typography>

        {/* Showtimes */}
        {attraction.category === "SHOW" && attraction.state === "OPEN" && (
          <Box sx={{ mt: 2, display: "flex", flexWrap: "wrap", gap: 1 }}>
            {attraction.showTimes?.showTimes.map((show, index) => (
              <Chip
                key={index}
                label={show.localFromTime}
                size="small"
                sx={{
                  bgcolor: show.isPassed ? "#eee" : "rgb(170,24,44)",
                  color: show.isPassed ? "#999" : "#fff",
                }}
              />
            ))}
          </Box>
        )}
      </CardContent>
    </Card>
  );
}

function stripHtml(html: string): string {
  const tmp = document.createElement("div");
  tmp.innerHTML = html;
  return tmp.textContent || tmp.innerText || "";
}