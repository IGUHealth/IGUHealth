import React from "react";
import styled from "styled-components";
import "./button.css";

interface Props {
  value: string;
}

const Main = styled.div`
  color: red;
`;

export const String = ({ value = "", ...props }: Props) => {
  return (
    <Main>
      <input type="text" value={value} />
    </Main>
  );
};
