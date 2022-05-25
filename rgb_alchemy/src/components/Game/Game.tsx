import { FC, useEffect, useState } from "react";
import axios from "axios";
import InfoBox from "./InfoBox/InfoBox";
import Field from "./Field/Field";
import { cellType, ICell } from "../../models/field";
import { IFetchedData, initURL } from "../../models/fetchedData";
import {
  gameStatus,
  IData,
  IGameData,
  INITIAL_STEPS_NUMBER,
} from "../../models/gameData";
import {
  generateInitialField,
  getCellColorById,
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
        isDnDEnabled: false,
      },
    }));
  };

  const setInitialField = (data: IFetchedData) => {
    setField(generateInitialField(data));
  };

  const handleSourceClick = (cellId: string) => {
    if (data.game?.status == gameStatus.Initial) {
      initialGameProc(cellId);
    }
  };

  const handleCellDrop = (e: DragEvent, sourceCellId: string) => {
    const tileCellId = e.dataTransfer?.getData("id") as string;

    if (data.game?.status == gameStatus.InGame) {
      draggingGameProc(tileCellId, sourceCellId);
    }
  };

  const setDnD = (isDnDEnabled: boolean) => {
    // Enable Drag & Drop
    setField((prevState) => {
      const updatedField = getFieldCopy(prevState);

      for (let y = 0; y <= (data.initial?.height as number) + 1; y++) {
        for (let x = 0; x <= (data.initial?.width as number) + 1; x++) {
          if (updatedField[y][x].type !== cellType.Empty) {
            updatedField[y][x] = {
              ...updatedField[y][x],
              isDnDEnabled: isDnDEnabled,
            };
          }
        }
      }

      return updatedField;
    });
  };

  const disableDnD = () => {};

  const initialGameProc = (cellId: string) => {
    if (typeof data.game?.stepCount !== "undefined") {
      const stepCount = data.game.stepCount;

      paintSourceAndTilesLine(cellId, data.game?.nextColor);

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

        setDnD(true);
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

  const paintSourceAndTilesLine = (cellId: string, cellColor: number[]) => {
    setField((prevState) => {
      const x = getXFromCellId(cellId);
      const y = getYFromCellId(cellId);
      const updatedField = getFieldCopy(prevState);

      updatedField[y][x] = {
        ...updatedField[y][x],
        color: cellColor,
      };

      return getPaintedTilesLine(data, cellId, updatedField);
    });
  };

  const draggingGameProc = (tileCellId: string, sourceCellId: string) => {
    if (typeof data.game?.stepCount !== "undefined") {
      const stepCount = data.game.stepCount;
      const tileColor = getCellColorById(field, tileCellId);

      paintSourceAndTilesLine(sourceCellId, tileColor);

      increaseStepCount(stepCount);
    }
  };

  return (
    <>
      <InfoBox data={data} />
      <Field
        data={data}
        field={field}
        onSourceClick={handleSourceClick}
        onCellDrop={handleCellDrop}
      />
    </>
  );
};

export default Game;
