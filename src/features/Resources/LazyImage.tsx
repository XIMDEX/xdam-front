import React from "react";
import styled, { keyframes } from "styled-components";
import PropTypes from "prop-types";
import LazyLoad from "react-lazyload";
import { MULTIMEDIA } from "../../constants";

const ImageWrapper = styled.div`
  position: relative;
  width: 100%;
  height: 140px;
`;

const loadingAnimation = keyframes`
  0% {
    background-color: #fff;
  }
  50% {
    background-color: #ccc;
  }
  100% {
    background-color: #fff;
  }
`;

const Placeholder = styled.div`
  position: absolute;
  left: 0;
  top: 0;
  right: 0;
  bottom: 0;
  animation: ${loadingAnimation} 1s infinite;
`;

const StyledImageGrid = styled.img`
  position: absolute;
  left: 0;
  width: 100%;
  height: 100%;
  max-height: 120px;
  object-fit: contain;
`;

const StyledImageList = styled.img`
  position: absolute;
  left: 0;
  width: 100%;
  height: 100%;
  object-fit: cover;
`;

const LazyImage = ({ src, alt, grid = false, type = MULTIMEDIA }) => {
  const refPlaceholder = React.useRef();

  const removePlaceholder = () => {
    (refPlaceholder.current as any).remove();
  };

  const removePlaceholderError = (evt) => {
    (refPlaceholder.current as any).remove();
    evt.target.onError = null
    evt.target.src = type === MULTIMEDIA
        ? "https://media.istockphoto.com/vectors/thumbnail-image-vector-graphic-vector-id1147544807?k=20&m=1147544807&s=612x612&w=0&h=pBhz1dkwsCMq37Udtp9sfxbjaMl27JUapoyYpQm0anc="
        : "http://geonode.ciifen.org/static/documents/doc-placeholder.png"
  }

  return (
    <ImageWrapper>
      <Placeholder ref={refPlaceholder} />
      <LazyLoad>
        {grid ? (
          <StyledImageGrid
            onLoad={removePlaceholder}
            onError={removePlaceholderError}
            src={src}
            alt={alt}
          />
        ) : (
          <StyledImageList
            onLoad={removePlaceholder}
            onError={removePlaceholderError}
            src={src}
            alt={alt}
          />
        )}

      </LazyLoad>
    </ImageWrapper>
  );
};

LazyImage.propTypes = {
  src: PropTypes.string.isRequired,
  alt: PropTypes.string.isRequired,
  type: PropTypes.string
};

export default LazyImage;
