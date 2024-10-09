import React from 'react';
import { Link } from 'react-router-dom';

interface SidebarOption {
  title: string;
  icon: string;
  customStyle?: string;
  customTitleStyle?: string;
  redirectLink?: string;
  handleClick?: () => void;
}

const SidebarOption = ({
  title,
  icon,
  customStyle,
  customTitleStyle,
  redirectLink,
  handleClick,
}: SidebarOption) => {
  return (
    <Link
      to={`/${redirectLink === undefined ? '' : redirectLink}`}
      onClick={handleClick}
      className={`flex items-center p-2 rounded-lg space-x-2 cursor-pointer ${customStyle}`}
    >
      <img src={icon} className='w-5' />
      <p className={`text-sm font-semibold text-gray-500 ${customTitleStyle}`}>
        {title}
      </p>
    </Link>
  );
};

export default SidebarOption;
