import React, { useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import { t } from 'mt-react-library/functions';
import { TplEnhancedTable, TplLoading } from 'mt-react-library/containers/templates';
import { RequestState } from '../../helpers/requestState';
import { ErrorAlert } from '../ErrorAlert';

const GenericSelectionTable = ({name, initialFilter, itemsFetcher, itemFetcher, itemIdentifier, tableHeader, rowMapper, values, onChange}) => {
  const [items, setItems] = useState();
  const [item, setItem] = useState();
  const [pagination, setPagination] = useState({number: 0, size: 10, totalElements: 0});
  const [filter, setFilter] = useState(initialFilter || {});
  const [fetchRequestState, setFetchRequestState] = useState(RequestState.progress);

  const fetchItems = (switchPage) => {
    if (!switchPage) {
      setFetchRequestState(RequestState.progress);
    }
    itemsFetcher(filter, pagination).then(response => {
      const {data, totalElements} = response;
      const index = data.findIndex(itemIdentifier);
      if (index > -1) {
        data.splice(index, 1);
      }
      setItems(data);
      setFetchRequestState(RequestState.success);
      setPagination({...pagination, totalElements});
    })
    .catch(() => setFetchRequestState(RequestState.error));
  };

  useEffect(() => {
    fetchItems(!!items);
  }, [pagination.size, pagination.number]);

  useEffect(() => {
    if (!items) {
      return;
    }
    if (pagination.number > 0) {
      setPagination({...pagination, number: 0});
    } else {
      fetchItems(true);
    }
  }, [filter]);

  useEffect(function selectDefaultItem() {
    const fetcher = itemFetcher();
    if (fetcher) {
      fetcher.then(data => {
        onChange({target: {name, value: data}});
        setItem(data);
      });
    }else{
      setItem(values[name]);
    }
  }, []);

  return (
    <>
      {fetchRequestState === RequestState.progress && <TplLoading />}
      {fetchRequestState === RequestState.error && <ErrorAlert message={t('error.wizardFetch')} marginY={2} retry={fetchItems} />}
      {fetchRequestState === RequestState.success && (
        <TplEnhancedTable
          key={item}
          rows={item ? [item, ...items] : items}
          headers={tableHeader}
          rowMapper={rowMapper || (x => [{...x}])}
          controlled
          pageable
          paginationDefault={pagination}
          onPageChange={setPagination}
          filterable
          filterDefault={filter}
          onFilterChange={setFilter}
          selectable
          selectionDefault={item ? [item] : []}
          onSelectionChange={selectedItems => {
            const list = selectedItems.length > 2 ? [] : selectedItems;
            const selectedItem = list.length === 0 ? null : selectedItems[selectedItems.length - 1];
            onChange({target: {name, value: selectedItem}});
            return [selectedItem];
          }}
        />
      )}
    </>
  );
};

GenericSelectionTable.propTypes = {
  name: PropTypes.string.isRequired,
  initialFilter: PropTypes.obj,
  itemsFetcher: PropTypes.func.isRequired,
  itemFetcher: PropTypes.func.isRequired,
  itemIdentifier: PropTypes.func.isRequired,
  tableHeader: PropTypes.obj.isRequired,
  rowMapper: PropTypes.func,
  values: PropTypes.obj.isRequired,
  onChange: PropTypes.func.isRequired,
};

export default GenericSelectionTable;
