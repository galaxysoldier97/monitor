import React, { useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import { FormControl, InputLabel, MenuItem, Select } from "@material-ui/core";
import { useHistory } from "react-router-dom";
import { useTranslation } from "react-i18next";
import TableFrame from "../tableFrame/TableFrame";

export default function DynamicTable({ title, navigation, importPath, options }) {
  const { t } = useTranslation();
  const history = useHistory();
  const currentLocation = history.location;
  const searchParams = new URLSearchParams(currentLocation.search);
  const entities = Object.keys(options || {});
  const [entity, setEntity] = useState(options?.[searchParams.get("entity")] ? searchParams.get("entity") : entities[0] || "");

  const handleChange = (e) => {
    const selectedEntity = e.target.value;
    searchParams.set("page", "0");
    history.replace({ pathname: currentLocation.pathname, search: searchParams.toString() });
    setEntity(selectedEntity);
  };

  useEffect(() => {
    searchParams.set("entity", entity);
    history.replace({ pathname: currentLocation.pathname, search: searchParams.toString() });
  }, [entity]);


  const EntityComponent = options[entity];

  return (
    <>
      <TableFrame navigation={t(navigation)} title={t(title)} importPath={importPath}>
        <FormControl>
          <InputLabel id="entity-name-label">{t('import.entity')}</InputLabel>
          <Select
            value={entity}
            id="entity-name"
            labelId="entity-name-label"
            onChange={handleChange}>
            {entities.map((value) => (
              <MenuItem key={value} value={value}>
                {t(value)}
              </MenuItem>
            ))}
          </Select>
        </FormControl>
        <EntityComponent/>
      </TableFrame>
    </>
  );
}

DynamicTable.propTypes = {
  title: PropTypes.string.isRequired,
  navigation: PropTypes.string.isRequired,
  options: PropTypes.object.isRequired,
  importPath: PropTypes.string
};
