import React, {useEffect, useState} from 'react';
import PropTypes from 'prop-types';
import PageBase from '../../../components/PageBase';
import { t } from 'mt-react-library/functions';
import ServiceInfoDetails from '../ServiceInfoDetails';
import { ServiceAccessActions } from './ServiceAccessActions';
import { ServiceComponentActions } from '../ServiceComponentManager/ServiceComponentActions';
import { ServiceParametersBlock } from '../ServiceParametersBloc';
import { useLocation } from 'react-router-dom';
import TecrepServiceService from '../../../services/services/TecrepServiceService';
import { ErrorAlert } from '../../../components/ErrorAlert';
import { TplLoading } from 'mt-react-library/containers/templates';
import AssociatedProvisioningTagsTable from "./AssociatedProvisioningTagsTable";

const ServiceInfoPage = () => {
  const [service, setService] = useState({loading: true, data: null, error: null});
  const location = useLocation();
  const serviceId = location.pathname.split('/')[2];
  const fetchServices = async () => {
    try {
      const res = await TecrepServiceService.getService(serviceId);
      setService({ loading: false, data: res, error: null });
    } catch (error) {
      console.error('Error fetching service:', error);
      setService({loading: false, data: null, error});
    }
  };

  useEffect(() => {
    fetchServices().then(() => {});
  }, [serviceId]);

  const actionButton = service.data ? service.data?.serviceCategory === 'COMPONENT'
    ? <ServiceComponentActions item={service.data} infoPage onServiceUpdate={fetchServices}  />
    : <ServiceAccessActions item={service.data} infoPage onServiceUpdate={fetchServices} /> : undefined;

  return (
    <>
      <PageBase
        title={t('service.info.title')}
        navigation={t('service.info.navigation')}
        actionButton={actionButton}
        backButton>
          {service.error && <ErrorAlert message={service.error} />}
          {service.loading && !service.error && <TplLoading />}
          {!service.loading && !service.error && <ServiceInfoDetails item={service.data} />}
      </PageBase>
      {!!service.data && <>
        <AssociatedProvisioningTagsTable serviceData={{activity: service?.data.serviceActivity, category: service?.data?.serviceCategory}}/>
        {!!service.data.serviceParameters && <ServiceParametersBlock serviceParameters={service.data.serviceParameters} />}
      </>}
    </>
  );
};

export const serviceInfoPropType = () => PropTypes.shape({
  accessPointId: PropTypes.string,
  accessPointIdRequest: PropTypes.string,
  accessType: PropTypes.string,
  actionEnd: PropTypes.string,
  actionPlanned: PropTypes.bool,
  actionRequest: PropTypes.string,
  actionStart: PropTypes.string,
  activationDate: PropTypes.string,
  ancillaryEquipmentIdsRequest: PropTypes.string,
  barringDate: PropTypes.string,
  cancellationDate: PropTypes.string,
  creationDate: PropTypes.string,
  crmServiceId: PropTypes.string,
  customerNo: PropTypes.number,
  dateRequest: PropTypes.string,
  deactivationDate: PropTypes.string,
  equipmentCategory: PropTypes.string,
  equipmentId: PropTypes.number,
  equipmentIdRequest: PropTypes.number,
  number: PropTypes.string,
  numberRequest: PropTypes.string,
  onGoingAction: PropTypes.bool,
  parentServiceAccess: PropTypes.string,
  parentServiceOrderId: PropTypes.string,
  plannedDate: PropTypes.string,
  reasonRequest: PropTypes.string,
  resumedDate: PropTypes.string,
  serviceActionStatus: PropTypes.string,
  serviceActivations: PropTypes.arrayOf(PropTypes.shape({
    activCode: PropTypes.object,
    activValue: PropTypes.number,
  })),
  serviceActivity: PropTypes.string,
  serviceCategory: PropTypes.string,
  serviceComponents: [],
  serviceId: PropTypes.number,
  serviceOrderId: PropTypes.string,
  serviceTags: PropTypes.arrayOf(
    PropTypes.shape({
      provisioningTag: PropTypes.shape({
        accessType: PropTypes.string,
        activity: PropTypes.string,
        category: PropTypes.string,
        description: PropTypes.string,
        nature: PropTypes.string,
        persistent: PropTypes.bool,
        tagCode: PropTypes.string,
        tagId: PropTypes.number,
        tagParameters: PropTypes.object,
        tagValue: PropTypes.string,
      }),
      tagValue: PropTypes.string,
    })),
  serviceTransitions: PropTypes.arrayOf(PropTypes.string),
  status: PropTypes.string,
  subscriptionId: PropTypes.string,
  suspensionDate: PropTypes.string,
  techId: PropTypes.number,
});

ServiceInfoPage.propTypes = {};

export default ServiceInfoPage;
