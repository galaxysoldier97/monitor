import React, {useEffect} from 'react';
import PropTypes from 'prop-types';
import {TplEnhancedDialog, TplLoading} from 'mt-react-library/containers/templates';
import {Box, Snackbar} from '@material-ui/core';
import {Tune} from '@material-ui/icons';
import PageBase from '../components/PageBase';
import {connect} from 'react-redux';
import {NavigationBuilder} from 'mt-react-library/components/NavigationBuilder';
import Actions from '../actions/Actions';
import store from '../store';
import {prepareSimCard} from '../components/import/simCardImport';
import {prepareNumbers} from '../components/import/numbersImport';
import {prepareIpAddresses} from '../components/import/ipAddressesImport';
import {prepareEquipmentsAdmin} from '../components/import/equipmentsAdminImport';
import {prepareServicesAdmin} from '../components/import/servicesAdminImport';
import {prepareAddressAdmin} from '../components/import/addressAdminImport';
import {prepareCPE} from '../components/import/cpeImport';
import {prepareAncillaryEquipments} from '../components/import/ancillaryEquipmentsImport';
import Grid from '@material-ui/core/Grid';
import CircularProgress from '@material-ui/core/CircularProgress';
import {ImportHistoriesBlock} from '../components/import/ImportHistoriesBlock';
import {prepareStockImport} from '../components/import/stockAdminImport';
import {resourcesScopes} from '../config/resources/resourcesScopes';
import Auth from '../services/Auth';
import {addToObj, removeFromObj} from "../helpers/commonHelper";
import TecrepEquipmentModelService from "../services/equipments/TecrepEquipmentModelService";
import {prepareResourcesImport} from "../components/import/ResourcesAdminImport";
import {useTranslation} from "react-i18next";
import TecrepProviderService from "../services/equipments/TecrepProviderService";

const getPreparedData = (entity, operation, init) => {
  const ancillaryEquipmentsType = new URLSearchParams(location.search).get('type');
  switch (entity) {
    case 'cpe' :
      return prepareCPE(operation, init);
    case 'simCard' :
      return prepareSimCard(operation, init);
    case 'number' :
      return prepareNumbers(operation, init);
    case 'ipAddresses' :
      return prepareIpAddresses(operation);
    case 'resourcesAdmin':
      return prepareResourcesImport(operation, init);
    case 'equipmentsAdmin' :
      return prepareEquipmentsAdmin(operation);
    case 'servicesAdmin' :
      return prepareServicesAdmin(operation);
    case 'addressAdmin' :
      return prepareAddressAdmin(operation);
    case 'ancillaryEquipments' :
      return prepareAncillaryEquipments(operation, init, ancillaryEquipmentsType);
    case 'stockAdmin' :
      return prepareStockImport(operation, init);
    default:
      return null;
  }
};

