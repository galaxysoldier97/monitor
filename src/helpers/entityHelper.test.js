import React from 'react';
import { populateEntityConfiguration } from './entityHelper';
import { configFieldDynamic, configFields, configFieldsCompany, configFieldsConditions, configFieldsTranslated, dynamicValues, editableConditionsMock, hiddenConditionsMock } from '../../mocks/config.mock';
import { FormattedMessage } from 'react-intl';
import * as companyModule from '../config/company';

describe('populateEntityConfiguration', () => {
  test('populateEntityConfiguration with empty array should return empty array', () => {
      expect(populateEntityConfiguration([])).toStrictEqual([]);
    },
  );

  test('populateEntityConfiguration with hidden, filterable and editable fields', () => {
      expect(populateEntityConfiguration(configFields)).toStrictEqual(
        [{"hidden": true, "id": "id", "label": <FormattedMessage defaultMessage={null} id="config.id" values={{}} />, "type": "number",},
        {"editable": true, "filterable": true, "id": "code", "label": <FormattedMessage defaultMessage={null} id="config.code" values={{}} />, "type": "string"},
        {"addable": true, "filterable": true, "id": "value", "label": <FormattedMessage defaultMessage={null} id="config.value" values={{}} />, "type": "string"},
        {"cellProps": {"style": {"whiteSpace": "nowrap"}}, "id": "actions", "label": ""}]);
    },
  );

  test('populateEntityConfiguration with dynamic values', () => {
      expect(populateEntityConfiguration(configFieldDynamic, dynamicValues))
      .toStrictEqual([{"id": "parameterValue",
        "label": <FormattedMessage defaultMessage={null} id="config.parameterValue" values={{}} />,
        "type": "enum", "values":  "peppa"}]);
    },
  );

  test('populateEntityConfiguration with translated labels', () => {
      expect(populateEntityConfiguration(configFieldsTranslated))
      .toStrictEqual( [{"id": "parameterValue", "label": <FormattedMessage defaultMessage={null} id="config.parameterValue" values={{}} />, "type": "string"}]);
    },
  );

  test('populateEntityConfiguration with company hidden filterable editable and addable fields', () => {
    const spy = jest.spyOn(companyModule, 'getCompanyName');
    spy.mockReturnValue('MT');
    expect(populateEntityConfiguration(configFieldsCompany))
    .toStrictEqual([{"hidden": false, "id": "id", "label": <FormattedMessage defaultMessage={null} id="config.id" values={{}} />, "type": "number"},
      {"editable": true, "filterable": true, "id": "code", "label": <FormattedMessage defaultMessage={null} id="config.code" values={{}} />, "type": "string"},
      {"addable": true, "filterable": false, "id": "value", "label": <FormattedMessage defaultMessage={null} id="config.value" values={{}} />, "type": "string"}]);
    },
  );

  test('populateEntityConfiguration with hidden and editable conditions', () => {
      expect(populateEntityConfiguration(configFieldsConditions, {}, hiddenConditionsMock, editableConditionsMock))
      .toStrictEqual([{"hidden": true, "id": "id", "label": <FormattedMessage defaultMessage={null} id="config.id" values={{}} />, "type": "number"},
        {"hidden": true, "id": "code", "label": <FormattedMessage defaultMessage={null} id="config.code" values={{}} />, "type": "string"},
        {"editable": true, "id": "value", "label": <FormattedMessage defaultMessage={null} id="config.value" values={{}} />, "type": "string"}]);
    },
  );
});