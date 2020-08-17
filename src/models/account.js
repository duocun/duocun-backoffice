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
  2: "MERCHANT_ADMIN",
  3: "MERCHANT_STUFF",
  4: "MANAGER",
  5: "DRIVER",
  6: "CLIENT",
  7: "CUSTOMER_SERVICE",
  8: "STORAGE_ADMIN",
};

export const ROLE_ENUM = enumLikeObj(ROLES);

export const RESOURCES = {
  STATISTICS: "STATISTICS",
  CATEGORY: "CATEGORY",
  PRODUCT: "PRODUCT",
  ORDER: "ORDER",
  STOCK: "STOCK",
};

export const PERMISSIONS = {
  CREATE: "CREATE",
  READ: "READ",
  UPDATE: "UPDATE",
  DELETE: "DELETE",
};

export const RESOURCES_PERMISSIONS = {
  [RESOURCES.STATISTICS]: [PERMISSIONS.READ],
  [RESOURCES.CATEGORY]: [
    PERMISSIONS.READ,
    PERMISSIONS.CREATE,
    PERMISSIONS.UPDATE,
    PERMISSIONS.DELETE,
  ],
  [RESOURCES.PRODUCT]: [
    PERMISSIONS.READ,
    PERMISSIONS.CREATE,
    PERMISSIONS.UPDATE,
    PERMISSIONS.DELETE,
  ],
  [RESOURCES.ORDER]: [
    PERMISSIONS.READ,
    PERMISSIONS.CREATE,
    PERMISSIONS.UPDATE,
    PERMISSIONS.DELETE,
  ],
  [RESOURCES.STOCK]: [PERMISSIONS.READ, PERMISSIONS.UPDATE],
};

export const hasRole = (user, role, rbacData) => {
  if (!role) {
    return true;
  }
  if (!user || !user.roles) {
    return false;
  }
  const userRoles = user.roles.map((r) => String(r));
  if (userRoles.includes(String(ROLE_ENUM.SUPER))) {
    return true;
  }
  if (role.role) {
    const hasRole = userRoles.includes(String(role.role));
    return hasRole;
  }
  if (role.resource) {
    if (!rbacData) {
      return false;
    }

    for (let i=0; i<userRoles.length; i++) {
      const r = userRoles[i];
      if (!rbacData[r]) {
        return false;
      }
      if (rbacData[r][role.resource]) {
        if (!role.permission) {
          return true;
        } else {
          return rbacData[r][role.resource].includes(role.permission);
        }
      }
    }
  }
  return false;
};
