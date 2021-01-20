import './Image.scss';

import { stringify } from 'querystring';
import React, { FunctionComponent, useCallback } from 'react';
import { useSelector } from 'react-redux';
import { Link } from 'react-router-dom';

import { GlobalState, Image as ImageProps, PublicRequestKeys, RequestStatus } from '../../../Library';
import useUser from '../../Hooks/Requests/useUser';
import { Image } from '../Image';
import { ProfileImageEdit } from './ImageEdit';

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

  const {
    user: {
      result: user,
      status,
    },
    send,
  } = useUser();

  const queryParameter = '?' + stringify({
    modal: 'image',
  });

  const target = `${location.pathname}${queryParameter}`;

  const handleSuccess = useCallback((avatar: ImageProps, avatarOriginal: ImageProps) => {   
    send({
        data: {
        ...user,
        avatar,
        avatarOriginal,
      }, 
      method: 'PUT'
    });
  }, [send, user]);
  
  return (
    <div className="profile-image">
      <Link to={target}>
        {(status === RequestStatus.Loaded) && user?.avatar ? (
          <Image {...user?.avatar}/>
        ) : (
          <Image {...noImage} isLocal={true} />
        )}
      </Link>
      <ProfileImageEdit 
        from={location.pathname}
        image={user?.avatarOriginal}
        onSuccess={handleSuccess}
        to={target}
      />
    </div>
  );
}