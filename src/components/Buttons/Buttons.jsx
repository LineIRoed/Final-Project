import React from "react";
import styles from "./Buttons.module.css";

// Button component that renders a customizable button
const Button = ({ children, onClick, className,}) => {
  const buttonClass = `${styles.button} ${className ? className : ""}`;
  return (
    <button
      className={buttonClass}
      onClick={onClick}
    >
      {children}
    </button>
  );
};

export default Button;