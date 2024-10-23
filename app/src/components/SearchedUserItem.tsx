import icons from '../constants/icons';
import { TUser } from '../types/types';

interface ISearchedUserItem {
  user: TUser;
  customStyles: string;
  handleClick?: (user: TUser) => void;
}
const SearchedUserItem = ({
  user,
  customStyles,
  handleClick,
}: ISearchedUserItem) => {
  return (
    <>
      <div
        onClick={() => handleClick(user)}
        key={user.id}
        className={`px-4 py-1 flex items-center space-x-2 bg-slate-200 cursor-not-allowed opacity-60 ${customStyles}`}
      >
        <div className='w-8 h-8 bg-blue-600 rounded-full overflow-hidden'>
          <img src={icons.slika} className='w-full h-full' />
        </div>
        <div>
          <p className='text-sm font-medium'>{user.name}</p>
          <p className='text-xs'>{user.email}</p>
        </div>
      </div>

      {/* <div
        onClick={() => handleClick(user)}
        key={user.id}
        className='px-4 py-1 flex items-center space-x-2 hover:bg-slate-200 cursor-pointer'
      >
        <div className='w-8 h-8 bg-blue-600 rounded-full overflow-hidden'>
          <img src={icons.slika} className='w-full h-full' />
        </div>
        <div>
          <p className='text-sm font-medium'>{user.name}</p>
          <p className='text-xs'>{user.email}</p>
        </div>
      </div> */}

      {/* <div
        key={user.id}
        className='py-1 flex items-center space-x-2 hover:bg-slate-100 cursor-pointer px-2'
      >
        <div className='w-8 h-8 bg-blue-600 rounded-full overflow-hidden'>
          <img src={icons.slika} className='w-full h-full' />
        </div>
        <div>
          <p className='text-sm font-medium'>{user.name}</p>
          <p className='text-xs'>{user.email}</p>
        </div>
      </div> */}
    </>
  );
};

export default SearchedUserItem;
