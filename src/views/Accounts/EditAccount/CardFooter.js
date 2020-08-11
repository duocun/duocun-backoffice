import React from "react";
import PropTypes from "prop-types";
import CardFooter from "components/Card/CardFooter";
import { Button, Box } from "@material-ui/core";
import SaveIcon from "@material-ui/icons/Save";
import { useTranslation } from "react-i18next";
import GridItem from "components/Grid/GridItem";
import FormatListBulletedIcon from "@material-ui/icons/FormatListBulleted";

const Footer = ({ onSave, onBack, processing }) => {
  const { t } = useTranslation();

  return (
    <CardFooter>
      <GridItem xs={12} container direction="row-reverse">
        <Box>
          <Button varaint="contained" onClick={onBack}>
            <FormatListBulletedIcon />
            {t("Back")}
          </Button>
        </Box>
        <Box mr={2}>
          <Button
            color="primary"
            variant="contained"
            disabled={processing}
            onClick={onSave}
          >
            <SaveIcon />
            {t("Save")}
          </Button>
        </Box>
      </GridItem>
    </CardFooter>
  );
};

Footer.propTypes = {
  onSave: PropTypes.func,
  onBack: PropTypes.func,
  processing: PropTypes.bool
};

Footer.defaultProps = {
  onSave: () => {},
  onBack: () => {},
  processing: false
};

export default Footer;
