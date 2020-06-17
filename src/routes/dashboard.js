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
import LocationIcon from "@material-ui/icons/LocationOn";
import LocalMallIcon from "@material-ui/icons/LocalMall";
import EditAttributesIcon from "@material-ui/icons/EditAttributes";
import CategoryIcon from "@material-ui/icons/Category";
import StoreIcon from "@material-ui/icons/Store";
import TransactionIcon from "@material-ui/icons/AttachMoney";
import SalaryIcon from "@material-ui/icons/PeopleAlt";
// import ListAltIcon from "@material-ui/icons/ListAlt";
// core components/views for Admin layout
import CategoriesPage from "views/Categories/Categories.js";
import FinanceRoute from "views/Finance/FinanceRoute.js";
import ProductPage from "views/Products/Products.js";
import StockPage from "views/Stock/ListProductStock.js";
import AttributePage from "views/Attributes/Attributes.js";
import OrderRoute from "views/Orders/OrderRoute.js";
import MapRoute from "views/Maps/MapRoute.js";
import TableList from "views/TableList/TableList.js";
import StaticPage from "views/Pages/Pages.js";
// import Assignment from "views/Assignment/AssignmentRoute";
import SupportPage from 'views/Support/Support.js';
import DashboardRoute from "views/Dashboard/DashboardRoute.js";

import AccountsPage from "views/Accounts/AccountsPage";
import MerchantsPage from "views/Merchants/MerchantsPage";
import WidgetsIcon from "@material-ui/icons/Widgets";

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
  // {
  //   path: "/finance",
  //   name: "Finance",
  //   icon: "content_paste",
  //   component: FinanceRoute,
  //   layout: "/"
  // },
  {
    path: "/orders",
    name: "Order",
    icon: "content_paste",
    component: OrderRoute,
    layout: "/"
  },
  {
    path: "/finance/transactions",
    name: "Transaction",
    icon: TransactionIcon,
    component: FinanceRoute,
    layout: "/"
  },
  {
    path: "/finance/salary",
    name: "Salary",
    icon: SalaryIcon,
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
    path: "/stocks",
    name: "Stock",
    icon: WidgetsIcon,
    component: StockPage,
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
    path: "/maps",
    name: "Assignment",
    icon: LocationIcon,
    component: MapRoute,
    layout: "/"
  },
  {
    path: "/pages",
    name: "Static Page",
    icon: LocationIcon,
    component: StaticPage,
    layout: "/"
  },
  // {
  //   path: "/assignment",
  //   name: "Assignment",
  //   icon: LocationIcon,
  //   component: Assignment,
  //   layout: "/"
  // },
  /** 
   * Customer Service Menu
   * @author  terminator
  */
  {
    path: '/support',
    name: 'Support',
    icon: 'help',
    component: SupportPage,
    layout: '/'
  },
  // {
  //   path: "/table",
  //   name: "Table List",
  //   icon: "content_paste",
  //   component: TableList,
  //   layout: "/"
  // },
  // {
  //   path: "/typography",
  //   name: "Typography",
  //   icon: LibraryBooks,
  //   component: Typography,
  //   layout: "/"
  // },
  // {
  //   path: "/icons",
  //   name: "Icons",
  //   icon: BubbleChart,
  //   component: Icons,
  //   layout: "/"
  // },
  // {
  //   path: "/maps",
  //   name: "Maps",
  //   icon: LocationOn,
  //   component: Maps,
  //   layout: "/"
  // },
  // {
  //   path: "/user",
  //   name: "User Profile",
  //   icon: Person,
  //   component: UserProfile,
  //   layout: "/"
  // },
  // {
  //   path: "/notifications",
  //   name: "Notifications",
  //   icon: Notifications,
  //   component: NotificationsPage,
  //   layout: "/"
  // }
];

export default dashboardRoutes;