const EntityImport = ({entity, operation, init, notification}) => {
  const prepared = !!init && getPreparedData(entity, operation, init);
  const [importParams, setImportParams] = React.useState(prepared && prepared.initialValues);
  const [importInProgress, setImportInProgress] = React.useState(false);
  const [refreshForm, setRefreshForm] = React.useState(0);
  const {t} = useTranslation();

  useEffect(() => {
    const data = !!init && getPreparedData(entity, operation, init);
    setImportParams(data && data.initialValues);
    setImportInProgress(false);
    setRefreshForm(refreshForm + 1);
  }, [entity, operation, init]);
  if (!['import', 'changeStatus'].includes(operation) || !entity || !Auth.connectedUserHasPermission(resourcesScopes[entity].read)) {
    return null;
  }
  if (!init) {
    return <TplLoading/>;
  }

  let navigation = new NavigationBuilder(null, store)
    .withHRef(Actions.IMPORTER, {
      ajax: true, mapper: (action, input) => {
        if (input.target && input.target.action) {
          action.params = [input.target.entity, input.target.operation, input.target.action, input.target.payload, input.target.importParams];
        } else {
          action.params = [entity, operation, 'init'];
        }
      },
    })
    .build();

  const proceedAction = (params) => {
    if (params.entity === '') {
      return;
    }
    navigation.hrefOnClick(Actions.IMPORTER)({
      action: 'upload',
      payload: {
        entityCategory: prepared.meta.entityCategory,
        entityName: params.entity,
        value: params.file,
      },
      importParams: removeFromObj(params, "entity"),
      entity,
      operation,
    });
    setImportInProgress(true);
  };

  const validateRequiredFields = (fieldsToValidate, receivedParams) => {
    const missingFields = {};

    for (const field of fieldsToValidate) {
      if (field.required && receivedParams[field.id] === undefined) {
        missingFields[field.id] = t('requiredField');
      }
    }

    return missingFields;
  };

  const computeConfiguration = params => {
    const category = params.entity === 'AncillaryEquipment' ? 'ANCILLARY' : 'CPE';
    const name = params.entity === 'AncillaryEquipment' ? params.equipmentName : params.accessType;
    params = removeFromObj(params, 'equipmentName');
    if (['AncillaryEquipment', 'CPE'].includes(params.entity) && params?.modelName) {
      TecrepEquipmentModelService.getModels()
        .then(data => {
          if (data.content.length) {
            const element = data.content.filter(x => x.name === params.modelName && x.category === category);
            if (element.length && element[0] !== undefined) {
              const configuration = name + '_' + element[0].provider.name;
              proceedAction(addToObj(params, 'configuration', configuration));
            }
          }
        }).catch(e => e);
    } else if ("SimCard" === params.entity) {
      TecrepProviderService.getProviderById(params.providerId)
        .then(data => {
          if (data) {
            const configuration = params.brand !== undefined ? data.name + '_' + params.brand : data.name;
            params = removeFromObj(params, 'providerId');
            proceedAction(addToObj(params, 'configuration', configuration));
          }
        }).catch(e => e);
    } else {
      proceedAction(params);
    }
  };

  return (
    <PageBase scope="import" title={t('import.equipments.' + prepared.operation)} navigation={t(prepared.meta.title)}>
      <Grid container spacing={2} direction="column">
        <Grid item>
          {prepared.headers && !importInProgress && <Box marginTop={2} marginBottom={1}>
            <TplEnhancedDialog
              dialogProps={{maxWidth: 'sm', fullWidth: true}}
              key={`${entity}${operation}${refreshForm}`}
              title={t(operation)}
              headers={prepared.headers}
              confirmProps={{label: t('confirm'), icon: <Tune/>}}
              cancelProps={{label: t('cancel')}}
              initialValues={importParams || {}}
              closed={notification.show}
              autocloseOnConfirm={false}
              validate={values => validateRequiredFields(prepared.headers, values)}
              showProps={{contained: true, label: t(operation), icon: <Tune/>}}
              onConfirm={params => {
                computeConfiguration({...importParams, ...params});
              }}
            /></Box>}
        </Grid>
        {importInProgress && !notification.message && <Grid item>
          <CircularProgress size={30}/>
        </Grid>}
        <Grid item>
          <ImportHistoriesBlock entityCategory={prepared.meta.entityCategory} message={notification.message}/>
        </Grid>
      </Grid>
      <Snackbar
        id="popup"
        open={notification.show}
        message={notification.message}
        autoHideDuration={3000}
        onClose={() => {
          setImportInProgress(false);
          navigation.hrefOnClick(Actions.IMPORTER)({action: 'notification', entity, operation});
        }}
      />
    </PageBase>
  );
};

EntityImport.propTypes = {
  entity: PropTypes.string,
  operation: PropTypes.string,
  init: PropTypes.object,
  notification: PropTypes.object,
};

const mapStateToProps = state => {
  const entity = state.importer && state.importer.params && state.importer.params[0];
  const operation = state.importer && state.importer.params && state.importer.params[1];
  const payload = state.importer && state.importer.payload && state.importer.payload[entity] && state.importer.payload[entity][operation];
  return {
    entity,
    operation,
    init: payload && payload.init,
    notification: payload && payload.notification || {show: false},
  };
};

const EntityImportPage = connect(mapStateToProps)(EntityImport);
export default EntityImportPage;
