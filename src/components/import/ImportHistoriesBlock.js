import React, { PropTypes, useEffect, useState } from 'react';
import { TplActionButton } from 'mt-react-library/containers/templates';
import { Refresh } from '@material-ui/icons';
import { t } from 'mt-react-library/functions';
import Typography from '@material-ui/core/Typography';
import Grid from '@material-ui/core/Grid';
import Table from '@material-ui/core/Table';
import TableCell from '@material-ui/core/TableCell';
import TableRow from '@material-ui/core/TableRow';
import TableBody from '@material-ui/core/TableBody';
import TableHead from '@material-ui/core/TableHead';
import ImportHistoryService from '../../services/ImportHistoryService';
import LinearProgress from '@material-ui/core/LinearProgress';
import Button from '@material-ui/core/Button';
import Chip from '@material-ui/core/Chip';
import { ImportHistoryErrorsTable } from './ImportHistoryErrorsTable';
import TablePagination from '@material-ui/core/TablePagination';
import Popover from '@material-ui/core/Popover';
import Select from '@material-ui/core/Select';
import MenuItem from '@material-ui/core/MenuItem';
import FilterListIcon from '@material-ui/icons/FilterList';
import TextField from '@material-ui/core/TextField';
import FormControl from '@material-ui/core/FormControl';
import InputLabel from '@material-ui/core/InputLabel';
import IconButton from '@material-ui/core/IconButton';
import DeleteIcon from '@material-ui/icons/Delete';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogTitle from '@material-ui/core/DialogTitle';
import Box from '@material-ui/core/Box';
import { CircularProgress } from '@material-ui/core';
import { RequestState } from '../../helpers/requestState';
import { ErrorAlert } from '../../components/ErrorAlert';

