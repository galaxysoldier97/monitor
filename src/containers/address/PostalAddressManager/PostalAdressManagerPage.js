import React, { useState } from 'react';
import PageBase from '../../../components/PageBase';
import { DialogContentText, Grid, Snackbar } from '@material-ui/core';
import { TplActionButton, TplEnhancedDialog, TplEnhancedTable, TplLoading } from 'mt-react-library/containers/templates';
import { t } from 'mt-react-library/functions';
import { Assignment, Cancel, CheckCircle, Delete, History, RadioButtonUnchecked } from '@material-ui/icons';
import { postalAddressFields } from '../../../config/adresses/postalAddress/postalAddressFields';
import { populateEntityConfiguration } from '../../../helpers/entityHelper';
import { ErrorAlert } from '../../../components/ErrorAlert';
import { ROUTES } from '../../../config/routes';
import { Link } from 'react-router-dom';
import { useUrlForm } from '../../../hooks/useUrlForm';
import { useSearchList } from '../../../hooks/useSearchList';
import { SearchEntities } from '../../../helpers/SearchEntities';
import { ResetFilterButton } from '../../../components/buttons/ResetFilterButton';

export const buildHeaders = () => populateEntityConfiguration(postalAddressFields);

export const postalAddressRowMapper = (item, onDelete) => {
  let mapped = Object.assign({}, item);
  mapped.buildingCode = item?.building?.buildingCode;
  mapped.buildingName = item?.building?.buildingName;
  mapped.streetNumber = item?.address?.streetNumber;
  mapped.streetQualifier = item?.address?.streetQualifier;
  mapped.streetName = item?.address?.street?.streetName;
  mapped.district = item?.address?.district;
  mapped.sector = item?.address?.sector;
  mapped.latitude = item?.address?.latitude;
  mapped.longitude = item?.address?.longitude;
  mapped.mainFlag = item.mainFlag ? <CheckCircle /> : <RadioButtonUnchecked />;
  mapped.buildingBlock = item?.buildingBlock;
  mapped.buildingType = item?.buildingType;
  mapped.flatNumber = item?.flatNumber;
  mapped.remark = item?.building?.remark;
  mapped.buildingCode = (
    <Link to={ROUTES.buildingInfo.path.replace(':buildingId', item.building.buildingId)}>
      {item?.building?.buildingCode}
    </Link>
  );
  mapped.actions = (
    <Grid
      container
      alignItems="center"
      wrap="nowrap">
      <Grid item>
        <TplActionButton
          tooltipTitle={t('detail')}
          icon={<Assignment />}
          link={ROUTES.postalAddress.path.replace(':postalAddressId', item.postalAddressId)} />
      </Grid>
      <Grid item>
        <TplActionButton
          tooltipTitle={t('historic.title')}
          icon={<History />}
          link={ROUTES.historic.path.replace(':entity', 'postalAddress').replace(':id', item.postalAddressId)} />
      </Grid>
      <Grid item>
        {onDelete &&
          <TplEnhancedDialog
            tooltipTitle={t('delete')}
            title={t('delete.postal.address')}
            initialValues={item}
            confirmProps={{label: t('block.delete'), icon: <Delete />}}
            cancelProps={{label: t('cancel'), icon: <Cancel />}}
            showProps={{icon: <Delete color="error" />}}
            onConfirm={onDelete}>
              <DialogContentText>
                {t('delete.postal.address.ask')}
              </DialogContentText>
          </TplEnhancedDialog>}
      </Grid>
    </Grid>
  );
  return [mapped, {}];
};

export default function PostalAdressManagerPage(){
  const headers = buildHeaders();
  const {filters, setFilters, ready, reset} = useUrlForm();
  const {list, totalElements, handlePageChange} = useSearchList({filters, setFilters, entity: SearchEntities.postalAddresses, isFilterReady: ready});
  const [notification, setNotification] = useState({visible: false, message: ''});
  const handleFilterChange = filterChange => setFilters({...filterChange, page: 0});

  return (
    <PageBase
      title={t('postal.address.title')}
      navigation={t('postal.address.navigation')}>
        {list.error && <ErrorAlert message={list.error} />}
        {list.loading && !list.error && <TplLoading />}
        {!list.loading && !list.error &&
          <TplEnhancedTable
            rows={list.data}
            headers={headers}
            rowMapper={postalAddressRowMapper}
            filterable
            pageable
            paginationDefault={{number: Number(filters.page), size: Number(filters.size), totalElements}}
            onPageChange={handlePageChange}
            filterDefault={filters}
            onFilterChange={handleFilterChange}
            headerFreeContent={<ResetFilterButton onClick={reset} />}
          />}
        <Snackbar
          open={notification.visible}
          message={notification.message}
          autoHideDuration={4000}
          onClose={() => setNotification({...notification, visible: false})}
        />
    </PageBase>
  );
}
