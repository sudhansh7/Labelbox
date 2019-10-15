import React, { useEffect } from 'react'
import styled from "styled-components";

const BLUE = '#1976d2';
const NO_BLUE_BORDER = `0px solid ${BLUE}`;
const BLUE_BORDER = `5px solid ${BLUE}`;

const Wrapper = styled.div`
  position: relative;
  max-width: 300px;
  max-height: 300px;
  border-radius: 4px;
  cursor: ${props => props.pointer ? 'pointer' : 'default'};

  div.border {
    box-sizing: border-box;
    border: ${props => props.selected ? BLUE_BORDER : NO_BLUE_BORDER};
    width: 100%;
    height: 100%;
    position: absolute;
    top: 0;
    left: 0;
    border-radius: 4px;
    transition: .1s;
  }

  img {
    max-height: 300px;
    max-width: 300px;
  }
  
  :hover {
    div.border {
      border: ${props => props.pointer ? BLUE_BORDER : props.selected ? BLUE_BORDER : NO_BLUE_BORDER};
    }
  }
`;

export default ({ src, alt, selected, pointer, onClick }) => {

  // PRELOAD STATE
  useEffect(() => {
    new Promise((resolve) => {
      const img = document.createElement('img');
      img.src = src;
      img.onload = () => {
        img.remove();
        resolve();
      };
      img.style.display = 'none';
      img.style.width = '0px';
      img.style.height = '0px';
      document.body.appendChild(img);
    });
  }, [src])
  
  return (
    <Wrapper
      className='image-wrapper'
      pointer={pointer}
      selected={selected}
      onClick={onClick}
    >
      <img src={src} alt={alt} />
      <div className='border' />
    </Wrapper>
  )
}
