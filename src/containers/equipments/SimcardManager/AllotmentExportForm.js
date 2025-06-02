import React, { useState } from 'react';
import { CircularProgress } from '@material-ui/core';
import { RequestState } from '../../../helpers/requestState';
import { t } from 'mt-react-library/functions';
import { AllotmentService } from '../../../services/equipments/AllotmentService';
import FormControl from '@material-ui/core/FormControl';
import Select from '@material-ui/core/Select';
import MenuItem from '@material-ui/core/MenuItem';
import FormHelperText from '@material-ui/core/FormHelperText';
import IconButton from '@material-ui/core/IconButton';
import { Check } from '@material-ui/icons';
import PropTypes from 'prop-types';
import { downloadTextFile } from '../../../helpers/exportHelper';

export const AllotmentExportForm = (props) => {
  const {allotment, fileConfigurationRequestState} = props;
  const [exportRequestState, setExportRequestState] = useState();
  const [fileConfigurationSelected, setFileConfigurationSelected] = useState(fileConfigurationRequestState.data && fileConfigurationRequestState.data[0] && fileConfigurationRequestState.data[0].name);

  const exportAllotment = () => {
    let fileName = `Returned-${fileConfigurationSelected}-${allotment.allotmentId}`;
    setExportRequestState(RequestState.progress);
    AllotmentService.export(allotment.allotmentId, fileConfigurationSelected)
    .then(response => {
      if (response && response.data) {
        if (response.headers['content-disposition']) {
          fileName = response.headers['content-disposition'].split('=')[1];
        }
        downloadTextFile(fileName, response.data);
        setExportRequestState(RequestState.success);
      }
      else {
        setExportRequestState(RequestState.error);
      }
    })
    .catch(() => setExportRequestState(RequestState.error));
  };

  return (
    <>
      <FormControl error={fileConfigurationRequestState.state === RequestState.error || exportRequestState === RequestState.error}>
        <Select name="fileConfiguration" value={fileConfigurationSelected} onChange={e => setFileConfigurationSelected(e.target.value)}>
          {fileConfigurationRequestState.data && fileConfigurationRequestState.data.map(item => <MenuItem key={item.fileId} value={item.name}>{item.name}</MenuItem>)}
        </Select>
        {fileConfigurationRequestState.state === RequestState.error && <FormHelperText>{t('allotment.errorFetchingConfiguration')}</FormHelperText>}
        {exportRequestState === RequestState.error && <FormHelperText>{t('allotment.exportError')}</FormHelperText>}
        {exportRequestState === RequestState.success && <FormHelperText>{t('allotment.exportSuccess')}</FormHelperText>}
      </FormControl>
      {fileConfigurationRequestState.state === RequestState.success && <IconButton disabled={exportRequestState === RequestState.progress} onClick={exportAllotment}><Check /></IconButton>}
      {exportRequestState === RequestState.progress && <CircularProgress size={25} />}
    </>
  );
};

AllotmentExportForm.propTypes = {
  allotment: PropTypes.object,
  fileConfigurationRequestState: PropTypes.object,
};
