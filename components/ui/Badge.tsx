import React from 'react';

type BadgeVariant = 'success' | 'warning' | 'error' | 'info' | 'neutral';

interface BadgeProps {
    children: React.ReactNode;
    variant?: BadgeVariant;
    size?: 'sm' | 'md';
    pulse?: boolean;
}

const Badge: React.FC<BadgeProps> = ({ children, variant = 'neutral', size = 'md', pulse = false }) => {
    const variantClasses: Record<BadgeVariant, string> = {
        success: 'bg-nature-100 text-nature-800 border-nature-200',
        warning: 'bg-amber-100 text-amber-800 border-amber-200',
        error: 'bg-red-100 text-red-800 border-red-200',
        info: 'bg-blue-100 text-blue-800 border-blue-200',
        neutral: 'bg-earth-100 text-earth-700 border-earth-200',
    };

    const sizeClasses = {
        sm: 'px-2 py-0.5 text-xs',
        md: 'px-3 py-1 text-sm',
    };

    return (
        <span
            className={`
        inline-flex items-center gap-1.5 font-medium rounded-full border
        ${variantClasses[variant]}
        ${sizeClasses[size]}
        ${pulse ? 'animate-pulse' : ''}
      `}
        >
            {pulse && (
                <span className={`w-2 h-2 rounded-full ${variant === 'success' ? 'bg-nature-500' :
                        variant === 'warning' ? 'bg-amber-500' :
                            variant === 'error' ? 'bg-red-500' :
                                variant === 'info' ? 'bg-blue-500' : 'bg-earth-500'
                    }`} />
            )}
            {children}
        </span>
    );
};

export default Badge;
