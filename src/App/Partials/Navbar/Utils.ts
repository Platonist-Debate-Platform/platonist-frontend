import { FooterNavItems, Page } from '../../../Library';
import { NavigationType } from './Keys';


export const enableNavItem = (type: NavigationType, inNavigation: boolean, inFooter: boolean): boolean => {
  switch (type) {
    case NavigationType.Navbar:
      return inNavigation;
    case NavigationType.Footer:
      return inFooter;
    case NavigationType.Admin: 
      return true;
    default:
      return false;
  }
}

export const getNavItems = (navItems: Page['footerNav']) => {
  if (!navItems) { return; }

  const items: FooterNavItems[] = [];
  
  navItems.forEach(navItem => {
    if (navItem && navItem.items && navItem.items.length > 0) {
      navItem.items.forEach(item => item && items.push(item));
    }
  });

  return items;
}

export const utils = {
  enableNavItem,
  getNavItems
}

export default utils;