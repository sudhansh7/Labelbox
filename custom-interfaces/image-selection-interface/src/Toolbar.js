import React from "react";
import ChevronLeftIcon from "@material-ui/icons/ChevronLeft";
import ChevronRightIcon from "@material-ui/icons/ChevronRight";
import styled from "styled-components";

const ToolbarContainer = styled.div`
  display: flex;
  flex-grow: 1;
  align-items: center;
  border-bottom: 1px solid lightgrey;
  padding: 10px;
`;

const Left = styled(ChevronLeftIcon)`
  cursor: pointer;
  ${props => (props.disabled ? `opacity: 0.2` : "")}
`;

const Right = styled(ChevronRightIcon)`
  cursor: pointer;
  ${props => (props.disabled ? `opacity: 0.2` : "")}
`;

export function Toolbar({ hasLeft, onLeftClick, onRightClick }) {
  return (
    <ToolbarContainer>
      <Left disabled={!hasLeft} onClick={hasLeft ? onLeftClick : () => {}} />
      <div style={{ marginLeft: "10px", marginRight: "10px" }}>
        Choose Images
      </div>
      <Right onClick={onRightClick} />
    </ToolbarContainer>
  );
}
