import React, { useState, useEffect, useCallback } from "react";
import { Box } from "@material-ui/core";
import PropTypes from "prop-types";
import GridItem from "components/Grid/GridItem";
import DateRangePicker from "components/DateRangePicker/DateRangePicker";
import IconButton from "@material-ui/core/IconButton";
import AddBoxIcon from "@material-ui/icons/AddBox";
import DowButton from "./DowButton";
import { getDowsInDateRange } from "helper";
import { arrayToggleElem } from "helper/index";

const dows = [0, 1, 2, 3, 4, 5, 6];

const NewPeriod = ({ startDate, endDate, onAdd }) => {
  const [model, setModel] = useState({ startDate, endDate, dows: [] });
  const [availableDows, setAvailableDows] = useState(
    getDowsInDateRange(model.startDate, model.endDate)
  );

  // set available days of week when start date or end date is changed
  useEffect(() => {
    setAvailableDows(getDowsInDateRange(model.startDate, model.endDate));
  }, [model.startDate, model.endDate]);

  // opt out unavailable days of week
  useEffect(() => {
    const newModel = { ...model };
    newModel.dows = model.dows.filter((day) => availableDows.includes(day));
    setModel(newModel);
    //eslint-disable-next-line react-hooks/exhaustive-deps
  }, [availableDows]);

  const onSelectDow = useCallback(
    (dow) => {
      const newModel = { ...model };
      newModel.dows = arrayToggleElem([...newModel.dows], dow);
      setModel(newModel);
    },
    [model]
  );
  return (
    <Box>
      <GridItem xs={12}>
        <DateRangePicker
          defaultStartDate={startDate}
          defaultEndDate={endDate}
          minDate={startDate}
          maxDate={endDate}
          onChange={(newStart, newEnd) => {
            const newModel = {
              ...model,
              startDate: newStart.toDate(),
              endDate: newEnd.toDate(),
            };
            setModel(newModel);
          }}
        />
      </GridItem>
      <GridItem xs={12}>
        {dows.map((day) => (
          <DowButton
            key={day}
            dow={day}
            selected={model.dows.includes(day)}
            variant={model.dows.includes(day) ? "contained" : "outlined"}
            disabled={!availableDows.includes(day)}
            onClick={() => {
              onSelectDow(day);
            }}
          />
        ))}
        <IconButton onClick={() => onAdd({ ...model })}>
          <AddBoxIcon />
        </IconButton>
      </GridItem>
    </Box>
  );
};

NewPeriod.propTypes = {
  startDate: PropTypes.object,
  endDate: PropTypes.object,
  onAdd: PropTypes.func,
};

NewPeriod.defaultProps = {
  onAdd: () => {},
};

export default NewPeriod;
