import { useState, useEffect, useMemo } from "react";
import { Stop, StopsService } from "./stops.service";
import { StopsGroup } from "./models";
import { MapSelect } from "./components/MapSelect";
import { RealtimeData } from "./components/RealtimeData";
import {
  MonitorInfo,
  MonitorResponse,
  WienerLinienService,
} from "./wiener-linien.service";

const VIENNA_LAT_LONG: [number, number] = [48.2081743, 16.3738189];
const STOPS_FILE = "/traffic-monitor/stops.csv";
const STORAGE_KEY = "myin-vienna-traffic-monitor";
const WIENER_LINIEN_API_URL = "http://localhost:5000/"; // need a backend because CORS
const wienerLinienService = new WienerLinienService(WIENER_LINIEN_API_URL);

const stopsService = new StopsService(STOPS_FILE);

function App() {
  const [groups, setGroups] = useState(
    JSON.parse(localStorage.getItem(STORAGE_KEY) ?? "{}") as Record<
      string,
      StopsGroup
    >
  );

  const keys = Object.keys(groups).filter((x) => x !== "");

  const [selectedGroup, setSelectedGroup] = useState(
    keys.length > 0 ? keys[0] : ""
  );
  const [stops, setStops] = useState([] as Stop[]);
  const [currentPosition, setCurrentPosition] = useState(
    groups[selectedGroup]?.position ?? VIENNA_LAT_LONG
  );
  const [selectLocation, setSelectLocation] = useState(false);
  const [distanceInKm, setDistanceInKm] = useState(0.3); // TODO: adjustable radius per group
  const [monitoring, setMonitoring] = useState(
    {} as Record<number, MonitorResponse>
  );

  const nearbyStops = useMemo(() => {
    if (selectedGroup === "") return [];
    return stopsService.getStopsNearby(
      stops,
      groups[selectedGroup].position,
      distanceInKm
    );
  }, [stops, selectedGroup, currentPosition, groups, distanceInKm]);

  useEffect(() => {
    stopsService.getStops().then((stops) => {
      setStops(stops);
    });
  }, []);

  useEffect(() => {
    setCurrentPosition(groups[selectedGroup].position);
  }, [selectedGroup]);

  useEffect(() => {
    setGroups({ ...groups, [selectedGroup]: { position: currentPosition } });
    saveData();
  }, [currentPosition]);

  useEffect(() => {
    loadMonitoring();
  }, [nearbyStops]);

  // TODO: periodic update
  const loadMonitoring = async () => {
    const ids = nearbyStops.map((s) => s.rbl);
    if (ids.length === 0 || ids.length > 40) {
      console.log("Empty or too many nearby stops", ids.length);
      return;
    }

    const data = await wienerLinienService.monitor(ids, [
      MonitorInfo.SHORT,
      MonitorInfo.LONG,
      MonitorInfo.ELEVATOR,
    ]);

    const map = {} as Record<number, MonitorResponse>;
    data.forEach((d) => {
      map[d.locationStop.properties.attributes.rbl] = d;
    });
    setMonitoring(map);
  };

  const saveData = () => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(groups));
  };

  const addGroupOnEnterKey = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      const newGroup = e.currentTarget.value;
      setGroups({ ...groups, [newGroup]: { position: VIENNA_LAT_LONG } });
      setCurrentPosition(VIENNA_LAT_LONG);

      e.currentTarget.value = "";

      if (selectedGroup === "") {
        setSelectedGroup(newGroup);
      }
    }
  };

  return (
    <div className="flex flex-col p-4 gap-4 h-full">
      <div className="flex justify-between">
        <div className="flex gap-2">
          {keys.map((group) => (
            <button
              className={`${
                group === selectedGroup ? "text-black" : "text-gray-400"
              } bg-white px-4 py-2`}
              key={group}
              onClick={() => setSelectedGroup(group)}
            >
              {group}
            </button>
          ))}
        </div>
        {selectedGroup && (
          <button onClick={() => setSelectLocation(!selectLocation)}>
            Select
          </button>
        )}
        <input
          type="text"
          placeholder="new group"
          className="w-40 px-2 py-1"
          onKeyUp={addGroupOnEnterKey}
        />
      </div>

      {(selectLocation && (
        <MapSelect
          position={currentPosition}
          nearbyStops={nearbyStops}
          monitoring={monitoring}
          setPosition={setCurrentPosition}
        />
      )) || <RealtimeData stops={nearbyStops} monitoring={monitoring} />}
    </div>
  );
}

export default App;
