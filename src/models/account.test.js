import { expect } from "chai";
import { ROLE_ENUM, RESOURCES, PERMISSIONS, hasRole } from "./account";

describe("hasRole", () => {
  it("returns true if user has role; false otherwise", () => {
    const merchant = {
      roles: [ROLE_ENUM.MERCHANT_ADMIN],
    };
    const admin = {
      roles: [ROLE_ENUM.SUPER],
    };
    const roleData = {
      [ROLE_ENUM.MERCHANT_ADMIN]: {
        [RESOURCES.CATEGORY]: [PERMISSIONS.READ, PERMISSIONS.DELETE],
      },
    };
    expect(hasRole(admin, { role: ROLE_ENUM.MERCHANT_ADMIN }, roleData))
      .to.be.true;
    expect(hasRole(merchant, { role: ROLE_ENUM.MERCHANT_ADMIN }, roleData))
      .to.be.true;
    expect(hasRole(merchant, { role: ROLE_ENUM.SUPER }, roleData)).to.be.false;
    expect(hasRole(merchant, { resource: RESOURCES.STOCK }, roleData))
      .to.be.false;
    expect(hasRole(admin, { resource: RESOURCES.STOCK }, roleData)).to.be.true;
    expect(
      hasRole(merchant, {
        resource: RESOURCES.CATEGORY,
        permission: PERMISSIONS.READ,
      }, roleData)
    ).to.be.true;
    expect(
      hasRole(merchant, {
        resource: RESOURCES.CATEGORY,
        permission: PERMISSIONS.UPDATE,
      }, roleData)
    ).to.be.false;
  });
});
