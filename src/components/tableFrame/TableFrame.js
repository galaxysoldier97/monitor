import React from 'react';
import PropTypes from 'prop-types';
import './TableFrame.scss';
import {Link, withRouter} from "react-router-dom";
import {t} from "mt-react-library/functions";
import DropdownMenu from "../DropdownMenu";
import {resourcesScopes} from "../../config/resources/resourcesScopes";
import {MenuItem} from "@material-ui/core";
import Auth from "../../services/Auth";

const GoBack = ({ history }) => (
  <button onClick={() => history.goBack()} className="back-button">
    Go Back
  </button>
);

GoBack.propTypes = {
  history: PropTypes.object,
};

const BackButton = withRouter(GoBack);

export default function TableFrame(props){
  const { title, navigation, importPath, backButton, children, actionButton, importable = true } = props;

  return (
    <>
      <div className="page-container">
        <div>
          <div className={backButton ? 'back-button' : ''}>
            {backButton && <BackButton />}
          </div>
          <div className="table-frame-navigation-title">{navigation}</div>
        </div>
        <div className="table-frame-import-button">
          {importable &&
            <DropdownMenu>
            {() => {
              const submenuItems = [];
              if (Auth.connectedUserHasPermission(resourcesScopes.servicesAdmin.update)) {
                submenuItems.push(<MenuItem key="import" component={Link} to={importPath}>{t('import.from.file')}</MenuItem>);
              }
              return submenuItems;
            }}
          </DropdownMenu>
          }
        </div>
      </div>
      <div className="page-content">
        <div className="table-frame-header">
          <div><h3 className="table-frame-title">{title}</h3></div>
          {actionButton}
        </div>
        {children}
      </div>
    </>
  );
}

TableFrame.propTypes = {
  title: PropTypes.string,
  navigation: PropTypes.string,
  children: PropTypes.element,
  backButton: PropTypes.bool,
  subMenu: PropTypes.element,
  actionButton: PropTypes.element,
  importable: PropTypes.bool,
  importPath: PropTypes.string
};
