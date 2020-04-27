import React from "react";
import { useState, useEffect, forwardRef, useImperativeHandle } from "react";
import { useTranslation } from "react-i18next";
import { makeStyles } from "@material-ui/core/styles";

import GridContainer from "components/Grid/GridContainer.js";
import GridItem from "components/Grid/GridItem.js";

import Card from "components/Card/Card.js";
import CardHeader from "components/Card/CardHeader.js";
import CardBody from "components/Card/CardBody.js";
import CardFooter from "components/Card/CardFooter.js";

import TreeView from "@material-ui/lab/TreeView";
import TreeItem from "@material-ui/lab/TreeItem";

import Button from "@material-ui/core/Button";
import Skeleton from "@material-ui/lab/Skeleton";

import SaveIcon from "@material-ui/icons/Save";
import ExpandMoreIcon from "@material-ui/icons/ExpandMore";
import ChevronRightIcon from "@material-ui/icons/ChevronRight";

const useStyles = makeStyles({
  root: {
    flexGrow: 1,
    minHeight: 360,
    border: "1px solid #eeeeee",
    padding: "1rem"
  }
});

export const DEFAULT_STRUCTURE_DATA = [
  {
    categoryId: "1",
    name: "Home",
    children: [
      {
        categoryId: "2",
        name: "Food & Drinks",
        children: [
          {
            categoryId: "3",
            name: "Snacks"
          },
          {
            categoryId: "4",
            name: "Beverage"
          }
        ]
      },
      {
        categoryId: "5",
        name: "Fashion & Lingeries",
        children: [
          {
            categoryId: "6",
            name: "Men"
          },
          {
            categoryId: "7",
            name: "Women"
          }
        ]
      }
    ]
  },
  {
    categoryId: "8",
    name: "FAQ",
    children: [
      {
        categoryId: "9",
        name: "Contact Us"
      }
    ]
  }
];

const TreeSkeleton = () => (
  <GridItem align="right">
    <Skeleton height={48} />
    <Skeleton height={36} width="75%" />
    <Skeleton height={36} width="75%" />
    <Skeleton height={36} width="50%" />
    <Skeleton height={36} width="50%" />
  </GridItem>
);

const CategoryTreeItem = ({ categoryData }) => {
  if (!categoryData.children || !categoryData.children.length) {
    return (
      <TreeItem nodeId={categoryData.categoryId} label={categoryData.name} />
    );
  } else {
    return (
      <TreeItem nodeId={categoryData.categoryId} label={categoryData.name}>
        {categoryData.children.map(child => (
          <CategoryTreeItem key={child.categoryId} categoryData={child} />
        ))}
      </TreeItem>
    );
  }
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

const CategoryStructure = forwardRef((props, ref) => {
  const { t } = useTranslation();
  const classes = useStyles();
  const [treeData, setTreeData] = useState(DEFAULT_STRUCTURE_DATA);
  const [loading, setLoading] = useState(true);
  const [defaultExpanded, setDefaultExpanded] = useState([]);

  useEffect(() => {
    const expanded = [];
    traverseCategoryData(treeData, ({ categoryId }) => {
      expanded.push(categoryId);
    });
    setDefaultExpanded(expanded);
    setLoading(false);
  }, []);

  useImperativeHandle(ref, () => ({
    update() {
      alert("update");
    }
  }));

  return (
    <Card>
      <CardHeader color="primary">
        <GridContainer>
          <GridItem xs={12} lg={6}>
            <h4>{t("Category Structure")}</h4>
          </GridItem>
          <GridItem
            xs={12}
            lg={6}
            container
            direction="row-reverse"
            alignItems="center"
          >
            <Button variant="contained" color="default">
              <SaveIcon />
              {t("Save")}
            </Button>
          </GridItem>
        </GridContainer>
      </CardHeader>
      <CardBody>
        {loading && <TreeSkeleton />}
        {!loading && treeData && (
          <TreeView
            className={classes.root}
            defaultCollapseIcon={<ExpandMoreIcon />}
            defaultExpandIcon={<ChevronRightIcon />}
            defaultExpanded={defaultExpanded}
          >
            {treeData.map(categoryData => (
              <CategoryTreeItem
                key={categoryData.categoryId}
                categoryData={categoryData}
              />
            ))}
          </TreeView>
        )}
      </CardBody>
    </Card>
  );
});

CategoryStructure.displayName = "CategoryStructure";
export default CategoryStructure;
