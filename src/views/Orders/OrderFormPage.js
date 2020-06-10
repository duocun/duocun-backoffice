import React, { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { connect } from "react-redux";
import PropTypes from "prop-types";

// import { Save as SaveIcon, FormatListBulleted as FormatListBulletedIcon } from "@material-ui/icons";
import { TextField, Button, Checkbox,
    Select, MenuItem, InputLabel, FormControl, FormControlLabel } from "@material-ui/core";
// import { Alert } from "@material-ui/lab"

import GridContainer from "components/Grid/GridContainer.js";
import GridItem from "components/Grid/GridItem.js";
// import Card from "components/Card/Card.js";
// import CardHeader from "components/Card/CardHeader.js";
// import CardBody from "components/Card/CardBody.js";
// import CardFooter from "components/Card/CardFooter.js";

// import EditSkeleton from "../Common/EditSkeleton";
import ApiOrderService from "services/api/ApiOrderService";

import OrderForm from './OrderForm';

import { selectOrder, setDeliverDate } from 'redux/actions/order';
import { setAccount } from 'redux/actions/account';
import ApiAccountService from "services/api/ApiAccountService";


const defaultOrdersModelState = {
  _id: '',
  clientId: {},
  merchantId: {},
  items: [],
  price: 0,
  cost: 0,
  location: {},
  delivered: "",
  created: "",
  type: "",
  actionCode: "",
  code:""
}

const OrderFormPage = ({match, history, order, selectOrder, account, deliverDate, setDeliverDate, setAccount}) => {
  const { t } = useTranslation();
  const [loading, setLoading] = useState(false);
  const [processing, setProcessing] = useState(false);

  // for model
  const [model, setModel] = useState(defaultOrdersModelState);
  const [alert, setAlert] = useState({ message: "", severity: "info" });

  //////////////////// For data fetch
  const getOrderData = () => {

  }

  const updateData = () => {
    // const qDeliverDate = deliverDate ? {deliverDate} : {};
    // const keyword = query;
    // const condition = {
    //   $or: [
    //     { clientName: { $regex: keyword }},
    //     { clientPhone: { $regex: keyword }},
    //     { code: { $regex: keyword }}
    //   ],
    //   status: {
    //     $nin: [OrderStatus.BAD, OrderStatus.DELETED, OrderStatus.TEMP],
    //   },
    //   ...qDeliverDate
    // };
    // ApiOrderService.getOrders(page, rowsPerPage, condition, [sort]).then(
    //   ({ data }) => {
    //     setOrders(data.data);
    //     setTotalRows(data.count);
    //     setLoading(false);
    //     if(data.data && data.data.length>0){
    //       const d = data.data[0];
    //       const _id = d.clientId ? d.clientId : '';
    //       const username = d.clientName ? d.clientName: '';
    //       setAccount({_id, username, type: 'client'});
    //     }
    //   }
    // );
  };

  const updateFormData = (id) => {
    if(id){
      ApiOrderService.getOrder(id).then(({data}) => {
        const order = data.data;
        setModel(order);
      });
    }
  }

  const handleAfterUpdate = () => {
    updateFormData(model._id);
    updateData();
  }

  useEffect(() => {
    if(!model._id){
      ApiOrderService.getOrder(match.params.id).then(({data}) => {
        const order = data.data;
        const clientId = order.clientId;
        ApiAccountService.getAccount(clientId).then(({data}) => {
          const account = data.data;
          setAccount(account);
          setModel(order);
        });
      });
    }
  }, [model]);
  /////////////////// For render and events 


  ////////////////////////////////////
  // For submit
  const saveModel = () => {
    // setProcessing(true);
    // ApiOrderService.createOrder(model).then(
    //   ({ data }) => {
    //     setProcessing(false);
    //     if ( data.code === "success" ) {
    //       // success 
    //       setAlert({
    //         message: "Created success!",
    //         severity: "success"
    //       });
    //     } else {
    //       // failure
    //       setAlert({
    //         message: data.data,
    //         severity: "error"
    //       });
    //     }
    //   }
    // );
  }

  const updateModel = () => {

  }

  return (
    <GridContainer>
      <GridItem xs={12} sm={12} md={12}>
        <OrderForm
            account={account}
            data={model}
            onAfterUpdate={handleAfterUpdate}
            // toTransactionHistory={handleToTransactionHistory}
             />
      </GridItem>

    </GridContainer>
  );
};


OrderFormPage.propTypes = {
  match: PropTypes.shape({
    params: PropTypes.shape({
      id: PropTypes.string
    })
  }),
  history: PropTypes.object
};

const mapStateToProps = (state) => ({
  order: state.order, 
  deliverDate: state.deliverDate,
  account: state.account
});
// const mapDispatchToProps = (dispatch) => ({
//   loadAccounts: (payload, searchOption) => {
//     dispatch(loadAccountsAsync(payload, searchOption));
//   },
// });
export default connect(
  mapStateToProps,
  {
    selectOrder, setDeliverDate, setAccount
  }
)(OrderFormPage);