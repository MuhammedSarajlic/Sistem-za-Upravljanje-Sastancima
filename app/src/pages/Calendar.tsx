import { useState, useEffect } from 'react';
import Sidebar from '../components/Sidebar';
import { dayNames } from '../constants/days';
import icons from '../constants/icons';
import {
  getCurrentUserMeetings,
  getCurrentUserMeetingsByDate,
} from '../services/meeting';
import { useGlobalContext } from '../context/GlobalProvider';
import { TMeeting } from '../types/types';

const Calendar = () => {
  const currentDate = new Date();
  const currentDay = currentDate.getDate();
  const [currentTime, setCurrentTime] = useState(new Date());
  const [weekOffset, setWeekOffset] = useState(0);
  const [userMeetingList, setUserMeetingList] = useState<[] | TMeeting[]>([]);
  const { user } = useGlobalContext();

  // Calculate hours from 0 to 23
  const hours = Array.from({ length: 24 }, (_, i) => i);

  const formatHour = (hour) => {
    if (hour === 0) {
      return '';
    }
    const period = hour < 12 ? 'AM' : 'PM';
    const formattedHour = hour % 12 === 0 ? 12 : hour % 12; // Converts 0 to 12 for midnight and 12 to 12 for noon
    return `${formattedHour} ${period}`;
  };

  const formatCurrentTime = (date) => {
    const hours = date.getHours() % 12 || 12; // Convert to 12-hour format
    const minutes = date.getMinutes().toString().padStart(2, '0'); // Pad minutes with leading 0
    const period = date.getHours() < 12 ? 'AM' : 'PM';
    return `${hours}:${minutes} ${period}`;
  };

  const getDateWithOffset = (offset) => {
    const newDate = new Date(currentDate);
    newDate.setDate(currentDate.getDate() + offset + weekOffset * 7); // Adjust with weekOffset
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
    firstDayOfWeek.setDate(currentDate.getDate() + weekOffset * 7 - 3); // Start of the week

    const lastDayOfWeek = new Date(currentDate);
    lastDayOfWeek.setDate(currentDate.getDate() + weekOffset * 7 + 3); // End of the week

    const firstMonth = firstDayOfWeek.toLocaleString('default', {
      month: 'long',
    });
    const firstYear = firstDayOfWeek.getFullYear();
    const lastMonth = lastDayOfWeek.toLocaleString('default', {
      month: 'long',
    });
    const lastYear = lastDayOfWeek.getFullYear();

    // If the month is the same, return just one month and year
    if (firstMonth === lastMonth && firstYear === lastYear) {
      return `${firstMonth} ${firstYear}`;
    }

    // If crossing months or years, return both month and year ranges
    return `${firstMonth} - ${lastMonth} ${
      firstYear === lastYear ? firstYear : `${firstYear} - ${lastYear}`
    }`;
  };

  const handlePrevWeek = () => {
    setWeekOffset((prevOffset) => prevOffset - 1); // Move 1 week back
  };

  const handleNextWeek = () => {
    setWeekOffset((prevOffset) => prevOffset + 1); // Move 1 week forward
  };

  const getUserMeetings = async () => {
    // Calculate the start and end date based on the current date and week offset
    const startDate = new Date(currentDate);
    startDate.setDate(currentDate.getDate() + weekOffset * 7 - 3); // Start 3 days before the current week
    const endDate = new Date(currentDate);
    endDate.setDate(currentDate.getDate() + weekOffset * 7 + 3); // End 3 days after the current week

    // Call the API with the user ID and date range
    const res = await getCurrentUserMeetingsByDate(
      user.id,
      startDate.toISOString(),
      endDate.toISOString()
    );
    setUserMeetingList(res.data);
    console.log(res);
  };

  // Update the current time every minute
  useEffect(() => {
    console.log(userMeetingList);
    getUserMeetings();
    const interval = setInterval(() => {
      setCurrentTime(new Date());
    }, 60000); // Update every minute

    return () => clearInterval(interval); // Clear interval on unmount
  }, [weekOffset]);

  // Calculate the current hour and minute
  const currentHour = currentTime.getHours();
  const currentMinutes = currentTime.getMinutes();

  // Calculate the vertical position for the current time (0-100% of the current hour row)
  const linePosition = (currentMinutes / 60) * 100; // Position in percentage

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
            {/* Header Row: Timezone and Days */}
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

                    {/* Show current time only in the current hour */}
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

              {/* Div wrapping the 7 day columns */}
              <div className='flex w-full'>
                {/* 7 day columns */}
                {days.map((date, colIndex) => (
                  <div
                    key={colIndex}
                    className='relative w-full border-l-[1px]'
                  >
                    {console.log(date)}
                    {/* Generate rows for each hour inside each day column */}
                    {hours.map((hour, rowIndex) => (
                      <div
                        key={rowIndex}
                        className='h-[100px] border-b-[1px] relative'
                      >
                        {userMeetingList.map((meet) => {
                          const meetDate = new Date(meet.startTime);
                          const meetEndDate = new Date(meet.endTime);

                          // Calculate the meeting's start and end within the hour
                          const minutesStart = meetDate.getMinutes();
                          const durationMinutes =
                            (meetEndDate - meetDate) / (1000 * 60); // Duration in minutes

                          if (
                            meetDate.toDateString() ===
                              date.newDate.toDateString() &&
                            meetDate.getHours() === hour
                          ) {
                            return (
                              <div
                                key={meet.id}
                                className='absolute w-full bg-blue-500 text-white rounded-lg px-2 py-1'
                                style={{
                                  top: `${(minutesStart / 60) * 100}%`, // Start position in the cell (percentage)
                                  height: `${(durationMinutes / 60) * 100}%`, // Height of the block (percentage)
                                }}
                              >
                                {meet.title}
                              </div>
                            );
                          }

                          return null;
                        })}

                        {/* Blue line for current time inside each column */}
                        {currentHour === hour && (
                          <>
                            {/* Time line */}
                            <div
                              className='absolute left-0 w-full border-t-2 border-blue-500'
                              style={{ top: `${linePosition}%` }} // Dynamically position the line
                            ></div>

                            {/* Time dot at the start of the line */}
                            {colIndex === 0 && (
                              <div
                                className='absolute h-3 w-3 bg-blue-500 rounded-full left-[-7px]'
                                style={{
                                  top: `${linePosition}%`,
                                  transform: 'translateY(-50%)',
                                }} // Center the dot vertically
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
