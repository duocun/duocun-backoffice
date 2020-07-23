import React from 'react';
import { useTranslation } from "react-i18next";
import TableSortLabel from "@material-ui/core/TableSortLabel";
import TableHead from "@material-ui/core/TableHead";
import TableRow from "@material-ui/core/TableRow";
import TableCell from "@material-ui/core/TableCell";

export const TableHeadCell = ({ sort, field, label, onSetSort }) => {
  const { t } = useTranslation();

  const toggleSort = (fieldName) => {// sort only one field
    if (sort && sort[0] === fieldName) {
      onSetSort([fieldName, sort[1] === 1 ? -1 : 1]);
    } else {
      onSetSort([fieldName, 1]);
    }
  }

  const renderSortLabel = (fieldName) => {
    return (
      <TableSortLabel
        active={sort && sort[0] === fieldName}
        direction={sort && sort[1] === -1 ? "desc" : "asc"}
        onClick={() => { toggleSort(fieldName); }}
      >
      </TableSortLabel>
    )
  }

  return (
    <TableCell
      onClick={() => { toggleSort(field); }}
      style={{ cursor: "pointer" }}
    >
      {t(label)}
      {renderSortLabel(field)}
    </TableCell>
  )
}

// data --- [{field:x, label}]
export const TableHeader = ({data, sort, onSetSort}) => {
  return(
    <TableHead>
      <TableRow>
        {
          data && data.length > 0 &&
          data.map(t => 
            <TableHeadCell sort={sort} field={t.field} label={t.label} onSetSort={onSetSort} />
          )
        }
        
        {/* <TableHeadCell sort={sort} field="created" label="Created Date" onSetSort={setSort} />
        <TableHeadCell sort={sort} field="fromName" label="From Name" onSetSort={setSort} />
        <TableHeadCell sort={sort} field="toName" label="To Name" onSetSort={setSort} />
        <TableHeadCell sort={sort} field="amount" label="Amount" onSetSort={setSort} />
        <TableHeadCell sort={sort} field="toBalance" label="Balance" onSetSort={setSort} />
        <TableHeadCell sort={sort} field="note" label="Note" onSetSort={setSort} />
        <TableCell>{t("Actions")}</TableCell> */}
      </TableRow>
    </TableHead>
  )
}