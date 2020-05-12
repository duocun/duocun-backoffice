import React from "react";
import GridItem from "components/Grid/GridItem.js";
import Skeleton from "@material-ui/lab/Skeleton";

const EditSkeleton = () => (
  <React.Fragment>
    <GridItem xs={12} lg={12}>
      <Skeleton height={48} />
    </GridItem>
    <GridItem xs={12} lg={12}>
      <Skeleton height={48} />
    </GridItem>
    <GridItem xs={12} lg={12}>
      <Skeleton height={48} />
    </GridItem>
    <GridItem xs={12} lg={12}>
      <Skeleton height={48} />
    </GridItem>
    <GridItem xs={12} lg={12}>
      <Skeleton height={48} />
    </GridItem>
    <GridItem xs={12} lg={12}>
      <Skeleton height={48} />
    </GridItem>
    <GridItem xs={12} lg={12}>
      <Skeleton height={240} />
    </GridItem>
    <GridItem xs={12} lg={12}>
      <Skeleton height={240} />
    </GridItem>
  </React.Fragment>
);
export const EditSkeletonShort = () => (
  <React.Fragment>
    <GridItem xs={12} lg={12}>
      <Skeleton height={48} />
    </GridItem>
    <GridItem xs={12} lg={12}>
      <Skeleton height={48} />
    </GridItem>
  </React.Fragment>
);

export default EditSkeleton;
