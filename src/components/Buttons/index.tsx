import React from 'react';

import './index.css';
import { Button } from 'react-bootstrap';

interface ICustomButton {
  disabled?: boolean;
  onClick?: React.MouseEventHandler<HTMLButtonElement> | undefined;
  style?: string;
  type?: "button" | "submit" | "reset" | undefined;
}

const CustomButton: React.FC<ICustomButton> = ({
  children,
  disabled,
  onClick,
  style,
  type
}): JSX.Element => {
  return(
    <Button
      className={style}
      disabled={disabled}
      onClick={onClick}
      type={type}
    >
      {children}
    </Button>
  )
}

export {
  CustomButton,
};
