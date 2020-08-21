import React, { useState, useEffect, useContext, useCallback } from "react";
import PropTypes from "prop-types";
import { useTranslation } from "react-i18next";
import { makeStyles } from "@material-ui/core/styles";
import { Link } from "react-router-dom";

import GridContainer from "components/Grid/GridContainer.js";
import GridItem from "components/Grid/GridItem.js";

import Card from "components/Card/Card.js";
import CardHeader from "components/Card/CardHeader.js";
import CardBody from "components/Card/CardBody.js";
import CardFooter from "components/Card/CardFooter.js";

import Table from "@material-ui/core/Table";
import TableBody from "@material-ui/core/TableBody";
import TableCell from "@material-ui/core/TableCell";
import TableContainer from "@material-ui/core/TableContainer";
import TableHead from "@material-ui/core/TableHead";
import TablePagination from "components/Table/TablePagniation.js";
import TableRow from "@material-ui/core/TableRow";
import TableSortLabel from "@material-ui/core/TableSortLabel";
import IconButton from "@material-ui/core/IconButton";
import EditIcon from "@material-ui/icons/Edit";
import CheckIcon from "@material-ui/icons/Check";
import CloseIcon from "@material-ui/icons/Close";
import AddCircleOutlineIcon from "@material-ui/icons/AddCircleOutline";
import LocalMallIcon from "@material-ui/icons/LocalMall";
import ToggleOffIcon from "@material-ui/icons/ToggleOff";
import ToggleOnIcon from "@material-ui/icons/ToggleOn";
import Avatar from "@material-ui/core/Avatar";
import Alert from "@material-ui/lab/Alert";
import TableBodySkeleton from "components/Table/TableBodySkeleton";
import Searchbar from "components/Searchbar/Searchbar";
import Tooltip from "@material-ui/core/Tooltip";

import InputLabel from "@material-ui/core/InputLabel";
import MenuItem from "@material-ui/core/MenuItem";
// import FormHelperText from '@material-ui/core/FormHelperText';
import FormControl from "@material-ui/core/FormControl";
import Select from "@material-ui/core/Select";
import { Button, Box } from "@material-ui/core";

import ApiCategoryService from "services/api/ApiCategoryService";
import ApiProductService from "services/api/ApiProductService";
import { getQueryParam } from "helper/index";
import FlashStorage from "services/FlashStorage";
import AuthContext from "shared/AuthContext";
import RoleContext from "shared/RoleContext";
import { hasRole } from "models/account";
import { RESOURCES } from "models/account";
import { PERMISSIONS } from "models/account";

const useStyles = makeStyles(theme => ({
  table: {
    minWidth: 750
  },
  formControl: {
    margin: theme.spacing(1),
    minWidth: 120
  },
  selectEmpty: {
    marginTop: theme.spacing(2)
  }
}));

// const defaultProduct = {
//   name: "",
//   description: "",
//   category: { _id: "", name: "" }
// };

