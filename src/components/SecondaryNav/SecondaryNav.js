import React, { useState, useEffect } from "react";

import { makeStyles, useTheme } from "@material-ui/core/styles";
import AppBar from "@material-ui/core/AppBar";
import Tabs from "@material-ui/core/Tabs";
import Tab from "@material-ui/core/Tab";

function a11yProps(index) {
  return {
    id: `full-width-tab-${index}`,
    "aria-controls": `full-width-tabpanel-${index}`
  };
}

const useStyles = makeStyles(theme => ({
  root: {
    flexGrow: 1,
    width: "100%",
    [theme.breakpoints.down("md")]: {
      marginBottom: "20px"
    },
    "& .MuiTabs-indicator": {
      backgroundColor: "transparent"
    },
    "& .MuiTabs-flexContainer": {
      backgroundColor: "transparent"
    },
    "& .MuiPaper-root": {
      backgroundColor: "transparent",
      boxShadow: "none"
    },
    "& .MuiTab-wrapper": {
      color: "rgba(0, 0, 0, 0.54)"
    }
  }
}));

export default function SecondaryNav({ tabs, history }) {
  const classes = useStyles();
  const theme = useTheme();
  const [value, setValue] = useState(0);

  useEffect(() => setValue(0), []);

  const handleChange = (event, newValue) => {
    setValue(newValue);
  };

  return (
    <div className={classes.root}>
      <AppBar position="static" color="default">
        <Tabs
          value={value}
          // onChange={handleChange}
          indicatorColor="secondary"
          textColor="primary"
          variant="scrollable"
          scrollButtons="auto"
        >
          {tabs &&
            tabs.map((tab, index) => (
              <Tab
                label={tab.title}
                key={index}
                {...a11yProps(index)}
                onClick={() => {
                  history.push(tab.route);
                }}
              />
            ))}
        </Tabs>
      </AppBar>
    </div>
  );
}
