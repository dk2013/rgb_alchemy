import { FC, useEffect, useState } from "react";
import axios from "axios";
import InfoBox from "./InfoBox/InfoBox";
import Field from "./Field/Field";
import {
  gameStatus,
  IData,
  IGameData,
  INITIAL_STEPS_NUMBER,
} from "../../models/gameData";
import { cellType, ICell } from "../../models/field";
import { IFetchedData, initURL } from "../../models/fetchedData";

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
        nextColor: [255, 0, 0], // To paint Source
      },
    }));
  };

  const setInitialField = (initialData: IFetchedData) => {
    const initialField: ICell[][] = [];
    const h = initialData.height;
    const w = initialData.width;
    let type: cellType;

    if (h === 0 || w === 0) {
      // not initialized
      return [];
    }

    for (let y = 0; y < h + 2; y++) {
      // + 2 - to add source circles
      initialField[y] = [];

      for (let x = 0; x < w + 2; x++) {
        // + 2 - to add source circles
        if (x === 0 || y === 0 || x > w || y > h) {
          // Find empty corner Sources
          if (
            (x === 0 && y === 0) ||
            (x === 0 && y === h + 1) ||
            (x === w + 1 && y === 0) ||
            (x === w + 1 && y === h + 1)
          ) {
            type = cellType.Empty;
          } else {
            type = cellType.Source;
          }
        } else {
          type = cellType.Tile;
        }

        let cell: ICell = {
          id: x + "," + y,
          color: [0, 0, 0],
          type: type,
        };

        initialField[y][x] = cell;
      }
    }

    setField(initialField);
  };

  const handleSourceClick = (cellId: string) => {
    nextTurn(cellId);
  };

  // Main game routine
  const nextTurn = (cellId: string) => {
    if (data.game?.status == gameStatus.Initial) {
      initialGameProc(cellId);
    }
  };

  const initialGameProc = (cellId: string) => {
    if (typeof data.game?.stepCount !== "undefined") {
      const stepCount = data.game.stepCount;

      // Paint clicked Source
      paintSource(cellId);

      // Set a color to paint a next Source by clicking to it
      switch (stepCount) {
        case 1:
          setData(
            (prevState): IData => ({
              ...prevState,
              game: {
                ...(prevState.game as IGameData),
                nextColor: [0, 255, 0],
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
                nextColor: [0, 0, 255],
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
      setData((prevState) => ({
        ...prevState,
        game: {
          ...(prevState.game as IGameData),
          stepCount: stepCount + 1,
        },
      }));
    }
  };

  const getXFromCellId = (cellId: string) => {
    const coords = cellId.split(",");
    return Number(coords[0]);
  };

  const getYFromCellId = (cellId: string) => {
    const coords = cellId.split(",");
    return Number(coords[1]);
  };

  const paintSource = (cellId: string) => {
    const x = getXFromCellId(cellId);
    const y = getYFromCellId(cellId);
    const updatedField = [...field];

    updatedField[y][x] = {
      ...updatedField[y][x],
      color: data.game?.nextColor || [0, 0, 0],
    };
  };

  return (
    <>
      <InfoBox data={data} />
      <Field data={data} field={field} onSourceClick={handleSourceClick} />
    </>
  );
};

export default Game;
