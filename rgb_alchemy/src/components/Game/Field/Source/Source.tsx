import React, { FC } from "react";
import styled from "styled-components";
import { ICell } from "../../../../models/field";
import { gameStatus } from "../../../../models/gameData";

interface ISourceProps {
  cell: ICell;
  gameStatus?: gameStatus;
  onSourceClick: (cellId: string) => void;
}

const Source: FC<ISourceProps> = (props) => {
  const handleSourceClick = () => {
    props.onSourceClick(props.cell.id);
  };

  return (
    <SSource
      $color={props.cell.color}
      $clickable={props.gameStatus === gameStatus.Initial}
      onClick={handleSourceClick}
    />
  );
};

export default Source;

interface ISSource {
  $color?: number[];
  $clickable?: boolean;
}

const SSource = styled.div`
  display: inline-block;
  width: 22px;
  height: 22px;
  border-radius: 50%;
  border: 2px solid #ccc;
  margin: 1px;
  ${(props: ISSource): string => {
    return `
      background-color: rgb(${props.$color?.[0] || 0}, ${
      props.$color?.[1] || 0
    }, ${props.$color?.[2] || 0});
    `;
  }};
  ${(props: ISSource): string => {
    return props.$clickable ? "cursor: pointer;" : "";
  }}
`;
