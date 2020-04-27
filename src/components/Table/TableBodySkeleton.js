import React from "react";
import PropTypes from "prop-types";
import TableRow from "@material-ui/core/TableRow";
import TableCell from "@material-ui/core/TableCell";
import Skeleton from "@material-ui/lab/Skeleton";

const TableBodySkeleton = ({
  colCount = 1,
  rowCount = 3,
  ...skeletonProps
}) => {
  const rowIndexes = Array.from(Array(rowCount), (val, idx) => idx);
  return (
    <>
      {rowIndexes.map(idx => {
        return (
          <TableRow key={idx}>
            <TableCell colSpan={colCount}>
              <Skeleton variant="rect" height={48} {...skeletonProps} />
            </TableCell>
          </TableRow>
        );
      })}
    </>
  );
};
TableBodySkeleton.propTypes = {
  colCount: PropTypes.number,
  rowCount: PropTypes.number
};
export default TableBodySkeleton;
