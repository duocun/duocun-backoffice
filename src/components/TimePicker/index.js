import React, { useState } from "react";
import { DatePicker } from "@material-ui/pickers";
import Moment from 'react-moment';
import 'moment-timezone';

export default function datePicker() {
  // const [selectedDate, handleDateChange] = useState(new Date());

  return (
    <div>
      <DatePicker
        variant="inline"
        label="Basic example"
        // value={selectedDate}
        // onChange={handleDateChange}
      />
    </div>
  );
}
