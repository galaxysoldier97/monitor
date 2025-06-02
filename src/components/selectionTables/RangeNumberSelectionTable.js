import React, { PropTypes } from 'react';
import GenericSelectionTable from './GenericSelectionTable';
import { getRangeNumberDisplayMapper } from '../../helpers/entityMapper';
import TecrepRangeNumbersService from '../../services/resources/TecrepRangeNumbersService';
import { rangeNumbersHeaderForUpdateServiceWizard } from '../../config/resources/rangeNumbers/rangeNumbersFields';

const RangeNumberSelectionTable = ({mainRangeId, values, onChange}) => {
  const itemsFetcher = (filter, pagination) => {
    const fetcher = filter.rangeId ?
      TecrepRangeNumbersService.get(filter.rangeId).then(range => ({content: [range]})) :
      TecrepRangeNumbersService.search({extendedRange: 0, ...filter}, pagination.number, pagination.size);
    return fetcher.then(data => ({data: data.content || [], totalElements: data.totalElements}));
  };

  const rowMapper = item => {
    const mapped = {...item};
    rangeNumbersHeaderForUpdateServiceWizard.forEach(field => {
      mapped[field.id] = getRangeNumberDisplayMapper(item, field.id);
    });
    return [mapped, {}];
  };

  return (
    <GenericSelectionTable
      name="range"
      itemsFetcher={itemsFetcher}
      itemFetcher={() => mainRangeId && TecrepRangeNumbersService.get(mainRangeId)}
      itemIdentifier={n => n.rangeId === mainRangeId}
      tableHeader={rangeNumbersHeaderForUpdateServiceWizard}
      rowMapper={rowMapper}
      values={values}
      onChange={onChange}
    />
  );
};

RangeNumberSelectionTable.propTypes = {
  mainRangeId: PropTypes.string,
  values: PropTypes.object,
  onChange: PropTypes.func,
};

export default RangeNumberSelectionTable;
