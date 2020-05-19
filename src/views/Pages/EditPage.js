import React, { useState, useEffect } from "react";
import PropTypes from "prop-types";
import { useTranslation } from "react-i18next";
import { makeStyles } from "@material-ui/core/styles";

import GridContainer from "components/Grid/GridContainer.js";
import GridItem from "components/Grid/GridItem.js";
import Box from "@material-ui/core/Box";

import Card from "components/Card/Card.js";
import CardHeader from "components/Card/CardHeader.js";
import CardBody from "components/Card/CardBody.js";

import Alert from "@material-ui/lab/Alert";
import FormLabel from "@material-ui/core/FormLabel";
import MenuItem from "@material-ui/core/MenuItem";
import Select from "@material-ui/core/Select";
import FormControl from "@material-ui/core/FormControl";
import InputLabel from "@material-ui/core/InputLabel";
import Modal from "@material-ui/core/Modal";
import Backdrop from "@material-ui/core/Backdrop";
import Fade from "@material-ui/core/Fade";

import FormatListBulletedIcon from "@material-ui/icons/FormatListBulleted";
import SaveIcon from "@material-ui/icons/Save";
import StayCurrentPortraitIcon from "@material-ui/icons/StayCurrentPortrait";
import PhoneIphoneIcon from "@material-ui/icons/PhoneIphone";
import TabletIcon from "@material-ui/icons/Tablet";
import DesktopWindowsIcon from "@material-ui/icons/DesktopWindows";

import FlashStorage from "services/FlashStorage";
import CustomInput from "components/CustomInput/CustomInput";
import { Skeleton } from "@material-ui/lab";
import { Button, TextField } from "@material-ui/core";
import WysiwigEditor from "components/WysiwigEditor/WysiwigEditor";
import SerpPreview from "react-serp-preview";

import ApiPageService from "services/api/ApiPageService";

const defaultModel = {
  _id: "new",
  title: "请输入标题",
  titleEN: "",
  slug: "please-input-slug",
  description: "请输入描述",
  descriptionEN: "",
  keywords: "",
  content: "请输入内容",
  contentEN: "",
  status: "draft"
};

const useStyle = makeStyles(theme => {
  return {
    input: {
      marginTop: "1rem"
    },
    textarea: {
      width: "100%"
    },
    inlineInput: {
      display: "inline-block",
      marginLeft: "1rem"
    },
    subheading: {
      fontWeight: 600,
      fontSize: "1rem"
    },
    inlineSubheading: {
      fontWeight: 600,
      fontSize: "1rem",
      display: "inline-block"
    },
    bordered: {
      border: "1px solid #eeeeee"
    },
    w100: {
      width: "100%"
    },
    modal: {
      display: "flex",
      alignItems: "center",
      justifyContent: "center"
    },
    paper: {
      backgroundColor: theme.palette.background.paper,
      border: "2px solid #000",
      boxShadow: theme.shadows[5],
      padding: theme.spacing(2, 4, 3),
      maxHeight: "calc(100vh - 72px)",
      overflowY: "scroll"
    },
    modalSize: {
      sm: {
        width: 320
      },
      md: {
        width: 768
      },
      lg: {
        width: 1280
      }
    }
  };
});

const EditPageSkeleton = () => {
  const { t } = useTranslation();
  return (
    <GridItem xs={12}>
      <GridContainer>
        <GridItem xs={12} lg={8}>
          <Skeleton height={48}></Skeleton>
          <Skeleton height={48}></Skeleton>
          <Skeleton height={48}></Skeleton>
          <Skeleton height={240}></Skeleton>
        </GridItem>
        <GridItem xs={12} lg={4}>
          <GridContainer>
            <GridItem xs={12}>
              <Skeleton height={48}></Skeleton>
              <Skeleton height={48}></Skeleton>
              <Skeleton height={48}></Skeleton>
            </GridItem>
            <GridItem xs={12} container direction="row-reverse">
              <Box mt={2}>
                <Button disabled variant="contained">
                  <FormatListBulletedIcon />
                  {t("Back")}
                </Button>
              </Box>
              <Box mt={2} mr={2}>
                <Button color="primary" variant="contained" disabled>
                  <SaveIcon />
                  {t("Save")}
                </Button>
              </Box>
            </GridItem>
          </GridContainer>
        </GridItem>
      </GridContainer>
    </GridItem>
  );
};

