import React, { useEffect, useState } from 'react';
import PageBase from '../../../components/PageBase';
import { TplLoading } from 'mt-react-library/containers/templates';
import { t } from 'mt-react-library/functions';
import { ErrorAlert } from '../../../components/ErrorAlert';
import Button from '@material-ui/core/Button';
import { makeStyles } from '@material-ui/styles';
import Box from '@material-ui/core/Box';
import {Add, Delete, GetApp} from '@material-ui/icons';
import { SIMCardGeneratorDialog } from './SIMCardGeneratorDialog';
import TecrepSimCardService from '../../../services/equipments/TecrepSimCardService';
import CircularProgress from '@material-ui/core/CircularProgress';
import Snackbar from '@material-ui/core/Snackbar';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import TableContainer from '@material-ui/core/TableContainer';
import Table from '@material-ui/core/Table';
import TableCell from '@material-ui/core/TableCell';
import TableBody from '@material-ui/core/TableBody';
import TablePagination from '@material-ui/core/TablePagination';
import { getDisplayedDate } from '../../../helpers/commonHelper';
import Grid from '@material-ui/core/Grid';
import Collapse from '@material-ui/core/Collapse';
import IconButton from '@material-ui/core/IconButton';
import KeyboardArrowDownIcon from '@material-ui/icons/KeyboardArrowDown';
import AllotmentCard from './AllotmentCard';
import EmptyComponent from '../../../components/EmptyComponent';
import { Auth } from '../../../services/Auth';
import { resourcesScopes } from '../../../config/resources/resourcesScopes';
import { downloadTextFile } from '../../../helpers/exportHelper';
import FirstPageIcon from '@material-ui/icons/FirstPage';
import LastPageIcon from '@material-ui/icons/LastPage';
import KeyboardArrowLeft from '@material-ui/icons/KeyboardArrowLeft';
import KeyboardArrowRight from '@material-ui/icons/KeyboardArrowRight';
import { useTheme } from '@material-ui/core/styles';

const columns = [
  {id: 'batchNumber', label: t('simcard.batchNumber')},
  {id: 'configurationName', label: t('simcard.batches.configurationName')},
  {id: 'creationDate', label: t('simcard.batches.creationDate')},
  {id: 'fileName', label: t('simcard.batches.fileName')},
  {id: 'inventoryPoolCode', label: t('simcard.batches.inventoryPoolCode')},
  {id: 'returnedDate', label: t('simcard.batches.returnedDate')},
  {id: 'processedDate', label: t('simcard.batches.processedDate')},
];

const getDisplayedBatchFileName = filename => filename ? filename.slice(0, -4) : '';

const useStyles = makeStyles(theme => ({
  tableContainer: {
    marginTop: theme.spacing(3),
  },
  expandButton: {
    transition: 'transform 0.3s',
    '&.expanded': {
      transform: 'rotate(180deg)',
    },
  },
  row: {
    transition: 'opacity 0.3s',
    '&.inactive': {
      opacity: 0.3,
    },
  },
  downloadIcon: {
    width: '0.8em',
    height: '0.8em',
  },
}));

