import React, {useEffect, useState} from 'react';
import PropTypes from 'prop-types';
import { serviceFields } from '../../config/service/serviceFields';
import { populateEntityConfiguration } from '../../helpers/entityHelper';
import TecrepServiceService from '../../services/services/TecrepServiceService';
import { useFetchSrvActivities } from '../../hooks/useFetchSrvActivities';
import { getServiceDisplayMapper } from '../../helpers/entityMapper';
import DialogActions from "@material-ui/core/DialogActions";
import CancelIcon from "@material-ui/icons/Cancel";
import NavigateBeforeIcon from "@material-ui/icons/NavigateBefore";
import DoubleArrowIcon from "@material-ui/icons/DoubleArrow";
import {DialogContent, Snackbar} from "@material-ui/core";
import {useTranslation} from "react-i18next";
import {useStepper} from "../stepperForm/StepperContext";
import TecrepIpAddressesService from "../../services/resources/TecrepIpAddressesService";
import GenericSelectionTable from "../selectionTables/GenericSelectionTable";
import TecrepRangeNumbersService from "../../services/resources/TecrepRangeNumbersService";
import TecrepNumberService from "../../services/resources/TecrepNumberService";
import Button from "@material-ui/core/Button";

const ServiceSelectionDialog = ({ resource, name, serviceType, values, onSubmit, onUpdate }) => {
  useFetchSrvActivities();
  const { serviceId } = values;
  const { t } = useTranslation();
  const { handleClose, previousPage, setWidth, error, setError} = useStepper();
  const [selectedValue, setSelectedValue] = useState({});

  useEffect(() => {
    setWidth('lg');
  }, []);

  const itemsFetcher = (filter, pagination) => {
    if (serviceType === 'ACCESS') {
      return TecrepServiceService.search(filter, pagination.number, pagination.size).then(data => ({
        data: data._embedded ? data._embedded.serviceaccesses : [],
        totalElements: data.page.totalElements,
      }));
    } else {
      return TecrepServiceService.search(filter, pagination.number, pagination.size).then(data => ({
        data: data?._embedded?.servicecomponents || [],
        totalElements: data?.page?.totalElements,
      }));
    }
  };

  const submit = () => {
    switch (resource) {
      case 'IpAddress':
        TecrepIpAddressesService.updateService(values, selectedValue.serviceId)
            .then(onUpdate)
            .catch(error => {
              setError(error.response.data.errorMessage);
            });
        break;
      case 'Number':
        TecrepNumberService.updateService(selectedValue, values)
            .then(onUpdate)
            .catch(error => {
              setError(error.response.data.errorMessage);
            });
        break;
      case 'Range':
        TecrepRangeNumbersService.updateService(values, selectedValue.serviceId)
            .then(() => {
              onUpdate();
              handleClose();
            })
            .catch(error => {
              setError(error.response.data.errorMessage);
            });
        break;
    }
  };

  const handleOnChange = (event) => {
    setSelectedValue(event.target.value);
  };

  const rowMapper = item => {
    const mapped = { ...item };
    ['activation', 'equipmentLink', 'onGoingAction', 'number', 'mainRangeId'].map(key => mapped[key] = getServiceDisplayMapper(item, key));
    return [mapped];
  };

  return (
      <>
        <DialogContent className={"form-dialog-container-scroll-disabled"}>
          <GenericSelectionTable
              name={name}
              initialFilter={{ serviceCategory: serviceType }}
              itemsFetcher={itemsFetcher}
              itemFetcher={() => serviceId && TecrepServiceService.getService(serviceId)}
              itemIdentifier={s => s.serviceId === serviceId}
              tableHeader={populateEntityConfiguration(serviceFields)}
              rowMapper={rowMapper}
              values={values}
              onChange={handleOnChange}
          />
          {error && <Snackbar
              open={error !== ''}
              message={error}
              autoHideDuration={4000}
              onClose={() => setError('')}
          /> }
        </DialogContent>
        <DialogActions fullWidth>
          <Button onClick={handleClose} startIcon={<CancelIcon/>}>
            {t('button.cancel')}
          </Button>
          <Button onClick={previousPage} color="primary" startIcon={<NavigateBeforeIcon />}>
            {t('button.previous')}
          </Button>
          <Button onClick={onSubmit ? () => onSubmit(selectedValue) : submit} color="primary" disabled={!selectedValue} endIcon={<DoubleArrowIcon />}>
            {t('button.submit')}
          </Button>
        </DialogActions>
      </>
  );
};

ServiceSelectionDialog.propTypes = {
  resource: PropTypes.string,
  name: PropTypes.string,
  values: PropTypes.object,
  serviceType: PropTypes.string,
  onUpdate: PropTypes.func,
  onSubmit: PropTypes.func
};

export default ServiceSelectionDialog;
