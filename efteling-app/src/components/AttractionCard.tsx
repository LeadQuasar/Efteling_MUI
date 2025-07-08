import { Card, CardContent, CardMedia, Typography, Box, Avatar, Chip } from "@mui/material";

type ShowTime = {
  localFromDate: string;
  localFromTime: string;
  duration: number; // duration in minutes
  isPassed: boolean;
};

type OpeningTime = {
  date: string;
  open: string;
  close: string;
  openTime: string; // e.g. "12:00:00"
  closeTime: string; // e.g. "22:00:00"
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
};

export default function AttractionCard({ attraction }: { attraction: Attraction }) {
  const firstShow = attraction.showTimes?.showTimes[0];
  const firstOpening = attraction.openingTimes?.[0]; // 👈 get first opening time

  const formatDuration = (minutes: number) => {
    const hrs = Math.floor(minutes / 60);
    const mins = minutes % 60;
    return `${hrs > 0 ? `${hrs}h ` : ""}${mins}min`;
  };

  const formatTimeRange = (open: string, close: string) => {
    return `${open.slice(0, 5)} - ${close.slice(0, 5)}`; // "12:00 - 22:00"
  };

  return (
    <Card sx={{ borderRadius: 3, boxShadow: 3 }}>
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
          sx={{ display: "flex", justifyContent: "space-between" }}
        >
          {attraction.title}
          {attraction.category === "ATTRACTION" && attraction.currentWaitTime > 0 && (
            <Avatar
              sx={{ mt: "-2rem", bgcolor: "rgb(170,24,44)" }}
            >
              {attraction.currentWaitTime ?? 0}
            </Avatar>
          )}
          {attraction.state !== "OPEN" && (
            <Chip
              label="Gesloten"
              sx={{
                mt: "-2rem",
                bgcolor: "rgb(170,24,44)",
                color: "#fff",
                fontSize: "16px",
              }}
            />
          )}
          {attraction.category === "SHOW" && firstShow && (
            <Chip
              label={`Duur ${formatDuration(firstShow.duration)}`}
              sx={{
                mt: "-2rem",
                bgcolor: "rgb(170,24,44)",
                color: "#fff",
                fontSize: "16px",
              }}
            />
          )}
          {attraction.category === "RESTAURANT" && firstOpening && (
            <Chip
              label={`Open ${formatTimeRange(firstOpening.openTime, firstOpening.closeTime)}`}
              sx={{
                mt: "-2rem",
                bgcolor: "rgb(170,24,44)",
                color: "#fff",
                fontSize: "16px",
              }}
            />
          )}
        </Typography>

        <Typography variant="subtitle2" color="text.secondary">
          {attraction.subTitle}
        </Typography>
        <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
          {stripHtml(attraction.description).slice(0, 100)}...
        </Typography>

        {/* Showtimes (for SHOW category) */}
        {attraction.category === "SHOW" && attraction.state === "OPEN" && (
          <Box sx={{ mt: 2, display: "flex", flexDirection: "column", gap: 1 }}>
            <Box sx={{ display: "flex", flexWrap: "wrap", gap: 1 }}>
              {attraction.showTimes?.showTimes.map((show, index) => (
                <Chip
                  key={index}
                  label={show.localFromTime}
                  size="small"
                  variant={show.isPassed ? "outlined" : "filled"}
                  sx={{
                    bgcolor: show.isPassed ? "#fff" : "rgb(170,24,44)",
                    color: show.isPassed ? "#333" : "#fff",
                    borderColor: show.isPassed ? "#999" : "rgb(170,24,44)",
                    fontWeight: 500,
                  }}
                />
              ))}
            </Box>
          </Box>
        )}
      </CardContent>
    </Card>
  );
}

// Utility function to strip HTML tags
function stripHtml(html: string): string {
  const tmp = document.createElement("div");
  tmp.innerHTML = html;
  return tmp.textContent || tmp.innerText || "";
}
