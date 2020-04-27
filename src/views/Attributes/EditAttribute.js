import React, { useState, useEffect } from "react";
import PropTypes from "prop-types";
import { useTranslation } from "react-i18next";

import GridContainer from "components/Grid/GridContainer.js";
import GridItem from "components/Grid/GridItem.js";
import Box from "@material-ui/core/Box";

import Card from "components/Card/Card.js";
import CardHeader from "components/Card/CardHeader.js";
import CardBody from "components/Card/CardBody.js";

import Table from "@material-ui/core/Table";
import TableBody from "@material-ui/core/TableBody";
import TableCell from "@material-ui/core/TableCell";
import TableContainer from "@material-ui/core/TableContainer";
import TableHead from "@material-ui/core/TableHead";
import TableRow from "@material-ui/core/TableRow";
import TableBodySkeleton from "components/Table/TableBodySkeleton";

import TextField from "@material-ui/core/TextField";
import Skeleton from "@material-ui/lab/Skeleton";
import Alert from "@material-ui/lab/Alert";
import CustomInput from "components/CustomInput/CustomInput";
import Button from "@material-ui/core/Button";
import IconButton from "@material-ui/core/IconButton";

import AddCircleOutlineIcon from "@material-ui/icons/AddCircleOutline";
import SaveIcon from "@material-ui/icons/Save";
import EditIcon from "@material-ui/icons/Edit";
import DeleteIcon from "@material-ui/icons/Delete";
import CancelIcon from "@material-ui/icons/Cancel";
import FormatListBulletedIcon from "@material-ui/icons/FormatListBulleted";

import ApiAttributeService from "services/api/ApiAttributeService";
import FlashStorage from "services/FlashStorage";

const defaultAttributeState = {
  id: "new",
  name: "",
  nameEN: "",
  values: []
};

const defaultValueState = {
  name: "",
  nameEN: ""
};

const EditRow = ({ row, onSave, onCancel, ...extraProps }) => {
  const [model, setModel] = useState(row || defaultValueState);
  return (
    <TableRow {...extraProps}>
      <TableCell></TableCell>
      <TableCell>
        <TextField
          inputProps={{
            value: model.name,
            onChange: e => setModel({ ...model, name: e.target.value })
          }}
        />
      </TableCell>
      <TableCell>
        <TextField
          inputProps={{
            value: model.nameEN,
            onChange: e => setModel({ ...model, nameEN: e.target.value })
          }}
        />
      </TableCell>
      <TableCell>
        <IconButton onClick={() => onSave(model, row)}>
          <SaveIcon />
        </IconButton>
        <IconButton onClick={() => onCancel(model, row)}>
          <CancelIcon />
        </IconButton>
      </TableCell>
    </TableRow>
  );
};

