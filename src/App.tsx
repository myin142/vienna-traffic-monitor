import React from "react";
import { useState } from "react";
import { Stop, StopsService } from "./stops.service";
import { WienerLinienService } from "./wiener-linien.service";
import { useEffect } from "react";

const WIENER_LINIEN_API_URL = "https://www.wienerlinien.at/ogd_realtime/";
const STOPS_FILE = "/stops.csv";

const wienerlinienService = new WienerLinienService(WIENER_LINIEN_API_URL);
const stopsService = new StopsService(STOPS_FILE);

function App() {
  const [stops, setStops] = useState([] as Stop[]);
  const [filteredStops, setFilteredStops] = useState([] as Stop[]);

  useEffect(() => {
    stopsService.getStops().then((stops) => {
      setStops(stops);
      console.log(stops);
    });
  }, []);

  const doSearchStop = (search: string) => {
    setFilteredStops(
      stops.filter((stop) =>
        stop.name.toLowerCase().includes(search.toLowerCase())
      )
    );
  }

  return (
    <div>
      <input
        type="text"
        placeholder="Enter stop name"
        onChange={(e) => doSearchStop(e.target.value)}
      />

      <ul>
        {filteredStops.map((stop) => (
          <li key={stop.rbl}>
            {stop.name} ({stop.rbl})
          </li>
        ))}
      </ul>
    </div>
  );
}

export default App;
