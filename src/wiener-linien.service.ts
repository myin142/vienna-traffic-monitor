export enum MonitorInfo {
  SHORT = "stoerungkurz",
  LONG = "stoerunglang",
  ELEVATOR = "aufzugsinfo",
}

export interface Geometry {
  type: string;
  coordinates: number[];
}

export interface LocationProperties {
  title: string;
  attributes: {
    rbl: number;
  };
}

export enum Direction {
  H = "H",
  R = "R",
}

export interface DepartureTime {
  timePlanned: string;
  timeReal: string;
  countdown: number;
}

export interface Vehicle {
  name: string;
  towards: string;
  direction: Direction;
  barrierFree: boolean;
  trafficjam: boolean;
  realtimeSupported: boolean;
  type: string;
}

export interface Departure {
  departureTime: DepartureTime;
  vehicle: Vehicle;
}

export interface MonitorLine {
  name: string;
  towards: string;
  direction: Direction;
  trafficjam: boolean;
  barrierFree: boolean;
  departures: { departure: Departure[] };
  type: string;
}

export interface MonitorResponse {
  locationStop: {
    geometry: Geometry;
    properties: LocationProperties;
  };
  lines: MonitorLine[];
}

export class WienerLinienService {
  constructor(private baseUrl: string) {}

  public async monitor(
    ids: number[],
    info: MonitorInfo[]
  ): Promise<MonitorResponse[]> {
    const res = await fetch(
      `${this.baseUrl}monitor?${ids.map((x) => `rbl=${x}`).join("&")}&${info
        .map((x) => `activateTrafficInfo=${x}`)
        .join("&")}`
    );

    const data = await res.json();
    return data.data.monitors;
  }
}
