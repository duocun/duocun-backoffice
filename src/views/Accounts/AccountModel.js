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

export const AccountTypes = [
  { key: 'client', text: 'Client' },
  { key: 'driver', text: 'Driver' },
  { key: 'merchant', text: 'Merchant' },
  { key: 'system', text: 'System' },
  { key: 'tmp', text: 'Temp' },
];

export const AccountAttribute = {
  I: "INDOOR", 
  G: "GARDENING", 
  R: "ROOFING", 
  O: "OFFICE", 
  P: "PLAZA", 
  H: "HOUSE", 
  C: "CONDO",
}

export const ROLE_MAPPING = {
  1: "SUPER",
  2: "MERCHANT_ADMIN",
  3: "MERCHANT_STUFF",
  4: "MANAGER",
  5: "DRIVER",
  6: "CLIENT"
};

export const ATTRIBUTES_MAPPING = {
  I: "INDOOR",
  G: "GARDENING",
  R: "ROOFING",
  O: "OFFICE",
  P: "PLAZA",
  H: "HOUSE",
  C: "CONDO"
};