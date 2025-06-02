import { useCallback, useEffect, useState } from 'react';
import { getErrorMessage, getSearchFunction, mapPaginationFromResponse, mapListFromResponse } from '../helpers/fetchHelper';

export const INITIAL_PAGE_NUMBER = 0;
export const INITIAL_PAGE_SIZE = 10;

export const useSearchList = ({filters, setFilters, entity, isFilterReady = true}) => {
  const [list, setList] = useState({loading: true});
  const minInitialElements = isFilterReady ? (Number(filters.page || INITIAL_PAGE_NUMBER) + 1) * (filters.size || INITIAL_PAGE_SIZE) + 1 : 999999;
  const [totalElements, setTotalElements] = useState(minInitialElements);

  const fetch = useCallback(() => {
    setList({loading: true, error: undefined});
    getSearchFunction(entity, filters, filters.page || INITIAL_PAGE_NUMBER, filters.size || INITIAL_PAGE_SIZE)
    .then(res => {
      const apiPagination = mapPaginationFromResponse(res, entity);
      setList({loading: false, data: mapListFromResponse(res, entity) || []});
      setTotalElements(apiPagination.totalElements);
    })
    .catch(err => setList({loading: false, error: getErrorMessage(err)}));
  }, [filters, entity]);

  useEffect(() => {
    if (isFilterReady) {
      fetch();
    }
  }, [isFilterReady, fetch]);

  const handlePageChange = pageChange => {
    setFilters({...filters, page: pageChange.number, size: pageChange.size});
    setTotalElements(pageChange.totalElements);
  };

  return {list, fetch, totalElements, handlePageChange};
};
