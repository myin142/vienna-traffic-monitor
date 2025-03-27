export interface Stop {
  name: string;
  rbl: number;
  latLng: [number, number];
}

export class StopsService {
  constructor(private readonly fileUrl: string) {}

  async getStops(): Promise<Stop[]> {
    const response = await fetch(this.fileUrl);
    const data = await response.text();
    const parsedData: Stop[] = data
      .split("\n")
      .map((line) => {
        const [rbl, name, lat, lng] = line.split(";");
        if (name && rbl != null) {
          return {
            name: name.replaceAll('"', ""),
            rbl: parseInt(rbl),
            latLng: [parseFloat(lat), parseFloat(lng)],
          };
        }

        return null;
      })
      .filter((stop) => stop != null) as Stop[];

    return parsedData;
  }

  getStopsNearby(stops: Stop[], pos: [number, number], distanceInKm: number) {
    const nearby = stops.filter(
      (stop) =>
        Math.abs(this.getDistanceFromLatLonInKm(
          pos[0],
          pos[1],
          stop.latLng[0],
          stop.latLng[1]
        )) <= distanceInKm
    );

    return nearby;
  }

  private getDistanceFromLatLonInKm(
    lat1: number,
    lon1: number,
    lat2: number,
    lon2: number
  ) {
    const R = 6371; // Radius of the earth in km
    const dLat = this.deg2rad(lat2 - lat1); // deg2rad below
    const dLon = this.deg2rad(lon2 - lon1);
    const a =
      Math.sin(dLat / 2) * Math.sin(dLat / 2) +
      Math.cos(this.deg2rad(lat1)) *
        Math.cos(this.deg2rad(lat2)) *
        Math.sin(dLon / 2) *
        Math.sin(dLon / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    return R * c; // Distance in km
  }

  private deg2rad(deg: number) {
    return deg * (Math.PI / 180);
  }
}
