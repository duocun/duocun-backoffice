import React, { useState, useEffect, useCallback } from "react";
import { useTranslation } from "react-i18next";
import GridContainer from "components/Grid/GridContainer";
import GridItem from "components/Grid/GridItem.js";
import {
  Box,
  Card,
  TableContainer,
  Table,
  TableHead,
  TableBody,
  TableRow,
  TableCell,
  Button,
  makeStyles
} from "@material-ui/core";
import Checkbox from "components/CustomInput/CustomCheckbox";
import CardHeader from "components/Card/CardHeader";
import CardBody from "components/Card/CardBody";
import CardFooter from "components/Card/CardFooter";
import {
  ROLES,
  ROLE_ENUM,
  RESOURCES,
  RESOURCES_PERMISSIONS,
  ROLES_PERMISSIONS
} from "models/account";
import FormGroup from "@material-ui/core/FormGroup";
import _ from "lodash";
import { arrayToggleElem } from "helper/index";
import SaveIcon from "@material-ui/icons/Save";
import FormatListBulletedIcon from "@material-ui/icons/FormatListBulleted";
import CustomLoader from "components/CustomLoader/CustomLoader";
import * as ApiRoleService from "services/api/ApiRoleService";
import Alert from "components/CustomAlert/CustomAlert";
import { enumLikeObj } from "helper/index";

const getPermissionRule = (roleModel, role, resource) => {
  return _.get(roleModel, `${ROLE_ENUM[String(role)]}.${resource}`, []);
};

const setPermissionRule = (roleModel, role, resource, permissions) => {
  _.set(roleModel, `${ROLE_ENUM[String(role)]}.${resource}`, permissions);
};

const hasPermission = (model, role, resource, permission) => {
  return getPermissionRule(model, role, resource).includes(permission);
};

const togglePermission = (model, role, resource, permission) => {
  const newModel = { ...model };
  const perms = [...getPermissionRule(model, role, resource)];
  arrayToggleElem(perms, permission);
  setPermissionRule(newModel, role, resource, perms);
  return newModel;
};

const Roles = ({ history }) => {
  const { t } = useTranslation();
  const classes = useStyles();
  const [model, setModel] = useState(null);
  const [loading, setLoading] = useState(true);
  const [processing, setProcessing] = useState(false);
  const [alert, setAlert] = useState(null);

  const loadModel = useCallback(() => {
    ApiRoleService.load()
      .then(({ data }) => {
        if (data.code !== "success") {
          setAlert({ message: t("Cannot load data"), severity: "error" });
        } else {
          setModel(data.data);
        }
      })
      .catch(e => {
        console.error(e);
        setAlert({ message: t("Cannot load data"), severity: "error" });
      })
      .finally(() => {
        setLoading(false);
      });
  }, []);

  const saveModel = useCallback(data => {
    setProcessing(true);
    ApiRoleService.save(data)
      .then(({ data }) => {
        if (data.code !== "success") {
          setAlert({ message: t("Save failed"), severity: "error" });
        } else {
          setAlert({ message: t("Saved successfully"), severity: "success" });
          setModel(data.data);
        }
      })
      .catch(e => {
        console.error(e);
        setAlert({ message: t("Save failed"), severity: "error" });
      })
      .finally(() => {
        setProcessing(false);
      });
  }, []);

  useEffect(() => {
    loadModel();
  }, []);

  return (
    <GridContainer>
      <GridItem xs={12}>
        <Card>
          <CardHeader color="primary">
            <h4>{t("Roles & Permissions")}</h4>
          </CardHeader>
          <CardBody>
            <Alert alert={alert} onClose={() => setAlert(null)} />
            {loading || !model ? (
              <CustomLoader />
            ) : (
              <TableContainer>
                <Table aria-label="role permission table" size="small">
                  <TableHead>
                    <TableRow>
                      <TableCell>Role</TableCell>
                      {_.map(RESOURCES, (resource, key) => (
                        <TableCell key={`resource_${key}`}>
                          {resource}
                        </TableCell>
                      ))}
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {_.map(ROLES, (role, key) => (
                      <TableRow key={key}>
                        <TableCell>{role}</TableCell>
                        {_.map(RESOURCES, (resource, key) => (
                          <TableCell key={`${role}_${resource}_${key}`}>
                            {_.map(
                              RESOURCES_PERMISSIONS[resource],
                              (perm, key) => (
                                <FormGroup key={`${role}_${resource}_${key}`}>
                                  <Checkbox
                                    disabled={role === ROLES[1]}
                                    label={perm}
                                    checkboxProps={{
                                      color: "primary",
                                      className: classes.checkbox
                                    }}
                                    checked={hasPermission(
                                      model,
                                      role,
                                      resource,
                                      perm
                                    )}
                                    onChange={() => {
                                      setModel(
                                        togglePermission(
                                          model,
                                          role,
                                          resource,
                                          perm
                                        )
                                      );
                                    }}
                                  />
                                </FormGroup>
                              )
                            )}
                          </TableCell>
                        ))}
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </TableContainer>
            )}
          </CardBody>
          <CardFooter>
            <GridItem xs={12} container direction="row-reverse">
              <Box>
                <Button varaint="contained" onClick={history.goBack}>
                  <FormatListBulletedIcon />
                  {t("Back")}
                </Button>
              </Box>
              <Box mr={2}>
                <Button
                  color="primary"
                  variant="contained"
                  disabled={processing}
                  onClick={() => saveModel(model)}
                >
                  <SaveIcon />
                  {t("Save")}
                </Button>
              </Box>
            </GridItem>
          </CardFooter>
        </Card>
      </GridItem>
    </GridContainer>
  );
};

const useStyles = makeStyles(theme => ({
  checkbox: {
    margin: 0,
    padding: 0
  }
}));

export default Roles;
