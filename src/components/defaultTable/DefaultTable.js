import React, {useEffect, useState} from "react";
import PropTypes from 'prop-types';
import { useTableActions } from "../../hooks/useTableActions";
import { TplEnhancedDialog } from "mt-react-library/containers/templates";
import {Assignment, Cancel, Delete } from "@material-ui/icons";
import DialogContent from "@material-ui/core/DialogContent";
import IconModalButton from "../../components/iconModalButton/IconModalButton";
import {Box, DialogTitle, Snackbar, Table as MaterialTable, TableBody, TableCell, TableRow} from "@material-ui/core";
import {BooleanInfoIcon} from "../BooleanInfoIcon";
import EditButton from "../../components/editButton/EditButton";
import { useHistory } from 'react-router-dom';
import { replaceUrlKeywords } from "../../helpers/commonHelper";
import IconButton from "../iconButton/IconButton";
import { Table } from "../table/Table";
import {useTranslation} from "react-i18next";

export default function DefaultTable({columnHeader, entity, isFilterable = true, isPageable = true, showAddButton = true, detailLink, showDetailsButton, showEditButton, showDeleteButton, predefinedValues, controlled = true, hasRerendered, overrideRows, AddActionButton}){
  const { t } = useTranslation();
  const { filter, addItem, deleteItem, updateItem, handleFilter, rows, defaultPagination, handlePagination, rowsNumber, resetFilter, error, resetError, loading } = useTableActions(entity, predefinedValues, controlled, overrideRows, hasRerendered);
  const [action, setAction] = useState('');
  const [selectedItem, setSelectedItem] = useState({});
  const [data, setData] = useState([]);
  const history = useHistory();
  const [entityName, setEntityName] = useState(t(entity));

  useEffect(() => {
    setEntityName(t(entity?.category || entity));
  }, [entity]);

  useEffect(() => {
    if(action !== undefined && action !== null && action !== '') {
      switch (action) {
        case "Détail": {
          if(detailLink !== null && detailLink !== undefined){
              history.push(`${replaceUrlKeywords(detailLink, selectedItem)}`);
          }else{
            const detailHeader = [];
            columnHeader.map(field => {
              if (field.infoPage) {
                detailHeader.push({id: field.id, label: field.label, value: selectedItem[field.id]});
              }
            });
            setData(detailHeader);
          }
        }
          break;
        case 'Edit': {
          const editableHeader = [];
          let editableObject = {id: selectedItem?.id};
          columnHeader.map(field => {
            if (field.editable) {
              editableObject = {...editableObject, [field.id]: selectedItem[field.id]};
            }
          });
          editableHeader.push(editableObject);
          setData(editableHeader);
        }
          break;
        case 'Delete': {
          //console.log('Deleting', data);
        }
          break;
        default:
          console.error(`Action undefined ${action}`);
      }
    }
  }, [action, selectedItem]);
  function handleSelectedRow(event, value){
    event.stopPropagation();
    setSelectedItem(value);
  }

  return (
    <>
      <Table
        headers={columnHeader}
        rows={rows}
        loading={loading}
        onParentClick={handleSelectedRow}
        newRowConfig={{title: `${t('admin.addButtonTitle')} ${t(entityName)}`, headers: columnHeader.filter(s => s.addable), onSubmit: addItem}}
        isFilterable={isFilterable}
        showAddButton={showAddButton}
        AddActionButton={AddActionButton}
        isPageable={isPageable}
        onFilterChange={handleFilter}
        defaultFilter={filter}
        defaultPagination={defaultPagination}
        onPageChange={handlePagination}
        rowsNumber={rowsNumber}
        predefinedValues={predefinedValues}
        resetFilter={resetFilter}>
        {showDetailsButton && detailLink && (
          <div onClick={() => setAction('Détail')}>
            <IconButton icon={<Assignment/>} text={t('detail')}/>
          </div>
        )}

        {showDetailsButton && !detailLink && (
          <div onClick={() => setAction('Détail')}>
            <IconModalButton icon={<Assignment/>} tooltipText={t('detail')}>
              <DialogTitle>{`${t('admin.detailButtonTitle')} ${t(entityName)}`}</DialogTitle>
              <DialogContent>
                <Box paddingY={1} paddingX={3}>
                  <MaterialTable>
                    <TableBody>
                      {data?.map((field, index) => (
                        <TableRow key={`${field}-${index}`}>
                          <TableCell>
                            <span>{t(field.label)}</span>
                          </TableCell>
                          <TableCell>
                            {typeof field.value === 'boolean' ? (
                              <span>
                        <BooleanInfoIcon value={field.value} />
                      </span>
                            ) : (
                              <span>{field.value}</span>
                            )}
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </MaterialTable>
                </Box>
              </DialogContent>
            </IconModalButton>
          </div>
        )}
        {showEditButton &&
          <div onClick={() => setAction('Edit')}>
            <EditButton
              headers={columnHeader.filter(h => h.editable)}
              entity={entityName}
              selectedItem={selectedItem}
              itemPrimaryKey={columnHeader[1].id || ''}
              initialValues={data}
              onSubmit={updateItem}/>
          </div>}
        {showDeleteButton &&
          <div onClick={() => setAction('Delete')}>
            <TplEnhancedDialog
              key={`delete-eqm-admin-`}
              title={`${t('admin.deleteButtonTitle')} ${t(entityName)}`}
              confirmProps={{label: t('delete'), icon: <Delete />, name: 'delete'}}
              cancelProps={{label: t('cancel'), icon: <Cancel />, name: 'cancel'}}
              showProps={{icon: <Delete color="error" />, name: 'delete'}}
              onConfirm={() => deleteItem(selectedItem)}
              dialogProps={{fullWidth: true, maxWidth: 'sm'}}
              autocloseOnConfirm
              tooltipTitle={t('delete')}
            >
              <DialogContent>
                <span>{t('deletePrompt')} {entityName} </span>
                <span style={{ fontWeight: 'bold' }}>{selectedItem?.[`${columnHeader[1].id}`] || ''} </span>
                <span>?</span>
              </DialogContent>
            </TplEnhancedDialog>
          </div>}
      </Table>
      <Snackbar
        open={error !== ''}
        message={error}
        autoHideDuration={4000}
        onClose={resetError}
      />
    </>
  );
}

DefaultTable.propTypes = {
  columnHeader: PropTypes.array,
  entity: PropTypes.string,
  detailLink: PropTypes.string,
  showDetailsButton: PropTypes.bool,
  showEditButton: PropTypes.bool,
  showDeleteButton: PropTypes.bool,
  isFilterable: PropTypes.bool,
  predefinedValues: PropTypes.object,
  controlled: PropTypes.bool,
  isPageable: PropTypes.bool,
  showAddButton: PropTypes.bool,
  hasRerendered: PropTypes.func,
  AddActionButton: PropTypes.node,
  overrideRows: PropTypes.array,
};
