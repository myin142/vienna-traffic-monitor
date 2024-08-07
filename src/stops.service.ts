export interface Stop {
  name: string;
  rbl: number;
}

export class StopsService {
  constructor(private fileUrl: string) {}

  async getStops(): Promise<Stop[]> {
    const response = await fetch(this.fileUrl);
    const data = await response.text();
    return data
      .split("\n")
      .map((line) => {
        const [rbl, name] = line.split(";");
        if (name && rbl != null) {
          return { name: name.replaceAll('"', ""), rbl: parseInt(rbl) };
        }

        return null;
      })
      .filter((stop) => stop != null) as Stop[];
  }
}
