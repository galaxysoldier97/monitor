import React, {useEffect, useState} from 'react';
import PropTypes from 'prop-types';
import { Table as MaterialTable, TableBody, TableCell, TablePagination, TableRow } from '@material-ui/core';
import {FilterList, Add, Cancel} from '@material-ui/icons';
import {BooleanInfoIcon} from "../BooleanInfoIcon";
import "./Table.scss";
import FormDialog from "../formDialog/FormDialog";
import TableHead from "./TableHead";
import TableFooter from "./TableFooter";
import {ResetFilterButton} from "../buttons/ResetFilterButton";
import {TplLoading} from "mt-react-library/containers/templates";
import ContainedButton from "../containedButton/ContainedButton";
import {useTranslation} from "react-i18next";
import {FileConfigurationDialog} from "../../containers/equipments/EquipmentAdminManager/FileConfigurationDialog";

export const Table = ({
                        headers = [], rows, defaultFilter = {}, defaultPagination, onPageChange, onFilterChange = () => {},
                        isFilterable = false, isPageable = false, isControlled = false, children, onParentClick, newRowConfig, rowsNumber, resetFilter, predefinedValues, loading, showAddButton = true, AddActionButton}) => {
  const { t } = useTranslation();

  const [page, setPage] = useState(defaultPagination?.page || 0);
  const [rowsPerPage, setRowsPerPage] = useState(defaultPagination?.size || 10);
  function handleChangePage(event, newPage) {
    if(page === newPage) {
      return;
    }
    onPageChange({
      size: rowsPerPage,
      page: newPage,
    });
    if (!isControlled) {
      setPage(newPage);
    }
  }

  function handleChangeRowsPerPage(event, selector) {
    onPageChange({
      size: selector.props.value,
      page: 0
    });
    if (!isControlled) {
      setRowsPerPage(selector.props.value);
    }
  }

  const visibleHeaders = headers.filter(h => h.hidden !== true);

  useEffect(() => {
    setPage(defaultPagination?.page);
    setRowsPerPage(defaultPagination?.size);
  }, [defaultPagination]);

  return (
      <div className="enhanced-table-root">
        <div className="enhanced-table-buttons-container">
          <div className="enhanced-table-options-buttons-section">
            {isFilterable &&
                <>
                  <FormDialog
                      className="enhanced-table-filter-form"
                      title={t("tpl.enhancedTable.filterResults")}
                      headers={[...headers.filter(h => h.filterable)]}
                      confirmProps={{ label : t("tpl.enhancedTable.filter"), icon: <FilterList />, name: "confirm_filter" }}
                      cancelProps = {{label : t("tpl.enhancedTable.cancel"), icon:  <Cancel />, name: "cancel"}}
                      initialValues={[defaultFilter]}
                      showAllOption={false}
                      onSubmit={onFilterChange}>
                    <div className="enhanced-table-filter-button-container">
                      <div className="enhanced-table-filter-button">
                        <FilterList />{t("tpl.enhancedTable.filter")}
                      </div>
                    </div>
                  </FormDialog>
                  <ResetFilterButton onClick={resetFilter}/>
                </>
            }
          </div>
          <div className="enhanced-table-add-button-section">
            {showAddButton && AddActionButton ? (
                <AddActionButton
                    predefinedValues={predefinedValues}
                    onSubmit={newRowConfig.onSubmit}
                />
            ) : showAddButton ? (
                <FormDialog
                    title={newRowConfig.title}
                    headers={newRowConfig.headers}
                    predefinedValues={predefinedValues}
                    confirmProps={{ label: t('add'), icon: <Add />, name: 'confirm_add' }}
                    cancelProps={{ label: t('cancel'), icon: <Cancel />, name: 'cancel' }}
                    showAllOption={false}
                    onSubmit={newRowConfig.onSubmit}
                >
                  <ContainedButton />
                </FormDialog>
            ) : null}
          </div>
        </div>
        <div className="enhanced-table-wrapper">
          <MaterialTable className="enhanced-table" aria-labelledby="tableTitle">
            <TableHead
                headers={visibleHeaders}
            />
            {!loading &&
                <TableBody>
                  {rows
                      ?.map((n, index) => {
                        return (
                            <TableRow
                                className="enhanced-table-row"
                                tabIndex={-1}
                                key={`rows-${index}`}>
                              {visibleHeaders.map(header => {
                                let cellValue = n[header.id];
                                if (header.type === 'enum' && header?.values !== [] && Array.isArray(header?.values)) {
                                  let matchingValues = header?.values?.filter(v => v?.key === n[header.id]);
                                  if(matchingValues.length > 0) {
                                    cellValue = matchingValues[0].value;
                                  }
                                }

                                if(typeof cellValue === 'boolean'){
                                  cellValue = <BooleanInfoIcon value={cellValue} />;
                                }else{
                                  cellValue = t(cellValue);
                                }
                                if(header.type === 'dialog'){
                                  return <TableCell padding="none" key={index + '-' + header.id}><FileConfigurationDialog content={cellValue}/></TableCell>;
                                }
                                return <TableCell padding="none" key={index + '-' + header.id}>{cellValue}</TableCell>;
                              })}
                              <TableCell className="enhanced-table-actions-cell" padding={"none"} onClick={(e) => onParentClick(e,n)}>{children}</TableCell>
                            </TableRow>
                        );
                      })}
                </TableBody>}
          </MaterialTable>
          {loading && <div className="loading-container"><TplLoading /></div>}
        </div>
        {isPageable &&
            <TablePagination
                labelRowsPerPage={t("tpl.list.rowsPerPage")}
                labelDisplayedRows={(({ from, to, count }) => `${from}-${to} / ${count}`)}
                rowsPerPageOptions={[5, 10, 25]}
                component="div"
                count={rowsNumber || rows?.length || 0}
                rowsPerPage={rowsPerPage || 10}
                page={page || 0}
                backIconButtonProps={{
                  'aria-label': 'Previous Page',
                }}
                nextIconButtonProps={{
                  'aria-label': 'Next Page',
                }}
                onChangePage={handleChangePage}
                onChangeRowsPerPage={handleChangeRowsPerPage}
                ActionsComponent={TableFooter}
            />
        }
      </div>
  );
};

Table.propTypes = {
  headers: PropTypes.array.isRequired,
  rows: PropTypes.array.isRequired,
  rowMapper: PropTypes.func,
  defaultFilter: PropTypes.object,
  defaultPagination: PropTypes.object,
  defaultSelection: PropTypes.array,
  onPageChange: PropTypes.func,
  isSelectable: PropTypes.bool,
  isSortable: PropTypes.bool,
  isPageable: PropTypes.bool,
  isControlled: PropTypes.bool,
  onFilterChange: PropTypes.func,
  onSelectionChange: PropTypes.func,
  isFilterable: PropTypes.bool,
  clearSelection: PropTypes.bool,
  headerFreeContent: PropTypes.element,
  children: PropTypes.node,
  onParentClick: PropTypes.func,
  newRowConfig: PropTypes.object,
  rowsNumber: PropTypes.number,
  resetFilter: PropTypes.func,
  predefinedValues: PropTypes.object,
  loading: PropTypes.bool,
  showAddButton: PropTypes.bool,
  AddActionButton: PropTypes.node,
};
