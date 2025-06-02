import React, { useState } from 'react';
import PropTypes from 'prop-types';
import { Button, Dialog, DialogActions, DialogContent, DialogTitle, Divider, Typography } from '@material-ui/core';
import VisibilityIcon from '@material-ui/icons/Visibility';
import { t } from 'mt-react-library/functions';

export const FileConfigurationDialog = (props) => {
  const {content} = props;
  const [open, setOpen] = useState(false);

  if (!content) {
    return <Typography variant="caption">{t('fileConfiguration.emptyTemplate')}</Typography>;
  }

  return (
    <React.Fragment>
      <Button startIcon={<VisibilityIcon />} onClick={() => setOpen(true)}>{t('fileConfiguration.viewTemplate')}</Button>
      <Dialog open={open} onClose={() => setOpen(false)} maxWidth="md" fullWidth>
        <DialogTitle>{t('fileConfiguration.template')}</DialogTitle>
        <Divider />
        <DialogContent>
          {content && content.split('${\'\\n\'}').map((item, i) => (
            <pre key={i}>{item}<br /></pre>
          ))}
        </DialogContent>
        <Divider />
        <DialogActions>
          <Button onClick={() => setOpen(false)}>{t('button.close')}</Button>
        </DialogActions>
      </Dialog>
    </React.Fragment>
  );
};

FileConfigurationDialog.propTypes = {
  content: PropTypes.oneOfType([PropTypes.string, null]),
};
