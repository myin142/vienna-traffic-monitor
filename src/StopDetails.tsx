import { useState } from "react";
import { MonitorLine } from "./wiener-linien.service";
// import {
//   MdDirectionsBus,
//   MdTram,
//   MdDirectionsSubway,
//   MdQuestionMark,
// } from "react-icons/md";

export interface StopDetailsProps {
  name: string;
  lines: MonitorLine[];
}

export default function StopDetails({ name, lines }: StopDetailsProps) {
  const [expanded, setExpanded] = useState(false);

  const vehicleIcon = (type: string) => {
    switch (type) {
      case "ptBusCity":
      // return <MdDirectionsBus size={32} />;
      case "ptTram":
      // return <MdTram size={32} />;
      case "ptMetro":
      // return <MdDirectionsSubway size={32} />;
      default:
      // return <MdQuestionMark size={32} />;
    }

    return <div />;
  };

  return (
    <div className="bg-white flex flex-col gap-4 p-4">
      <div className="flex font-bold justify-between">
        <span>{name}</span>
        <button onClick={() => setExpanded(!expanded)}>
          {expanded ? "Collapse" : "Expand"}
        </button>
      </div>

      {
        lines.map((line) => (
          <div key={line.name + line.towards + line.barrierFree} className="flex gap-2">
            <div className="flex gap-2">
              {vehicleIcon(line.type)}
              <span className="flex items-center">
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
      }
    </div>
  );
}
