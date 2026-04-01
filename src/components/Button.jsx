import React from 'react';
import { motion } from 'framer-motion';
import './Button.css';

const Button = ({ children, variant = 'primary', className = '', ...props }) => {
  const baseClasses = 'btn';
  const variantClasses = `btn-${variant}`;

  return (
    <motion.button
      className={`${baseClasses} ${variantClasses} ${className}`}
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.95 }}
      transition={{ type: 'spring', stiffness: 400, damping: 10 }}
      {...props}
    >
      {children}
    </motion.button>
  );
};

export default Button;
