import React, { ReactNode } from 'react';
import './Typography.scss';

interface TypographyProps {
  variant?: 'h1' | 'h2' | 'h3' | 'body1' | 'body2';
  className?: string;
  children: ReactNode;
}

const Typography: React.FC<TypographyProps> = ({ variant = 'body1', className = '', children }) => {
  return (
    <div className={`typography ${variant} ${className}`}>
      {children}
    </div>
  );
};

export default Typography;
