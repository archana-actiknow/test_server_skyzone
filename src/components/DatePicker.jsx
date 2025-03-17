import React from 'react';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';

const DatePickerComponent = (props) => {

  const {value, onChange, minDate, className, showWeekPicker} = props;
  const time = props.timeOnly ? props.timeOnly : false;

  return (
    <>
      {time 
      ?
      <DatePicker
        selected={value}
        onChange={onChange}
        className={`${(className) ? className : "fs-13 form-control"}`}
        showTimeSelect
        showTimeSelectOnly
        timeFormat="HH:mm"
        timeIntervals={5}
        timeCaption="Time"
        dateFormat="HH:mm"
      />
      :
      <DatePicker
        selected={value}
        onChange={onChange}
        dateFormat={(showWeekPicker) ? "w-yyyy":"yyyy-MM-dd"}
        className={`${(className) ? className : "fs-13 form-control"}`}
        minDate={minDate && new Date()}
        showYearDropdown
        scrollableYearDropdown
        // yearDropdownItemNumber={-5}
        isClearable
        showWeekPicker={(showWeekPicker) ? true : false}
        showWeekNumbers={(showWeekPicker) ? true : false}
        calendarStartDay={1}
      />
    }
    </>
  );
};

export default DatePickerComponent;
