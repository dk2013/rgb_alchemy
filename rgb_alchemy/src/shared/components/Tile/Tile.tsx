import React, { FC } from "react";
import styled from "styled-components";

interface ITileProps {
  color?: number[];
}

const Tile: FC<ITileProps> = (props) => {
  return <STile $color={props.color} />;
};

export default Tile;

interface ISTile {
  $color?: Number[];
}

const STile = styled.div`
  display: inline-block;
  width: 22px;
  height: 22px;
  border-radius: 2px;
  // background-color:
  ${(props: ISTile): string => {
    return `
      background-color: rgb(${props.$color?.[0] || 0}, ${
      props.$color?.[1] || 0
    }, ${props.$color?.[2] || 0});
    `;
  }};
  border: 2px solid #ccc;
  margin: 1px;
`;
