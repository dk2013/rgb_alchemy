import React, { FC } from "react";
import styled from "styled-components";

const Empty: FC = () => {
  return <SEmpty />;
};

export default Empty;

const SEmpty = styled.div`
  display: inline-block;
  width: 28px;
  height: 28px;
  background-color: transparent;
`;
