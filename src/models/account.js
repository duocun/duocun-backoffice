import { enumLikeObj } from "helper/index";

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
  created: new Date()
};

export const ACCOUNT_TYPES = [
  "Merchant",
  "Driver",
  "Client",
  "System",
  "Freight",
  "Customer Service",
  "Stock Manager",
  "Admin"
];

export const ATTRIBUTES = {
  I: "INDOOR",
  G: "GARDENING",
  R: "ROOFING",
  O: "OFFICE",
  P: "PLAZA",
  H: "HOUSE",
  C: "CONDO"
};

export const ROLES = {
  1: "SUPER",
  2: "MERCHANT ADMIN",
  3: "MERCHANT STUFF",
  4: "MANAGER",
  5: "DRIVER",
  6: "CLIENT",
  7: "CUSTOMER SERVICE",
  8: "STORAGE ADMIN"
};

export const ROLE_ENUM = enumLikeObj(ROLES);

export const RESOURCES = {
  STATISTICS: "STATISTICS",
  CATEGORY: "CATEGORY",
  PRODUCT: "PRODUCT",
  ORDER: "ORDER",
  STOCK: "STOCK"
};

export const PERMISSIONS = {
  CREATE: "CREATE",
  READ: "READ",
  UPDATE: "UPDATE",
  DELETE: "DELETE"
};

export const RESOURCES_PERMISSIONS = {
  [RESOURCES.STATISTICS]: [PERMISSIONS.READ],
  [RESOURCES.CATEGORY]: [
    PERMISSIONS.READ,
    PERMISSIONS.CREATE,
    PERMISSIONS.UPDATE,
    PERMISSIONS.DELETE
  ],
  [RESOURCES.PRODUCT]: [
    PERMISSIONS.READ,
    PERMISSIONS.CREATE,
    PERMISSIONS.UPDATE,
    PERMISSIONS.DELETE
  ],
  [RESOURCES.ORDER]: [
    PERMISSIONS.READ,
    PERMISSIONS.CREATE,
    PERMISSIONS.UPDATE,
    PERMISSIONS.DELETE
  ],
  [RESOURCES.STOCK]: [PERMISSIONS.READ, PERMISSIONS.UPDATE]
};

export const getRolesFromAccountTypes = accountType => {
  if (accountType === "admin") {
    return Object.keys(ROLES);
  }
  const rolesEnum = ROLE_ENUM;
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

export const ROLES_PERMISSIONS = {
  SUPER: { ...RESOURCES_PERMISSIONS },
  "MERCHANT ADMIN": {
    [RESOURCES.STATISTICS]: [],
    [RESOURCES.CATEGORY]: [
      PERMISSIONS.READ,
      PERMISSIONS.CREATE,
      PERMISSIONS.UPDATE,
      PERMISSIONS.DELETE
    ],
    [RESOURCES.PRODUCT]: [
      PERMISSIONS.READ,
      PERMISSIONS.CREATE,
      PERMISSIONS.UPDATE,
      PERMISSIONS.DELETE
    ],
    [RESOURCES.ORDER]: [
      PERMISSIONS.READ,
      PERMISSIONS.CREATE,
      PERMISSIONS.UPDATE,
      PERMISSIONS.DELETE
    ],
    [RESOURCES.STOCK]: [PERMISSIONS.READ, PERMISSIONS.UPDATE]
  },
  "MERCHANT STUFF": {
    [RESOURCES.STATISTICS]: [],
    [RESOURCES.CATEGORY]: [PERMISSIONS.READ],
    [RESOURCES.PRODUCT]: [PERMISSIONS.READ],
    [RESOURCES.ORDER]: [PERMISSIONS.READ],
    [RESOURCES.STOCK]: [PERMISSIONS.READ, PERMISSIONS.UPDATE]
  },
  MANAGER: {},
  DRIVER: {},
  CLIENT: {},
  "CUSTOMER SERVICE": {},
  "STORAGE ADMIN": {
    [RESOURCES.STATISTICS]: [],
    [RESOURCES.CATEGORY]: [PERMISSIONS.READ],
    [RESOURCES.PRODUCT]: [PERMISSIONS.READ],
    [RESOURCES.ORDER]: [PERMISSIONS.READ],
    [RESOURCES.STOCK]: [PERMISSIONS.READ, PERMISSIONS.UPDATE]
  }
};
