import { FC, useEffect, useState } from "react";
import axios from "axios";
import InfoBox from "./InfoBox/InfoBox";
import Field from "./Field/Field";
import { ICell } from "../../models/field";
import { IFetchedData, initURL } from "../../models/fetchedData";
import {
  gameStatus,
  IData,
  IGameData,
  INITIAL_STEPS_NUMBER,
} from "../../models/gameData";
import {
  generateInitialField,
  getFieldCopy,
  getPaintedTilesLine,
  getXFromCellId,
  getYFromCellId,
} from "../../helpers/game";

const Game: FC = () => {
  const [data, setData] = useState<IData>({});
  const [field, setField] = useState<ICell[][]>([]);

  useEffect(() => {
    initGame();
  }, []);

  const initGame = () => {
    axios.get<IFetchedData>(initURL).then(({ data }) => {
      setInitialGame(data);
      setInitialField(data);
    });
  };

  const setInitialGame = (initialData: IFetchedData) => {
    setData((prevState) => ({
      ...prevState,
      initial: initialData,
      game: {
        closestColor: [0, 0, 0],
        status: gameStatus.Initial,
        stepCount: 0,
        nextColor: [255, 0, 0], //  red color to paint 1st Source
      },
    }));
  };

  const setInitialField = (data: IFetchedData) => {
    setField(generateInitialField(data));
  };

  const handleSourceClick = (cellId: string) => {
    nextStep(cellId);
  };

  // Main game routine
  const nextStep = (cellId: string) => {
    if (data.game?.status == gameStatus.Initial) {
      initialGameProc(cellId);
    }
  };

  const initialGameProc = (cellId: string) => {
    if (typeof data.game?.stepCount !== "undefined") {
      const stepCount = data.game.stepCount;

      // Paint clicked Source
      paintSourceAndTilesLine(cellId);

      // Set a color for next step to paint a next Source by clicking to it
      switch (stepCount) {
        case 0:
          setData(
            (prevState): IData => ({
              ...prevState,
              game: {
                ...(prevState.game as IGameData),
                nextColor: [0, 255, 0], // green to 2nd Source
              },
            })
          );
          break;
        case 2:
        default:
          setData(
            (prevState): IData => ({
              ...prevState,
              game: {
                ...(prevState.game as IGameData),
                nextColor: [0, 0, 255], // blue to 3rd Source
              },
            })
          );
      }

      // Check whether a game status need to be changed
      if (stepCount === INITIAL_STEPS_NUMBER - 1) {
        setData((prevState) => ({
          ...prevState,
          game: {
            ...(prevState.game as IGameData),
            status: gameStatus.InGame,
          },
        }));
      }
      increaseStepCount(stepCount);
    }
  };

  const increaseStepCount = (stepCount: number) => {
    setData((prevState) => ({
      ...prevState,
      game: {
        ...(prevState.game as IGameData),
        stepCount: stepCount + 1,
      },
    }));
  };

  const paintSourceAndTilesLine = (cellId: string) => {
    const x = getXFromCellId(cellId);
    const y = getYFromCellId(cellId);
    const updatedField = getFieldCopy(field);

    updatedField[y][x] = {
      ...updatedField[y][x],
      color: data.game?.nextColor as number[],
    };

    setField(getPaintedTilesLine(data, cellId, updatedField));
  };

  return (
    <>
      <InfoBox data={data} />
      <Field data={data} field={field} onSourceClick={handleSourceClick} />
    </>
  );
};

export default Game;
