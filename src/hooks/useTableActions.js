import {useEffect, useMemo, useState} from 'react';
import {
  addFromEntity,
  deleteFromEntity,
  getFromEntity,
  updateFromEntity
} from '../helpers/adminManagerHelper';
import {APIformat} from "../helpers/entityMapper";
import {useHistory} from "react-router-dom";
import {useTranslation} from "react-i18next";

export const useTableActions = (entity, predefinedValues, controlled = true, overrideRows, hasRerendered ) => {
  const { t } = useTranslation();
  const [loading, setLoading] = useState(false);
  const [rows, setRows] = useState([]);
  const [filter, setFilter] = useState({});
  const [rowsNumber, setRowsNumber] = useState(0);
  const [isFirstRendering, setIsFirstRendering] = useState(true);
  const history = useHistory();
  const currentLocation = history.location;
  const searchParams = new URLSearchParams(currentLocation.search);
  const memoizedPredefinedValues = useMemo(() => predefinedValues, []);
  const defaultPage = Number(searchParams.get('page')) || 0;
  const [defaultPagination, setDefaultPagination] = useState({ page: defaultPage, size: 10 });
  const [error, setError] = useState('');
  const [filterApplied, setFilterApplied] = useState(false);

  useEffect(() => {
    setRows(overrideRows);
  }, [overrideRows]);

  useEffect(() => {
    if(!filterApplied){
      // eslint-disable-next-line no-unused-vars
      const { totalElements, ...rest } = defaultPagination;
      setFilter({...filter, ...rest});

      if(controlled){
        const page = Number(searchParams.get('page')) || 0;
        const size = Number(searchParams.get('size') || 10);
        if(!isFirstRendering) {
          if(defaultPagination.page !== page || defaultPagination.size !== size) {
            searchParams.set('page', defaultPagination.page.toString());
            searchParams.set('size', defaultPagination.size.toString());
            history.push({
              pathname: currentLocation.pathname,
              search: searchParams.toString(),
            });
            getRows();
          }
        }else{
          setDefaultPagination({...defaultPagination, page});
          setIsFirstRendering(false);
        }
      }else{
        getRows();
      }
    }else{
      setFilterApplied(false);
      searchParams.set('page', defaultPagination.page.toString());
      history.push({
        pathname: currentLocation.pathname,
        search: searchParams.toString(),
      });
    }
  }, [defaultPagination]);

  useEffect(() => {
    getRows();
  }, [memoizedPredefinedValues]);
  const deleteItem = item => {
    setLoading(true);
    const completedItem = {...item, ...predefinedValues};
    deleteFromEntity(entity, completedItem)
      .then(() => {
        if(hasRerendered){
          hasRerendered();
        }
        getRows();
      })
      .catch(error => {
        const errorMessage = error?.response?.data?.error || error?.response?.data?.errorMessage || `Failed to delete ${t(entity)}`;
        setError(errorMessage);
      }).finally(() => setLoading(false));
  };
  const handleFilter = (newFilter) => {
    setLoading(true);
    setFilterApplied(true);
    // eslint-disable-next-line no-unused-vars
    const {page, ...rest} = newFilter;
    getFromEntity(entity, rest).then((response) => {
      const updatedRows = response?.rows.map((item, index) => {return {...item, index};});
      setRows(updatedRows);
      setRowsNumber(response.page.totalElements);
      setFilter(rest);
      setDefaultPagination({...defaultPagination, page: 0});
    }).catch(error => {
      const errorMessage = error?.response?.data?.error || error?.response?.data?.errorMessage || `Failed to fetch ${t(entity)}`;
      setError(errorMessage);
    }).finally(() => setLoading(false));
  };
  const handlePagination = (pagination) => {
    setDefaultPagination(pagination);
  };
  const updateItem = (oldItem,updatedItem) => {
    setLoading(true);
    const mergedItem = {...oldItem, ...updatedItem};

    updateFromEntity(entity, oldItem, mergedItem)
      .then(() => {
        const updatedRows = rows.map(row => {
          if (row.index === mergedItem?.index){
            return APIformat(mergedItem);
          }
          return row;
        });
        if(hasRerendered){
          hasRerendered();
        }
        setRows(updatedRows);
      })
      .catch(error => {
        const errorMessage = error?.response?.data?.error || error?.response?.data?.errorMessage || `Failed to update ${t(entity)}`;
        setError(errorMessage);
      }).finally(() => setLoading(false));
  };
  const addItem = item => {
    setLoading(true);
    addFromEntity(entity, APIformat(item))
      .then(() => {
        if(hasRerendered){
          hasRerendered();
        }
        getRows();
      })
      .catch(error => {
        const errorMessage = error?.response?.data?.error || error?.response?.data?.errorMessage || `Failed to create ${t(entity)}`;
        setError(errorMessage);
      }).finally(() => setLoading(false));
  };

  const getRows = () => {
    if(!overrideRows){
      setLoading(true);
      getFromEntity(entity, {...filter, ...defaultPagination, ...predefinedValues}).then((response) => {
        const updatedRows = response?.rows.map((item, index) => {return {...item, index};});
        setRows(updatedRows);
        setRowsNumber(response?.page?.totalElements || updatedRows?.length);
      }).catch(error => {
        const errorMessage = error?.response?.data?.error || `Failed to fetch ${t(entity)}`;
        setError(errorMessage);
      }).finally(() => setLoading(false));
    }
  };

  const resetFilter = () => {
    const {size} = defaultPagination;
    handleFilter({page: 0, size});
  };

  const resetError = () => {
    setError('');
  };

  return {
    deleteItem,
    updateItem,
    addItem,
    rows,
    handleFilter,
    filter,
    defaultPagination,
    handlePagination,
    rowsNumber,
    resetFilter,
    error,
    resetError,
    loading,
  };
};
