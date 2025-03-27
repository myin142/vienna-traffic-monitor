import StopDetails from "../StopDetails";
import { Stop } from "../stops.service";
import { MonitorResponse } from "../wiener-linien.service";

interface RealtimeDataProps {
  stops: Stop[];
  monitoring: Record<number, MonitorResponse>;
}

export function RealtimeData({
  stops,
  monitoring,
}: Readonly<RealtimeDataProps>) {
  const groupedStops = stops.reduce((acc, stop) => {
    if (!acc[stop.name]) {
      acc[stop.name] = [];
    }
    if (monitoring[stop.rbl]) {
      acc[stop.name].push(stop.rbl);
    }
    return acc;
  }, {} as Record<string, number[]>);

  return (
    <div className="flex flex-col gap-4 grow">
      {Object.keys(groupedStops)
      .filter(s => groupedStops[s].length > 0)
      .map((stop) => (
        <StopDetails
          key={stop}
          name={stop}
          lines={groupedStops[stop]
            .map((s) => monitoring[s].lines)
            .reduce((acc, val) => acc.concat(val), [])}
        />
      ))}
    </div>
  );
}
