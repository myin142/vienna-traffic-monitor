export interface StopsGroup {
  name: string;
  stops: StopData[];
}

export interface StopData {
  name: string;
  rbls: number[];
}