export default function EditAttribute({ match, history }) {
  const { t } = useTranslation();
  const [loading, setLoading] = useState(true);
  const [editIndex, setEditIndex] = useState(-1);
  const [adding, setAdding] = useState(false);
  const [model, setModel] = useState(defaultAttributeState);
  const [processing, setProcessing] = useState(false);
  const [alert, setAlert] = useState(
    FlashStorage.get("ATTRIBUTE_ALERT") || { message: "", severity: "info" }
  );
  const addNewRow = row => {
    if (row.name) {
      const values = [...model.values];
      values.push(row);
      setModel({ ...model, values });
    }
    setAdding(false);
  };

  const updateRow = (row, index) => {
    if (row.name) {
      const values = [...model.values];
      values[index] = row;
      setModel({ ...model, values });
    }
    setEditIndex(-1);
  };

  const removeRow = index => {
    const values = [...model.values];
    values.splice(index, 1);
    setModel({ ...model, values });
  };

  const saveAttribute = () => {
    removeAlert();
    setProcessing(true);
    ApiAttributeService.saveAttribute(model)
      .then(({ data }) => {
        if (data.success) {
          const newAlert = {
            message: t("Saved successfully"),
            severity: "success"
          };
          if (model.id === "new") {
            FlashStorage.set("ATTRIBUTE_ALERT", newAlert);
            history.push("../attributes");
          } else {
            setAlert(newAlert);
            setModel({ ...data.data, id: data.data._id });
          }
        } else {
          setAlert({
            message: t("Save failed"),
            severity: "error"
          });
        }
      })
      .catch(e => {
        console.error(e);
        setAlert({
          message: t("Save failed"),
          severity: "error"
        });
      })
      .finally(() => {
        setProcessing(false);
      });
  };

  const removeAlert = () => {
    setAlert({
      message: "",
      severity: "info"
    });
  };

  useEffect(() => {
    /* eslint eqeqeq: 0 */
    if (match.params.id && match.params.id != "new") {
      ApiAttributeService.getAttribute(match.params.id)
        .then(({ data }) => {
          if (data.success) {
            setModel({ ...data.data, id: data.data._id });
            setLoading(false);
          } else {
            setAlert({
              message: t("Data not found"),
              severity: "error"
            });
          }
        })
        .catch(e => {
          console.error(e);
          setAlert({
            message: t("Data not found"),
            severity: "error"
          });
        });
    } else {
      setLoading(false);
    }
    // since params.id and t are very unlikely to change
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <GridContainer>
      <GridItem xs={12}>
        <Card>
          <CardHeader color="primary">
            {loading && <h4>{t("Attribute")}</h4>}
            {!loading && (
              <h4>
                {model.id && model.id !== "new"
                  ? t("Edit Attribute") + ": " + model.name
                  : t("Add Attribute")}
              </h4>
            )}
          </CardHeader>
          <CardBody>
            <GridContainer>
              {!!alert.message && (
                <GridItem xs={12}>
                  <Alert severity={alert.severity} onClose={removeAlert}>
                    {alert.message}
                  </Alert>
                </GridItem>
              )}
              {loading ? (
                <React.Fragment>
                  <GridItem xs={12} lg={4}>
                    <Skeleton height={48} />
                  </GridItem>
                  <GridItem xs={12} lg={4}>
                    <Skeleton height={48} />
                  </GridItem>
                </React.Fragment>
              ) : (
                <React.Fragment>
                  <GridItem xs={12} lg={4}>
                    <CustomInput
                      labelText={t("Attribute Name (Chinese)")}
                      id="attribute-name"
                      formControlProps={{
                        fullWidth: true
                      }}
                      inputProps={{
                        value: model.name,
                        onChange: e => {
                          setModel({ ...model, name: e.target.value });
                        }
                      }}
                    />
                  </GridItem>
                  <GridItem xs={12} lg={4}>
                    <CustomInput
                      labelText={t("Attribute Name (English)")}
                      id="attribute-name-en"
                      formControlProps={{
                        fullWidth: true
                      }}
                      inputProps={{
                        value: model.nameEN,
                        onChange: e => {
                          setModel({ ...model, nameEN: e.target.value });
                        }
                      }}
                    />
                  </GridItem>
                </React.Fragment>
              )}
              <GridItem
                xs={12}
                lg={4}
                container
                direction="row"
                alignItems="center"
              >
                <Box mr={2}>
                  <Button
                    variant="contained"
                    color="primary"
                    disabled={loading || processing}
                    onClick={saveAttribute}
                  >
                    <SaveIcon /> {t("Save")}
                  </Button>
                </Box>
                <Button variant="outlined" color="primary" href="../attributes">
                  <FormatListBulletedIcon /> {t("Back")}
                </Button>
              </GridItem>
              <GridItem
                xs={12}
                container
                direction="row-reverse"
                alignItems="center"
              >
                <Button
                  variant="contained"
                  disabled={loading || processing}
                  onClick={() => setAdding(true)}
                >
                  <AddCircleOutlineIcon /> {t("Add New Value")}
                </Button>
              </GridItem>
              <GridItem xs={12}>
                <TableContainer>
                  <Table size="small">
                    <TableHead>
                      <TableRow>
                        <TableCell>#</TableCell>
                        <TableCell>{t("Display Name (Chinese)")}</TableCell>
                        <TableCell>{t("Display Name (English)")}</TableCell>
                        <TableCell>{t("Actions")}</TableCell>
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      {loading ? (
                        <TableBodySkeleton colCount={4} />
                      ) : (
                        <React.Fragment>
                          {model.values && model.values.length > 0
                            ? model.values.map((value, index) => {
                                if (index === editIndex) {
                                  return (
                                    <EditRow
                                      row={value}
                                      key={index}
                                      onSave={e => updateRow(e, index)}
                                      onCancel={() => setEditIndex(-1)}
                                    />
                                  );
                                } else {
                                  return (
                                    <TableRow key={index}>
                                      <TableCell>{index + 1}</TableCell>
                                      <TableCell>{value.name}</TableCell>
                                      <TableCell>{value.nameEN}</TableCell>
                                      <TableCell>
                                        <IconButton
                                          onClick={() => setEditIndex(index)}
                                          disabled={processing}
                                        >
                                          <EditIcon />
                                        </IconButton>
                                        <IconButton
                                          onClick={() => removeRow(index)}
                                          disabled={processing}
                                        >
                                          <DeleteIcon />
                                        </IconButton>
                                      </TableCell>
                                    </TableRow>
                                  );
                                }
                              })
                            : !adding && (
                                <TableRow>
                                  <TableCell
                                    colSpan={4}
                                    align="center"
                                    size="medium"
                                  >
                                    {t("No data to display")}
                                  </TableCell>
                                </TableRow>
                              )}
                          {adding && (
                            <EditRow
                              key={0}
                              onSave={row => addNewRow(row)}
                              onCancel={() => setAdding(false)}
                            />
                          )}
                        </React.Fragment>
                      )}
                    </TableBody>
                  </Table>
                </TableContainer>
              </GridItem>
            </GridContainer>
          </CardBody>
        </Card>
      </GridItem>
    </GridContainer>
  );
}

EditRow.propTypes = {
  row: PropTypes.shape({
    name: PropTypes.string,
    nameEN: PropTypes.string
  }),
  onSave: PropTypes.func,
  onCancel: PropTypes.func
};

EditAttribute.propTypes = {
  match: PropTypes.shape({
    params: PropTypes.shape({
      id: PropTypes.string
    })
  }),
  history: PropTypes.object
};
