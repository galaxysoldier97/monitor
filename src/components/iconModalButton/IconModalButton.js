import React, {useState} from 'react';
import PropTypes from 'prop-types';
import "./IconModalButton.scss";

export default function IconModalButton({icon, tooltipText, children}){
  const [open, setOpen] = useState(false);

  const handleOpen = () => {
    setOpen(true);
  };
  const handleClose = (e) => {
    e.stopPropagation();
    setOpen(false);
  };
  return (
    <>
      <span style={{paddingBottom: '3px'}}>
         <div className="icon-modal-button-tooltip">
          <button className="icon-modal-button" onClick={handleOpen}>
            {icon}
          </button>
          <span className="icon-modal-button-tooltiptext">{tooltipText}</span>
         </div>
      </span>
      {open && (
        <div className="modal-overlay">
          <div className="modal-content">
            <div className="modal-content-button-container">
              <button className="model-content-button" onClick={handleClose}>
                <span>X</span>
              </button>
            </div>
          {children}
          </div>
        </div>
      )}
    </>);
}
IconModalButton.propTypes = {
  icon: PropTypes.object,
  children: PropTypes.node,
  tooltipText: PropTypes.string
};
