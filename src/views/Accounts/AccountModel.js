import { enumLikeObj } from "helper/index";

export const defaultAccount = {
  _id: 'new',
  username: "",
  imageurl: "",
  realm: "",
  sex: "",
  openId: "",
  type: "merchant",
  balance: 0,
  phone: "",
  created: "",
  verificationCode: "",
  verified: true,
  attributes: []
}

export const AccountAttribute = {
  I: "INDOOR", 
  G: "GARDENING", 
  R: "ROOFING", 
  O: "OFFICE", 
  P: "PLAZA", 
  H: "HOUSE", 
  C: "CONDO",
}

export const DEFAULT_MODEL = {
  _id: "new",
  email: "",
  username: "",
  imageurl: "",
  realm: "",
  sex: "0",
  openId: "",
  type: "client",
  balance: 0,
  phone: "",
  created: "",
  verificationCode: "",
  verified: false,
  attributes: [],
  passwordRaw: "",
  roles: [],
  secondPhone: "",
  created: new Date(),
};

export const ACCOUNT_TYPES = [
  "Merchant",
  "Driver",
  "Client",
  "System",
  "Freight",
  "Customer Service",
  "Stock Manager",
  "Admin",
];

export const ATTRIBUTES = {
  I: "INDOOR",
  G: "GARDENING",
  R: "ROOFING",
  O: "OFFICE",
  P: "PLAZA",
  H: "HOUSE",
  C: "CONDO",
};

export const ROLES = {
  1: "SUPER",
  2: "MERCHANT ADMIN",
  3: "MERCHANT STUFF",
  4: "MANAGER",
  5: "DRIVER",
  6: "CLIENT",
  7: "CUSTOMER SERVICE",
  8: "STORAGE ADMIN",
};

export const getRolesFromAccountTypes = (accountType) => {
  if (accountType === "admin") {
    return Object.keys(ROLES);
  }
  const rolesEnum = enumLikeObj(ROLES);
  if (accountType === "merchant") {
    return [rolesEnum["MERCHANT ADMIN"], rolesEnum["MERCHANT STUFF"]];
  }
  if (accountType === "driver") {
    return [rolesEnum["DRIVER"]];
  }
  if (accountType === "customer service") {
    return [rolesEnum["CUSTOMER SERVICE"]];
  }
  return [rolesEnum.CLIENT];
};