export default function EditPage({ match, history }) {
  const { t } = useTranslation();
  const classes = useStyle();
  const [loading, setLoading] = useState(true);
  const [lang, setLang] = useState("zh");
  const [model, setModel] = useState({ ...defaultModel, _id: match.params.id });
  const [processing, setProcessing] = useState(false);
  const [modalOpen, setModalOpen] = useState(false);
  const [modalSize, setModalSize] = useState("sm");
  const [alert, setAlert] = useState(
    FlashStorage.get("PAGE_ALERT") || { message: "", severity: "info" }
  );

  const removeAlert = () => {
    setAlert({
      message: "",
      severity: "info"
    });
  };

  const updatePage = () => {
    ApiPageService.getPage(model._id)
      .then(({ data }) => {
        if (data.code === "success") {
          setModel(data.data);
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
      })
      .finally(() => {
        setLoading(false);
      });
  };

  const saveModel = () => {
    removeAlert();
    setProcessing(true);
    ApiPageService.savePage(model)
      .then(({ data }) => {
        if (data.code === "success") {
          const newAlert = {
            message: t("Saved successfully"),
            severity: "success"
          };
          if (model._id === "new") {
            FlashStorage.set("PAGE_ALERT", newAlert);
            history.push("../pages");
            return;
          } else {
            setAlert(newAlert);
            updatePage();
          }
        } else {
          setAlert({
            message: t(data.message || "Save failed"),
            severity: "error"
          });
        }
        setProcessing(false);
      })
      .catch(e => {
        console.error(e);
        setAlert({
          message: t("Save failed"),
          severity: "error"
        });
        setProcessing(false);
      });
  };

  useEffect(() => {
    if (match.params.id && match.params.id !== "new") {
      updatePage();
    } else {
      setLoading(false);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <GridContainer>
      <GridItem xs={12}>
        <Card>
          <CardHeader color="primary">
            {loading && <h4>{t("Static Page")}</h4>}
            {!loading && (
              <h4>
                {model._id && model._id !== "new"
                  ? t("Edit Page") + ": " + model.title
                  : t("Add New Page")}
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
              {loading && <EditPageSkeleton />}
              {!loading && (
                <React.Fragment>
                  <GridItem xs={12}>
                    <GridContainer>
                      <GridItem xs={12} lg={7}>
                        <GridContainer>
                          <GridItem xs={12} md={6} lg={4}>
                            <h5 className={classes.inlineSubheading}>
                              {t("Content")}
                            </h5>
                          </GridItem>
                          <GridItem
                            xs={12}
                            md={6}
                            lg={4}
                            container
                            alignItems="center"
                          >
                            <Select
                              id="input-lang"
                              value={lang}
                              onChange={e => setLang(e.target.value)}
                            >
                              <MenuItem value="zh">中文</MenuItem>
                              <MenuItem value="en">English</MenuItem>
                            </Select>
                          </GridItem>
                          <GridItem
                            xs={12}
                            md={6}
                            lg={4}
                            container
                            alignItems="center"
                            justify="flex-end"
                          >
                            <Button
                              variant="outlined"
                              color="secondary"
                              onClick={() => {
                                setModalSize("sm");
                                setModalOpen(true);
                              }}
                            >
                              <PhoneIphoneIcon />
                            </Button>
                            <Button
                              variant="outlined"
                              color="secondary"
                              onClick={() => {
                                setModalSize("md");
                                setModalOpen(true);
                              }}
                            >
                              <TabletIcon />
                            </Button>
                            <Button
                              variant="outlined"
                              color="secondary"
                              onClick={() => {
                                setModalSize("lg");
                                setModalOpen(true);
                              }}
                            >
                              <DesktopWindowsIcon />
                            </Button>
                          </GridItem>
                          <div
                            style={{
                              display: lang === "zh" ? "block" : "none"
                            }}
                          >
                            <GridItem xs={12}>
                              <Box pb={2}>
                                <CustomInput
                                  labelText={t("Title (Chinese)")}
                                  id="input-title"
                                  formControlProps={{
                                    fullWidth: true,
                                    required: true
                                  }}
                                  inputProps={{
                                    value: model.title,
                                    onChange: e => {
                                      setModel({
                                        ...model,
                                        title: e.target.value
                                      });
                                    }
                                  }}
                                />
                              </Box>
                            </GridItem>
                            <GridItem xs={12}>
                              <Box pb={2}>
                                <FormLabel
                                  color="primary"
                                  required
                                  variant="filled"
                                >
                                  {t("Content (Chinese)")}
                                </FormLabel>
                              </Box>
                            </GridItem>
                            <GridItem xs={12}>
                              <Box pb={2}>
                                <WysiwigEditor
                                  initialValue={model.content}
                                  onChange={(event, editor) => {
                                    setModel({
                                      ...model,
                                      content: editor.getData()
                                    });
                                  }}
                                />
                              </Box>
                            </GridItem>
                          </div>

                          <div
                            style={{
                              display: lang === "en" ? "block" : "none"
                            }}
                          >
                            <GridItem xs={12}>
                              <Box pb={2}>
                                <CustomInput
                                  labelText={t("Title (English)")}
                                  id="input-title-en"
                                  formControlProps={{
                                    fullWidth: true
                                  }}
                                  inputProps={{
                                    value: model.titleEN,
                                    onChange: e => {
                                      setModel({
                                        ...model,
                                        titleEN: e.target.value
                                      });
                                    }
                                  }}
                                />
                              </Box>
                            </GridItem>

                            <GridItem xs={12}>
                              <Box pb={2}>
                                <FormLabel color="primary" variant="filled">
                                  {t("Content (English)")}
                                </FormLabel>
                              </Box>
                            </GridItem>
                            <GridItem xs={12}>
                              <Box pb={2}>
                                <WysiwigEditor
                                  initialValue={model.contentEN}
                                  onChange={(event, editor) => {
                                    setModel({
                                      ...model,
                                      contentEN: editor.getData()
                                    });
                                  }}
                                />
                              </Box>
                            </GridItem>
                          </div>
                        </GridContainer>
                      </GridItem>
                      <GridItem xs={12} lg={5}>
                        <GridContainer>
                          <GridItem xs={12}>
                            <h5 className={classes.subheading}>{t("SEO")}</h5>
                          </GridItem>
                          <GridItem xs={12}>
                            <Box pb={2}>
                              <CustomInput
                                labelText={t("Slug")}
                                id="input-slug"
                                formControlProps={{
                                  fullWidth: true,
                                  required: true
                                }}
                                inputProps={{
                                  value: model.slug,
                                  onChange: e => {
                                    setModel({
                                      ...model,
                                      slug: e.target.value
                                    });
                                  }
                                }}
                              />
                            </Box>
                          </GridItem>
                          <GridItem xs={12}>
                            <Box pb={2}>
                              <TextField
                                id="input-description"
                                label={t("Description")}
                                multiline
                                rowsMax={4}
                                className={classes.textarea}
                                variant="outlined"
                                value={model.description}
                                onChange={e => {
                                  setModel({
                                    ...model,
                                    description: e.target.value
                                  });
                                }}
                              />
                            </Box>
                          </GridItem>
                          <GridItem xs={12}>
                            <Box pb={2}>
                              <TextField
                                id="input-description"
                                label={t("Keywords")}
                                multiline
                                rowsMax={4}
                                className={classes.textarea}
                                variant="outlined"
                                value={model.keywords}
                                onChange={e => {
                                  setModel({
                                    ...model,
                                    keywords: e.target.value
                                  });
                                }}
                              />
                            </Box>
                          </GridItem>
                          <GridItem xs={12}>
                            <h5 className={classes.subheading}>
                              {t("Google Serp")}
                            </h5>
                          </GridItem>
                          <GridItem xs={12}>
                            <Box p={1} className={classes.bordered}>
                              <SerpPreview
                                title={model.title}
                                metaDescription={model.description}
                                url={
                                  "https://duocun.ca/mall/page/" + model.slug
                                }
                              />
                            </Box>
                          </GridItem>
                          <GridItem xs={12}>
                            <GridContainer>
                              <GridItem xs={12} lg={4}>
                                <Box mt={2}>
                                  <FormControl>
                                    <InputLabel id="label-select-status">
                                      {t("Status")}
                                    </InputLabel>
                                    <Select
                                      id="select-status"
                                      labelId="label-select-status"
                                      value={model.status}
                                      onChange={e => {
                                        setModel({
                                          ...model,
                                          status: e.target.value
                                        });
                                      }}
                                    >
                                      <MenuItem value="draft">
                                        {t("Draft")}
                                      </MenuItem>
                                      <MenuItem value="publish">
                                        {t("Publish")}
                                      </MenuItem>
                                    </Select>
                                  </FormControl>
                                </Box>
                              </GridItem>
                              <GridItem xs={12} lg={8}>
                                <Box mt={2}>
                                  <GridContainer>
                                    <GridItem xs={12} md={6}>
                                      <Button
                                        className={classes.w100}
                                        variant="contained"
                                        color="primary"
                                        onClick={saveModel}
                                      >
                                        <SaveIcon />
                                        {t("Save")}
                                      </Button>
                                    </GridItem>
                                    <GridItem xs={12} md={6}>
                                      <Button
                                        className={classes.w100}
                                        variant="contained"
                                        onClick={history.goBack}
                                      >
                                        <FormatListBulletedIcon />
                                        {t("Back")}
                                      </Button>
                                    </GridItem>
                                  </GridContainer>
                                </Box>
                              </GridItem>
                            </GridContainer>
                          </GridItem>
                        </GridContainer>
                      </GridItem>
                    </GridContainer>
                  </GridItem>
                </React.Fragment>
              )}
            </GridContainer>
          </CardBody>
        </Card>
      </GridItem>
      <Modal
        aria-labelledby="transition-modal-title"
        aria-describedby="transition-modal-description"
        className={classes.modal}
        open={modalOpen}
        onClose={() => {
          setModalOpen(false);
        }}
        closeAfterTransition
        BackdropComponent={Backdrop}
        BackdropProps={{
          timeout: 500
        }}
      >
        <Fade in={modalOpen}>
          <div className={classes.paper}>
            <div
              style={{ width: { sm: 320, md: 768, lg: 1280 }[modalSize] }}
              dangerouslySetInnerHTML={{
                __html:
                  lang === "zh"
                    ? model.content
                    : model.contentEN
                    ? model.contentEN
                    : model.content
              }}
            />
          </div>
        </Fade>
      </Modal>
    </GridContainer>
  );
}

EditPage.propTypes = {
  match: PropTypes.shape({
    params: PropTypes.shape({
      id: PropTypes.string
    })
  }),
  history: PropTypes.object
};
