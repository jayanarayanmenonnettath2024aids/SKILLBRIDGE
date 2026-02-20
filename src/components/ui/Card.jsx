import React from 'react';
import '../../styles/ui.css';

const Card = ({ children, className = '', ...props }) => {
    return (
        <div className={`card ${className}`} {...props}>
            {children}
        </div>
    );
};

export const CardContent = ({ children, className = '', ...props }) => {
    return (
        <div className={`card-content ${className}`} {...props}>
            {children}
        </div>
    );
};

export default Card;
