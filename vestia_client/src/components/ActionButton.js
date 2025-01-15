import React from 'react';
import PropTypes from 'prop-types';

const ActionButton = ({ onClick, disabled, icon: Icon, title, className }) => (
  <button 
    onClick={onClick}
    disabled={disabled}
    className={`flex items-center justify-center gap-2 py-2 px-4 rounded-md shadow-md transition-all duration-300 ease-in-out 
      ${className} ${disabled ? 'opacity-50 cursor-not-allowed' : 'hover:shadow-lg'}`}
  >
    <Icon size={20} strokeWidth={2.5} /> 
    <span>{title}</span>
  </button>
);

ActionButton.propTypes = {
  onClick: PropTypes.func.isRequired,
  disabled: PropTypes.bool,
  icon: PropTypes.func.isRequired, // Assuming Lucide icons are passed as functions
  title: PropTypes.string.isRequired,
  className: PropTypes.string,
};

ActionButton.defaultProps = {
  disabled: false,
  className: '',
};

export default ActionButton;