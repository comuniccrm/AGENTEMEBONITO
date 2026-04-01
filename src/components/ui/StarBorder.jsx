import './StarBorder.css';

const StarBorder = ({
  as: Component = 'div',
  className = '',
  innerClassName = '',
  color = '#00a8cc',
  speed = '6s',
  thickness = 2,
  children,
  ...rest
}) => {
  return (
    <Component
      className={`star-border-container ${className}`}
      style={{
        padding: `${thickness}px`,
        boxSizing: 'border-box',
        ...rest.style
      }}
      {...rest}
    >
      <div
        className="border-gradient-bottom"
        style={{
          background: `conic-gradient(from 0deg, transparent 40%, ${color} 80%, ${color} 100%)`,
          animationDuration: speed
        }}
      ></div>
      <div
        className="border-gradient-top"
        style={{
          background: `conic-gradient(from 180deg, transparent 40%, ${color} 80%, ${color} 100%)`,
          animationDuration: speed
        }}
      ></div>
      <div 
        className={`inner-content ${innerClassName}`} 
        style={{ flex: 1, minHeight: 0, minWidth: 0, borderRadius: `calc(inherit - ${thickness/2}px)` }}
      >
        {children}
      </div>
    </Component>
  );
};

export default StarBorder;
