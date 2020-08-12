import React, { useState, useEffect } from "react";
import PropTypes from "prop-types";
import { useTranslation } from "react-i18next";
import { makeStyles } from "@material-ui/core/styles";

import { Link } from "@material-ui/core";

import GridContainer from "components/Grid/GridContainer.js";
import GridItem from "components/Grid/GridItem.js";

import Card from "components/Card/Card.js";
import CardHeader from "components/Card/CardHeader.js";
import CardBody from "components/Card/CardBody.js";
import CardFooter from "components/Card/CardFooter.js";

import TableContainer from "@material-ui/core/TableContainer";
import Table from "@material-ui/core/Table";
import TableHead from "@material-ui/core/TableHead";
import TableBody from "@material-ui/core/TableBody";
import TableRow from "@material-ui/core/TableRow";
import TableCell from "@material-ui/core/TableCell";
import TablePagination from "components/Table/TablePagniation.js";
import TableSortLabel from "@material-ui/core/TableSortLabel";
import TableBodySkeleton from "components/Table/TableBodySkeleton";

import Button from "@material-ui/core/Button";
import IconButton from "@material-ui/core/IconButton";
import Alert from "@material-ui/lab/Alert";

import EditIcon from "@material-ui/icons/Edit";
import DeleteIcon from "@material-ui/icons/Delete";
// import OpenWithIcon from "@material-ui/icons/OpenWith";
import AddCircleOutlineIcon from "@material-ui/icons/AddCircleOutline";

import ConfirmDialog from "components/ConfirmDialog/ConfirmDialog";

import ApiCategoryService from "services/api/ApiCategoryService";
import FlashStorage from "services/FlashStorage";
import { getQueryParam } from "helper/index";

const useStyles = makeStyles(() => ({
  table: {
    minWidth: 750
  }
}));

export default function ListCategories({ location }) {
  const { t } = useTranslation();
  const classes = useStyles();

  // states related to pagination
  const [rows, setRows] = useState([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [totalRows, setTotalRows] = useState(0);
  const [sort, setSort] = useState(["order", 1]);
  const parentId = getQueryParam(location, "parentId")
    ? parseInt(getQueryParam(location, "parentId"))
    : undefined;
  const [parents] = useState([]);
  // states related to processing
  const [alert, setAlert] = useState(
    FlashStorage.get("CATEGORY_ALERT") || { message: "", severity: "info" }
  );
  const [processing, setProcessing] = useState(false);
  const [modalOpen, setModalOpen] = useState(false);
  const [removeId, setRemoveId] = useState(null);

  // const structurePanelRef = useRef();

  const removeAlert = () => {
    setAlert({
      message: "",
      severity: "info"
    });
  };

  const updateRows = () => {
    ApiCategoryService.getCategoryList(page, rowsPerPage, parentId, [sort])
      .then(({ data }) => {
        setRows(data.data);
        setTotalRows(data.count);
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

  const renderCardTitle = () => {
    return (
      <React.Fragment>
        <h4 className={classes.cardTitleWhite}>{t("Categories")}</h4>
        {parents && parents.length > 0 && (
          <p className={classes.cardCategoryWhite}>
            {parents.map((parent, index) => {
              return (
                <React.Fragment key={index}>
                  <Link
                    href={`categories?parentId=${parent._id}`}
                    color="inherit"
                    underline="none"
                  >
                    {parent.name}
                  </Link>
                  {index !== parents.length - 1 && <span> / </span>}
                </React.Fragment>
              );
            })}
          </p>
        )}
      </React.Fragment>
    );
  };

  const onConfirmModal = value => {
    setModalOpen(false);
    if (!value) {
      setRemoveId(null);
      return;
    }
    setProcessing(true);
    ApiCategoryService.removeCategory(removeId)
      .then(({ data }) => {
        if (data.code === "success") {
          setAlert({
            message: "Removed successfully",
            severity: "success"
          });
          if (page === 0) {
            updateRows();
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
    updateRows();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [page, rowsPerPage, sort]);

  return (
    <GridContainer>
      <GridItem xs={12}>
        <Card>
          <CardHeader color="primary">
            <GridContainer>
              <GridItem xs={12} lg={6}>
                {renderCardTitle()}
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
                  href="categories/new"
                  disabled={processing}
                >
                  <AddCircleOutlineIcon />
                  {t("Add Category")}
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
                    aria-label="Category Table"
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
                          {t("Category Name (Chinese)")}
                          {renderSort("name")}
                        </TableCell>
                        <TableCell
                          onClick={() => {
                            toggleSort("nameEN");
                          }}
                          style={{ cursor: "pointer" }}
                        >
                          {t("Category Name (English)")}
                          {renderSort("nameEN")}
                        </TableCell>
                        {/* <TableCell
                          onClick={() => {
                            toggleSort("order");
                          }}
                          style={{ cursor: "pointer" }}
                        >
                          {t("Display Order")}
                          {renderSort("order")}
                        </TableCell> */}
                        <TableCell>{t("Actions")}</TableCell>
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      {loading && (
                        <TableBodySkeleton
                          colCount={5}
                          rowCount={rowsPerPage}
                        />
                      )}
                      {!loading &&
                        (rows.length > 0 ? (
                          rows.map((row, index) => (
                            <TableRow key={index}>
                              <TableCell>
                                {page * rowsPerPage + index + 1}
                              </TableCell>
                              <TableCell>{row.name}</TableCell>
                              <TableCell>{row.nameEN}</TableCell>
                              {/* <TableCell>{row.order}</TableCell> */}
                              <TableCell>
                                {/* <IconButton disabled={processing}>
                                  <OpenWithIcon></OpenWithIcon>
                                </IconButton> */}
                                <IconButton
                                  disabled={processing}
                                  href={`categories/${row._id}`}
                                >
                                  <EditIcon></EditIcon>
                                </IconButton>
                                <IconButton
                                  disabled={processing}
                                  onClick={() => {
                                    setModalOpen(true);
                                    setRemoveId(row._id);
                                  }}
                                >
                                  <DeleteIcon />
                                </IconButton>
                              </TableCell>
                            </TableRow>
                          ))
                        ) : (
                          <TableRow>
                            <TableCell align="center" colSpan={5} size="medium">
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
}

ListCategories.propTypes = {
  location: PropTypes.object
};
