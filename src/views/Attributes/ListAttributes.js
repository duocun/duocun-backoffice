import React, { useState, useEffect } from "react";
import PropTypes from "prop-types";
import { useTranslation } from "react-i18next";
import { makeStyles } from "@material-ui/core/styles";

import GridContainer from "components/Grid/GridContainer.js";
import GridItem from "components/Grid/GridItem.js";

import Card from "components/Card/Card.js";
import CardHeader from "components/Card/CardHeader.js";
import CardBody from "components/Card/CardBody.js";
import CardFooter from "components/Card/CardFooter.js";

import TableContainer from "@material-ui/core/TableContainer";
import Table from "@material-ui/core/Table";
import TableHead from "@material-ui/core/TableHead";
import TableRow from "@material-ui/core/TableRow";
import TableBody from "@material-ui/core/TableBody";
import TableCell from "@material-ui/core/TableCell";
import TablePagination from "components/Table/TablePagniation.js";
import TableBodySkeleton from "components/Table/TableBodySkeleton";
import TableSortLabel from "@material-ui/core/TableSortLabel";

import Button from "@material-ui/core/Button";
import IconButton from "@material-ui/core/IconButton";
import Alert from "@material-ui/lab/Alert";

import AddCircleOutlineIcon from "@material-ui/icons/AddCircleOutline";
import EditIcon from "@material-ui/icons/Edit";
import DeleteIcon from "@material-ui/icons/Delete";

import ConfirmDialog from "components/ConfirmDialog/ConfirmDialog";

import { getQueryParam } from "helper/index";
import ApiAttributeService from "services/api/ApiAttributeService";
import FlashStorage from "services/FlashStorage";

const useStyles = makeStyles(() => ({
  table: {
    minWidth: 750
  }
}));

