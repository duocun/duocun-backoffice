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

import { Button } from "@material-ui/core";
import IconButton from "@material-ui/core/IconButton";
import Alert from "@material-ui/lab/Alert";

import AddCircleOutlineIcon from "@material-ui/icons/AddCircleOutline";
import EditIcon from "@material-ui/icons/Edit";
import DeleteIcon from "@material-ui/icons/Delete";

import ConfirmDialog from "components/ConfirmDialog/ConfirmDialog";

import { getQueryParam } from "helper/index";
import FlashStorage from "services/FlashStorage";
import ApiPageService from "services/api/ApiPageService";
import { Link } from "react-router-dom";

const useStyles = makeStyles(() => ({
  table: {
    minWidth: 750,
    ": th td": {
      cursor: "pointer"
    }
  }
}));

export default function ListPages({ location }) {
  const { t } = useTranslation();
  const classes = useStyles();
  const [loading, setLoading] = useState(true);
  const [docs, setDocs] = useState([]);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [page, setPage] = useState(
    getQueryParam(location, "page")
      ? parseInt(getQueryParam(location, "page"))
      : 0
  );
  const [totalRows, setTotalRows] = useState(0);
  // const [sort, setSort] = useState(["_id", 1]);
  const sort = ["_id", 1];
  const [processing, setProcessing] = useState(false);
  const [removeId, setRemoveId] = useState("");
  const [modalOpen, setModalOpen] = useState(false);
  const [alert, setAlert] = useState(
    FlashStorage.get("PAGE_ALERT") || { message: "", severity: "info" }
  );
  const removeAlert = () => {
    setAlert({
      message: "",
      severity: "info"
    });
  };
  const updateData = () => {
    ApiPageService.getPageList(page, rowsPerPage, [sort])
      .then(({ data }) => {
        if (data.code === "success") {
          setDocs(data.data);
          setTotalRows(data.count);
        } else {
          setAlert({
            message: "Cannot load data",
            severity: "error"
          });
        }
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
      setRemoveId("");
      return;
    }
    setProcessing(true);
    ApiPageService.deletePage(removeId)
      .then(({ data }) => {
        if (data.code === "success") {
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
        setRemoveId("");
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
                <h4>{t("Static Page")}</h4>
              </GridItem>
              <GridItem
                xs={12}
                lg={6}
                container
                direction="row-reverse"
                alignItems="center"
              >
                <Button href="pages/new" variant="contained" color="default">
                  <AddCircleOutlineIcon />
                  {t("Add New Page")}
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
                    aria-label="Page Table"
                    size="small"
                  >
                    <TableHead>
                      <TableRow>
                        <TableCell>#</TableCell>
                        <TableCell>{t("Title")}</TableCell>
                        <TableCell>{t("Slug")}</TableCell>
                        <TableCell>{t("Status")}</TableCell>
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
                        (docs.length > 0 ? (
                          docs.map((doc, idx) => (
                            <TableRow key={doc._id}>
                              <TableCell>
                                {page * rowsPerPage + idx + 1}
                              </TableCell>
                              <TableCell>
                                <Link to={`pages/${doc._id}`}>{doc.title}</Link>
                              </TableCell>
                              <TableCell>{doc.slug}</TableCell>
                              <TableCell>
                                {t((doc.status || "").toUpperCase())}
                              </TableCell>
                              <TableCell>
                                <IconButton
                                  disabled={processing}
                                  href={`pages/${doc._id}`}
                                >
                                  <EditIcon />
                                </IconButton>
                                <IconButton
                                  disabled={processing}
                                  onClick={() => {
                                    setModalOpen(true);
                                    setRemoveId(doc._id);
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
              />
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

ListPages.propTypes = {
  location: PropTypes.object
};
