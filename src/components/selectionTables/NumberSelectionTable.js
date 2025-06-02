import React, { PropTypes } from 'react';
import { useFetchRscActivities } from '../../hooks/useFetchRscActivities';
import GenericSelectionTable from './GenericSelectionTable';
import { buildNumbersHeaders } from '../../containers/resources/NumberManager/NumberManagerPage';
import { numberFields } from '../../config/resources/number/numberFields';
import { getNumberDisplayMapper } from '../../helpers/entityMapper';
import TecrepNumberService from '../../services/resources/TecrepNumberService';

const NumberSelectionTable = ({number, values, onChange}) => {
  useFetchRscActivities();

  const itemsFetcher = (filter, pagination) => {
    return TecrepNumberService.search(filter, pagination.number, pagination.size)
      .then(data => ({
        data: data.content || [],
        totalElements: data.totalElements
      }));
  };

  const rowMapper = item => {
    const mapped = {...item};
    numberFields.forEach(field => mapped[field.id] = getNumberDisplayMapper(item, field.id));
    return [mapped, {}];
  };

  return (
    <GenericSelectionTable
      name="number"
      itemsFetcher={itemsFetcher}
      itemFetcher={() => number && TecrepNumberService.getNumber(number)}
      itemIdentifier={n => n.number === number}
      tableHeader={buildNumbersHeaders()}
      rowMapper={rowMapper}
      values={values}
      onChange={onChange}
    />
  );
};

NumberSelectionTable.propTypes = {
  number: PropTypes.string,
  values: PropTypes.object,
  onChange: PropTypes.func,
};

export default NumberSelectionTable;
