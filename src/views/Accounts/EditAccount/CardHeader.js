import React from "react";
import { useTranslation } from "react-i18next";
import CardHeader from "components/Card/CardHeader";

const Header = ({ model, loading }) => {
  const { t } = useTranslation();
  const title = loading
    ? t("Account")
    : model.id && model.id !== "new"
    ? `${t(`Edit Account`)}: ${model.username}`
    : t("New Account");
  return (
    <CardHeader color="primary">
      <h4>{title}</h4>
    </CardHeader>
  );
};

export default Header;
