import { useLocation } from 'react-router-dom';
import icons from '../constants/icons';
import SidebarOption from './SidebarOption';

const ACTIVE_OPTION = 'border-[1px] border-slate-200 bg-white shadow-sm';

const Sidebar = () => {
  const location = useLocation();

  const logout = () => {
    localStorage.removeItem('userId');
    window.location.reload();
  };
  return (
    <div className='w-1/5 h-screen py-4 flex flex-col justify-between border-r-[1px] bg-[#FBFBFB] shadow-md'>
      <div>
        <div className='px-4 flex items-center space-x-4 pb-4 border-b-[1px] border-slate-200'>
          <img src={icons.logo} className='w-10' />
          <p className='font-bold text-2xl'>Syncro</p>
        </div>
        <div className='py-4 space-y-4'>
          <div className='py-2 px-4 space-y-2'>
            <p className='text-xs font-medium uppercase text-gray-500 mb-2'>
              main menu
            </p>
            <SidebarOption
              title='Upravljačka tabla'
              icon={
                location.pathname === '/'
                  ? icons.dashboardActive
                  : icons.dashboard
              }
              customStyle={location.pathname === '/' ? ACTIVE_OPTION : ''}
              customTitleStyle={location.pathname === '/' ? 'text-black' : ''}
              redirectLink=''
            />
            <SidebarOption
              title='Moj Kalendar'
              icon={
                location.pathname === '/kalendar'
                  ? icons.calendarActive
                  : icons.calendar
              }
              customStyle={
                location.pathname === '/kalendar' ? ACTIVE_OPTION : ''
              }
              customTitleStyle={
                location.pathname === '/kalendar' ? 'text-black' : ''
              }
              redirectLink='kalendar'
            />
          </div>
          <div className='h-[1px] bg-slate-200'></div>
          <div className='py-2 px-4 space-y-2'>
            <p className='text-xs font-medium uppercase text-gray-500 mb-2'>
              ostalo
            </p>
            <SidebarOption
              title='Postavke'
              icon={
                location.pathname === '/postavke'
                  ? icons.settingsActive
                  : icons.settings
              }
              customStyle={
                location.pathname === '/postavke' ? ACTIVE_OPTION : ''
              }
              customTitleStyle={
                location.pathname === '/postavke' ? 'text-black' : ''
              }
              redirectLink='postavke'
            />
            <SidebarOption
              handleClick={logout}
              title='Odjava'
              icon={icons.logout}
              customTitleStyle='text-red-600'
            />
          </div>
        </div>
      </div>
      <div className='px-4'>Strater plan</div>
    </div>
  );
};

export default Sidebar;
