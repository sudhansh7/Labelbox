// tslint:disable
import * as React from 'react';
import Icon from 'material-ui/Icon';
import styled from 'styled-components';

const HistoryContainer = styled.div`
  font-weight: 100;
  font-size: 22px;
  display: flex;
`;

interface ArrowPros {
  direction: 'left' | 'right';
  disabled?: boolean;
  className?: string;
  onClick?: Function;
  width?: string;
}
const ArrowUnstyled = ({direction, className, onClick}: ArrowPros) => (
  <Icon className={className} onClick={() => onClick && onClick()}>
    {direction === 'left' ? 'keyboard_arrow_left' : 'keyboard_arrow_right'}
  </Icon>
)

const Arrow = styled(ArrowUnstyled)`
  cursor: pointer;
  opacity: ${(props: ArrowPros) => {
    return props.disabled ? 0.1 : 1;
  }};
  pointer-events: ${(props: ArrowPros) => {
    return props.disabled ? 'none' : 'inherit';
  }};
  width: ${(props: ArrowPros) => {
    return props.width ? props.width : 'inherit';
  }}
`;

export function History({
  title,
  hasBack,
  goBack,
  hasNext,
  goNext,
  isCurrent,
  goCurrent
}:{
  title: string,
  hasBack: boolean,
  hasNext: boolean,
  isCurrent: boolean,
  goBack: Function,
  goNext: Function,
  goCurrent: Function
}){
  return (
    <HistoryContainer>
      <div style={{paddingRight: '20px'}}>
        <Arrow direction="left" disabled={!hasBack} onClick={goBack} />
      </div>
      <div>{title}</div>
      <div style={{paddingLeft: '20px'}}>
        <Arrow direction="right" disabled={!hasNext} onClick={goNext} />
      </div>
      <div onClick={() => !isCurrent && goCurrent()}>
        <Arrow direction="right" disabled={isCurrent} width="10px" />
        <Arrow direction="right" disabled={isCurrent} width="10px" />
      </div>
    </HistoryContainer>
  )
}