const Attributes = ({ location }) => {
  const { t } = useTranslation();
  const classes = useStyles();
  // states related to pagination
  const [loading, setLoading] = useState(true);
  const [attributes, setAttributes] = useState([]);
  const [page, setPage] = useState(
    getQueryParam(location, "page")
      ? parseInt(getQueryParam(location, "page"))
      : 0
  );
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [totalRows, setTotalRows] = useState(0);
  const [sort, setSort] = useState(["_id", 1]);

  // states related to processing
  const [alert, setAlert] = useState(
    FlashStorage.get("ATTRIBUTE_ALERT") || { message: "", severity: "info" }
  );
  const [processing, setProcessing] = useState(false);
  const [modalOpen, setModalOpen] = useState(false);
  const [removeId, setRemoveId] = useState(null);

  const removeAlert = () => {
    setAlert({
      message: "",
      severity: "info"
    });
  };

  const toggleSort = fieldName => {
    // sort only one field
    if (sort && sort[0] === fieldName) {
      setSort([fieldName, sort[1] === 1 ? -1 : 1]);
    } else {
      setSort([fieldName, 1]);
    }
  };

  const renderSort = fieldName => {
    return (
      <TableSortLabel
        active={sort && sort[0] === fieldName}
        direction={sort && sort[1] === -1 ? "desc" : "asc"}
        onClick={() => {
          toggleSort(fieldName);
        }}
      ></TableSortLabel>
    );
  };

  const updateData = () => {
    ApiAttributeService.getAttributeList(page, rowsPerPage, [sort])
      .then(({ data }) => {
        setAttributes(data.data);
        setTotalRows(data.meta.count);
      })
      .catch(e => {
        console.error(e);
        setAlert({
          message: "Cannot load data",
          severity: "error"
        });
      })
      .finally(() => {
        setLoading(false);
      });
  };

  const onConfirmModal = value => {
    setModalOpen(false);
    if (!value) {
      setRemoveId(null);
      return;
    }
    setProcessing(true);
    ApiAttributeService.removeAttribute(removeId)
      .then(({ data }) => {
        if (data.success) {
          setAlert({
            message: "Removed successfully",
            severity: "success"
          });
          if (page === 0) {
            updateData();
          } else {
            setPage(0);
          }
        } else {
          setAlert({
            message: "Remove failed",
            severity: "error"
          });
        }
      })
      .catch(e => {
        console.error(e);
        setAlert({
          message: "Remove failed",
          severity: "error"
        });
      })
      .finally(() => {
        setRemoveId(null);
        setProcessing(false);
      });
  };

  useEffect(() => {
    updateData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [page, rowsPerPage, sort]);

  return (
    <GridContainer>
      <GridItem xs={12}>
        <Card>
          <CardHeader color="primary">
            <GridContainer>
              <GridItem xs={12} lg={6}>
                <h4>{t("Attributes")}</h4>
              </GridItem>
              <GridItem
                xs={12}
                lg={6}
                container
                direction="row-reverse"
                alignItems="center"
              >
                <Button
                  variant="contained"
                  color="default"
                  href="attributes/new"
                  disabled={processing}
                >
                  <AddCircleOutlineIcon />
                  {t("Add Attribute")}
                </Button>
              </GridItem>
            </GridContainer>
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
              <GridItem xs={12}>
                <TableContainer>
                  <Table
                    className={classes.table}
                    aria-label="Attribute Table"
                    size="small"
                  >
                    <TableHead>
                      <TableRow>
                        <TableCell>#</TableCell>
                        <TableCell
                          onClick={() => {
                            toggleSort("name");
                          }}
                          style={{ cursor: "pointer" }}
                        >
                          {t("Attribute Name (Chinese)")}
                          {renderSort("name")}
                        </TableCell>
                        <TableCell
                          onClick={() => {
                            toggleSort("nameEN");
                          }}
                          style={{ cursor: "pointer" }}
                        >
                          {t("Attribute Name (English)")}
                          {renderSort("nameEN")}
                        </TableCell>
                        <TableCell>{t("Actions")}</TableCell>
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      {loading && (
                        <TableBodySkeleton
                          colCount={4}
                          rowCount={rowsPerPage}
                        />
                      )}
                      {!loading &&
                        (attributes.length > 0 ? (
                          attributes.map((attribute, index) => (
                            <TableRow key={index}>
                              <TableCell>
                                {page * rowsPerPage + index + 1}
                              </TableCell>
                              <TableCell>{attribute.name}</TableCell>
                              <TableCell>{attribute.nameEN}</TableCell>
                              <TableCell>
                                <IconButton
                                  disabled={processing}
                                  href={`attributes/${attribute._id}`}
                                >
                                  <EditIcon />
                                </IconButton>
                                <IconButton
                                  disabled={processing}
                                  onClick={() => {
                                    setModalOpen(true);
                                    setRemoveId(attribute._id);
                                  }}
                                >
                                  <DeleteIcon />
                                </IconButton>
                              </TableCell>
                            </TableRow>
                          ))
                        ) : (
                          <TableRow>
                            <TableCell align="center" colSpan={4} size="medium">
                              {t("No data to display")}
                            </TableCell>
                          </TableRow>
                        ))}
                    </TableBody>
                  </Table>
                </TableContainer>
              </GridItem>
            </GridContainer>
          </CardBody>
          <CardFooter>
            {!loading && (
              <TablePagination
                rowsPerPage={rowsPerPage}
                page={page}
                onChangePage={(e, newPage) => setPage(newPage)}
                count={totalRows}
                onChangeRowsPerPage={({ target }) => {
                  setPage(0);
                  setRowsPerPage(target.value);
                }}
              ></TablePagination>
            )}
          </CardFooter>
        </Card>
      </GridItem>
      <ConfirmDialog
        open={modalOpen}
        title={t("Confirm")}
        content={t("Do you want to remove selected item?")}
        onClose={onConfirmModal}
      />
    </GridContainer>
  );
};

Attributes.propTypes = {
  location: PropTypes.object
};

export default Attributes;