export const ImportHistoriesBlock = ({entityCategory, message}) => {

  const tableSize = 20;
  const importStatus = {completed: 'COMPLETED', started: 'STARTED', aborted: 'ABORTED'};
  const [histories, setHistories] = useState();
  const [error, setError] = useState();
  const [refresh, setRefresh] = useState(0);
  const [loading, setLoading] = useState(false);
  const [pagination, setPagination] = useState({size: 1, page: 0, total: -1});
  const [showErrorsId, setShowErrorsId] = useState();
  const [popoverAnchorEl, setPopoverAnchorEl] = useState(null);
  const [filters, setFilters] = useState({
    importStatus: '',
    fileName: '',
  });
  const headers = ['fileName', 'start', 'end', 'importStatus', 'errors', ''];
  const [deleteDialogIsOpen, setDeleteDialogIsOpen] = useState(false);
  const [deleteLastRequestState, setDeleteLastRequestState] = useState();

  const selectStatusComponent = () => (
    <FormControl variant="filled">
      <InputLabel>{t('import.info.detail.importStatus')}</InputLabel>
      <Select name="status"
              onChange={(event) => setFilters({...filters, importStatus: event.target.value})}
              value={filters.importStatus}>
        {Object.values(importStatus).map(status => <MenuItem key={status} value={status}>{status}</MenuItem>)}
      </Select>
    </FormControl>);
  const filtersComponent = {
    fileName: <TextField variant="filled" name="fileName" label={t('import.info.detail.fileName')} value={filters.fileName} onChange={(event) => setFilters({...filters, fileName: event.target.value})} />,
    importStatus: selectStatusComponent(),
  };

  const handleClosePopover = () => {
    setPopoverAnchorEl(null);
    setPagination({...pagination, page: 0, size: tableSize});
    setRefresh(refresh + 1);
  };

  const deleteImport = () => {
    setDeleteLastRequestState(RequestState.progress);
    ImportHistoryService.deleteLast(entityCategory)
    .then(() => {
      setDeleteDialogIsOpen(false);
      setDeleteLastRequestState(RequestState.success);
      setRefresh(refresh + 1);
    })
    .catch(() => setDeleteLastRequestState(RequestState.error));
  };

  useEffect(() => {
    setLoading(true);
    ImportHistoryService.search({filter: {fileName: filters.fileName, status: filters.importStatus}, pagination: {size: pagination.size, number: pagination.page}}, entityCategory)
    .then(data => {
      setHistories(data.content || []);
      setPagination({...pagination, total: data.totalElements || -1});
    })
    .catch(err => setError(err))
    .finally(() => setLoading(false));
  }, [refresh, pagination.size, pagination.page]);

  useEffect(() => {
    if (!message) {
      setPagination({...pagination, page: 0});
      setRefresh(refresh + 1);
    }
  }, [message]);

  useEffect(() => {
    setPagination({...pagination, page: 0, size: 1});
    setRefresh(refresh + 1);
  }, [entityCategory]);

  const confirmDeleteLastHistory = () => {
    setDeleteLastRequestState(undefined);
    setDeleteDialogIsOpen(true);
  };

  return (
    <Grid container direction="column" spacing={2}>
      <Grid item>
        <Typography variant="h6">{t('import.history', <TplActionButton icon={<Refresh />} onClick={() => setRefresh(refresh + 1)} />)}</Typography>
      </Grid>
      {loading && <LinearProgress />}
      {!loading && error &&
      <Grid item>
        <Typography color="error">{t('import.lastImportError')}
        </Typography>
      </Grid>}
      {!loading && histories && histories[0] && histories[0].importStatus === 'STARTED' &&
      <Grid item>
        <Typography color="primary">{t('import.lastImportInProgress')}</Typography>
      </Grid>
      }
      {!loading && histories &&
      <Grid item>
        <Table>
          <TableHead>
            <TableRow>
              {headers.map(key => <TableCell key={key}>
                <Grid container direction="column">
                  <Grid item>
                    {filtersComponent[key] ?
                      <Button name={key}
                              size="small"
                              endIcon={<FilterListIcon />}
                              onClick={(e) => setPopoverAnchorEl(e.currentTarget)}>{key && t('import.info.detail.' + key) || ''}
                      </Button> : (key && t('import.info.detail.' + key) || '')}
                  </Grid>
                  {filters[key] && <Grid item>
                    <Chip size="small" label={(filters[key] instanceof Date) ? filters[key].toLocaleString() : filters[key]} onDelete={() => {
                      setFilters({...filters, [key]: ''});
                      setRefresh(refresh + 1);
                    }} />
                  </Grid>}
                </Grid>
              </TableCell>)}
            </TableRow>
          </TableHead>
          <TableBody>
            {histories.map((history, index) => (
              <React.Fragment key={history.id}>
                <TableRow>
                  <TableCell key="fileName">{history.fileName}</TableCell>
                  <TableCell key="start">{history.start ? new Date(history.start).toLocaleString() : ''}</TableCell>
                  <TableCell key="end">{history.end ? new Date(history.end).toLocaleString() : ''}</TableCell>
                  <TableCell key="importStatus">{history.importStatus}</TableCell>
                  <TableCell>
                    <Chip label={history.errors && history.errors.length} color={history.errors.length ? 'primary' : 'default'} onClick={() => setShowErrorsId(showErrorsId === history.id ? undefined : history.id)} />
                  </TableCell>
                  <TableCell>
                    {index === 0 && history.importStatus === importStatus.started && (
                      <IconButton onClick={confirmDeleteLastHistory}>
                        <DeleteIcon fontSize="small" color="primary" />
                      </IconButton>
                    )}
                  </TableCell>
                </TableRow>
                {showErrorsId === history.id && history.errors && history.errors.length > 0 &&
                <TableRow>
                  <TableCell colSpan={12}>
                    <ImportHistoryErrorsTable history={history} />
                  </TableCell>
                </TableRow>
                }
              </React.Fragment>
            ))}
          </TableBody>
        </Table>
        {pagination.size > 1 && <TablePagination
          component="div"
          count={pagination.total || -1}
          rowsPerPage={pagination.size}
          page={pagination.page}
          onChangePage={(event, page) => setPagination({...pagination, page})}
          rowsPerPageOptions={[]}
        />}
        <Popover
          id="popover"
          open={!!popoverAnchorEl}
          anchorEl={popoverAnchorEl}
          onClose={handleClosePopover}
          anchorOrigin={{
            vertical: 'bottom',
            horizontal: 'center',
          }}
          transformOrigin={{
            vertical: 'top',
            horizontal: 'center',
          }}
        >
          {popoverAnchorEl && popoverAnchorEl.name && filtersComponent[popoverAnchorEl.name]}
        </Popover>
      </Grid>
      }
      {!loading && histories && pagination.size === 1 && <Grid item>
        <Grid container item justify="flex-end">
          <Button variant="contained" size="small" color="secondary" onClick={() => setPagination({...pagination, size: tableSize})}>{t('viewMore')}
          </Button>
        </Grid>
      </Grid>}
      <Dialog open={deleteDialogIsOpen} onClose={() => setDeleteDialogIsOpen(false)} disableBackdropClick={deleteLastRequestState === RequestState.progress} maxWidth="xs" fullWidth>
        <DialogTitle>{t('import.info.detail.deleteImport')}</DialogTitle>
        <DialogContent>
          {t('import.info.detail.confirmDelete')}
          {deleteLastRequestState === RequestState.error && <ErrorAlert message={t('import.info.detail.errorDelete')} />}
        </DialogContent>
        <DialogActions>
          {deleteLastRequestState === RequestState.progress
            ? <Box marginRight={2} marginBottom={1}><CircularProgress size={25} /></Box>
            : (
              <React.Fragment>
                <Button onClick={() => setDeleteDialogIsOpen(false)} color="primary">{t('button.cancel')}</Button>
                <Button onClick={deleteImport} color="primary" autoFocus>{t('button.delete')}</Button>
              </React.Fragment>
            )}
        </DialogActions>
      </Dialog>
    </Grid>);
};

ImportHistoriesBlock.propTypes = {
  entityCategory: PropTypes.String,
  message: PropTypes.string,
};
