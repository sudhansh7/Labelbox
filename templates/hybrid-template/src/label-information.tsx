import * as React from 'react';
import styled from 'styled-components';
import * as moment from 'moment';

const Information = styled.div`
  display: flex;
  flex-direction: column;
  font-size: 13px;
  color: #4b4b4b;
`

export function LabelInformation(
  {
    typeName,
    createdBy,
    createdAt,
  }:
  {
    typeName: 'Any' | 'Skip',
    createdBy: string,
    createdAt: string,
  }
){
  return (
    <Information>
      {typeName === 'Skip' && (<div style={{color: '#e87d7c'}}>Skipped</div>)}
      <div>{createdBy}</div>
      <div>{moment.duration(moment().diff(moment(createdAt))).humanize()} ago</div>
    </Information>
  )
}
