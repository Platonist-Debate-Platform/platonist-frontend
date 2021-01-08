import './ProfileImage.scss';

import { stringify } from 'querystring';
import React, { FunctionComponent, useCallback, useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { Link } from 'react-router-dom';

import { GlobalState, Image as ImageProps, PublicRequestKeys, randomHash, RequestStatus } from '../../../Library';
import { useAuthentication } from '../../Hooks';
import useUser from '../../Hooks/Requests/useUser';
import { Image } from '../Image';
import { ProfileImageEdit } from './ProfileImageEdit';

const noImageItem = require('../../../Assets/Images/dummy-profile.png');
console.log(noImageItem);

const noImage: ImageProps= {
    id: 9999999,
    name: 'a44af3bb5f074e3cdb4be8a56232c996.jpg',
    alternativeText: '',
    caption: '',
    width: 400,
    height: 400,
    ext: '.png',
    hash: '',
    mime: 'image/jpeg',
    url: noImageItem.default,
    previewUrl: null,
    provider: 'local',
    provider_metadata: null,
    created_at: '2020-12-17T07:46:28.764Z',
    updated_at: '2020-12-17T07:46:28.786Z',
    size: 119,
}

export const ProfileImage: FunctionComponent = () => {
  const {
    location,
  } = useSelector<GlobalState, GlobalState[PublicRequestKeys.Router]>(
    state => state[PublicRequestKeys.Router]
  );

  const authentication = useAuthentication();
  const userState = useUser(authentication[1]?.id);

  const queryParameter = '?' + stringify({
    modal: 'image',
  });

  const [randomKey, setRandomKey] = useState(randomHash(16));
  const [image, setImage] = useState<ImageProps | undefined>(userState.user.result?.avatar || undefined);
  const [imageOriginal, setImageOriginal] = useState<ImageProps | undefined>(userState.user.result?.avatarOriginal || undefined);

  const target = `${location.pathname}${queryParameter}`;

  const handleFinished = () => {
    setRandomKey(randomHash(16));

    setImage(undefined);
    setImageOriginal(undefined);
  };

  const handleSuccess = useCallback((avatar: ImageProps, avatarOriginal: ImageProps) => {   
    userState.send({
        data: {
        ...userState.user,
        avatar,
        avatarOriginal,
      }, 
      method: 'PUT'
    });
    setImage(avatar);
    setImageOriginal(avatarOriginal)
  }, [userState]);
  
  useEffect(() => {
    if (userState.user.status === RequestStatus.Loaded) {
      setImage(userState.user.result?.avatar || undefined);
      setImageOriginal(userState.user.result?.avatarOriginal || undefined);
    }
  }, [image, imageOriginal, userState.user.result?.avatar, userState.user.result?.avatarOriginal, userState.user.status]);

  return (
    <div className="profile-image">
      <Link key={`link_${randomKey}`} to={target}>
        {(userState.user.status === RequestStatus.Loaded) && image ? (
          <Image key={`img_1_${randomKey}`} {...image}/>
        ) : (
          <Image {...noImage} isLocal={true} />
        )}
      </Link>
      {imageOriginal && (
        <ProfileImageEdit 
          from={location.pathname}
          key={randomKey}
          image={imageOriginal}
          onSuccess={handleSuccess}
          onFinished={handleFinished}
          to={target}
        />
      )}
    </div>
  );
}