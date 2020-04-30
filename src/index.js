import React from "react";
import ReactDOM from "react-dom";
import { Provider } from "react-redux";
import { createStore, applyMiddleware } from "redux";
import rootReducer from "./redux/reducers";
import { composeWithDevTools } from "redux-devtools-extension";
import thunk from "redux-thunk";
//time picker
import { MuiPickersUtilsProvider } from "@material-ui/pickers";
import MomentUtils from '@date-io/moment';
// i18n
import i18n from "i18next";
import { initReactI18next } from "react-i18next";
import lang from "./assets/i18n";
import Root from "./routes/root";
// styles
import "assets/css/material-dashboard-react.css?v=1.8.0";

i18n.use(initReactI18next).init({
  resources: lang,
  lng: process.env.NODE_ENV === "production" ? "zh" : "en",
  fallbackLng: "en",
  interpolation: {
    escapeValue: false,
  },
});

const store = createStore(
  rootReducer,
  composeWithDevTools(applyMiddleware(thunk))
);

ReactDOM.render(
  <Provider store={store}>
    <MuiPickersUtilsProvider utils={MomentUtils}>
      <Root />
    </MuiPickersUtilsProvider>
  </Provider>,
  document.getElementById("root")
);
