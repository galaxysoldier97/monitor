import React, { PropTypes, useState } from 'react';
import {
  Button,
  CircularProgress,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Grid
} from '@material-ui/core';
import AddIcon from '@material-ui/icons/Add';
import PublishIcon from '@material-ui/icons/Publish';
import { t } from 'mt-react-library/functions';
import { parseCsvWithHeader, parseCsvWithoutHeader } from './fileParser';

const FileImporter = (props) => {
  const {accept, onParse, expectedHeader, onFileError, uploadAction, uploadLabel, uploadIcon, uploadDisabled, noHeaderLine, confirmMessage} = props;
  const [file, setCSVFile] = useState(null);
  const [data, setData] = useState([]);
  const [isImporting, setIsImporting] = useState(false);
  const [confirmDialogOpen, setConfirmDialogOpen] = useState(false);

  const select = event => {
    const reader = new FileReader();
    const file = event.target.files[0];
    setCSVFile(file);
    setData([]);
    reader.onload = () => {
      if (accept.includes('.csv') && file.name.split('.').pop() === 'csv') {
        processCsv(reader.result);
      }
    };
    if (file) {
      reader.readAsText(file);
    }
  };

  const upload = () => {
    setConfirmDialogOpen(false);
    setIsImporting(true);
    uploadAction(file).finally(() => setIsImporting(false));
  };

  const confirmOrProceed = () => {
    if (confirmMessage) {
      setConfirmDialogOpen(true);
    } else {
      upload();
    }
  };

  const processCsv = result => {
    try {
      const parser = noHeaderLine ? parseCsvWithoutHeader : parseCsvWithHeader;
      const parsed = parser(result, expectedHeader);
      onParse(parsed);
      setData(parsed);
    } catch (e) {
      onFileError(e);
    }
  };

  return (
    <Grid container spacing={2} alignItems="center">
      {isImporting && (
        <Grid item>
          <CircularProgress size={20} />
        </Grid>
      )}
      <Grid item>
        <input id="file-input" type="file" onChange={select} accept={accept} onClick={e => e.target.value = null} hidden />
        <Button component="label" htmlFor="file-input" variant="contained" color="secondary" startIcon={<AddIcon />} disabled={isImporting}>
          {t('selectFile')}
        </Button>
      </Grid>
      <Grid item>
        <Button variant="contained" color="primary" startIcon={uploadIcon || <PublishIcon />} onClick={confirmOrProceed} disabled={uploadDisabled || data.length === 0 || isImporting}>
          {uploadLabel || t('import')}
        </Button>
      </Grid>
      {confirmMessage && (
        <Dialog open={confirmDialogOpen} maxWidth="sm" fullWidth>
          <DialogTitle>{t('confirm')}</DialogTitle>
          <DialogContent>
            {confirmMessage}
          </DialogContent>
          <DialogActions>
            <Button onClick={() => setConfirmDialogOpen(false)}>{t('no')}</Button>
            <Button onClick={upload}>{t('yes')}</Button>
          </DialogActions>
        </Dialog>
      )}
    </Grid>
  );
};

FileImporter.propTypes = {
  accept: PropTypes.string.isRequired,
  expectedHeader: PropTypes.array.isRequired,
  onParse: PropTypes.func.isRequired,
  onFileError: PropTypes.func.isRequired,
  uploadAction: PropTypes.shape({finally: PropTypes.func.isRequired}).isRequired,
  uploadLabel: PropTypes.string,
  uploadIcon: PropTypes.element,
  uploadDisabled: PropTypes.boolean,
  noHeaderLine: PropTypes.bool,
  confirmMessage: PropTypes.string,
};

export default FileImporter;
