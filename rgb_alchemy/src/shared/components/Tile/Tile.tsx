import React, { FC } from "react";
import styled from "styled-components";
import { ICell } from "../../../models/field";

interface ITileProps {
  cell: ICell;
}

const Tile: FC<ITileProps> = (props) => {
  const handleDragStart = (e: DragEvent) => {
    e.dataTransfer?.setData("id", props.cell.id);
  };

  let additionalProps = {};
  if (props.cell.isDnDEnabled) {
    additionalProps = {
      onDragStart: handleDragStart,
    };
  }

  return (
    <STile
      {...additionalProps}
      draggable={props.cell.isDnDEnabled}
      $color={props.cell.color}
      $borderColor={props.cell.borderColor}
    />
  );
};

export default Tile;

interface ISTile {
  $color?: number[];
  $borderColor?: number[];
}

const STile = styled.div`
  display: inline-block;
  width: 22px;
  height: 22px;
  border-radius: 2px;
  margin: 1px;
  ${(props: ISTile): string => {
    return `
      background-color: rgb(${props.$color?.[0] || 0}, ${
      props.$color?.[1] || 0
    }, ${props.$color?.[2] || 0});
    `;
  }};
  border-style: solid;
  border-width: 2px;
  ${(props: ISTile): string => {
    return `
      border-color: rgb(${props.$borderColor?.[0] || 0}, ${
      props.$borderColor?.[1] || 0
    }, ${props.$borderColor?.[2] || 0});
    `;
  }};
`;
