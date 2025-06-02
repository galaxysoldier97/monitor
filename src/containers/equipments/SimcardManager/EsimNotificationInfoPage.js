import React, {useEffect, useState} from 'react';
import {isEmpty, t} from "mt-react-library/functions";
import PageBase from "../../../components/PageBase";
import {TplEnhancedTable} from "mt-react-library/containers/templates";
import {useParams} from "react-router-dom";
import {getDate, isObject} from '../../../helpers/commonHelper';
import HistoryInfoDetails from "../../HistoryInfoDetails";
import EsimNotificationService from "../../../services/equipments/EsimNotificationService";


export const buildHeaders = () => [
  {id: 'date', label: t('historic.date')},
  {id: 'before', label: t('historic.before')},
  {id: 'after', label: t('historic.after')},
];

const EsimNotificationInfoPage = () => {
  const headers = buildHeaders();
  const {equipmentId} = useParams();
  const [list, setList] = useState({loading: true});
  const [totalElements, setTotalElement] = useState();

  useEffect(() => {
    EsimNotificationService.searchEsimNotification(equipmentId)
      .then(response => {
        setList({loading:false, data:response.content ? response.content : []});
        setTotalElement(response.totalElements);
      })
      .catch((error) => {
        throw error;
      });
  });


  const getRowMappers = (item, search) => {
    const index = search.map(x => x.id).indexOf(item.id);
    const mappedItem = {
      before: null,
      after: item,
      date: getDate(item.date)
    };

    const isFirst = index === search.length - 1;

    if (!isFirst) {
      const beforeEntity = search[index + 1];
      const afterEntity = item;
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

      delete changesAfter.id;
      delete changesBefore.id;

      mappedItem.before = <HistoryInfoDetails item={changesBefore} showNull/>;
      mappedItem.after = <HistoryInfoDetails item={changesAfter} showNull/>;
    } else {
      Object.keys(mappedItem.after).forEach((k) => mappedItem.after[k] == null && delete mappedItem.after[k]);
      delete mappedItem.after.id;

      mappedItem.after = <HistoryInfoDetails item={mappedItem.after} showNull/>;
    }
    return [mappedItem, {}];
  };

  return (
    <PageBase title={t('esim.info.notification')}
              navigation={t('esim.info.notification.navigation')}
              backButton>
      {!list.loading && !list.error &&
        (<TplEnhancedTable
          rows={list.data.reverse()}
          headers={headers}
          rowMapper={item => getRowMappers(item, list.data)}
          sortable
          pageable
          paginationDefault={{number: 0, size: 10, totalElements}}
        />)
      }
    </PageBase>
  );
};

EsimNotificationInfoPage.propTypes = {};

export default EsimNotificationInfoPage;
