import { IFetchedData } from "../models/fetchedData";
import { cellType, ICell } from "../models/field";
import { IData } from "../models/gameData";

export const enum sourcePosition {
  Top,
  Right,
  Bottom,
  Left,
}

export const generateInitialField = (initialData: IFetchedData): ICell[][] => {
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

  return initialField;
};

export const getXFromCellId = (cellId: string) => {
  const coords = cellId.split(",");
  return Number(coords[0]);
};

export const getYFromCellId = (cellId: string) => {
  const coords = cellId.split(",");
  return Number(coords[1]);
};

export const getSourcePosition = (sourceCellId: string, data: IData) => {
  const sourceX = getXFromCellId(sourceCellId);
  const sourceY = getYFromCellId(sourceCellId);
  let position;

  if (sourceX === 0) {
    position = sourcePosition.Left;
  } else if (sourceX === (data.initial?.width as number) + 1) {
    position = sourcePosition.Right;
  } else if (sourceY === 0) {
    position = sourcePosition.Top;
  } else {
    position = sourcePosition.Bottom;
  }

  return position;
};

export const getCalculatedTileColor = (
  color: number[],
  distance: number,
  dimension: number
): number[] => {
  const k = (dimension + 1 - distance) / (dimension + 1);

  return color.map((colorComponent) => colorComponent * k);
};

// The tiles in the same row or column will be painted as well.
// If the distance between the tile and the source is d,
// the color of the tile depends on the "relative distance" from the colored source,
// (w+1−d)/(w+1) or (h+1−d)/(h+1).
export const getPaintedTilesLine = (
  data: IData,
  sourceCellId: string,
  updatedField: ICell[][]
) => {
  const sourceX = getXFromCellId(sourceCellId);
  const sourceY = getYFromCellId(sourceCellId);
  const position = getSourcePosition(sourceCellId, data);

  // let updatedField: ICell[][] = getFieldCopy();

  const height = data.initial?.height as number;
  const width = data.initial?.width as number;
  switch (position) {
    case sourcePosition.Top:
      for (let i = 1; i <= height; i++) {
        updatedField[i][sourceX] = {
          ...updatedField[i][sourceX],
          color: getCalculatedTileColor(
            updatedField[sourceY][sourceX].color,
            i,
            height
          ),
        };
      }
      break;
    case sourcePosition.Right:
      for (let i = width; i > 0; i--) {
        updatedField[sourceY][i] = {
          ...updatedField[sourceY][i],
          color: getCalculatedTileColor(
            updatedField[sourceY][sourceX].color,
            width - i,
            width
          ),
        };
      }
      break;
    case sourcePosition.Bottom:
      for (let i = height; i > 0; i--) {
        updatedField[i][sourceX] = {
          ...updatedField[i][sourceX],
          color: getCalculatedTileColor(
            updatedField[sourceY][sourceX].color,
            height - i,
            height
          ),
        };
      }
      break;
    case sourcePosition.Left:
    default:
      for (let i = 0; i <= width; i++) {
        updatedField[sourceY][i] = {
          ...updatedField[sourceY][i],
          color: getCalculatedTileColor(
            updatedField[sourceY][sourceX].color,
            i,
            width
          ),
        };
      }
      break;
  }

  return updatedField;
};

export // Deep copy of field
const getFieldCopy = (field: ICell[][]) => {
  let newFieldState: ICell[][] = [];

  for (let y = 0; y < field.length; y++) {
    newFieldState[y] = [];
    for (let x = 0; x < field[y].length; x++) {
      newFieldState[y][x] = { ...field[y][x] };
    }
  }

  return newFieldState;
};
