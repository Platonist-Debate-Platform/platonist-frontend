import 'react-image-crop/lib/ReactCrop.scss';

import React from 'react';
import ReactCrop, {Crop, PercentCrop} from 'react-image-crop';
import { randomHash } from '../../../Library';

export interface ImageCropProps {
  file: File;
  onCrop?: (file: File) => void;
}

export interface ImageCropState {
  crop: Crop;
  croppedImageUrl?: string;
  fileName: string
  src?: string | null;
}

export class ImageCrop extends React.Component<ImageCropProps, ImageCropState> {
  fileUrl: string | undefined;
  imageRef: HTMLImageElement | undefined;
  reader = new FileReader();

  constructor(props: ImageCropProps) {
    super(props);

    this.state = {
      crop: {
        unit: '%',
        width: 50,
        aspect: 1 / 1,
      },
      fileName: randomHash(32),
    };
  }

  public componentDidMount () {
    const _self = this;
    this.reader.addEventListener('load', function (event: ProgressEvent) {
      _self.handleFileReaderLoading(this, event);
    });
    this.reader.readAsDataURL(this.props.file);
  }
  
  public componentDidUpdate(prevProps: ImageCropProps) {
    const prevFile = prevProps.file;
    const file = this.props.file;
    if (prevFile.name !== file.name || file.size !== prevFile.size) {
      this.reader.readAsDataURL(this.props.file);
      this.makeClientCrop(this.state.crop);
    }
  }

  private getCroppedImage = async (image: HTMLImageElement, crop: any, fileName: string): Promise<{url: string, blob: Blob} | undefined> => {   
    if (!image || !crop) {
      return;
    }
        
    const canvas = document.createElement('canvas') as HTMLCanvasElement;
    const scaleX = image.naturalWidth / image.width;
    const scaleY = image.naturalHeight / image.height;
    canvas.width = crop.width || 300;
    canvas.height = crop.height || 300;
    const ctx = canvas.getContext('2d');
    
    if (!ctx) {
      return;
    }

    ctx.drawImage(
      image,
      (crop.x || 0) * scaleX,
      (crop.y || 0) * scaleY,
      crop.width * scaleX,
      crop.height * scaleY,
      0,
      0,
      crop.width,
      crop.height
    );

    return new Promise((resolve, reject) => {
      canvas.toBlob(blob => {
        if (!blob) {
          console.error('Canvas is Empty');
          return;
        }
        (blob as Blob & {name: string}).name = fileName;

        window.URL.revokeObjectURL(this.fileUrl || '');
        this.fileUrl = URL.createObjectURL(blob);
        
        resolve({
          url: this.fileUrl,
          blob,
        });
      }, 'image/jpeg')
    })
  }

  private handleFileReaderLoading = (reader: FileReader, event: ProgressEvent) => {
    this.setState({
      src: reader.result?.toString(),
      fileName: randomHash(32),
    });
  }

  private makeClientCrop = async (crop: Crop) => {
    const {
      onCrop
    } = this.props;
    const {
      fileName
    } = this.state;

    if (this.imageRef && crop.width && crop.height) {
      const croppedImage = await this.getCroppedImage(
        this.imageRef,
        crop,
        fileName
      );

      if (croppedImage && croppedImage.blob && onCrop) {
        const reader = new FileReader();
        reader.readAsArrayBuffer(croppedImage?.blob)
        reader.addEventListener('loadend', (e: ProgressEvent) => {
          const arrayBuffer = (e.target as any).result as ArrayBuffer;
          const blob = new Blob([arrayBuffer], {type: 'image/jpeg'})
          const file = new File([blob], fileName, {type: 'image/jpeg'});
          onCrop(file);
        });
      }
      this.setState({croppedImageUrl: croppedImage?.url})
    }
  }

  onCropChange = (crop: Crop) => {
    this.setState({ crop });
  };

  private onCropComplete = (crop: Crop, percentCrop: PercentCrop) => {
    this.makeClientCrop(crop);
  }

  private onImageLoaded = (image: HTMLImageElement) => {
    this.imageRef = image;
  }

  public render() {
    const { crop, src } = this.state;
    return (
      <div>
      {src && (
        <ReactCrop
          circularCrop={false}
          crop={crop}
          minHeight={300}
          minWidth={300}
          onChange={this.onCropChange}
          onComplete={this.onCropComplete}
          onImageLoaded={this.onImageLoaded}
          ruleOfThirds={true}
          src={src}
        />
      )}
      </div>
    );
  }
}
