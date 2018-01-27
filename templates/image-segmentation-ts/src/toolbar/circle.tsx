import * as React from 'react';

export function Circle({color}) {
  return (
    <div style={{borderRadius: '100%', width: '25px', height: '25px', backgroundColor: color}}></div>
  );
}
