import React, {useEffect} from 'react';
import PropTypes from 'prop-types';
import DefaultTable from "../../../components/defaultTable/DefaultTable";
import {ServiceEntityTypes} from "../../../config/service/serviceTypes";
import Auth from "../../../services/Auth";
import {resourcesScopes} from "../../../config/resources/resourcesScopes";
import TableFrame from "../../../components/tableFrame/TableFrame";
import {t} from "mt-react-library/functions";
import {TagsAndCodesFields} from "../../../config/service/TagsAndCodesFields";
import {ActivationCodeEndPoint} from "../../../services/services/ServicesEndpoint/ActivationCodeService";
export default function TagsAndCodesManagerTable({ controlled, predefinedValues }){
  const showDeleteButton = Auth.connectedUserHasPermission(resourcesScopes.servicesAdmin.delete);

  useEffect(() => {
    ActivationCodeEndPoint.getAll({size: 999999}).then((response) => {
      TagsAndCodesFields.find(el => el.id === 'code').values = response.rows.map(r => {return {id: r.code, key: r.code, value: r.code};});
    });
  }, []);

  return (
    <>
      <TableFrame title={t('activationCode.title')} importable={false}>
        <DefaultTable
        columnHeader={TagsAndCodesFields}
        entity={ServiceEntityTypes.TAGS_AND_CODES}
        predefinedValues={predefinedValues}
        controlled={controlled}
        isFilterable={false}
        showDetailsButton={false}
        showEditButton={false}
        showDeleteButton={showDeleteButton}/>
      </TableFrame>
    </>);
}

TagsAndCodesManagerTable.propTypes ={
  predefinedValues: PropTypes.object,
  controlled: PropTypes.bool,
};
