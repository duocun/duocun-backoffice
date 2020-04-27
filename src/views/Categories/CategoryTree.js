import React, { useState } from "react";
import PropTypes from "prop-types";
import { useTranslation } from "react-i18next";
import { makeStyles } from "@material-ui/core/styles";

import TreeView from "@material-ui/lab/TreeView";
import TreeItem from "@material-ui/lab/TreeItem";
import FormControlLabel from "@material-ui/core/FormControlLabel";
import Radio from "@material-ui/core/Radio";
import RadioGroup from "@material-ui/core/RadioGroup";

import ExpandMoreIcon from "@material-ui/icons/ExpandMore";
import ChevronRightIcon from "@material-ui/icons/ChevronRight";

const useStyles = makeStyles({
  root: {
    flexGrow: 1,
    minHeight: 360,
    border: "1px solid #eeeeee",
    padding: "1rem"
  },
  enabledLabel: {
    color: "black"
  },
  disabledLabel: {
    color: "#555555"
  }
});

export const CategoryTreeItem = ({ categoryData, checkDisable, classes }) => {
  let disabled = false;
  if (checkDisable) {
    disabled = checkDisable(categoryData);
  }
  return (
    <TreeItem
      nodeId={categoryData.categoryId}
      label={
        <FormControlLabel
          value={categoryData.categoryId}
          control={<Radio color="primary" />}
          disabled={disabled}
          label={
            <label
              className={
                disabled ? classes.disabledLabel : classes.enabledLabel
              }
            >
              {categoryData.name}
            </label>
          }
        />
      }
    >
      {categoryData.children && (
        <React.Fragment>
          {categoryData.children.map(child => (
            <CategoryTreeItem
              key={child.categoryId}
              categoryData={child}
              checkDisable={disabled ? () => true : checkDisable}
              classes={classes}
            />
          ))}
        </React.Fragment>
      )}
    </TreeItem>
  );
};

export const traverseCategoryData = (treeData, callback) => {
  if (Array.isArray(treeData)) {
    treeData.forEach(root => traverseCategoryData(root, callback));
    return;
  }
  callback(treeData);
  if (treeData.children && treeData.children.length) {
    treeData.children.forEach(child => {
      traverseCategoryData(child, callback);
    });
  }
};

const CategoryTree = ({
  treeData,
  selectedCategoryId,
  onSelect,
  checkDisable
}) => {
  const { t } = useTranslation();
  const treeDataWithRoot = [
    {
      name: t("Home"),
      categoryId: "0",
      children: treeData
    }
  ];
  const classes = useStyles();
  const expanded = [];
  traverseCategoryData(treeDataWithRoot, ({ categoryId }) => {
    expanded.push(categoryId);
  });
  const [model, setModel] = useState(selectedCategoryId);

  return (
    <TreeView
      className={classes.root}
      defaultCollapseIcon={<ExpandMoreIcon />}
      defaultExpandIcon={<ChevronRightIcon />}
      expanded={expanded}
    >
      <RadioGroup
        name="category-tree-radio-group"
        value={model}
        onChange={e => {
          onSelect(e.target.value);
          setModel(e.target.value);
        }}
      >
        {treeDataWithRoot.map(categoryData => (
          <CategoryTreeItem
            key={categoryData.categoryId}
            categoryData={categoryData}
            checkDisable={checkDisable}
            classes={classes}
          />
        ))}
      </RadioGroup>
    </TreeView>
  );
};

CategoryTreeItem.propTypes = {
  categoryData: PropTypes.shape({
    categoryId: PropTypes.string,
    name: PropTypes.string,
    children: PropTypes.array
  }),
  checkDisable: PropTypes.func,
  classes: PropTypes.object
};

CategoryTree.propTypes = {
  treeData: PropTypes.array,
  selectedCategoryId: PropTypes.string,
  checkDisable: PropTypes.func,
  onSelect: PropTypes.func
};

export default CategoryTree;
