import React from "react";
import { useState } from "react";
import { Stop, StopsService } from "./stops.service";
import {
  MonitorInfo,
  MonitorResponse,
  WienerLinienService,
} from "./wiener-linien.service";
import { useEffect } from "react";
import { StopsGroup } from "./models";
import StopDetails from "./StopDetails";
import { flatMap } from "lodash";

const WIENER_LINIEN_API_URL = "http://localhost:5000/"; // need a backend because CORS
const STOPS_FILE = "/stops.csv";
const STORAGE_KEY = "myin-vienna-traffic-monitor";

const wienerLinienService = new WienerLinienService(WIENER_LINIEN_API_URL);
const stopsService = new StopsService(STOPS_FILE);

function App() {
  const [groups, setGroups] = useState(
    JSON.parse(localStorage.getItem(STORAGE_KEY) ?? "[]") as StopsGroup[]
  );
  const [updatedData, setUpdatedData] = useState(false);
  const [selectedGroup, setSelectedGroup] = useState(
    groups.length > 0 ? groups[0].name : ""
  );
  const [stops, setStops] = useState({} as Record<string, Stop[]>);
  const [searchStop, setSearchStop] = useState("");
  const [filteredStops, setFilteredStops] = useState([] as string[]);
  const [currentMonitoring, setCurrentMonitoring] = useState(
    [] as Record<number, MonitorResponse>
  );

  const currentGroup = groups.find((group) => group.name === selectedGroup);

  useEffect(() => {
    stopsService.getStops().then((stops) => {
      setStops(stops);
    });
  }, []);

  const saveData = () => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(groups));
    console.log("save");
  };

  useEffect(() => {
    if (updatedData) {
      saveData();
      setUpdatedData(false);
    }
  }, [updatedData]);

  const loadCurrentMonitoring = async () => {
    if (currentGroup && currentGroup.stops.length) {
      const ids = flatMap(currentGroup.stops, (s) => s.rbls);
      const data = await wienerLinienService.monitor(ids, [
        MonitorInfo.SHORT,
        MonitorInfo.LONG,
        MonitorInfo.ELEVATOR,
      ]);
      const map = {} as Record<number, MonitorResponse>;

      data.forEach((d) => {
        map[d.locationStop.properties.attributes.rbl] = d;
      });
      setCurrentMonitoring(map);
    }
  };

  useEffect(() => {
    loadCurrentMonitoring();
  }, [wienerLinienService, currentGroup]);

  const doSearchStop = (search: string) => {
    setSearchStop(search);
    if (search.length > 2) {
      setFilteredStops(
        Object.keys(stops).filter((stop) =>
          stop.toLowerCase().includes(search.toLowerCase())
        )
      );
    } else {
      setFilteredStops([]);
    }
  };

  const resetSearch = () => {
    setSearchStop("");
    setFilteredStops([]);
  };

  const addGroupOnEnterKey = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      const newGroup = e.currentTarget.value;
      if (newGroup && !groups.find((g) => g.name === newGroup)) {
        setGroups([...groups, { name: newGroup, stops: [] }]);
        setUpdatedData(true);
        e.currentTarget.value = "";

        if (selectedGroup === "") {
          setSelectedGroup(newGroup);
        }
      }
    }
  };

  const addStopToGroup = (stop: string) => {
    if (currentGroup) {
      const updatedGroup = {
        ...currentGroup,
        stops: [
          ...currentGroup.stops,
          stops[stop].reduce(
            (acc, s) => ({ ...acc, rbls: [...acc.rbls, s.rbl] }),
            {
              name: stop,
              rbls: [] as number[],
            }
          ),
        ],
      };
      setGroups(
        groups.map((group) =>
          group.name === selectedGroup ? updatedGroup : group
        )
      );
      setUpdatedData(true);
    }
    resetSearch();
  };

  return (
    <div className="flex flex-col p-4 gap-4 h-full">
      <div className="flex justify-between">
        <div className="flex gap-2">
          {groups.map((group) => (
            <button
              className={`${
                group.name === selectedGroup ? "text-black" : "text-gray-400"
              } bg-white px-4 py-2`}
              key={group.name}
              onClick={() => setSelectedGroup(group.name)}
            >
              {group.name}
            </button>
          ))}
        </div>
        <input
          type="text"
          placeholder="new group"
          className="w-40 px-2 py-1"
          onKeyUp={addGroupOnEnterKey}
        />
      </div>

      {currentGroup && (
        <div className="flex flex-col gap-4 grow">
          <div className="relative">
            <div>
              <input
                type="text"
                placeholder="Add stop"
                value={searchStop}
                onChange={(e) => doSearchStop(e.target.value)}
              />
              <button onClick={() => resetSearch()}>Reset</button>
            </div>

            <ul className="absolute bg-white border-slate-500">
              {filteredStops.map((stop) => (
                <li key={stop}>
                  <button
                    onClick={() => addStopToGroup(stop)}
                    className="text-left w-full p-2 hover:bg-gray-100"
                  >
                    {stop}
                  </button>
                </li>
              ))}
            </ul>
          </div>
          <div className="flex gap-4 grow">
            {currentGroup.stops.map((stop) => (
              <StopDetails
                key={stop.name}
                stop={stop}
                monitor={currentMonitoring}
              />
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

export default App;
