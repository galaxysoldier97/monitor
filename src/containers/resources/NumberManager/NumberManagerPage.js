import React, { useState } from 'react';
import PageBase from '../../../components/PageBase';
import { Link } from 'react-router-dom';
import { MenuItem, Snackbar } from '@material-ui/core';
import { Add, Cancel } from '@material-ui/icons';
import { TplEnhancedTable, TplLoading } from 'mt-react-library/containers/templates';
import DropdownMenu from '../../../components/DropdownMenu';
import { Auth } from '../../../services/Auth';
import { resourcesScopes } from '../../../config/resources/resourcesScopes';
import { t } from 'mt-react-library/functions';
import { populateEntityConfiguration } from '../../../helpers/entityHelper';
import { getNumberDisplayMapper } from '../../../helpers/entityMapper';
import { numberFields } from '../../../config/resources/number/numberFields';
import { ErrorAlert } from '../../../components/ErrorAlert';
import { OpenTplDialButton } from '../../../components/buttons/OpenTplDialButton';
import { useFetchNumberConfigs } from '../../../hooks/useFetchNumberConfigs';
import TecrepNumberService from '../../../services/resources/TecrepNumberService';
import { NumberActions } from './NumberActions';
import { useUrlForm } from '../../../hooks/useUrlForm';
import { useSearchList } from '../../../hooks/useSearchList';
import { SearchEntities } from '../../../helpers/SearchEntities';
import { getErrorMessage } from '../../../helpers/fetchHelper';
import { ResetFilterButton } from '../../../components/buttons/ResetFilterButton';

export const buildNumbersHeaders = () => populateEntityConfiguration(numberFields);

const getSubMenu = () => (<DropdownMenu>
  {() => {
    const submenuItems = [];
    if (Auth.connectedUserHasPermission(resourcesScopes.number.edit)) {
      submenuItems.push(<MenuItem id="import" key="import" component={Link} to="/importer/number/import">{t('import.from.file')}</MenuItem>);
    }
    return submenuItems;
  }}
</DropdownMenu>);

const NumberManagerPage = () => {
  useFetchNumberConfigs();
  const headers = buildNumbersHeaders();
  const {filters, setFilters, ready, reset} = useUrlForm();
  const {list, fetch, totalElements, handlePageChange} = useSearchList({filters, setFilters, entity: SearchEntities.numbers, isFilterReady: ready});
  const [notification, setNotification] = useState({visible: false, message: ''});
  const [createdSuccessfully, setCreatedSuccessfully] = useState(false);

  const handleFilterChange = filterChange => setFilters({...filterChange, page: 0});

  const createNumber = data => {
    TecrepNumberService.addNumber(data)
    .then(() => {
      fetch();
      setCreatedSuccessfully(true);
      setNotification({visible: true, message: t('numbers.createSuccess', data.number)});
      setTimeout(() => setCreatedSuccessfully(false), 500);
    })
    .catch(error => setNotification({visible: true, message: getErrorMessage(error)}));
  };

  const getRowMapper = item => {
    const mapped = {...item};
    numberFields.forEach(field => {
      mapped[field.id] = getNumberDisplayMapper(item, field.id);
    });
    mapped.actions = <NumberActions mapped={item} onActionPerform={fetch} />;
    return [mapped, {}];
  };

  const addActionButton = headers && Auth.connectedUserHasPermission(resourcesScopes.number.create) &&
    <OpenTplDialButton title={t('number.add')}
                       key={'add-number-' + createdSuccessfully}
                       headers={headers.filter(h => h.addable)}
                       confirmProps={{label: t('add'), icon: <Add />}}
                       forbiddenValues={{status: ['']}}
                       cancelProps={{label: t('cancel'), icon: <Cancel />}}
                       showProps={{icon: <Add />, label: t('number.add')}}
                       onConfirm={createNumber}
                       autocloseOnConfirm={false}
                       closed={createdSuccessfully}
    />;

  return (
    <PageBase title={t('number.title')}
              navigation={t('number.navigation')}
              subMenu={getSubMenu()}
              actionButton={addActionButton}
    >
      {list.error && <ErrorAlert message={list.error} />}
      {list.loading && !list.error && <TplLoading />}
      {!list.loading && !list.error && (
        <TplEnhancedTable rows={list.data}
                          headers={headers}
                          rowMapper={getRowMapper}
                          filterable
                          pageable
                          paginationDefault={{number: Number(filters.page), size: Number(filters.size), totalElements}}
                          onPageChange={handlePageChange}
                          filterDefault={filters}
                          onFilterChange={handleFilterChange}
                          headerFreeContent={<ResetFilterButton onClick={reset} />}
        />)}
      <Snackbar
        open={notification.visible}
        message={notification.message}
        autoHideDuration={4000}
        onClose={() => setNotification({...notification, visible: false})}
      />
    </PageBase>
  );
};

NumberManagerPage.propTypes = {};

export default NumberManagerPage;
