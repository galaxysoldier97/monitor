import React, { PropTypes, useState } from 'react';
import { t } from 'mt-react-library/functions';
import Table from '@material-ui/core/Table';
import TableCell from '@material-ui/core/TableCell';
import TableRow from '@material-ui/core/TableRow';
import TableBody from '@material-ui/core/TableBody';
import TableHead from '@material-ui/core/TableHead';
import TablePagination from '@material-ui/core/TablePagination';
import { makeStyles } from '@material-ui/styles';

const useStyles = makeStyles(() => ({
  table: {
    backgroundColor: '#fffafa',
    padding: '1em 3em',
  },
}));

export const ImportHistoryErrorsTable = ({history}) => {
  const errorsHeaders = ['line', 'error', 'group'];
  const [page, setPage] = useState(0);
  const classes = useStyles();
  const pageSize = 20;
  return <React.Fragment>
    <Table className={classes.table}>
      <TableHead>
        <TableRow>
          {errorsHeaders.map(key => <TableCell key={key}>{t('import.' + key)}</TableCell>)}
        </TableRow>
      </TableHead>
      <TableBody>
        {history.errors.slice(pageSize * page, pageSize * page + pageSize).map((error) => (
          <TableRow key={error.id}>
            {errorsHeaders.map(key => <TableCell key={key}>{error[key]}</TableCell>)}
          </TableRow>
        ))}
      </TableBody>
    </Table>
    <TablePagination
      component="div"
      count={history.errors.length}
      rowsPerPage={pageSize}
      page={page}
      onChangePage={(event, p) => setPage(p)}
      rowsPerPageOptions={[]}
    />
  </React.Fragment>;
};

ImportHistoryErrorsTable.propTypes = {
  history: PropTypes.Object,
};
