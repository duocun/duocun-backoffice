import React, { useState, useEffect } from "react";
import PropTypes from "prop-types";
import { Box, Button, makeStyles, IconButton } from "@material-ui/core";
import CustomModal from "components/CustomModal/CustomModal";
import CustomSelect from "components/CustomInput/SelectWithLabel";
import { useTranslation } from "react-i18next";
import NewPeriod from "./NewPeriod";
import moment from "moment";
import DowButton from "./DowButton";
import DeleteForeverIcon from "@material-ui/icons/DeleteForever";
import { canAddDateRange, getPeriods } from "models/schedule";

const AreaModal = ({
  areas,
  open,
  onClose,
  onChange,
  onDelete,
  value,
  editAreaId
}) => {
  const [areaId, setAreaId] = useState("");
  const [periods, setPeriods] = useState([]);
  const { t } = useTranslation();
  const areaData = (editAreaId
    ? areas.filter(area => area._id === editAreaId)
    : areas.filter(area => {
        return value.areas.findIndex(a => a.areaId === area._id) === -1;
      })
  ).map(area => ({ text: area.name, value: area._id }));
  const classes = useStyles();

  useEffect(() => {
    setAreaId(editAreaId);
  }, [editAreaId]);
  useEffect(() => {
    setPeriods(getPeriods(value, areaId));
  }, [areaId, value]);

  return (
    <CustomModal open={open} onClose={onClose} size="md">
      <CustomSelect
        label={t("Areas")}
        itemData={areaData}
        value={areaId}
        disabled={!!editAreaId}
        onChange={val => setAreaId(val)}
      />
      {!!areaId && (
        <Box mt={3}>
          <NewPeriod
            startDate={value.startDate}
            endDate={value.endDate}
            onAdd={p => {
              if (canAddDateRange(p.startDate, p.endDate, periods)) {
                setPeriods([...periods, p]);
              }
            }}
          />
        </Box>
      )}
      {periods.length > 0 &&
        periods.map((period, index) => (
          <Box key={`period_${index}`} mt={3}>
            <label className={classes.dateLabel}>
              {moment(period.startDate).format("YYYY-MM-DD")}
            </label>
            <label className={classes.dateLabel}>
              {moment(period.endDate).format("YYYY-MM-DD")}
            </label>
            {[0, 1, 2, 3, 4, 5, 6].map(dow => (
              <DowButton
                key={`period_${index}_dow_${dow}`}
                dow={dow}
                variant={period.dows.includes(dow) ? "contained" : "outlined"}
                selected={period.dows.includes(dow)}
              />
            ))}
            <IconButton
              onClick={() => {
                const newPeriods = [...periods];
                newPeriods.splice(index, 1);
                setPeriods(newPeriods);
              }}
            >
              <DeleteForeverIcon />
            </IconButton>
          </Box>
        ))}
      <Box mt={3}>
        <Button
          variant="contained"
          color="primary"
          className={classes.button}
          onClick={() => onChange({ areaId, periods })}
        >
          {t("OK")}
        </Button>
        {editAreaId && (
          <Button
            variant="outlined"
            className={classes.button}
            color="secondary"
            onClick={onDelete}
          >
            {t("Delete")}
          </Button>
        )}
        <Button variant="contained" onClick={onClose}>
          {t("Cancel")}
        </Button>
      </Box>
    </CustomModal>
  );
};

AreaModal.propTypes = {
  areas: PropTypes.array,
  open: PropTypes.bool,
  onClose: PropTypes.func,
  onChange: PropTypes.func,
  onDelete: PropTypes.func,
  value: PropTypes.object,
  editAreaId: PropTypes.string
};

AreaModal.defaultProps = {
  areas: []
};

const useStyles = makeStyles(theme => ({
  dateLabel: {
    marginRight: "1em"
  },
  button: {
    marginRight: "1em"
  }
}));

export default AreaModal;
