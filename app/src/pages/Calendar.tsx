import { useState, useEffect, useRef } from 'react';
import Sidebar from '../components/Sidebar';
import { dayNames } from '../constants/days';
import icons from '../constants/icons';
import {
  addNewEvent,
  getCurrentUserMeetingsByDate,
  removeEvent,
} from '../services/meeting';
import { useGlobalContext } from '../context/GlobalProvider';
import { TMeeting, TNewEvent, TUser } from '../types/types';
import FormInput from '../components/FormInput';
import { monthTranslations } from '../constants/months';
import { findUserByEmail } from '../services/user';
import CalendarMeetCard from '../components/CalendarMeetCard';
import SearchedUserItem from '../components/SearchedUserItem';
import useOnClickOutside from '../hooks/useOnClickOutside';

const Calendar = () => {
  const currentDate = new Date();
  const currentDay = currentDate.getDate();
  const addEventRef = useRef(null);
  const [currentTime, setCurrentTime] = useState(new Date());
  const [weekOffset, setWeekOffset] = useState(0);
  const [userMeetingList, setUserMeetingList] = useState<[] | TMeeting[]>([]);
  const { user } = useGlobalContext();
  const [isAddEventModalOpen, setIsAddEventModalOpen] =
    useState<boolean>(false);
  const [isUpdateModalOpen, setIsUpdateModalOpen] = useState<boolean>(false);
  const [newEvent, setNewEvent] = useState<TNewEvent>({
    title: '',
    description: '',
    startTime: '',
    endTime: '',
    participantsIds: [],
    participants: [],
  });
  const [searchedUsers, setSearchedUsers] = useState<TUser[] | []>([]);
  const [query, setQuery] = useState<string>('');
  useOnClickOutside(addEventRef, setIsAddEventModalOpen);

  const hours = Array.from({ length: 24 }, (_, i) => i);

  const formatHour = (hour) => {
    if (hour === 0) {
      return '';
    }
    const period = hour < 12 ? 'AM' : 'PM';
    const formattedHour = hour % 12 === 0 ? 12 : hour % 12;
    return `${formattedHour} ${period}`;
  };

  const formatCurrentTime = (date) => {
    const hours = date.getHours() % 12 || 12;
    const minutes = date.getMinutes().toString().padStart(2, '0');
    const period = date.getHours() < 12 ? 'AM' : 'PM';
    return `${hours}:${minutes} ${period}`;
  };

  const getDateWithOffset = (offset) => {
    const newDate = new Date(currentDate);
    newDate.setDate(currentDate.getDate() + offset + weekOffset * 7);
    const day = newDate.getDate();
    const dayName = dayNames[newDate.getDay()];
    return { day, dayName, newDate };
  };

  const days = [];
  for (let i = -3; i <= 3; i++) {
    days.push(getDateWithOffset(i));
  }

  const getMonthYearDisplay = () => {
    const firstDayOfWeek = new Date(currentDate);
    firstDayOfWeek.setDate(currentDate.getDate() + weekOffset * 7 - 3);

    const lastDayOfWeek = new Date(currentDate);
    lastDayOfWeek.setDate(currentDate.getDate() + weekOffset * 7 + 3);

    const firstMonth = firstDayOfWeek.toLocaleString('default', {
      month: 'long',
    });
    const firstYear = firstDayOfWeek.getFullYear();
    const lastMonth = lastDayOfWeek.toLocaleString('default', {
      month: 'long',
    });
    const lastYear = lastDayOfWeek.getFullYear();

    const translatedFirstMonth = monthTranslations[firstMonth] || firstMonth;
    const translatedLastMonth = monthTranslations[lastMonth] || lastMonth;

    if (
      translatedFirstMonth === translatedLastMonth &&
      firstYear === lastYear
    ) {
      return `${translatedFirstMonth} ${firstYear}`;
    }

    return `${translatedFirstMonth} - ${translatedLastMonth} ${
      firstYear === lastYear ? firstYear : `${firstYear} - ${lastYear}`
    }`;
  };

  const handlePrevWeek = () => {
    setWeekOffset((prevOffset) => prevOffset - 1);
  };

  const handleNextWeek = () => {
    setWeekOffset((prevOffset) => prevOffset + 1);
  };

  const getUserMeetings = async () => {
    const startDate = new Date(currentDate);
    startDate.setDate(currentDate.getDate() + weekOffset * 7 - 3);
    const endDate = new Date(currentDate);
    endDate.setDate(currentDate.getDate() + weekOffset * 7 + 3);

    const formattedStartDate = startDate.toISOString().split('T')[0];
    const formattedEndDate = endDate.toISOString().split('T')[0];

    const res = await getCurrentUserMeetingsByDate(
      user.id,
      formattedStartDate,
      formattedEndDate
    );
    setUserMeetingList(res.data);
  };

  const combineDateAndTime = (date: string, time: string) => {
    if (!time) return '';
    return `${date}T${time}:00`;
  };

  const handleDateChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const date = e.target.value;

    setNewEvent((prevEvent) => ({
      ...prevEvent,
      startTime: combineDateAndTime(
        date,
        prevEvent.startTime.split('T')[1] || '00:00'
      ),
      endTime: combineDateAndTime(
        date,
        prevEvent.endTime.split('T')[1] || '00:00'
      ),
    }));
  };

  const handleStartTimeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const time = e.target.value;
    if (newEvent.startTime) {
      const date = newEvent.startTime.split('T')[0];
      setNewEvent((prevEvent) => ({
        ...prevEvent,
        startTime: combineDateAndTime(date, time),
      }));
    }
  };

  const handleEndTimeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const time = e.target.value;
    if (newEvent.endTime) {
      const date = newEvent.endTime.split('T')[0];
      setNewEvent((prevEvent) => ({
        ...prevEvent,
        endTime: combineDateAndTime(date, time),
      }));
    }
  };

  const findParticipants = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.value != '') {
      setQuery(e.target.value);
      const res = await findUserByEmail(e.target.value);
      setSearchedUsers(res.data);
    } else {
      setQuery('');
      setSearchedUsers([]);
    }
  };

  const handleAddParticipant = (user: TUser) => {
    setNewEvent((prevEvent) => {
      if (prevEvent && !prevEvent.participantsIds.includes(user.id)) {
        return {
          ...prevEvent,
          participantsIds: [...prevEvent.participantsIds, user.id],
          participants: [...prevEvent.participants, user],
        };
      }
    });
    setQuery('');
    setSearchedUsers([]);
  };

  const handleAddNewEvent = async () => {
    console.log(newEvent);

    const res = await addNewEvent(newEvent);
    console.log(res);
    if (res.status === 200) {
      setNewEvent({
        title: '',
        description: '',
        startTime: '',
        endTime: '',
        participantsIds: [],
        participants: [],
      });
      setIsAddEventModalOpen(false);
      getUserMeetings();
    }
  };

  const handleRemoveMeet = async (meetId: string) => {
    const res = await removeEvent(meetId);
    console.log(res);
    if (res.status === 200) {
      getUserMeetings();
    }
  };

  useEffect(() => {
    console.log(newEvent);
    getUserMeetings();
    const interval = setInterval(() => {
      setCurrentTime(new Date());
    }, 60000);

    return () => clearInterval(interval);
  }, [weekOffset]);

  const currentHour = currentTime.getHours();
  const currentMinutes = currentTime.getMinutes();

  const linePosition = (currentMinutes / 60) * 100;

  return (
    <div className='flex'>
      <Sidebar />
      <div className='w-full'>
        <div className='py-2 flex justify-between items-center border-b-[1px] px-4'>
          <p className='font-semibold text-xl'>Moj Kalendar</p>
          <div className='flex items-center space-x-3'>
            <div className='w-10 h-10 flex items-center justify-center border-[1px] rounded-full p-2 cursor-pointer'>
              <img src={icons.notification} className='w-5' />
            </div>
            <div className='h-6 w-[1px] bg-gray-300'></div>
            <div className='w-10 h-10 overflow-hidden rounded-full cursor-pointer'>
              <img src={icons.slika} className='w-full h-full object-cover' />
            </div>
          </div>
        </div>

        <div className='pt-4 px-4 flex justify-between items-center'>
          <div className='space-y-3'>
            <div className='flex items-center space-x-3'>
              <div
                className='w-10 h-10 rounded-full border-[1px] flex items-center justify-center cursor-pointer'
                onClick={handlePrevWeek}
              >
                <img src={icons.arrow} className='w-6 rotate-180' />
              </div>
              <div
                className='w-10 h-10 rounded-full border-[1px] flex items-center justify-center cursor-pointer'
                onClick={handleNextWeek}
              >
                <img src={icons.arrow} className='w-6' />
              </div>
              <p className='font-semibold text-2xl'>{getMonthYearDisplay()}</p>
            </div>
            <div className='flex items-center space-x-2'>
              <div className='flex items-center -space-x-1.5'>
                {location.pathname === '/kalendar' ? (
                  <div className='w-5 h-5 overflow-hidden bg-blue-600 rounded-full border-[1px] border-white'>
                    <img
                      src={icons.slika}
                      className='w-full h-full object-cover'
                    />
                  </div>
                ) : (
                  <>
                    <div className='w-5 h-5 overflow-hidden bg-blue-600 rounded-full border-[1px] border-white'>
                      <img
                        src={icons.slika}
                        className='w-full h-full object-cover'
                      />
                    </div>
                    <div className='w-5 h-5 overflow-hidden bg-blue-600 rounded-full border-[1px] border-white'>
                      <img
                        src={icons.slika}
                        className='w-full h-full object-cover'
                      />
                    </div>
                    <div className='w-5 h-5 overflow-hidden bg-blue-600 rounded-full border-[1px] border-white'>
                      <img
                        src={icons.slika}
                        className='w-full h-full object-cover'
                      />
                    </div>
                  </>
                )}
              </div>
              <p className='text-xs font-medium text-gray-500'>
                {location.pathname === '/kalendar' ? '1 Member' : '13 Members'}
              </p>
              <p className='text-gray-500'>⦁</p>
              <div className='flex items-center space-x-1'>
                <img src={icons.event} className='w-4' />
                <p className='text-sm text-blue-600 font-medium'>
                  {userMeetingList.length} Events
                </p>
              </div>
            </div>
          </div>
          <div className='flex items-center space-x-4'>
            {location.pathname !== '/kalendar' && (
              <div className='flex items-center space-x-1 border-[2px] border-blue-600 text-blue-600 px-4 py-1.5 rounded-md cursor-pointer text-center font-medium'>
                <img src={icons.addUser} className='w-4' />
                <p>Dodaj korisnika</p>
              </div>
            )}
            <div
              onClick={() => setIsAddEventModalOpen(!isAddEventModalOpen)}
              className='border-[2px] border-blue-600 bg-blue-600 px-4 py-1.5 rounded-md text-white cursor-pointer text-center'
            >
              Kreiraj događaj
            </div>
            {isAddEventModalOpen && (
              <div
                ref={addEventRef}
                className='top-36 right-4 z-50 absolute bg-white rounded-lg py-2 shadow-md border-[1px]'
              >
                <div className='flex items-center justify-between space-x-3 px-4 pb-2 border-b-[1px]'>
                  <div className='flex items-center space-x-3'>
                    <div className='flex items-center justify-center p-2 border-[1px] rounded-md'>
                      <img src={icons.addEvent} className='w-5 h-5' />
                    </div>
                    <div>
                      <p className='font-medium'>Kreirajte događaj</p>
                      <p className='text-sm text-gray-500'>
                        Unesite podatke da dodate događaj
                      </p>
                    </div>
                  </div>
                  <div
                    onClick={() => {
                      setNewEvent({
                        title: '',
                        description: '',
                        startTime: '',
                        endTime: '',
                        participantsIds: [],
                        participants: [],
                      });
                      setIsAddEventModalOpen(false);
                    }}
                    className='flex items-center justify-center w-7 h-7 cursor-pointer'
                  >
                    <img src={icons.close} className='w-3 h-3' />
                  </div>
                </div>
                <div className='p-4 border-b-[1px] space-y-2'>
                  <FormInput
                    inputName='Naziv događaja'
                    inputType='text'
                    placeholderText='Unesite naziv događaja'
                    customStyles={'text-sm outline-none'}
                    handleChange={(e) =>
                      setNewEvent({ ...newEvent, title: e.target.value })
                    }
                  />
                  <FormInput
                    inputName='Opis događaja'
                    inputType='text'
                    placeholderText='Unesite opis događaja'
                    customStyles={'text-sm outline-none'}
                    handleChange={(e) =>
                      setNewEvent({ ...newEvent, description: e.target.value })
                    }
                  />
                  <FormInput
                    inputName='Datum'
                    inputType='date'
                    customStyles={'text-sm outline-none'}
                    handleChange={(e) => handleDateChange(e)}
                  />
                  <div className='w-full flex space-x-2'>
                    <div className='w-1/2'>
                      <FormInput
                        inputName='Vrijeme početka'
                        inputType='time'
                        placeholderText='Unesite opis događaja'
                        customStyles={'text-sm outline-none w-full'}
                        handleChange={(e) => handleStartTimeChange(e)}
                      />
                    </div>
                    <div className='w-1/2'>
                      <FormInput
                        inputName='Vrijeme završetka'
                        inputType='time'
                        placeholderText='Unesite opis događaja'
                        customStyles={'text-sm outline-none w-full'}
                        handleChange={(e) => handleEndTimeChange(e)}
                      />
                    </div>
                  </div>
                  <div className='relative'>
                    <FormInput
                      inputName='Dodaj učesnike'
                      inputType='text'
                      customStyles={'text-sm outline-none'}
                      handleChange={findParticipants}
                      inputValue={query}
                    />
                    {searchedUsers.length > 0 && (
                      <div className='absolute z-50 bg-white w-full py-2 shadow-md rounded-lg'>
                        {searchedUsers.map((user) => {
                          const isUserAdded =
                            newEvent?.participantsIds.includes(user.id);

                          return isUserAdded ? (
                            // <SearchedUserItem
                            //   user={user}
                            //   customStyles='opacity-60 cursor-not-allowed bg-slate-200'
                            // />
                            <div
                              key={user.id}
                              className='opacity-60 px-4 py-1 flex items-center space-x-2 bg-slate-200 cursor-not-allowed'
                            >
                              <div className='w-8 h-8 bg-blue-600 rounded-full overflow-hidden'>
                                <img
                                  src={icons.slika}
                                  className='w-full h-full'
                                />
                              </div>
                              <div>
                                <p className='text-sm font-medium'>
                                  {user.name}
                                </p>
                                <p className='text-xs'>{user.email}</p>
                              </div>
                            </div>
                          ) : (
                            // <SearchedUserItem
                            //   user={user}
                            //   customStyles=''
                            //   handleClick={() => handleAddParticipant(user)}
                            // />
                            <div
                              onClick={() => handleAddParticipant(user)}
                              key={user.id}
                              className='px-4 py-1 flex items-center space-x-2 hover:bg-slate-200 cursor-pointer'
                            >
                              <div className='w-8 h-8 bg-blue-600 rounded-full overflow-hidden'>
                                <img
                                  src={icons.slika}
                                  className='w-full h-full'
                                />
                              </div>
                              <div>
                                <p className='text-sm font-medium'>
                                  {user.name}
                                </p>
                                <p className='text-xs'>{user.email}</p>
                              </div>
                            </div>
                          );
                        })}
                      </div>
                    )}
                    {newEvent.participants &&
                      newEvent.participants.length > 0 && (
                        <div className='py-2'>
                          {newEvent.participants.map((user) => (
                            // <SearchedUserItem user={user} customStyles='px-2' />
                            <div
                              key={user.id}
                              className='px-2 py-1 flex items-center space-x-2 hover:bg-slate-100 cursor-pointer'
                            >
                              <div className='w-8 h-8 bg-blue-600 rounded-full overflow-hidden'>
                                <img
                                  src={icons.slika}
                                  className='w-full h-full'
                                />
                              </div>
                              <div>
                                <p className='text-sm font-medium'>
                                  {user.name}
                                </p>
                                <p className='text-xs'>{user.email}</p>
                              </div>
                            </div>
                          ))}
                        </div>
                      )}
                  </div>
                </div>
                <div className='px-4 pt-2 flex items-center justify-end space-x-2'>
                  <div
                    onClick={() => {
                      setNewEvent({
                        title: '',
                        description: '',
                        startTime: '',
                        endTime: '',
                        participantsIds: [],
                        participants: [],
                      });
                      setIsAddEventModalOpen(false);
                    }}
                    className='flex items-center justify-center min-w-[80px] border-[2px] border-blue-600 rounded-lg py-1 text-blue-600 cursor-pointer text-sm font-medium'
                  >
                    Otkaži
                  </div>
                  <div
                    onClick={handleAddNewEvent}
                    className='flex items-center justify-center  min-w-[80px] w-[50px] border-[1px] border-blue-600 bg-blue-600 rounded-lg py-1 text-white text-sm font-medium cursor-pointer'
                  >
                    Dodaj
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>

        <div className='px-4 py-4'>
          <div className=' relative border-[1px] rounded-lg'>
            {/*Timezone and Days */}

            <div className='flex w-full border-b-[1px]'>
              <div className='py-3 min-w-20 flex justify-center'>GMT+2</div>
              {days.map((date, index) => (
                <div
                  key={index}
                  className={`w-full flex justify-center border-l-[1px] space-x-2 ${
                    currentDate.getTime() == date.newDate.getTime()
                      ? 'bg-blue-50'
                      : ''
                  }`}
                >
                  <div
                    className={`py-3 w-full h-full flex items-center justify-center space-x-2 ${
                      currentDate.getTime() == date.newDate.getTime()
                        ? 'border-b-[2px] border-blue-600'
                        : ''
                    }`}
                  >
                    <span
                      className={`${
                        currentDate.getTime() == date.newDate.getTime()
                          ? 'text-blue-600'
                          : 'text-gray-500'
                      }`}
                    >
                      {date.dayName}
                    </span>
                    <div
                      className={`${
                        currentDate.getTime() == date.newDate.getTime()
                          ? 'bg-blue-600 rounded-full'
                          : ''
                      }`}
                    >
                      <span
                        className={`font-semibold ${
                          currentDate.getTime() == date.newDate.getTime()
                            ? 'px-1.5 py-2 text-white text-center'
                            : ''
                        }`}
                      >
                        {date.day}
                      </span>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            <div className='flex'>
              {/* Column for Hours */}
              <div className='min-w-20 flex flex-col'>
                {hours.map((hour, index) => (
                  <div
                    key={index}
                    className='h-[100px] flex justify-center items-center relative'
                  >
                    <div className='absolute -top-3 text-gray-500'>
                      {formatHour(hour)}
                    </div>

                    {/* Show current time */}
                    {currentHour === hour && (
                      <div
                        className='absolute z-10 bg-blue-600 text-white text-xs rounded-lg px-2 py-1'
                        style={{
                          top: `${linePosition}%`,
                          transform: 'translateY(-50%)',
                        }}
                      >
                        {formatCurrentTime(currentTime)}
                      </div>
                    )}
                  </div>
                ))}
              </div>

              <div className='flex w-full'>
                {/* 7 day columns */}
                {days.map((date, colIndex) => (
                  <div
                    key={colIndex}
                    className='relative w-full border-l-[1px]'
                  >
                    {/* Rows for each hour inside each day column */}
                    {hours.map((hour, rowIndex) => (
                      <div
                        key={rowIndex}
                        className={`h-[100px] border-b-[1px] relative ${
                          currentDate.getTime() == date.newDate.getTime()
                            ? 'bg-blue-50'
                            : ''
                        }`}
                      >
                        {userMeetingList.map((meet) => {
                          const meetDate = new Date(meet.startTime);
                          const meetEndDate = new Date(meet.endTime);

                          const minutesStart = meetDate.getMinutes();
                          const durationMinutes =
                            (meetEndDate - meetDate) / (1000 * 60);

                          if (
                            meetDate.toDateString() ===
                              date.newDate.toDateString() &&
                            meetDate.getHours() === hour
                          ) {
                            return (
                              <CalendarMeetCard
                                key={meet.id}
                                meet={meet}
                                minutesStart={minutesStart}
                                durationMinutes={durationMinutes}
                                handleRemoveMeet={handleRemoveMeet}
                              />
                            );
                          }

                          return null;
                        })}

                        {/* Blue line for current time */}
                        {currentHour === hour && (
                          <>
                            <div
                              className='absolute left-0 w-full border-t-2 border-blue-500'
                              style={{ top: `${linePosition}%` }}
                            ></div>

                            {colIndex === 0 && (
                              <div
                                className='absolute h-3 w-3 bg-blue-500 rounded-full left-[-7px]'
                                style={{
                                  top: `${linePosition}%`,
                                  transform: 'translateY(-50%)',
                                }}
                              ></div>
                            )}
                          </>
                        )}
                      </div>
                    ))}
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Calendar;
