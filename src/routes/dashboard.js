/*!

=========================================================
* Material Dashboard React - v1.8.0
=========================================================

* Product Page: https://www.creative-tim.com/product/material-dashboard-react
* Copyright 2019 Creative Tim (https://www.creative-tim.com)
* Licensed under MIT (https://github.com/creativetimofficial/material-dashboard-react/blob/master/LICENSE.md)

* Coded by Creative Tim

=========================================================

* The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.

*/
// @material-ui/icons
import Dashboard from "@material-ui/icons/Dashboard";
import Person from "@material-ui/icons/Person";
import LibraryBooks from "@material-ui/icons/LibraryBooks";
import BubbleChart from "@material-ui/icons/BubbleChart";
import LocationOn from "@material-ui/icons/LocationOn";
import Notifications from "@material-ui/icons/Notifications";
import LocalMallIcon from "@material-ui/icons/LocalMall";
import EditAttributesIcon from '@material-ui/icons/EditAttributes';
import CategoryIcon from '@material-ui/icons/Category';
import StoreIcon from '@material-ui/icons/Store';

// core components/views for Admin layout
import DashboardPage from "views/Dashboard/Dashboard.js";
import UserProfile from "views/UserProfile/UserProfile.js";

import TableList from "views/TableList/TableList.js";

import Typography from "views/Typography/Typography.js";
import Icons from "views/Icons/Icons.js";
import Maps from "views/Maps/Maps.js";
import NotificationsPage from "views/Notifications/Notifications.js";
import CategoriesPage from "views/Categories/Categories.js";
import FinanceRoute from "views/Finance/FinanceRoute.js";
import ProductPage from "views/Products/Products.js";
import AttributePage from "views/Attributes/Attributes.js";
import OrderPage from "views/Orders/OrderPage.js";

import Assignment from "views/Assignment/AssignmentRoute";
import DashboardRoute from "views/Dashboard/DashboardRoute.js";

import AccountsPage from "views/Accounts/AccountsPage";
import MerchantsPage from "views/Merchants/MerchantsPage";

const dashboardRoutes = [
  {
    path: "/dashboard",
    name: "Dashboard",
    icon: Dashboard,
    component: DashboardRoute,
    layout: "/"
  },
  {
    path: "/categories",
    name: "Categories",
    icon: CategoryIcon,
    component: CategoriesPage,
    layout: "/"
  },
  {
    path: "/finance",
    name: "Finance",
    icon: "content_paste",
    component: FinanceRoute,
    layout: "/"
  },
  {
    path: "/products",
    name: "Products",
    icon: LocalMallIcon,
    component: ProductPage,
    layout: "/"
  },
  {
    path: "/attributes",
    name: "Attributes",
    icon: EditAttributesIcon,
    component: AttributePage,
    layout: "/"
  },
  {
    path: "/accounts",
    name: "Accounts",
    icon: Person,
    component: AccountsPage,
    layout: "/"
  },
  {
    path: "/merchants",
    name: "Merchants",
    icon: StoreIcon,
    component: MerchantsPage,
    layout: "/"
  },
  {
    path: "/orders",
    name: "Order",
    icon: "content_paste",
    component: OrderPage,
    layout: "/"
  },
  {
    path:"/assignment",
    name:"Assignment",
    icon:LocationOn,
    component: Assignment,
    layout:"/"
  },
  {
    path: "/table",
    name: "Table List",
    icon: "content_paste",
    component: TableList,
    layout: "/"
  },
  {
    path: "/typography",
    name: "Typography",
    icon: LibraryBooks,
    component: Typography,
    layout: "/"
  },
  {
    path: "/icons",
    name: "Icons",
    icon: BubbleChart,
    component: Icons,
    layout: "/"
  },
  {
    path: "/maps",
    name: "Maps",
    icon: LocationOn,
    component: Maps,
    layout: "/"
  },
  {
    path: "/user",
    name: "User Profile",
    icon: Person,
    component: UserProfile,
    layout: "/"
  },
  {
    path: "/notifications",
    name: "Notifications",
    icon: Notifications,
    component: NotificationsPage,
    layout: "/"
  }
];

export default dashboardRoutes;
