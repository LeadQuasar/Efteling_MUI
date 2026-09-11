import { Box } from "@mui/material";
import { keyframes } from "@emotion/react";
import eftelinglogo from "../assets/efteling.png";

// Glowing pulse
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

// Floating animation
const float = keyframes`
  0%, 100% { transform: translateY(0); }
  50% { transform: translateY(-12px); }
`;

// Twinkle
const twinkle = keyframes`
  0%, 100% { opacity: 1; transform: scale(1); }
  50% { opacity: 0.3; transform: scale(0.6); }
`;

// Orbit
const orbitRotate = keyframes`
  from { transform: rotate(0deg); }
  to { transform: rotate(360deg); }
`;

const sparkles = [
  { top: "-20px", left: "10px", size: 6, duration: 2 },
  { top: "40px", left: "130px", size: 5, duration: 3 },
  { top: "110px", left: "20px", size: 4, duration: 2.5 },
  { top: "100px", left: "110px", size: 5, duration: 3.5 },
];

const GlowingLogoLoader = () => {
  return (
    <Box
      sx={{
        position: "relative",
        width: 240,
        height: 240,
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
      }}
    >
      {/* Aura */}
      <Box
        sx={{
          position: "absolute",
          width: 200,
          height: 200,
          borderRadius: "50%",
          background:
            "radial-gradient(circle, rgba(255,180,100,0.2), transparent 70%)",
          filter: "blur(25px)",
          zIndex: 1,
        }}
      />

      {/* Floating container */}
      <Box
        sx={{
          position: "relative",
          animation: `${float} 3s ease-in-out infinite`,
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        {/* Orbit */}
        <Box
          sx={{
            position: "absolute",
            width: 220,
            height: 220,
            borderRadius: "50%",
            animation: `${orbitRotate} 4s linear infinite`,
            display: "flex",
            justifyContent: "center",
            alignItems: "flex-start",
            pointerEvents: "none",
            zIndex: 3,
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

        {/* Logo */}
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

        {/* Sparkles */}
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
              zIndex: 4,
            }}
          />
        ))}
      </Box>
    </Box>
  );
};

export default GlowingLogoLoader;