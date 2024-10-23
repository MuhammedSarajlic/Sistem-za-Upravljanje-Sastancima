import { useRef, useState } from 'react';
import icons from '../constants/icons';
import { TMeeting } from '../types/types';
import useOnClickOutside from '../hooks/useOnClickOutside';
import { dayNames } from '../constants/days';
import { monthTranslations } from '../constants/months';

interface ICalendarMeetCard {
  meet: TMeeting;
  minutesStart: number;
  durationMinutes: number;
  handleRemoveMeet: (meetId: string) => Promise<void>;
}

const CalendarMeetCard = ({
  meet,
  minutesStart,
  durationMinutes,
  handleRemoveMeet,
}: ICalendarMeetCard) => {
  const ref = useRef(null);
  const [isMeetDetailsModalOpen, setIsMeetDetailsModalOpen] =
    useState<boolean>(false);
  useOnClickOutside(ref, setIsMeetDetailsModalOpen);

  const formatMeetingTime = (startTime: string, endTime: string) => {
    const startDate = new Date(startTime);
    const endDate = new Date(endTime);

    const dayOfWeek = dayNames[startDate.getDay()];
    const month =
      monthTranslations[
        startDate.toLocaleDateString('en-US', { month: 'long' })
      ];

    const dayAndMonth = `${month} ${startDate.getDate()}`;

    const startFormattedTime = startDate
      .toLocaleTimeString([], { hour: 'numeric', minute: '2-digit' })
      .replace(' ', '');
    const endFormattedTime = endDate
      .toLocaleTimeString([], { hour: 'numeric', minute: '2-digit' })
      .replace(' ', '');

    return `${dayOfWeek}, ${dayAndMonth} ⦁ ${startFormattedTime} - ${endFormattedTime}`;
  };

  return (
    <>
      <div
        onClick={() => {
          setIsMeetDetailsModalOpen(!isMeetDetailsModalOpen);
        }}
        key={meet.id}
        className='z-10 overflow-hidden absolute w-full border-[2px] border-blue-500 bg-blue-100 rounded-lg flex-col px-1 space-y-1 cursor-pointer'
        style={{
          top: `${(minutesStart / 60) * 100}%`,
          height: `${(durationMinutes / 60) * 100}%`,
        }}
      >
        <p className='text-blue-500 text-sm font-medium line-clamp-2'>
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
            {meet.participants.slice(0, 2).map((participant) => (
              <div
                key={participant.id}
                className='w-5 h-5 overflow-hidden rounded-full border-[1px] border-blue-100'
              >
                <img src={icons.slika} className='w-full h-full object-cover' />
              </div>
            ))}
            {meet.participants.length > 2 && (
              <div className=' h-5 flex items-center justify-center bg-blue-100 overflow-hidden rounded-full border-[1px] border-white'>
                <p className='text-xs text-blue-600 px-1.5'>
                  {meet.participants.length - 2}+
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
      {isMeetDetailsModalOpen && (
        <div
          ref={ref}
          className='ml-2 px-3 py-2 min-w-[400px] z-30 absolute left-full bg-white rounded-lg shadow-2xl'
        >
          <div className='flex items-center justify-end'>
            <div className='flex items-center justify-center w-9 h-9 hover:bg-gray-100 rounded-full cursor-pointer'>
              <img src={icons.edit} className='w-4 h-4' />
            </div>
            <div
              onClick={() => {
                handleRemoveMeet(meet.id);
                setIsMeetDetailsModalOpen(false);
              }}
              className='mr-3 flex items-center justify-center w-9 h-9 hover:bg-gray-100 rounded-full cursor-pointer'
            >
              <img src={icons.remove} className='w-4 h-4' />
            </div>
            <div
              onClick={() => setIsMeetDetailsModalOpen(false)}
              className='flex items-center justify-center w-9 h-9 bg-gray-300 rounded-full cursor-pointer'
            >
              <img src={icons.close} className='w-2.5 h-2.5' />
            </div>
          </div>
          <div>
            <p className='text-2xl'>{meet.title}</p>
            <p className='text-sm text-gray-500 mb-3'>
              {formatMeetingTime(meet.startTime, meet.endTime)}
            </p>
            <p className='text-gray-700 mb-3'>{meet.description}</p>
            <div className='flex items-center -space-x-1.5'>
              {meet.participants.slice(0, 2).map((participant) => (
                <div
                  key={participant.id}
                  className='w-9 h-9 overflow-hidden rounded-full border-[1px] border-blue-100'
                >
                  <img
                    src={icons.slika}
                    className='w-full h-full object-cover'
                  />
                </div>
              ))}
              {meet.participants.length > 2 && (
                <div className='h-9 flex items-center justify-center bg-blue-100 overflow-hidden rounded-full border-[1px] border-white'>
                  <p className='text-md text-blue-600 px-2.5'>
                    {meet.participants.length - 2}+
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default CalendarMeetCard;
