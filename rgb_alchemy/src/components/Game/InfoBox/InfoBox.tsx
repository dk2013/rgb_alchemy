import { FC } from "react";
import styled from "styled-components";
import { IData } from "../../../models/gameData";
import Tile from "../../../shared/components/Tile/Tile";

interface IInfoBoxProps {
  data: IData;
}

const InfoBox: FC<IInfoBoxProps> = (props) => {
  return (
    <div>
      <h3>RGB Alchemy</h3>
      <SRow>User ID: {props.data.initial?.userId}</SRow>
      <SRow>
        Moves left:{" "}
        {(props.data.initial?.maxMoves as number) -
          (props.data.game?.stepCount as number)}
      </SRow>
      <SFlexRow>
        Target color &nbsp; <Tile color={props.data.initial?.target} />
      </SFlexRow>
      <SFlexRow>
        Closest color &nbsp; <Tile color={props.data.game?.closestColor} />
      </SFlexRow>
    </div>
  );
};

export default InfoBox;

const SRow = styled.div`
  line-height: 34px;
`;

const SFlexRow = styled.div`
  display: flex;
  align-items: center;
  line-height: 44px;
`;
