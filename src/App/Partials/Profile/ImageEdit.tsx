import React, {
  FunctionComponent,
  useCallback,
  useEffect,
  useState,
} from 'react';
import Dropzone, { DropEvent, FileRejection } from 'react-dropzone';
import { Redirect } from 'react-router-dom';
import { usePrevious } from 'react-use';
import { Button } from 'reactstrap';

import { Image, RequestStatus, User } from 'platonist-library';
import useUser from '../../Hooks/Requests/useUser';
import { ImageCrop } from '../Image';
import { ModalWithRoute } from '../Modal';

export interface ProfileImageEditProps {
  from: string;
  image?: Image | null;
  imageCropped?: Image | null;
  onFinished?: () => void;
  to: string;
}

const appendFileExtension = (fileName: string, type: string) => {
  let extension: string = '';

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
  imageCropped,
  onFinished,
  from,
}) => {
  const {
    send,
    user: { result, status },
  } = useUser<User | FormData>();

  const [file, setFile] = useState<File | undefined>(undefined);
  const [formData, setFormData] = useState<FormData | undefined>(undefined);
  const [shouldRedirect, setShouldRedirect] = useState(false);
  const [showDropZone, setShowDropZone] = useState(!image);

  const prevUpdatedAt = usePrevious(imageCropped?.updated_at);

  const handleClick = useCallback(() => {
    send({
      method: 'PUT',
      data: formData,
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
  }, [formData, send]);

  const handleImageCrop = (data: File) => {
    const formData = new FormData();
    formData.append(
      `files.avatar`,
      data,
      appendFileExtension(data.name, data.type),
    );
    if (file && image?.name !== file.name) {
      formData.append(
        `files.avatarOriginal`,
        file,
        appendFileExtension(file.name, file.type),
      );
    }
    formData.append('data', JSON.stringify({}));
    setFormData(formData);
  };

  const handleImageDrop = (
    files: File[],
    _fileRejections: FileRejection[],
    _event: DropEvent,
  ) => {
    if (files && files.length > 0 && files[0]) {
      setFile(files[0]);
      setShowDropZone(false);
    }
  };

  const resetStates = () => {
    if (file) {
      setFile(undefined);
    }

    if (formData) {
      setFormData(undefined);
    }
  };

  const handleModalClose = () => {
    resetStates();

    if (shouldRedirect) {
      setShouldRedirect(false);
    }

    if (onFinished) {
      onFinished();
    }
  };

  useEffect(() => {
    if (
      status === RequestStatus.Loaded &&
      result?.avatar?.updated_at !== prevUpdatedAt
    ) {
      if (!shouldRedirect) {
        setShouldRedirect(true);
      }
    }

    if (
      status === RequestStatus.Loaded &&
      result?.avatar?.updated_at === prevUpdatedAt
    ) {
      if (shouldRedirect) {
        setShouldRedirect(false);
      }
    }
  }, [
    prevUpdatedAt,
    result?.avatar,
    result?.avatar?.updated_at,
    shouldRedirect,
    status,
  ]);

  return (
    <ModalWithRoute
      footer={
        <>
          <Button
            color="success"
            onClick={handleClick}
            disabled={status === RequestStatus.Updating}
          >
            Save
          </Button>
        </>
      }
      from={from}
      header="Edit and upload your profile image"
      onClosed={handleModalClose}
      size={'xl'}
      to={to}
    >
      <div className="profile-image-edit-settings text-right mb-3">
        <Button
          disabled={showDropZone ? false : true}
          onClick={() => setFile(undefined)}
          size="sm"
          title="Reset Image"
        >
          <i className="fa fa-undo" />{' '}
          <span className="sr-only">Reset image</span>
        </Button>
        <Button
          color="success"
          disabled={showDropZone}
          onClick={() => setShowDropZone(true)}
          size="sm"
          title="Remove image"
        >
          <i className="fa fa-upload" />{' '}
          <span className="sr-only">Remove image</span>
        </Button>
      </div>
      <div className="shadow p-3">
        <Dropzone
          accept={['image/jpg', 'image/jpeg', 'image/png']}
          preventDropOnDocument={true}
          onDrop={handleImageDrop}
        >
          {({ getRootProps, getInputProps }) => (
            <section className="drop-zone-container">
              <div {...getRootProps({ className: 'drop-zone-area' })}>
                <input {...getInputProps({ multiple: false })} />
                <p>
                  Drag 'n' drop your profile image here, or click to select
                  files
                </p>
              </div>
            </section>
          )}
        </Dropzone>
        <ImageCrop
          file={file}
          image={image}
          onCrop={handleImageCrop}
          reset={!file}
        />
      </div>
      {shouldRedirect && <Redirect to={from} />}
    </ModalWithRoute>
  );
};
