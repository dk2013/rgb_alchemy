import { IFetchedData } from "./fetchedData";

export const INITIAL_STEPS_NUMBER = 3;

export const enum gameStatus {
  Initial,
  InGame,
  Finished,
}

export interface IGameData {
  closestColor: number[];
  status: gameStatus;
  stepCount: number;
  nextColor: number[]; // To paint Source
}

export interface IData {
  initial?: IFetchedData;
  game?: IGameData;
}