const SIMCardBatchesPage = () => {
  const classes = useStyles();
  const [generateDialogIsOpen, setGenerateDialogIsOpen] = useState(false);
  const [batches, setBatches] = useState([]);
  const [error, setError] = useState();
  const [loading, setLoading] = useState(true);
  const [pagination, setPagination] = useState({number: 0, size: 10, totalElements: 0});
  const [importLoading, setImportLoading] = useState();
  const [batchNotification, setBatchNotification] = useState('');
  const [expandedRow, setExpandedRow] = useState();
  const [downloadGeneratedFileLoading, setDownloadGeneratedFileLoading] = useState();
  const [uploadReturnedFile, setUploadReturnedFile] = useState();
  const [uploadReturnedFileLoading, setUploadReturnedFileLoading] = useState();
  const [updatedBatchNumbers, setUpdatedBatchNumbers] = useState([]);
  const [downloadReturnedFileLoading, setDownloadReturnedFileLoading] = useState();

  const inputRef = React.createRef();

  const toggleExpandRow = id => setExpandedRow(expandedRow === id ? undefined : id);

  const fetchBatches = () => {
    setLoading(true);
    TecrepSimCardService
    .getBatches(pagination.number, pagination.size)
    .then(response => {
      setBatches(response.content);
      setPagination({...pagination, totalElements: response.totalElements});
    })
    .catch(setError)
    .finally(() => setLoading(false));
  };

  useEffect(fetchBatches, [pagination.size, pagination.number]);

  if (loading) {
    return (<PageBase title={t('simcard.batches')} navigation={t('simcard.navigation')} backButton>
      <TplLoading />
    </PageBase>);
  }
  if (error) {
    return (
      <PageBase title={t('simcard.batches')} navigation={t('simcard.navigation')} backButton>
        <ErrorAlert message={error.message} />
      </PageBase>
    );
  }

  const handleDownloadGeneratedFile = fileName => {
    setDownloadGeneratedFileLoading(fileName);
    TecrepSimCardService
    .downloadGeneratedFile(fileName)
    .then(response => response && downloadTextFile(fileName, response.data))
    .catch(err => setBatchNotification(t('simcard.download.error', err.response.data.errorMessage || err.message)))
    .finally(() => setDownloadGeneratedFileLoading(undefined));
  };

  const handleUploadClick = batchNumber => {
    setUploadReturnedFile(batchNumber);
    inputRef.current.click();
  };

  const handleUploadReturnedFile = file => {
    if (inputRef.current) {
      inputRef.current.value = null;
    }
    setUploadReturnedFileLoading(uploadReturnedFile);
    TecrepSimCardService
    .uploadReturnedFile(uploadReturnedFile, file)
    .then(() => {
      setUpdatedBatchNumbers([...updatedBatchNumbers, uploadReturnedFile]);
      setBatchNotification(t('simcard.upload.success'));
    })
    .catch(err => setBatchNotification(t('simcard.upload.error', err.message)))
    .finally(() => setUploadReturnedFileLoading(undefined));
  };

  const handleDeleteReturnedFile = (batchNumber) => {
    TecrepSimCardService
      .deleteReturnedFile(batchNumber)
      .then(() => {
        fetchBatches();
      })
      .catch(err => setBatchNotification(t('simcard.deletefile.error', err.message)))
      .finally(() => {
        let nums = updatedBatchNumbers.filter(x => x !== batchNumber);
        setUpdatedBatchNumbers(nums);
      });
  };

  const handleDownloadReturnedFile = (batchNumber, fileName) => {
    const file = `Returned-${fileName}`;
    setDownloadReturnedFileLoading(batchNumber);
    TecrepSimCardService
    .downloadReturnedFile(batchNumber)
    .then(response => response && downloadTextFile(file, response.data))
    .catch(err => setBatchNotification(t('simcard.download.error', err.response.data.errorMessage || err.message)))
    .finally(() => setDownloadReturnedFileLoading(undefined));
  };

  const addButton = Auth.connectedUserHasPermission(resourcesScopes.simCard.create) &&
    (<Button onClick={() => setGenerateDialogIsOpen(true)} startIcon={<Add />} variant="contained" color="primary" size="small">
        {t('simcard.generate')}
      </Button>
    );

  const onSIMCardGenerationSuccess = () => {
    setGenerateDialogIsOpen(false);
    fetchBatches();
    setBatchNotification(t('simcard.batches.generationSuccess'));
  };

  const launchPrepaySimcardImport = batchNumber => {
    setImportLoading(batchNumber);
    TecrepSimCardService.launchPrepaySimcardImport(batchNumber)
    .then((res) => {
      setBatchNotification(res.data && res.data.failures && res.data.failures.length > 0 ? t('simcard.batches.importFailures', res.data.failures.length, res.data.failures[0].message) : t('simcard.batches.importSuccessful'));
      fetchBatches();
    })
    .catch(() => {
      setBatchNotification(t('simcard.batches.importFailed'));
      setImportLoading(undefined);
    });
  };

  const displayBatchReturnDate = batch => (
    <>
      {getDisplayedDate(batch.returnedDate || new Date())}
      {batch.returnedDate && <Box marginLeft={1} display="inline-block">
        {downloadReturnedFileLoading === batch.batchNumber
          ? <CircularProgress size={18} />
          : <IconButton size="small" onClick={() => handleDownloadReturnedFile(batch.batchNumber, batch.exportFileName)}><GetApp className={classes.downloadIcon} /></IconButton>
        }
        {!batch.processedDate &&
          <Box marginLeft={1} display="inline-block">
            <IconButton size="small" onClick={() => handleDeleteReturnedFile(batch.batchNumber)}><Delete color="error" /></IconButton>
          </Box>}
      </Box>}
    </>
  );

  const TablePaginationActions = (props) => {
    const theme = useTheme();
    const { count, page, rowsPerPage, onChangePage } = props;

    const handleFirstPageButtonClick = (event) => {
      onChangePage(event, 0);
    };

    const handleBackButtonClick = (event) => {
      onChangePage(event, page - 1);
    };

    const handleNextButtonClick = (event) => {
      onChangePage(event, page + 1);
    };

    const handleLastPageButtonClick = (event) => {
      onChangePage(event, Math.max(0, Math.ceil(count / rowsPerPage) - 1));
    };

    return (
      <div style={{flexShrink: 0}}>
        <IconButton
          onClick={handleFirstPageButtonClick}
          disabled={page === 0}
          aria-label="first page"
        >
          {theme.direction === 'rtl' ? <LastPageIcon /> : <FirstPageIcon />}
        </IconButton>
        <IconButton
          onClick={handleBackButtonClick}
          disabled={page === 0}
          aria-label="previous page"
        >
          {theme.direction === 'rtl' ? <KeyboardArrowRight /> : <KeyboardArrowLeft />}
        </IconButton>
        <IconButton
          onClick={handleNextButtonClick}
          disabled={page >= Math.ceil(count / rowsPerPage) - 1}
          aria-label="next page"
        >
          {theme.direction === 'rtl' ? <KeyboardArrowLeft /> : <KeyboardArrowRight />}
        </IconButton>
        <IconButton
          onClick={handleLastPageButtonClick}
          disabled={page >= Math.ceil(count / rowsPerPage) - 1}
          aria-label="last page"
        >
          {theme.direction === 'rtl' ? <FirstPageIcon /> : <LastPageIcon />}
        </IconButton>
      </div>
    );
  };

  return (
    <PageBase title={t('simcard.batches')} navigation={t('simcard.navigation')} actionButton={addButton} backButton>
      {pagination.totalElements <= 0 && <EmptyComponent message={t('simcard.batches.empty')} marginY={5} />}
      {pagination.totalElements > 0 && (
        <React.Fragment>
          <TableContainer className={classes.tableContainer}>
            <Table size="small">
              <TableHead>
                <TableRow>
                  {columns.map(column => <TableCell key={column.id}>{column.label}</TableCell>)}
                </TableRow>
              </TableHead>
              <TableBody>
                {batches.map(batch => (
                  <React.Fragment key={batch.batchNumber}>
                    <TableRow className={[classes.row, expandedRow !== undefined && expandedRow !== batch.batchNumber && 'inactive'].join(' ')}>
                      <TableCell>{batch.batchNumber}</TableCell>
                      <TableCell>{batch.configurationName}</TableCell>
                      <TableCell>{getDisplayedDate(batch.creationDate)}</TableCell>
                      <TableCell>
                        {getDisplayedBatchFileName(batch.importFileName)}
                        {batch.exportFileName && <Box marginLeft={1} display="inline-block">
                          {downloadGeneratedFileLoading === batch.exportFileName
                            ? <CircularProgress size={18} />
                            : <IconButton size="small" onClick={() => handleDownloadGeneratedFile(batch.exportFileName)}><GetApp className={classes.downloadIcon} /></IconButton>
                          }
                        </Box>}
                      </TableCell>
                      <TableCell>{batch.inventoryPoolCode}</TableCell>
                      <TableCell>
                        {batch.returnedDate || updatedBatchNumbers.includes(batch.batchNumber) ? displayBatchReturnDate(batch) : (
                          uploadReturnedFileLoading === batch.batchNumber
                            ? <CircularProgress size={18} />
                            : <Button size="small" variant="outlined" color="primary" onClick={() => handleUploadClick(batch.batchNumber)}>{t('simcard.batches.uploadFile')}</Button>
                        )}
                      </TableCell>
                      <TableCell>
                        {batch.processedDate
                          ? (
                            <Grid container justify="space-between" alignItems="center">
                              <Grid item>{getDisplayedDate(batch.processedDate)}</Grid>
                              <Grid item>
                                <IconButton onClick={() => toggleExpandRow(batch.batchNumber)} className={[classes.expandButton, expandedRow === batch.batchNumber && 'expanded'].join(' ')}>
                                  <KeyboardArrowDownIcon />
                                </IconButton>
                              </Grid>
                            </Grid>
                          )
                          : (
                            <Box marginY={1}>
                              {importLoading === batch.batchNumber
                                ? <CircularProgress size={25} />
                                : <Button size="small" color="primary" variant="outlined" onClick={() => launchPrepaySimcardImport(batch.batchNumber)} disabled={!batch.returnedDate}>{t('simcard.batches.import')}</Button>}
                            </Box>
                          )}
                      </TableCell>
                    </TableRow>
                    <TableRow>
                      <TableCell style={{padding: 0}} colSpan={7}>
                        <Collapse in={expandedRow === batch.batchNumber} unmountOnExit>
                          <AllotmentCard batch={batch} />
                        </Collapse>
                      </TableCell>
                    </TableRow>
                  </React.Fragment>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
          <input type="file"
                 style={{display: 'none'}}
                 ref={inputRef}
                 onChange={event => handleUploadReturnedFile(event.target.files[0])} />
          <TablePagination
            component="div"
            count={pagination.totalElements || -1}
            rowsPerPage={pagination.size}
            page={pagination.number}
            onChangePage={(_, number) => setPagination({...pagination, number})}
            rowsPerPageOptions={[]}
            ActionsComponent={TablePaginationActions}
          />
        </React.Fragment>
      )}

      <SIMCardGeneratorDialog open={generateDialogIsOpen} onSuccess={onSIMCardGenerationSuccess} onCancel={() => setGenerateDialogIsOpen(false)} />

      <Snackbar
        anchorOrigin={{vertical: 'bottom', horizontal: 'center'}}
        open={!!batchNotification}
        autoHideDuration={6000}
        onClose={() => setBatchNotification('')}
        message={batchNotification}
      />
    </PageBase>
  );
};

SIMCardBatchesPage.propTypes = {};

export default SIMCardBatchesPage;
