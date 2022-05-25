export const enum cellType {
  Empty,
  Tile,
  Source,
}

export interface ICell {
  id: string;
  color: number[];
  type: cellType;
}
