import React, { useState } from 'react';
import dayjs from 'dayjs';
import isBetweenPlugin from 'dayjs/plugin/isBetween';
import isoWeek from 'dayjs/plugin/isoWeek';
import { styled } from '@mui/material/styles';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { DateCalendar } from '@mui/x-date-pickers/DateCalendar';
import { PickersDay } from '@mui/x-date-pickers/PickersDay';
import { DemoContainer, DemoItem } from '@mui/x-date-pickers/internals/demo';

dayjs.extend(isBetweenPlugin);
dayjs.extend(isoWeek);

const CustomPickersDay = styled(PickersDay, {
  shouldForwardProp: (prop) => prop !== 'isSelected' && prop !== 'isHovered',
})(({ theme, isSelected, isHovered, day }) => ({
  borderRadius: 0,
  ...(isSelected && {
    backgroundColor: theme.palette.primary.main,
    color: theme.palette.primary.contrastText,
    '&:hover, &:focus': {
      backgroundColor: theme.palette.primary.main,
    },
  }),
  ...(isHovered && {
    backgroundColor: theme.palette.primary.light,
    '&:hover, &:focus': {
      backgroundColor: theme.palette.primary.light,
    },
  }),
  ...(day.day() === 0 && {
    borderTopLeftRadius: '50%',
    borderBottomLeftRadius: '50%',
  }),
  ...(day.day() === 6 && {
    borderTopRightRadius: '50%',
    borderBottomRightRadius: '50%',
  }),
}));

const isInSameWeek = (dayA, dayB) => {
  if (dayB == null) {
    return false;
  }

  return dayA.isSame(dayB, 'week');
};

function Day(props) {
  const { day, selectedDay, hoveredDay, ...other } = props;

  return (
    <CustomPickersDay
      {...other}
      day={day}
      sx={{ px: 2.5 }}
      disableMargin
      selected={false}
      isSelected={isInSameWeek(day, selectedDay)}
      isHovered={isInSameWeek(day, hoveredDay)}
    />
  );
}

const DashboardCalendar = ({ handleDateChange, viewMode }) => {
  const [hoveredDay, setHoveredDay] = useState(null);
  const [value, setValue] = useState(dayjs('2024-01-01'));

  const handleSelection = (newDate) => {
    if (viewMode === 'week') {
      const startOfWeek = newDate.startOf('isoWeek'); // Δευτέρα
      const endOfWeek = newDate.endOf('isoWeek'); // Κυριακή
      setValue(newDate);
      handleDateChange([startOfWeek, endOfWeek]); // Επιστροφή του εύρους εβδομάδας
    } else {
      setValue(newDate);
      handleDateChange(newDate); // Για τις επιλογές έτους και μήνα
    }
  };

  return (
    <LocalizationProvider dateAdapter={AdapterDayjs}>
      <DemoContainer components={['DateCalendar']}>
        {viewMode === 'year' && (
          <DemoItem label={'Επιλογή Έτους'}>
            <DateCalendar
              value={value}
              views={['year']}
              minDate={dayjs('2024-01-01')}
              maxDate={dayjs('2030-12-31')}
              onChange={handleSelection}
            />
          </DemoItem>
        )}
        {viewMode === 'month' && (
          <DemoItem label={'Επιλογή Μήνα'}>
            <DateCalendar
              value={value}
              views={['month', 'year']}
              minDate={dayjs('2024-01-01')}
              maxDate={dayjs('2030-12-31')}
              onChange={handleSelection}
            />
          </DemoItem>
        )}
        {viewMode === 'week' && (
          <DemoItem label={'Επιλογή Εβδομάδας'}>
            <DateCalendar
              value={value}
              onChange={handleSelection}
              showDaysOutsideCurrentMonth
              displayWeekNumber
              slots={{ day: Day }}
              slotProps={{
                day: (ownerState) => ({
                  selectedDay: value,
                  hoveredDay,
                  onPointerEnter: () => setHoveredDay(ownerState.day),
                  onPointerLeave: () => setHoveredDay(null),
                }),
              }}
            />
          </DemoItem>
        )}
      </DemoContainer>
    </LocalizationProvider>
  );
};

export default DashboardCalendar;
