import { useState } from "react";
import { StopData } from "./models";
import { MonitorResponse } from "./wiener-linien.service";
import {
  MdDirectionsBus,
  MdTram,
  MdDirectionsSubway,
  MdQuestionMark,
} from "react-icons/md";

export interface StopDetailsProps {
  stop: StopData;
  monitor: Record<number, MonitorResponse>;
}

export default function StopDetails({ stop, monitor }: StopDetailsProps) {
  const [expanded, setExpanded] = useState(false);

  const vehicleIcon = (type: string) => {
    switch (type) {
      case "ptBusCity":
        return <MdDirectionsBus size={32} />;
      case "ptTram":
        return <MdTram size={32} />;
      case "ptMetro":
        return <MdDirectionsSubway size={32} />;
      default:
        return <MdQuestionMark size={32} />;
    }
  };

  return (
    <div className="bg-white flex flex-col gap-4 p-4">
      <div key={stop.name} className="flex font-bold justify-between">
        <span>{stop.name}</span>
        <button onClick={() => setExpanded(!expanded)}>
          {expanded ? "Collapse" : "Expand"}
        </button>
      </div>

      {stop.rbls
        .filter((rbl) => monitor[rbl])
        .map((rbl) =>
          monitor[rbl].lines.map((line) => (
            <div key={rbl} className="flex flex-col gap-2">
              <div className="flex gap-2">
                {vehicleIcon(line.type)}
                <span>
                  {line.name} - {line.towards}
                </span>
              </div>
              <div className="flex gap-2">
                {line.departures.departure
                  .slice(0, expanded ? line.departures.departure.length : 3)
                  .map((departure) => (
                    <div
                      className="flex gap-2"
                      key={departure.departureTime.timePlanned}
                    >
                      <div
                        className="bg-gray-100 p-2"
                        title={departure.departureTime.timeReal}
                      >
                        {departure.departureTime.countdown}
                      </div>
                    </div>
                  ))}
              </div>
            </div>
          ))
        )}
    </div>
  );
}
