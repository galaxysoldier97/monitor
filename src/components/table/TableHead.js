import {TableCell, TableHead as MaterialTableHead, TableRow} from "@material-ui/core";
import PropTypes from "prop-types";
import React from "react";
import {useTranslation} from "react-i18next";

export default function TableHead({ headers }){
  const { t } = useTranslation();

  return (
    <MaterialTableHead className="enhanced-table-head">
      <TableRow>
        {headers?.map(
          header => (
            <TableCell
              key={header.id}
              padding="none"
            >
              {t(header.label)}
            </TableCell>
          )
        )}
      </TableRow>
    </MaterialTableHead>
  );
}

TableHead.propTypes = {
  headers: PropTypes.array.isRequired,
};
