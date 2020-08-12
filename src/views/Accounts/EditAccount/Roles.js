import React from "react";
import GridContainer from "components/Grid/GridContainer.js";
import GridItem from "components/Grid/GridItem.js";
import PropTypes from "prop-types";
import { arrayToggleElem } from "helper/index";
import { useTranslation } from "react-i18next";
import { ROLES } from "models/account";
import { FormControlLabel, Checkbox } from "@material-ui/core";

const humanizeRoleName = (key) => {
  if (!ROLES[key]) {
    return key;
  }
  return String(ROLES[key]).replace(/_/g, " ");
};

const Roles = (props) => {
  const { t } = useTranslation();
  return (
    <GridContainer>
      <GridItem xs={12}>
        <h5>{t("Roles")}</h5>
      </GridItem>
      <GridItem xs={12}>
        <GridContainer>
          {Object.keys(ROLES).map((key) => (
            <GridItem xs={6} md={4} key={key}>
              <FormControlLabel
                color="primary"
                label={t(humanizeRoleName(key))}
                labelPlacement="end"
                control={
                  <Checkbox
                    checked={(props.model.roles || []).includes(Number(key))}
                    onChange={(e) => {
                      const newModel = { ...props.model };
                      if (!newModel.roles) {
                        newModel.roles = [];
                      }
                      arrayToggleElem(newModel.roles, Number(key));
                      props.onChange(newModel);
                    }}
                  />
                }
              />
            </GridItem>
          ))}
        </GridContainer>
      </GridItem>
    </GridContainer>
  );
};

Roles.propTypes = {
  model: PropTypes.object,
  onChange: PropTypes.func,
};

export default Roles;
