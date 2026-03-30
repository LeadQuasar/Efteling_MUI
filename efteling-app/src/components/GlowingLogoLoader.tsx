import { Box } from "@mui/material";
import { keyframes } from "@emotion/react";
import eftelinglogo from "../assets/efteling.png";

// 1️⃣ Glowing pulse animation for the logo
const pulseGlow = keyframes`
  0%, 100% {
    box-shadow: 
      0 0 10px rgba(140,20,35,0.4), 
      0 0 20px rgba(140,20,35,0.3), 
      0 0 30px rgba(140,20,35,0.2);
  }
  50% {
    box-shadow: 
      0 0 25px rgba(140,20,35,1), 
      0 0 50px rgba(140,20,35,0.6), 
      0 0 75px rgba(140,20,35,0.3);
  }
`;

// 2️⃣ Gentle floating animation
const float = keyframes`
  0%, 100% { transform: translateY(0); }
  50% { transform: translateY(-10px); }
`;

// 3️⃣ Twinkle animation for sparkles
const twinkle = keyframes`
  0%, 100% { opacity: 1; transform: scale(1); }
  50% { opacity: 0.3; transform: scale(0.6); }
`;

// 4️⃣ Orbit Animation (The Rotation)
const orbitRotate = keyframes`
  from { transform: rotate(0deg); }
  to { transform: rotate(360deg); }
`;

// Sparkle positions (Relative to center)
const sparkles = [
  { top: "-20px", left: "10px", size: 6, duration: 2 },
  { top: "40px", left: "130px", size: 5, duration: 3 },
  { top: "110px", left: "20px", size: 4, duration: 2.5 },
  { top: "100px", left: "110px", size: 5, duration: 3.5 },
];

const GlowingLogoLoader = () => {
  return (
    <Box
      display="flex"
      justifyContent="center"
      alignItems="center"
      minHeight="60vh"
      position="relative"
      sx={{ overflow: "hidden", backgroundColor: "transparent" }} // Transparent background
    >
      {/* Soft mist/vignette background */}
      <Box
        sx={{
          position: "absolute",
          width: "100%",
          height: "100%",
          background: "radial-gradient(circle, rgba(50,20,35,0.2), transparent 70%)",
          zIndex: 0,
        }}
      />

      {/* Magical aura behind the logo */}
      <Box
        sx={{
          position: "absolute",
          width: 180,
          height: 180,
          borderRadius: "50%",
          background: "radial-gradient(circle, rgba(255,180,100,0.15), transparent 70%)",
          filter: "blur(30px)",
          zIndex: 1,
        }}
      />

      {/* Main Container for Logo and Orbiting Elements */}
      <Box 
        position="relative" 
        display="flex" 
        justifyContent="center" 
        alignItems="center"
        sx={{ animation: `${float} 3s ease-in-out infinite` }}
      >
        {/* The Orbiting Particle */}
        <Box
          sx={{
            position: "absolute",
            width: 220,
            height: 220,
            borderRadius: "50%",
            animation: `${orbitRotate} 4s linear infinite`,
            zIndex: 4,
            display: "flex",
            justifyContent: "center",
            alignItems: "flex-start",
            pointerEvents: "none",
          }}
        >
          <Box
            sx={{
              width: 10,
              height: 10,
              backgroundColor: "#fff",
              borderRadius: "50%",
              boxShadow: "0 0 15px 5px #ffd700, 0 0 5px #fff",
            }}
          />
        </Box>

        {/* The Logo */}
        <Box
          component="img"
          src={eftelinglogo}
          alt="Efteling Logo"
          sx={{
            width: 120,
            height: 120,
            borderRadius: "50%",
            animation: `${pulseGlow} 1.8s infinite ease-in-out`,
            position: "relative",
            zIndex: 2,
          }}
        />

        {/* Sparkles clustered around the logo */}
        {sparkles.map((sparkle, idx) => (
          <Box
            key={idx}
            sx={{
              position: "absolute",
              top: sparkle.top,
              left: sparkle.left,
              width: sparkle.size,
              height: sparkle.size,
              borderRadius: "50%",
              background: "radial-gradient(circle, #fff, #ffd700)",
              animation: `${twinkle} ${sparkle.duration}s ease-in-out infinite`,
              zIndex: 3,
            }}
          />
        ))}
      </Box>
    </Box>
  );
};

export default GlowingLogoLoader;