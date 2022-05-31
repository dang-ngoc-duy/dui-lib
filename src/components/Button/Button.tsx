import React from 'react';
import { ButtonType } from './Button.types';
import buttonStyle from './style';
import clsx from 'clsx';

const Button: React.FC<ButtonType> = (props) => {
    const classes = buttonStyle();
    const {
        label,
        className,
        btnType, 
        onClick,
        size, 
        rounded, 
        isActive, 
        styles, 
        isDisabled
    } = props;
    return (
        <button
            className={clsx(classes.root,
                        className ? className : null,
                        btnType ? btnType : null,
                        size ? `button-${size}` : null,
                        `button-${rounded}`,
                        isActive === true ? 'active' : null,
                        isDisabled === true ? 'disabled' : null,
                       )}
            disabled={isDisabled ?? false}
            onClick={onClick}
            style={styles}>
            {label}
        </button>
    )
}

export default Button;