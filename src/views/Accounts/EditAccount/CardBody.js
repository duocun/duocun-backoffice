import React from "react";
import CardBody from "components/Card/CardBody.js";
import { makeStyles } from "@material-ui/core/styles";
import GridContainer from "components/Grid/GridContainer.js";
import GridItem from "components/Grid/GridItem.js";
import { useTranslation } from "react-i18next";
import { ACCOUNT_TYPES } from "models/account";
import CustomSelect from "components/CustomInput/SelectWithLabel";
import CustomTextField from "components/CustomInput/CustomTextField";
import UserAvatar from "components/UserAvatar/UserAvatar";
import moment from "moment";
import Attributes from "./Attributes";
import Roles from "./Roles";

const Body = ({ model, onChange }) => {
  const { t } = useTranslation();
  const classes = useStyles();
  return (
    <CardBody>
      <GridContainer>
        <GridItem xs={12} md={6}>
          <GridContainer>
            <GridItem xs={12}>
              <h5>{t("Basic Information")}</h5>
            </GridItem>
            <GridContainer>
              <GridItem xs={12} md={4} className={classes.avatarContainer}>
                <UserAvatar user={model} className={classes.avatarLarge} />
              </GridItem>
              <GridItem xs={12} md={8}>
                <GridContainer>
                  <GridItem xs={12} md={6}>
                    <CustomTextField
                      id="input-email"
                      label={t("Email")}
                      value={model.email}
                      onChange={(value) => onChange({ ...model, email: value })}
                    />
                  </GridItem>
                  <GridItem xs={12} md={6}>
                    <CustomTextField
                      id="input-password"
                      label={t("Password")}
                      value={model.passwordRaw}
                      inputProps={{ type: "password", minLength: 6 }}
                      onChange={(value) =>
                        onChange({ ...model, passwordRaw: value })
                      }
                    />
                  </GridItem>
                  <GridItem xs={12} md={6}>
                    <CustomTextField
                      id="input-username"
                      label="Username"
                      required
                      value={model.username}
                      onChange={(value) =>
                        onChange({ ...model, username: value })
                      }
                    />
                  </GridItem>
                  <GridItem xs={12} md={6}>
                    <CustomSelect
                      label="Account Type"
                      value={model.type}
                      itemData={ACCOUNT_TYPES.map((type) => {
                        return { value: type.toLowerCase(), text: type };
                      })}
                      onChange={(value) => onChange({ ...model, type: value })}
                    />
                  </GridItem>
                  <GridItem xs={12} md={6}>
                    <CustomTextField
                      id="input-phone"
                      label={t("Phone Number")}
                      value={model.phone}
                      onChange={(value) => onChange({ ...model, phone: value })}
                    />
                  </GridItem>
                  <GridItem xs={12} md={6}>
                    <CustomSelect
                      label="Verified"
                      value={String(model.verified)}
                      itemData={[
                        { value: true, text: "Yes" },
                        { value: false, text: "No" },
                      ]}
                      onChange={(value) =>
                        onChange({ ...model, verified: value })
                      }
                    />
                  </GridItem>
                  <GridItem xs={12} md={6}>
                    <CustomTextField
                      id="input-balance"
                      inputProps={{ type: "number", required: true }}
                      label={t("Balance")}
                      className="dc-full"
                      value={model.balance}
                      onChange={(value) =>
                        onChange({ ...model, balance: value })
                      }
                    />
                  </GridItem>
                  <GridItem xs={12} md={6}>
                    <CustomSelect
                      label="Gender"
                      value={String(model.sex)}
                      itemData={[
                        { value: 0, text: "Unknown" },
                        { value: 1, text: "Male" },
                        { value: 2, text: "Female" },
                      ]}
                      onChange={(value) => onChange({ ...model, sex: value })}
                    />
                  </GridItem>
                  <GridItem xs={12} md={6}></GridItem>
                </GridContainer>
              </GridItem>
            </GridContainer>
            <GridItem xs={12}>
              <h5>{t("Other Information")}</h5>
            </GridItem>
            <GridItem xs={12} md={6}>
              <CustomTextField
                id="input-realm"
                label={t("Realm")}
                value={model.realm}
                onChange={(value) => onChange({ ...model, realm: value })}
              />
            </GridItem>
            <GridItem xs={12} md={6}>
              <CustomTextField
                id="input-second-phone"
                label={t("Second Phone")}
                value={model.secondPhone}
                onChange={(value) => onChange({ ...model, secondPhone: value })}
              />
            </GridItem>
            <GridItem xs={12} md={6}>
              <CustomTextField
                id="input-openid"
                label={t("OpenID")}
                value={model.openId}
                onChange={(value) => onChange({ ...model, openId: value })}
              />
            </GridItem>
            <GridItem xs={12} md={6}>
              <CustomTextField
                id="input-address"
                label={t("Address")}
                value={model.location ? model.location.address : ""}
                disabled
              />
            </GridItem>
            <GridItem xs={12} md={6}>
              <CustomTextField
                id="input-createdAt"
                label={t("Created At")}
                value={moment(model.createdAt).format("YYYY-MM-DD HH:mm:ss")}
                disabled
              />
            </GridItem>
          </GridContainer>
        </GridItem>
        <GridItem xs={12} md={6}>
          <Attributes
            model={model}
            onChange={(newModel) => onChange(newModel)}
          />
          <Roles model={model} onChange={(newModel) => onChange(newModel)} />
        </GridItem>
      </GridContainer>
    </CardBody>
  );
};

const styles = {
  avatarContainer: {
    justifyContent: "center",
    alignItems: "center",
    display: "flex",
  },
  avatarLarge: {
    minWidth: 96,
    minHeight: 96,
    marginLeft: "auto",
    marginRight: "auto",
  },
};

const useStyles = makeStyles((theme) => styles);

export default Body;
