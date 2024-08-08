import { groupBy } from "lodash";

export interface Stop {
  name: string;
  rbl: number;
}

export class StopsService {
  constructor(private fileUrl: string) {}

  async getStops(): Promise<Record<string, Stop[]>> {
    const response = await fetch(this.fileUrl);
    const data = await response.text();
    const parsedData: Stop[] = data
      .split("\n")
      .map((line) => {
        const [rbl, name] = line.split(";");
        if (name && rbl != null) {
          return { name: name.replaceAll('"', ""), rbl: parseInt(rbl) };
        }

        return null;
      })
      .filter((stop) => stop != null) as Stop[];

    return groupBy(parsedData, (x) => x.name);
  }
}
