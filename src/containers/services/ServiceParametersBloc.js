import React, { PropTypes } from 'react';
import PageBase from '../../components/PageBase';
import { TplEnhancedTable } from 'mt-react-library/containers/templates';
import { t } from 'mt-react-library/functions';
import { Typography } from '@material-ui/core';

const serviceParametersHeaders = [
  {id: 'code', label: t('code')},
  {id: 'value', label: t('value')},
  {id: 'description', label: t('description')},
];

export const ServiceParametersBlock = ({serviceParameters}) => {
  return (
    <PageBase title={t('service.serviceParameters')}>
      {serviceParameters.length > 0 ? <TplEnhancedTable rows={serviceParameters}
                                                        headers={serviceParametersHeaders}
                                                        rowMapper={item => [{
                                                          ...item,
                                                          code: item.technicalParameter && item.technicalParameter.parameterCode,
                                                          description: item.technicalParameter && item.technicalParameter.description,
                                                        }, {}]}
      /> : <Typography style={{paddingTop: '1em'}}>{t('service.noServiceParameters')}</Typography>}
    </PageBase>
  );
};

ServiceParametersBlock.propTypes = {
  serviceParameters: PropTypes.arrayOf(PropTypes.shape({
    value: PropTypes.string,
    technicalParameter: PropTypes.object,
  })),
};
