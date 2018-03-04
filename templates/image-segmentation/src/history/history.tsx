// tslint:disable
import * as React from 'react';
import Icon from 'material-ui/Icon';

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
    <div style={{fontWeight: '100', fontSize: '22px', marginBottom: '30px', display: 'flex'} as any}>
      <Icon
        style={{marginRight: '20px', cursor: 'pointer', ...(!hasBack ? {opacity: '0.1', pointerEvents: 'none'}: {})} as any}
        onClick={() => goBack()}
      >
        keyboard_arrow_left
      </Icon>
      <div>{title}</div>
      <Icon
        style={{marginLeft: '20px', cursor: 'pointer', ...(!hasNext ? {opacity: '0.1', pointerEvents: 'none'}: {})} as any}
        onClick={() => goNext()}
      >
        keyboard_arrow_right
      </Icon>
      <div
        style={{marginLeft: '10px', cursor: 'pointer', ...(isCurrent ? {opacity: '0.1', pointerEvents: 'none'}: {})} as any}
        onClick={() => goCurrent()}
      >
        <Icon style={{width: '10px'}}> keyboard_arrow_right </Icon>
        <Icon style={{width: '10px'}}> keyboard_arrow_right </Icon>
      </div>
    </div>
  )
}
