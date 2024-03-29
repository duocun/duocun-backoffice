import React, { useState, useCallback, useEffect } from "react";
import PropTypes from "prop-types";
import { useTranslation } from "react-i18next";
import GridContainer from "components/Grid/GridContainer.js";
import GridItem from "components/Grid/GridItem.js";

import Card from "components/Card/Card.js";
import CardHeader from "components/Card/CardHeader.js";
import CardBody from "components/Card/CardBody.js";
import CardFooter from "components/Card/CardFooter";
import Alert from "components/CustomAlert/CustomAlert";

import CustomTextField from "components/CustomInput/CustomTextField";
import SelectWithLabel from "components/CustomInput/SelectWithLabel";
import DateRangePicker from "components/DateRangePicker/DateRangePicker";

import { DEFAULT_MODEL, validate, convertDataToModel } from "models/schedule";
import { Box, Button } from "@material-ui/core";
import SaveIcon from "@material-ui/icons/Save";
import FormatListBulletedIcon from "@material-ui/icons/FormatListBulleted";
import CustomLoader from "components/CustomLoader/CustomLoader";
import ScheduleTable from "./ScheduleTable";
import * as ApiScheduleService from "services/api/ApiScheduleService";
import AreaModal from "./AreaModal";
import FlashStorage from "services/FlashStorage";

