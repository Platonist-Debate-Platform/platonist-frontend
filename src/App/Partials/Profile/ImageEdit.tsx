import { AxiosRequestConfig } from 'axios';
import React, { FunctionComponent, useEffect, useState } from 'react';
import Dropzone, { DropEvent, FileRejection } from 'react-dropzone';
import { useDispatch, useSelector } from 'react-redux';
import { Redirect } from 'react-router-dom';
import { usePrevious } from 'react-use';
import { Button } from 'reactstrap';

import {
  GlobalState,
  Image,
  PrivateRequestKeys,
  ReactReduxRequestDispatch,
  ReactReduxRequestState,
  requestAction,
  RequestStatus,
  useConfig,
} from '../../../Library';
import { useFile } from '../../Hooks';
import { ImageCrop } from '../Image';
import { ModalWithRoute } from '../Modal';

export interface ProfileImageEditProps {
  from: string;
  image?: Image | null;
  onSuccess?: (image: Image, original: Image) => void;
  onFinished?: () => void;
  to: string;
}

const appendFileExtension = (fileName: string, type: string) => {
  
  let extension: string = '';
  //  'image/jpg', 'image/jpeg', 'image/png'
  switch (type.toLocaleLowerCase()) {
    case 'image/jpg':
    case 'image/jpeg':
      extension = 'jpg';
      break;
    case 'image/png':
      extension = 'png';
      break;
    default:
      extension = type.replace('image/', '');
      break;
  }

  const regExp = new RegExp(`.${extension}$`);
  const hasExt = regExp.test(fileName);

  if (hasExt) {
    return fileName;
  }

  return `${fileName}.${extension}`;
};

export const ProfileImageEdit: FunctionComponent<ProfileImageEditProps> = ({
  to,
  image,
  onSuccess,
  onFinished,
  from
}) => {
  const dispatch = useDispatch<ReactReduxRequestDispatch>();
  const uploadState: ReactReduxRequestState<Image[], AxiosRequestConfig> = useSelector<GlobalState, GlobalState[PrivateRequestKeys.Upload]>(
    state => state.upload,
  );
  
  const fileResult = useFile((image && {
    pathname: image.url,
    fileName: image.name
  }) || undefined);

  let prevFileResult = usePrevious(fileResult);

  const [file, setFile] = useState<File | undefined>(fileResult);
  const [formData, setFormData] = useState<FormData | undefined>(undefined);
  const [shouldRedirect, setShouldRedirect] = useState(false);

  const config = useConfig();
  const url = config.api.createApiUrl(config.api.config);
  url.pathname = 'upload';

  const handleClick = () => {
    dispatch(requestAction.load(PrivateRequestKeys.Upload, {
      method: 'post',
      url: url.href,
      data: formData,
      withCredentials: true,
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    }));
  };

  const handleImageCrop = (data: File) => {
    const formData = new FormData();
    formData.append(`files`, data, appendFileExtension(data.name, data.type));
    if (file && image?.name !== file.name) {
      formData.append(`files`, file, appendFileExtension(file.name, file.type));
    }
    setFormData(formData);
  }
  
  const handleImageDrop = (files: File[], _fileRejections: FileRejection[], _event: DropEvent) => {
    if (files && files.length > 0 && files[0]) {
      setFile(files[0]);
    }
  };

  const resetStates = () => {
    if (file) {
      setFile(undefined);
    }

    if (formData) {
      setFormData(undefined);
    }

    if (fileResult) {
      dispatch(requestAction.clear(PrivateRequestKeys.File));
    }
  };

  const handleModalOpened = () => {
    if (!file) {
      setFile(fileResult);
    }
  }

  const handleModalClose = () => {
    resetStates();
    console.log('closed');
    
    if(shouldRedirect) {
      setShouldRedirect(false);
    }

    if (onFinished) {
      onFinished();
    }
  };
  
  useEffect(() => {
    if (prevFileResult === undefined && fileResult && !file) {
      setFile(fileResult);
    }

    if (uploadState.status === RequestStatus.Loaded && uploadState.result) {
      if (onSuccess) {
        onSuccess(uploadState.result[0], uploadState.result[1]);
      }

      dispatch(requestAction.clear(PrivateRequestKeys.Upload));

      if (!shouldRedirect) {
        setShouldRedirect(true);
      }
    }    
  }, [prevFileResult, file, fileResult, formData, uploadState.status, uploadState.result, onSuccess, shouldRedirect, dispatch]);

  return (
    <ModalWithRoute
      footer={
        <>
          <Button
            color="success" 
            onClick={handleClick} 
            disabled={uploadState.status === RequestStatus.Updating}
          >
            Save
          </Button>
        </>
      }
      from={from}
      header="Edit and upload your profile image"
      onClosed={handleModalClose}
      onOpened={handleModalOpened}
      size={'xl'}
      to={to}
    >
      <div className="profile-image-edit-settings text-right mb-3">
        <Button
          disabled={(file?.size === fileResult?.size && file?.name === fileResult?.name) || file ? true : false}
          onClick={() => fileResult && setFile(fileResult)}
          size="sm"
          title="Reset Image"
        >
          <i className="fa fa-undo" /> <span className="sr-only">Reset image</span>
        </Button>
        <Button
          color="danger"
          disabled={!file}
          onClick={() => file && setFile(undefined)}
          size="sm"
          title="Remove image"
        >
          <i className="fa fa-trash" /> <span className="sr-only">Remove image</span>
        </Button>
      </div>
      <div className="shadow p-3">
        {!file && (
          <Dropzone
            accept={['image/jpg', 'image/jpeg', 'image/png']}
            preventDropOnDocument={true}
            onDrop={handleImageDrop}
          >
            {({getRootProps, getInputProps}) => (
              <section className="drop-zone-container">
                <div {...getRootProps({className: 'drop-zone-area'})}>
                  <input {...getInputProps({multiple: false})} />
                  <p>Drag 'n' drop your profile image here, or click to select files</p>
                </div>
              </section>
            )}
          </Dropzone>
        )}
        {file && (
          <ImageCrop
            file={file}
            onCrop={handleImageCrop}
          />
        )}
      </div>
      {shouldRedirect && (
        <Redirect to={from} />
      )}
    </ModalWithRoute>
  );
};