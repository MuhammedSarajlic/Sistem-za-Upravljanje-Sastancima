import { useState, useEffect } from 'react';
import Sidebar from '../components/Sidebar';
import { dayNames } from '../constants/days';
import icons from '../constants/icons';
import { getCurrentUserMeetingsByDate } from '../services/meeting';
import { useGlobalContext } from '../context/GlobalProvider';
import { TMeeting } from '../types/types';

const Calendar = () => {
  const currentDate = new Date();
  const currentDay = currentDate.getDate();
  const [currentTime, setCurrentTime] = useState(new Date());
  const [weekOffset, setWeekOffset] = useState(0);
  const [userMeetingList, setUserMeetingList] = useState<[] | TMeeting[]>([]);
  const { user } = useGlobalContext();

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

    if (firstMonth === lastMonth && firstYear === lastYear) {
      return `${firstMonth} ${firstYear}`;
    }

    return `${firstMonth} - ${lastMonth} ${
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

  useEffect(() => {
    console.log(userMeetingList);
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
              </div>
              <p className='text-xs font-medium text-gray-500'>13 Members</p>
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
            <div className='flex items-center space-x-1 border-[2px] border-blue-600 text-blue-600 px-4 py-1.5 rounded-md cursor-pointer text-center font-medium'>
              <img src={icons.addUser} className='w-4' />
              <p>Invite user</p>
            </div>
            <div className='border-[2px] border-blue-600 bg-blue-600 px-4 py-1.5 rounded-md text-white cursor-pointer text-center'>
              Create event
            </div>
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
                  className={`py-3 w-full flex justify-center border-l-[1px] space-x-2`}
                >
                  <span
                    className={`${
                      currentDay === date.day
                        ? 'text-blue-600'
                        : 'text-gray-500'
                    }`}
                  >
                    {date.dayName}
                  </span>
                  <div
                    className={`${
                      currentDay === date.day ? 'bg-blue-600 rounded-full' : ''
                    }`}
                  >
                    <span
                      className={`font-semibold ${
                        currentDay === date.day
                          ? 'px-1.5 py-2 text-white text-center'
                          : ''
                      }`}
                    >
                      {date.day}
                    </span>
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
                        className='h-[100px] border-b-[1px] relative'
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
                              <div
                                key={meet.id}
                                className='overflow-hidden absolute w-full border-[2px] border-blue-500 bg-blue-100 rounded-lg flex-col px-1 space-y-2'
                                style={{
                                  top: `${(minutesStart / 60) * 100}%`,
                                  height: `${(durationMinutes / 60) * 100}%`,
                                }}
                              >
                                <p className='text-blue-500 text-sm font-medium'>
                                  {meet.title}
                                </p>
                                <p className='text-xs text-blue-500'>
                                  {new Date(meet.startTime)
                                    .toLocaleTimeString([], {
                                      hour: 'numeric',
                                      minute: '2-digit',
                                    })
                                    .replace(' ', '')
                                    .toLowerCase()}
                                  -
                                  {new Date(meet.endTime)
                                    .toLocaleTimeString([], {
                                      hour: 'numeric',
                                      minute: '2-digit',
                                    })
                                    .replace(' ', '')
                                    .toLowerCase()}
                                </p>
                                <div className='flex items-center space-x-2'>
                                  <div className='flex items-center -space-x-1.5'>
                                    <div className='w-5 h-5 overflow-hidden rounded-full border-[1px] border-blue-100'>
                                      <img
                                        src={icons.slika}
                                        className='w-full h-full object-cover'
                                      />
                                    </div>
                                    <div className='w-5 h-5 overflow-hidden rounded-full border-[1px] border-blue-100'>
                                      <img
                                        src={icons.slika}
                                        className='w-full h-full object-cover'
                                      />
                                    </div>
                                    <div className='w-5 h-5 overflow-hidden rounded-full border-[1px] border-blue-100'>
                                      <img
                                        src={icons.slika}
                                        className='w-full h-full object-cover'
                                      />
                                    </div>
                                  </div>
                                  <div className='flex items-center justify-center border-[1px] border-blue-600 rounded-full px-1.5 text-blue-600 text-xs'>
                                    5+
                                  </div>
                                </div>
                              </div>
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
