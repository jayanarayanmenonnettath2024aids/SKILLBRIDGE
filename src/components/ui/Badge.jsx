import React from 'react';
import '../../styles/ui.css';

const Badge = ({ children, variant = 'neutral', className = '' }) => {
    return (
        <span className={`badge badge-${variant} ${className}`}>
            {children}
        </span>
    );
};

export default Badge;