const ScheduleEdit = ({ match, history }) => {
  const [loading, setLoading] = useState(true);
  const [processing, setProcessing] = useState(false);
  const [model, setModel] = useState(DEFAULT_MODEL);
  const [areas, setAreas] = useState([]);
  const { t } = useTranslation();
  const [alert, setAlert] = useState(null);
  const [openModal, setOpenModal] = useState(false);
  const [editAreaId, setEditAreaId] = useState("");
  const loadModel = useCallback(() => {
    ApiScheduleService.get(match.params.id)
      .then(({ data }) => {
        if (data.code === "success") {
          if (data.data) {
            setModel(convertDataToModel(data.data));
          }
          setAreas(data.meta.areas);
        } else {
          setAlert({
            severity: "error",
            message: t(data.message || "Cannot load data"),
          });
        }
      })
      .catch((e) => {
        setAlert({
          severity: "error",
          message: t("Cannot load data"),
        });
      })
      .finally(() => setLoading(false));
  }, [match, t]);

  const saveModel = useCallback(() => {
    setAlert(null);
    try {
      validate(model);
    } catch (e) {
      setAlert({
        message: t(e.message || "Invalid data"),
        severity: "error",
      });
      return;
    }
    setProcessing(true);
    const scheduleData = {
      appType: "G",
      status: "A",
      ...model,
    };
    // if (scheduleData.areas) {
    //   scheduleData.areas.forEach((a) => {
    //     if (a.periods) {
    //       a.periods.forEach((p) => {
    //         p.startDate = scheduleData.startDate;
    //         p.endDate = scheduleData.endDate;
    //       });
    //     }
    //   });
    // }
    ApiScheduleService.save(scheduleData)
      .then(({ data }) => {
        if (data.code === "success") {
          if (data.data) {
            const newAlert = {
              message: t("Saved successfully"),
              severity: "success",
            };
            if (!model._id || model._id === "new") {
              FlashStorage.set("SCHEDULE_ALERT", newAlert);
              history.push("../schedules");
              return;
            } else {
              setAlert(newAlert);
              loadModel();
            }
          }
        } else {
          setAlert({
            message: t(data.message || "Save failed"),
            severity: "error",
          });
        }
      })
      .catch((e) => {
        console.error(e);
        setAlert({
          message: t("Save failed"),
          severity: "error",
        });
      })
      .finally(() => {
        setProcessing(false);
      });
  }, [model, history, t, loadModel]);

  const handleSaveArea = useCallback(
    (areaSchedule) => {
      const newModel = { ...model };
      const idx = newModel.areas.findIndex(
        (area) => area.areaId === areaSchedule.areaId
      );
      if (idx === -1) {
        newModel.areas = [...newModel.areas, areaSchedule];
      } else {
        newModel.areas = [...newModel.areas];
        newModel.areas[idx] = areaSchedule;
      }
      setModel(newModel);
      setOpenModal(false);
    },
    [model]
  );

  const handleDeleteArea = useCallback(() => {
    setOpenModal(false);
    if (!editAreaId) {
      return;
    }
    const newModel = { ...model };
    newModel.areas = model.areas.filter((area) => area.areaId !== editAreaId);
    setModel(newModel);
    setEditAreaId("");
  }, [model, editAreaId]);

  useEffect(() => {
    loadModel();
  }, [loadModel]);

  return (
    <GridContainer>
      <GridItem xs={12}>
        <Card>
          <CardHeader color="primary">
            <GridItem xs={12} container>
              <h4>
                {model._id === "new"
                  ? t("Add Schedule")
                  : `${t("Schedule")}: ${model.title}`}
              </h4>
            </GridItem>
          </CardHeader>
          <CardBody>
            <GridContainer>
              {loading ? (
                <CustomLoader />
              ) : (
                <React.Fragment>
                  <GridItem xs={12}>
                    <Alert alert={alert} onClose={() => setAlert(null)}></Alert>
                  </GridItem>
                  <GridItem xs={12} md={6} container>
                    <GridItem xs={12}>
                      <CustomTextField
                        id="input-title"
                        label={t("Title")}
                        value={model.title}
                        onChange={(value) =>
                          setModel({ ...model, title: value })
                        }
                      />
                    </GridItem>
                    <GridItem xs={12}>
                      <CustomTextField
                        id="input-description"
                        label={t("Description")}
                        multiline
                        value={model.description}
                        onChange={(value) =>
                          setModel({ ...model, description: value })
                        }
                      />
                    </GridItem>
                    <GridItem xs={12}>
                      <SelectWithLabel
                        id="select-is-special"
                        label={t('Special Date')}
                        itemData={[{
                          id: 1,
                          value: true,
                          text: 'Yes'
                        }, {
                          id: 2,
                          value: false,
                          text: 'No'
                        }]}
                        value={model.isSpecial}
                        onChange={(value) =>
                          setModel({ ...model, isSpecial: value })
                        }
                      />
                    </GridItem>
                  </GridItem>
                  <GridItem xs={12} md={6} container>
                    <GridItem xs={12}>
                      <CustomTextField
                        id="input-end-time"
                        inputProps={{ type: "number" }}
                        label={t("End Time Margin (Hours))")}
                        value={model.endTimeMargin}
                        onChange={(value) =>
                          setModel({ ...model, endTimeMargin: value })
                        }
                      />
                    </GridItem>
                    <GridItem xs={12}>
                      <Box pt={2}>
                        <DateRangePicker
                          defaultStartDate={model.startDate}
                          defaultEndDate={model.endDate}
                          exactDate
                          onChange={(start, end) => {
                            const scheduleData = { ...model };
                            if (scheduleData.areas) {
                              scheduleData.areas.forEach((a) => {
                                if (a.periods) {
                                  a.periods.forEach((p) => {
                                    p.startDate = start;
                                    p.endDate = end;
                                  });
                                }
                              });
                            }
                            setModel({
                              ...scheduleData,
                              startDate: start,
                              endDate: end,
                            });
                          }}
                        />
                      </Box>
                    </GridItem>
                  </GridItem>
                  <GridItem xs={12}>
                    <Box mt={3}>
                      <ScheduleTable
                        model={model}
                        onAddArea={() => {
                          setEditAreaId("");
                          setOpenModal(true);
                        }}
                        onEditArea={(areaId) => {
                          setEditAreaId(areaId);
                          setOpenModal(true);
                        }}
                        onChange={(newModel) => setModel(newModel)}
                        areas={areas}
                      />
                    </Box>
                  </GridItem>
                </React.Fragment>
              )}
            </GridContainer>
          </CardBody>
          <CardFooter>
            <GridItem xs={12} container direction="row-reverse">
              <Box>
                <Button variant="contained" onClick={history.goBack}>
                  <FormatListBulletedIcon />
                  {t("Back")}
                </Button>
              </Box>
              <Box mr={2}>
                <Button
                  color="primary"
                  variant="contained"
                  disabled={processing}
                  onClick={saveModel}
                >
                  <SaveIcon />
                  {t("Save")}
                </Button>
              </Box>
            </GridItem>
          </CardFooter>
        </Card>
        <AreaModal
          open={openModal}
          size="sm"
          areas={areas}
          editAreaId={editAreaId}
          value={model}
          onClose={() => setOpenModal(false)}
          onDelete={handleDeleteArea}
          onChange={handleSaveArea}
        />
      </GridItem>
    </GridContainer>
  );
};

ScheduleEdit.propTypes = {
  match: PropTypes.object,
  history: PropTypes.object,
};

export default ScheduleEdit;
