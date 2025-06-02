import React, { PropTypes } from 'react';
import connect from 'react-redux/es/connect/connect';
import { isEmpty, t } from 'mt-react-library/functions';
import Actions from '../actions/Actions';
import PageBase from '../components/PageBase';
import { NavigationBuilder } from 'mt-react-library/components/NavigationBuilder';
import store from '../store';
import { TplEnhancedTable, TplLoading } from 'mt-react-library/containers/templates';
import HistoryInfoDetails from './HistoryInfoDetails';
import Auth from '../services/Auth';
import { resourcesScopes } from '../config/resources/resourcesScopes';
import { ErrorAlert } from '../components/ErrorAlert';
import { getDate, isObject } from '../helpers/commonHelper';
import { Typography } from '@material-ui/core';

export const buildHeaders = () => [
  {id: 'date', label: t('historic.date')},
  {id: 'author', label: t('historic.author')},
  {id: 'before', label: t('historic.before')},
  {id: 'after', label: t('historic.after')},
];

const hasPermission = (entity) => {
  let scope;
  scope = resourcesScopes.number.read;
  switch (entity) {
    case 'number':
    case 'rangeNumber':
      scope = resourcesScopes.number.read;
      break;
    case 'service':
      scope = resourcesScopes.number.read;
      break;
    case 'simcard':
      scope = resourcesScopes.cpe.read;
      break;
    case 'cpe':
      scope = resourcesScopes.number.read;
      break;
    case 'ancillaryEquipment':
      scope = resourcesScopes.ancillaryEquipments.read;
      break;
    case 'building':
    case 'pto':
    case 'buildingFlat':
    case 'accessPoint':
    case 'postalAddress':
    case 'buildingStatus':
      scope = resourcesScopes.address.read;
      break;
    default:
      break;
  }
  return Auth.connectedUserHasPermission(scope);
};

const getTitle = (entity, firstEntry) => {
  let title = '';
  switch (entity) {
    case 'number':
      return t('historic.number.title', <strong>{firstEntry ? firstEntry.entity.number : ''}</strong>);
    case 'ipAddress':
      return <strong>{t('historic.ipAddress.title', firstEntry ? firstEntry.entity.ipAddress : '')}</strong>;
    case 'service':
      title = firstEntry ? firstEntry.entity.crmServiceId : '';
      return t('historic.service.title', <strong>{title} {firstEntry ? firstEntry.entity.customerNo : ''}</strong>);
    case 'simcard':
      if (firstEntry) {
        title = `${firstEntry.entity.serialNumber}, ${firstEntry.entity.imsiNumber}`;
      }
      return t('historic.simcard.title', <strong>{title}</strong>);
    case 'cpe':
      if (firstEntry) {
        title = firstEntry.entity.serialNumber;
      }
      return t('historic.cpe.title', <strong>{title}</strong>);
    case 'ancillaryEquipment':
      if (firstEntry) {
        title = firstEntry.entity.serialNumber;
      }
      return t('historic.ancillaryEquipment.title', <strong>{title}</strong>);
    case 'building':
      if (firstEntry) {
        title = firstEntry.entity.buildingCode;
      }
      return t('historic.building.title', <strong>{title}</strong>);
    case 'pto':
      if (firstEntry) {
        title = firstEntry.entity.ptoCode;
      }
      return t('historic.pto.title', <span>{title}</span>);
    case 'buildingFlat':
      if (firstEntry) {
        title = firstEntry.entity.flatNumber;
      }
      return t('historic.buildingFlat.title', <span>{title}</span>);
    case 'accessPoint':
      if (firstEntry) {
        title = firstEntry.entity.accessPointId;
      }
      return t('historic.accessPoint.title', <span>{title}</span>);
    case 'postalAddress':
      return t('historic.postalAddress.title');
    case 'buildingStatus':
      return t('historic.buildingStatus.title');
    case 'rangeNumber':
      return t('historic.rangeNumber.title', <strong>{firstEntry ? firstEntry.entity.rangeId : ''}</strong>);
    default:
      return null;
  }
};

