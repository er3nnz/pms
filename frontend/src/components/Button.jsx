import React from "react";

const Button = React.forwardRef(function Button({ children, type = "button", className = "", style = {}, ...props }, ref) {
  return (
    <button
      type={type}
      ref={ref}
      className={`button ${className}`.trim()}
      style={style}
      {...props}
    >
      {children}
    </button>
  );
});

export default Button; 