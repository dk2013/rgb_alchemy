import React, { FC } from "react";
import { cellType, ICell } from "../../../../models/field";
import Tile from "../../../../shared/components/Tile/Tile";
import Source from "../Source/Source";
import Empty from "../Empty/Empty";
import { gameStatus } from "../../../../models/gameData";

interface ICellProps {
  cell: ICell;
  gameStatus?: gameStatus;
  onSourceClick: (cellId: string) => void;
}

const Cell: FC<ICellProps> = (props) => {
  switch (props.cell.type) {
    case cellType.Tile:
      return <Tile color={props.cell.color} />;
    case cellType.Source:
      return (
        <Source
          cell={props.cell}
          gameStatus={props.gameStatus}
          onSourceClick={props.onSourceClick}
        />
      );
    default:
      return <Empty />;
  }
};

export default Cell;
