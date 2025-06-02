import React from "react";
import PropTypes from "prop-types";
import {Cancel, Edit} from "@material-ui/icons";
import "./EditButton.scss";
import FormDialog from "../formDialog/FormDialog";
import {useTranslation} from "react-i18next";

export default function EditButton({headers, entity, itemPrimaryKey, selectedItem, initialValues, onSubmit}){
  const { t } = useTranslation();
  const handleOnSubmit = (value) => {
    onSubmit(selectedItem, value);
  };

  return(
    <>
      <FormDialog
        title={`${t('admin.editButtonTitle')} ${t(entity)} ${t(selectedItem?.[itemPrimaryKey])}`}
        headers={headers}
        initialValues={initialValues}
        confirmProps={{label: t('edit'), icon: <Edit />, name: 'edit'}}
        cancelProps={{label: t('cancel'), icon: <Cancel />, name: 'cancel'}}
        showAllOption={false}
        onSubmit={handleOnSubmit}
      >
        <div className="icon-modal-button-tooltip">
          <div className="edit-button-container">
            <Edit/>
          </div>
          <span className="icon-modal-button-tooltiptext">{t('edit')}</span>
        </div>
      </FormDialog>
    </>
  );
}

EditButton.propTypes = {
  headers: PropTypes.array,
  entity: PropTypes.string,
  selectedItem: PropTypes.object.isRequired,
  initialValues: PropTypes.array,
  onSubmit: PropTypes.func,
  itemPrimaryKey: PropTypes.string
};
