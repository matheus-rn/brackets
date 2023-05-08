import * as React from 'react';
import { v4 } from 'uuid';

export const RectClipped = ({ x, y, width, height, children }) => {
  return (
    <Clipped path={<rect x={x} y={y} width={width} height={height}/>}>
      {children}
    </Clipped>
  );
}

const Clipped = ({ path, children }) => {
  const _id = v4();

  return (
    <g>
      <defs>
        <clipPath id={_id}>
          {path}
        </clipPath>
      </defs>

      <g clipPath={`url(#${_id})`}>
        {children}
      </g>
    </g>
  );
};

export default Clipped;
