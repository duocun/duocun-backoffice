import React from "react";
import { FormControlLabel, Checkbox } from "@material-ui/core";
import GridContainer from "components/Grid/GridContainer.js";
import GridItem from "components/Grid/GridItem.js";
import PropTypes from "prop-types";
import { ATTRIBUTES } from "models/account";
import { arrayToggleElem } from "helper/index";
import { useTranslation } from "react-i18next";

const Attributes = props => {
  const { t } = useTranslation();

  return (
    <GridContainer>
      <GridItem xs={12}>
        <h5>{t("Attributes")}</h5>
      </GridItem>
      <GridItem xs={12} lg={12}>
        <GridContainer>
          {Object.keys(ATTRIBUTES).map(key => {
            return (
              <GridItem xs={6} lg={4} key={key}>
                <FormControlLabel
                  label={t(ATTRIBUTES[key] || key)}
                  labelPlacement="end"
                  control={
                    <Checkbox
                      checked={props.model.attributes ? props.model.attributes.includes(key) : false}
                      onChange={e => {
                        const newModel = { ...props.model };
                        arrayToggleElem(newModel.attributes, key);
                        props.onChange(newModel);
                      }}
                      color="primary"
                    />
                  }
                />
              </GridItem>
            );
          })}
        </GridContainer>
      </GridItem>
    </GridContainer>
  );
};

Attributes.propTypes = {
  model: PropTypes.object,
  onChange: PropTypes.func
};

export default Attributes;
