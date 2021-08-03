import { ButtonHTMLAttributes } from 'react';

import './styles.scss'

type ButtonProps = ButtonHTMLAttributes<HTMLButtonElement> & {
    isOutlined?: boolean;
    isSignOut?: boolean;
};

export function Button({ isOutlined = false, isSignOut = false, ...props}: ButtonProps) {
    return (
        <button 
        className={`button ${
            isOutlined ? 'outlined' :
            isSignOut ? 'signOut' :
             ''}`} 
        {...props} />
    )
}