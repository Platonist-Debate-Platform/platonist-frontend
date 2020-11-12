import React from 'react';
import { Link } from 'react-router-dom';

import { useConfig } from '../../../Library';
import { Logo } from '../../../Library/Models';
import logoBw from '../../../Assets/Images/Logo/global-ct-logo-neg.svg'
import logoPos from '../../../Assets/Images/Logo/global-ct-logo-pos.svg'

export interface NavbarBrandProps extends Logo {
  title: string;
  isHomepage: boolean;
}

export const NavbarBrand: React.FC<NavbarBrandProps> = ({
  image,
  title,
  isHomepage,
}) => {
  const config = useConfig();
  const url = config.createApiUrl(config.api.config);
  url.pathname = (image.formats && image.formats.thumbnail.url) || '';

  return (
    <Link className="navbar-brand" to="/" title={title} >
      {isHomepage && (
        <img 
          className="navbar-brand-bw"
          src={logoBw}
          alt={image.alternativeText}
          height={image.height}
          width={image.width}
        />
      )}
      <img 
        className="navbar-brand-regular"
        src={(image.formats && url.href) || logoPos} 
        alt={image.alternativeText} 
        height={image.height} 
        width={image.width}
      />
    </Link>
  );
};

export default NavbarBrand;