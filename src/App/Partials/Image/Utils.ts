import { Image, ImageFormat, ImageFormats } from '../../../Library';

export const createSrcSet = (formats: ImageFormats, url: URL): string[] => {
  const formatsArray: ImageFormat[] = Object.keys(formats).map((key: string) => formats[key as keyof Image['formats']]);
  return formatsArray.sort((a, b) => a.width - b.width).map((format) => {
    return `${url.origin}${format.url} ${format.width}w`;
  });
};