export default function Product({ location }) {
  const { t } = useTranslation();
  const classes = useStyles();
  // states related to list and pagniation
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(
    getQueryParam(location, "page")
      ? parseInt(getQueryParam(location, "page"))
      : 0
  );
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [totalRows, setTotalRows] = useState(0);
  const [query, setQuery] = useState(getQueryParam(location, "search") || "");
  const [sort, setSort] = useState(["_id", 1]);

  // set model
  // const [model, setModel] = useState(defaultProduct);
  const updateData = useCallback(type => {
    const params = { type };
    ApiProductService.getProductList(page, rowsPerPage, query, params, [
      sort
    ]).then(({ data }) => {
      setProducts(data.data);
      setTotalRows(data.count);
      setLoading(false);
    });
  },[page, query, rowsPerPage, sort]);

  // type
  const [productType, setType] = useState("G"); // grocery
  const handleTypeChange = type => {
    setType(type);
    updateData(type);
  };

  // categories
  const [categories, setCategories] = useState([]);


  const handleCategoryChange = useCallback(
    (catId, productType, row) => {
      removeAlert();
      setProcessing(true);
      ApiProductService.saveProduct({ ...row, categoryId: catId })
        .then(({ data }) => {
          if (data.code === "success") {
            setAlert({
              message: t("Saved successfully"),
              severtiy: "success"
            });
            updateData(productType);
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
            message: t("Save exception"),
            severity: "error"
          });
        })
        .finally(() => {
          setProcessing(false);
        });
    },
    [updateData, t]
  );

  // permissions
  const user = useContext(AuthContext);
  const roleData = useContext(RoleContext);
  const canAdd = hasRole(
    user,
    { resource: RESOURCES.PRODUCT, permission: PERMISSIONS.CREATE },
    roleData
  );
  const canEdit = hasRole(
    user,
    { resource: RESOURCES.PRODUCT, permission: PERMISSIONS.UPDATE },
    roleData
  );
  // const canDelete = hasRole(
  //   user,
  //   { resource: RESOURCES.PRODUCT, permission: PERMISSIONS.DELETE },
  //   roleData
  // );

  // states related to processing
  const [alert, setAlert] = useState(
    FlashStorage.get("PRODUCT_ALERT") || { message: "", severity: "info" }
  );
  const [processing, setProcessing] = useState(false);

  const onChangeProductStatus = (rowId, currentStatus) => {
    ApiProductService.changeStatus(rowId, currentStatus).then(
      updateData(productType)
    );
  };

  useEffect(() => {
    ApiCategoryService.getCategories({ type: "G" }).then(({ data }) => {
      const cats = data.data;
      setCategories(cats);
    });
  }, []);

  const toggleSort = fieldName => {
    // sort only one field
    if (sort && sort[0] === fieldName) {
      setSort([fieldName, sort[1] === 1 ? -1 : 1]);
    } else {
      setSort([fieldName, 1]);
    }
  };
  const removeAlert = () => {
    setAlert({
      message: "",
      severity: "info"
    });
  };

  // change status
  const toggleFeature = (productId, type) => {
    removeAlert();
    setProcessing(true);
    ApiProductService.toggleFeature(productId)
      .then(({ data }) => {
        if (data.code === "success") {
          setAlert({
            message: t("Saved successfully"),
            severtiy: "success"
          });
          updateData(type);
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
  const renderRows = rows => {
    if (!rows.length) {
      return (
        <TableRow>
          <TableCell align="center" colSpan={9} size="medium">
            {t("No data to display")}
          </TableCell>
        </TableRow>
      );
    }
    return (
      <React.Fragment>
        {rows.map((row, idx) => (
          <TableRow key={idx}>
            <TableCell>{page * rowsPerPage + idx + 1}</TableCell>
            <TableCell>
              <Avatar
                variant="square"
                alt="product"
                src={
                  row.pictures && row.pictures[0] ? row.pictures[0].url : "#"
                }
              >
                <LocalMallIcon></LocalMallIcon>
              </Avatar>
            </TableCell>
            <TableCell>{row.name}</TableCell>
            <TableCell>
              <FormControl className={classes.formControl}>
                {/* <InputLabel id="category-select-label">Category</InputLabel> */}
                <Select
                  required
                  labelId="category-select-label"
                  id="category-select"
                  disabled={!canEdit}
                  value={row.categoryId}
                  onChange={e =>
                    handleCategoryChange(e.target.value, productType, row)
                  }
                >
                  {categories &&
                    categories.length > 0 &&
                    categories.map(cat => (
                      <MenuItem key={cat._id} value={cat._id}>
                        {cat.name}
                      </MenuItem>
                    ))}
                </Select>
              </FormControl>
            </TableCell>
            <TableCell>{row.price}</TableCell>
            <TableCell>{row.cost}</TableCell>
            <TableCell>{row.status}</TableCell>
            <TableCell>
              <IconButton
                disabled={processing}
                onClick={() => {
                  toggleFeature(row._id, productType);
                }}
              >
                {row.featured ? (
                  <CheckIcon color="primary"></CheckIcon>
                ) : (
                  <CloseIcon color="error"></CloseIcon>
                )}
              </IconButton>
            </TableCell>
            <TableCell>
              {canEdit && (
                <Tooltip title="修改">
                  <IconButton
                    aria-label="edit"
                    component={Link}
                    to={`products/${row._id}`}
                  >
                    <EditIcon />  
                  </IconButton>
                </Tooltip>
              )}
              {canEdit && (
                <Tooltip title="上架/下架">
                  <IconButton
                    size="medium"
                    aria-label="status"
                    disabled={processing}
                    onClick={() => onChangeProductStatus(row._id, row.status)}
                  >
                    {row.status === "A" ? <ToggleOffIcon /> : <ToggleOnIcon />}
                  </IconButton>
                </Tooltip>
              )}
            </TableCell>
          </TableRow>
        ))}
      </React.Fragment>
    );
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

  useEffect(() => {
    updateData(productType);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [page, rowsPerPage, sort]);

  return (
    <div>
      <GridContainer>
        <GridItem xs={12}>
          <Card>
            <CardHeader color="primary">
              <GridContainer>
                <GridItem xs={12} lg={6}>
                  <h4>{t("Products")}</h4>
                </GridItem>
                <GridItem xs={12} lg={6} align="right">
                  {canAdd && (
                    <Box mr={2} style={{ display: "inline-block" }}>
                      <Button
                        component={Link}
                        variant="contained"
                        color="default"
                        to="products/new"
                      >
                        <AddCircleOutlineIcon />
                        {t("New Product")}
                      </Button>
                    </Box>
                  )}
                  <FormControl className={classes.formControl}>
                    <InputLabel id="type-select-label">{t("Type")}</InputLabel>
                    <Select
                      required
                      labelId="type-select-label"
                      id="type-select"
                      value={productType}
                      onChange={e => handleTypeChange(e.target.value)}
                    >
                      <MenuItem value={"F"}>{t("Food")}</MenuItem>
                      <MenuItem value={"G"}>{t("Grocery")}</MenuItem>
                    </Select>
                  </FormControl>
                  <Searchbar
                    onChange={e => {
                      const { target } = e;
                      setQuery(target.value);
                    }}
                    onSearch={() => {
                      setLoading(true);
                      if (page === 0) {
                        updateData(productType);
                      } else {
                        setPage(0);
                      }
                    }}
                  />
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
                      aria-label="Product Table"
                      size="small"
                    >
                      <TableHead>
                        <TableRow>
                          <TableCell>#</TableCell>
                          <TableCell>{t("Image")}</TableCell>
                          <TableCell
                            onClick={() => {
                              toggleSort("name");
                            }}
                            style={{ cursor: "pointer" }}
                          >
                            {t("Product Name")}
                            {renderSort("name")}
                          </TableCell>
                          <TableCell>
                            <TableCell
                              onClick={() => {
                                toggleSort("category");
                              }}
                              style={{ cursor: "pointer" }}
                            >
                              {t("Category")}
                              {renderSort("category")}
                            </TableCell>
                          </TableCell>
                          <TableCell
                            onClick={() => {
                              toggleSort("price");
                            }}
                            style={{ cursor: "pointer" }}
                          >
                            {t("Price")}
                            {renderSort("price")}
                          </TableCell>
                          <TableCell
                            onClick={() => {
                              toggleSort("cost");
                            }}
                            style={{ cursor: "pointer" }}
                          >
                            {t("Cost")}
                            {renderSort("cost")}
                          </TableCell>
                          <TableCell
                            onClick={() => {
                              toggleSort("status");
                            }}
                            style={{ cursor: "pointer" }}
                          >
                            {t("Status")}
                            {renderSort("status")}
                          </TableCell>

                          <TableCell
                            onClick={() => {
                              toggleSort("featured");
                            }}
                            style={{ cursor: "pointer" }}
                          >
                            {t("Featured")}
                            {renderSort("featured")}
                          </TableCell>
                          <TableCell>{t("Actions")}</TableCell>
                        </TableRow>
                      </TableHead>
                      <TableBody>
                        {loading ? (
                          <TableBodySkeleton
                            colCount={9}
                            rowCount={rowsPerPage}
                          />
                        ) : (
                          renderRows(products)
                        )}
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
      </GridContainer>
    </div>
  );
}

Product.propTypes = {
  location: PropTypes.object
};
