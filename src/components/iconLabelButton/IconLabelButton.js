import React from "react";
import PropTypes from 'prop-types';
import "./IconLabelButton.scss";
export default function IconLabelButtons({label, icon, onClick, style}){
  const handleOnClick = () => {
    onClick();
  };

  return (
    <>
      <div style={style} className="icon-label-button-container" onClick={handleOnClick}>
          <span className={"icon-label-button-icon"}>{icon}</span>
          <button className="icon-label-button">
            {label}
          </button>
      </div>
    </>);
}

IconLabelButtons.propTypes = {
  style: PropTypes.object,
  label: PropTypes.string.isRequired,
  icon: PropTypes.node,
  onClick: PropTypes.func.isRequired,
};
