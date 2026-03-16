import { useEffect, useState } from "react";
import axios from "axios";
import map from "../assets/efteling_map.jpg";

interface ParkMapProps {
  onSelectAttraction: (ride: any) => void;
}

const rideEndpoint = "https://tp.arendz.nl/parks/efteling/rides";

export default function ParkMap({ onSelectAttraction }: ParkMapProps) {
  const [rides, setRides] = useState<any[]>([]);

  useEffect(() => {
    axios.get(rideEndpoint).then((res) => {
      setRides(res.data);
    });
  }, []);

  const handleClick = (e: React.MouseEvent, id: string) => {
    e.preventDefault();

    const ride = rides.find((r) => r.id === id);
    if (ride) onSelectAttraction(ride);
  };

  return (
    <div style={{ width: "100%", textAlign: "center" }}>
      <img
        src={map}
        useMap="#efteling-map"
        style={{ width: "100%", maxWidth: 1400 }}
        alt="Efteling Map"
      />

      <map name="efteling-map">

        <area shape="circle" coords="3386,3134,40" href="#" alt="dansemacabre"
          onClick={(e) => handleClick(e, "dansemacabre")} />

        <area shape="circle" coords="3797,2575,40" href="#" alt="baron1898"
          onClick={(e) => handleClick(e, "baron1898")} />

        <area shape="circle" coords="1621,2024,40" href="#" alt="carnavalfestival"
          onClick={(e) => handleClick(e, "carnavalfestival")} />

        <area shape="circle" coords="3388,3699,40" href="#" alt="fabula"
          onClick={(e) => handleClick(e, "fabula")} />

        <area shape="circle" coords="2065,2080,40" href="#" alt="archipel"
          onClick={(e) => handleClick(e, "archipel")} />

        <area shape="circle" coords="1941,2080,40" href="#" alt="sirocco"
          onClick={(e) => handleClick(e, "sirocco")} />

        <area shape="circle" coords="3712,3337,40" href="#" alt="maxmoritz"
          onClick={(e) => handleClick(e, "maxmoritz")} />

      </map>
    </div>
  );
}