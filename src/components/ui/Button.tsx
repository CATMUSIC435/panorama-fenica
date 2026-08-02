import React from 'react';
import { cn } from '../../utils';
import { animated, useSpring } from '@react-spring/web';

interface ButtonProps extends React.ComponentPropsWithoutRef<"button"> {
  variant?: 'primary' | 'secondary' | 'outline' | 'ghost';
  size?: 'sm' | 'md' | 'lg';
  className?: string;
  children: React.ReactNode;
}

export const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ variant = 'primary', size = 'md', className, children, onMouseEnter, onMouseLeave, onMouseDown, onMouseUp, ...props }, ref) => {
    const baseStyles = "inline-flex items-center justify-center rounded-md font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gold-500 disabled:pointer-events-none disabled:opacity-50";
    
    const variants = {
      primary: "bg-gold-500 text-gray-950 hover:bg-gold-400 shadow-[0_0_15px_rgba(245,158,11,0.3)]",
      secondary: "bg-gray-800 text-white hover:bg-gray-700",
      outline: "border border-gold-500 text-gold-500 hover:bg-gold-500 hover:text-gray-950",
      ghost: "hover:bg-gray-800 text-gray-300 hover:text-white",
    };

    const sizes = {
      sm: "h-9 px-4 text-sm",
      md: "h-11 px-6 text-base",
      lg: "h-14 px-8 text-lg",
    };

    const [isHovered, setIsHovered] = React.useState(false);
    const [isPressed, setIsPressed] = React.useState(false);

    const springProps = useSpring({
      scale: isPressed ? 0.98 : (isHovered ? 1.02 : 1),
      config: { tension: 400, friction: 15 }
    });

    return (
      <animated.button
        ref={ref}
        style={springProps}
        onMouseEnter={(e) => { setIsHovered(true); onMouseEnter?.(e); }}
        onMouseLeave={(e) => { setIsHovered(false); setIsPressed(false); onMouseLeave?.(e); }}
        onMouseDown={(e) => { setIsPressed(true); onMouseDown?.(e); }}
        onMouseUp={(e) => { setIsPressed(false); onMouseUp?.(e); }}
        className={cn(baseStyles, variants[variant], sizes[size], className)}
        {...props}
      >
        {children}
      </animated.button>
    );
  }
);

Button.displayName = 'Button';