const getRowMappers = (item, search, entity) => {
  let mappedItem = {
    ...item,
    date: getDate(item.date),
    author: item.author || '',
    after: item.index === search.page.length - 1 ? <HistoryInfoDetails item={item.entity} entity={entity} /> : undefined
  };

  if (!mappedItem?.after) {
    const beforeEntity = search.page[item.index + 1].entity;
    const afterEntity = item.entity;
    let changesBefore = {};
    let changesAfter = {};

    Object.keys(afterEntity).forEach(key => {
      const valueBefore = beforeEntity[key];
      const valueAfter = afterEntity[key];
      const bothAreObjects = isObject(valueBefore) && isObject(valueAfter);
      const anyValueIsEmpty = isEmpty(valueBefore) && isEmpty(valueAfter);
      const valuesDiffer = valueBefore !== valueAfter;

      if (!anyValueIsEmpty && (valuesDiffer || bothAreObjects)) {
        if (bothAreObjects) {
          const subKeysDiffer = Object.keys(valueBefore).some(subKey => valueBefore[subKey] !== valueAfter[subKey]);
          if (subKeysDiffer) {
            changesBefore[key] = valueBefore;
            changesAfter[key] = valueAfter;
          }
        } else if (!bothAreObjects && valuesDiffer) {
          changesBefore[key] = valueBefore;
          changesAfter[key] = valueAfter;
        }
      }
    });

    mappedItem.before = <HistoryInfoDetails item={changesBefore} showNull />;
    mappedItem.after = <HistoryInfoDetails item={changesAfter} showNull />;
    delete mappedItem.entity;
  }
  return [mappedItem, {}];
};

const getUniques = search => {
  return search && search.page && search.page.map((u, index) => {
    u.index = index;
    if (u.entity.serviceAccessDTO) {
      u.entity.serviceAccess = u.entity.serviceAccessDTO.serviceId;
      delete u.entity.serviceAccessDTO;
    }
    if (u.entity.firstNumber) {
      u.entity.firstNumber = u.entity.firstNumber.number;
    }
    if (u.entity.lastNumber) {
      u.entity.lastNumber = u.entity.lastNumber.number;
    }
    if (u.entity.mainRange) {
      u.entity.mainRange = u.entity.mainRange.rangeId;
    }
    return u;
  }).filter((a, index) => {
    return index === search.page.length - 1 || (index < search.page.length - 1 && JSON.stringify(a.entity) !== JSON.stringify(search.page[index + 1].entity));
  });
};

const HistoricManager = ({search, notification, params}) => {
  const uniques = getUniques(search);
  const titlePage = getTitle(params.entity, (uniques && uniques[0]) || null);

  new NavigationBuilder(null, store)
  .withHRef(Actions.HISTORIC, {
    ajax: true, mapper: (action, input) => {
      action.params = [params.entity, params.id, input.target.action];
      if (input.target.action === 'search') {
        action.pagination = input.target.pagination;
        action.filter = input.target.filter;
      }
      action.params = action.params.concat(input.target.params || []);
      if (search.page && search.page.length > 0) {
        action.params.push(search.page[search.page.length - 1].entity);
      }
    },
  })
  .build();

  const headers = buildHeaders();

  if (hasPermission(params.entity)) {
    return (
      <PageBase title={titlePage} navigation={t('historic.navigation')} backButton>
        {!notification.show && !search.page && <TplLoading />}
        {!notification.show && uniques && uniques[0] && <TplEnhancedTable key={search.page}
                                                                          rows={uniques}
                                                                          headers={headers}
                                                                          rowMapper={item => getRowMappers(item, search, params.entity)}
                                                                          sortable
                                                                          pageable
        />}
        {!notification.show && search.page && search.page.length === 0 && <Typography>{t('historic.empty')}</Typography>}
        {notification.show && <ErrorAlert message={notification.message} />}
      </PageBase>
    );
  }
  return null;
};

HistoricManager.propTypes = {
  init: PropTypes.object,
  notification: PropTypes.object.isRequired,
  search: PropTypes.object,
  params: PropTypes.object,
};

const mapStateToProps = state => {
  const entity = state.historic && state.historic.params && state.historic.params[0];
  const id = state.historic && state.historic.params && state.historic.params[1];
  return {
    search: !isEmpty(state.historic.payload) && !isEmpty(state.historic.payload.search) ? state.historic.payload.search[1] : undefined,
    notification: !isEmpty(state.historic.payload) && !isEmpty(state.historic.payload.notification) ? state.historic.payload.notification[0] : {show: false},
    params: {entity, id},
  };
};

const HistoricManagerPage = connect(mapStateToProps)(HistoricManager);
export default HistoricManagerPage;
