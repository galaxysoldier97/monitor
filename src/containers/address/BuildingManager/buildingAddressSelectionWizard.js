import React from 'react';
import Actions from '../../../actions/Actions';
import { MenuItem, Typography } from '@material-ui/core';
import { Field } from 'redux-form';
import { TplEnhancedTable } from 'mt-react-library/containers/templates';
import { isObject, t } from 'mt-react-library/functions';

const addressHeaders = [
  {id: 'streetNumber', label: t('address.street.number'), type: 'number', editable: false, filterable: true},
  {
    id: 'streetQualifier', label: t('address.street.qualifier'), type: 'enum', values: [
      {key: '', value: '__'},
      {key: 'BIS', value: 'BIS'},
      {key: 'TER', value: 'TER'},
      {key: 'A', value: 'A'},
    ], editable: false, filterable: true,
  },
  {id: 'streetName', label: t('address.street.name'), type: 'string', editable: false, filterable: true},
  {id: 'sector', label: t('address.sector'), type: 'number', editable: false, filterable: true},
  {id: 'actions'},
];

const makeTable = (item, renderContext, pageData, navigation, goToPage, renderField, contextId) => {

  if (!pageData.values.search) {
    return null;
  }

  let selectedValue = pageData.values[contextId];
  for (let i = 0; pageData.values.search.page && i < pageData.values.search.page.length && selectedValue; i++) {
    let paged = pageData.values.search.page[i];
    let matchKeys = Object.keys(selectedValue)
    .filter(k => selectedValue[k] && !Array.isArray(selectedValue[k]) && !isObject(selectedValue[k]));
    let isMatching = matchKeys.length > 0;
    matchKeys.forEach(k => isMatching &= selectedValue[k] === paged[k]);
    if (isMatching) {
      Object.assign(selectedValue, paged);
    }
  }

  return <div>
    <TplEnhancedTable key={pageData.values.search.page}
                      rows={pageData.values.search.page}
                      headers={renderContext[contextId].headers}
                      rowMapper={renderContext[contextId].rowMapper}
                      filterable
                      pageable
                      sortable
                      selectable
                      {...(pageData.values.search ? {
                        paginationDefault: pageData.values.search.pagination,
                        filterDefault: pageData.values.search.filter,
                      } : {})}
                      selectionDefault={selectedValue ? [selectedValue] : []}
                      onSelectionChange={(current, previous) => {
                        let filtered = current.filter(s => !previous.includes(s));
                        filtered = filtered.length === 0 || filtered.length > 1 ? [null] : filtered;
                        pageData.formProps.change(contextId, filtered[0]);
                        return filtered;
                      }}
                      onPageChange={paginationChange => navigation.hrefOnClick(Actions.BUILDING_INFO)({
                        action: 'search',
                        pagination: paginationChange,
                        filter: pageData.values.search.filter,
                      }).then(() => goToPage())}
                      onFilterChange={filterChange => navigation.hrefOnClick(Actions.BUILDING_INFO)({
                        action: 'search',
                        params: [item],
                        pagination: Object.assign({}, pageData.values.search.pagination, {number: 0}),
                        filter: filterChange,
                      }).then(() => goToPage())}
    />
    <Field
      name={contextId}
      type="hidden"
      component={renderField}
    />
  </div>;
};


const renderPage0 = (item, search, navigation, pageData, goToPage, renderField, submit) => {
  const renderContext = {
    address: {
      headers: addressHeaders,
      rowMapper: item => {
        let mapped = Object.assign({}, item);
        mapped.streetNumber = item ? item.streetNumber : null;
        mapped.streetQualifier = item ? item.streetQualifier : '__';
        mapped.streetName = item ? item.street.streetName : null;
        mapped.sector = item ? item.sector : null;
        return [mapped, {}];
      },
    },
  };
  return makeTable(item, renderContext, pageData, navigation, goToPage, renderField, 'address', submit);
};

const renderPage1 = (classes, renderField, goToPage, submit, pageData) => {
  if (pageData.values.address) {
    return <div>
      <Typography variant="caption">{t('currently.selected.address')} {pageData.values.address.addressId}  </Typography>
      <div className={classes.root}>
        <Typography variant="caption">Choisir le block du batiment</Typography>
        <div>
          <Field
            id="buildingBlock"
            classes={classes.input}
            name="buildingBlock"
            type="text"
            component={renderField}
            label="Block du batiment"
          />
        </div>
      </div>

      <div className={classes.root}>
        <Typography variant="caption">Choisir le flat number</Typography>
        <div>
          <Field
            id="flatNumber"
            classes={classes.input}
            name="flatNumber"
            type="text"
            component={renderField}
            label="Flat Number"
          />
        </div>
      </div>


      <div className={classes.root}>
        <Typography variant="caption">Choisir le type du batiement</Typography>
        <div>
          <Field
            id="buildingType"
            classes={classes.input}
            name="buildingType"
            type="select"
            component={renderField}
            label="building type">
            <MenuItem id="house" key="HOUSE" value="HOUSE">HOUSE</MenuItem>
            <MenuItem id="block_of_flats" key="BLOCK_OF_FLATS" value="BLOCK_OF_FLATS">BLOCK_OF_FLATS</MenuItem>
          </Field>
        </div>
      </div>


      <div className={classes.root}>
        <Typography variant="caption">Activer le main flag ?</Typography>
        <div>
          <Field
            id="yes"
            classes={classes.input}
            name="mainFlag"
            type="radio"
            component={renderField}
            value="Yes"
            label="Oui"
          />
          <Field
            id="no"
            classes={classes.input}
            name="mainFlag"
            type="radio"
            component={renderField}
            value="No"
            label="Non"
          />
        </div>
      </div>
    </div>;
  } else {
    goToPage(0);
  }
  submit();
};

export const addWizardPageRenderer = (item, search, classes, navigation, pageData, renderButtons, renderField, goToPage, submit) =>
  <div>
    <Typography variant="subtitle1">{t('change.wizard.step', Math.min(pageData.count, pageData.number + 1), pageData.count)}</Typography>
    {pageData.number === 0 && renderPage0(item, search, navigation, pageData, goToPage, renderField, submit)}
    {pageData.number === 1 && renderPage1(classes, renderField, goToPage, submit, pageData)}
    <div className={classes.wizardButtons}>{renderButtons(pageData)}</div>
  </div>;
