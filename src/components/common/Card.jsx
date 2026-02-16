import React from 'react';

const Card = ({ 
  children, 
  title,
  subtitle,
  footer,
  hover = false,
  className = '',
  headerAction,
  ...props 
}) => {
  return (
    <div className={`${hover ? 'card-hover' : 'card'} ${className}`} {...props}>
      {(title || subtitle || headerAction) && (
        <div className="p-6 border-b border-neutral-100">
          <div className="flex items-start justify-between">
            <div className="space-y-1">
              {title && (
                <h3 className="text-xl font-bold text-neutral-900">{title}</h3>
              )}
              {subtitle && (
                <p className="text-sm text-neutral-500">{subtitle}</p>
              )}
            </div>
            {headerAction && (
              <div>{headerAction}</div>
            )}
          </div>
        </div>
      )}
      
      <div className="p-6">
        {children}
      </div>

      {footer && (
        <div className="px-6 py-4 bg-neutral-50 border-t border-neutral-100 rounded-b-2xl">
          {footer}
        </div>
      )}
    </div>
  );
};

export default Card;