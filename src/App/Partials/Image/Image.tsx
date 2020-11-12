import './Image.scss';

import classNames from 'classnames';
import React from 'react';

import { Image as ImageProps, useConfig } from '../../../Library';
import { createSrcSet } from './Utils';

export interface ImageDefaultProps {
  className?: string;
  imgClassName?: string;
  onAbort?: (event: React.SyntheticEvent<HTMLImageElement, Event>) => void;
  onLoad?: (event: React.SyntheticEvent<HTMLImageElement, Event>) => void;
  onLoadStart?: (event: React.SyntheticEvent<HTMLImageElement, Event>) => void;
  showCaption?: boolean;
}

export const Image: React.FC<ImageProps & ImageDefaultProps> = (props) => {
  const {
    alternativeText,
    caption,
    className,
    imgClassName,
    formats,
    onAbort,
    onLoad,
    onLoadStart,
    url,
    showCaption
  } = props;

  const supportsObjectFit = ('object-fit' in document.body.style) ? true : false
  const config = useConfig();
  const apiUrl = config.api.createApiUrl(config.api.config);
  apiUrl.pathname = url;
  
  const srcSet = formats && createSrcSet(formats, apiUrl);

  const style = {
    background: `url(${apiUrl.origin}${url}) no-repeat`,
    backgroundPosition: 'top center',
  };

  return (
    <div 
      className={
        classNames(className, 'img-wrap', {
          'compat-object-fit': !supportsObjectFit
        })
      } style={!supportsObjectFit ? style : {}}
    >
      <figure>
        <img 
          alt={alternativeText}
          className={classNames(imgClassName, 'img-fluid')}
          onAbort={onAbort}
          onLoad={onLoad}
          onLoadStart={onLoadStart}
          src={apiUrl.href} 
          srcSet={srcSet && srcSet.join(',')}
        />
        {caption && showCaption && (
          <figcaption>{caption}</figcaption>
        )}
      </figure>
    </div>
  );
};