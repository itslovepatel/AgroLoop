import React from 'react';

interface ModalProps {
    isOpen: boolean;
    onClose: () => void;
    title?: string;
    children: React.ReactNode;
    size?: 'sm' | 'md' | 'lg' | 'xl';
}

const Modal: React.FC<ModalProps> = ({ isOpen, onClose, title, children, size = 'md' }) => {
    if (!isOpen) return null;

    const sizeClasses = {
        sm: 'max-w-sm',
        md: 'max-w-md',
        lg: 'max-w-lg',
        xl: 'max-w-2xl',
    };

    return (
        <div className="fixed inset-0 z-50 overflow-y-auto">
            <div className="flex min-h-full items-center justify-center p-4">
                {/* Backdrop */}
                <div
                    className="fixed inset-0 bg-black/50 backdrop-blur-sm transition-opacity"
                    onClick={onClose}
                />

                {/* Modal Content */}
                <div className={`relative w-full ${sizeClasses[size]} bg-white rounded-2xl shadow-2xl transform transition-all animate-modal-enter`}>
                    {title && (
                        <div className="flex items-center justify-between px-6 py-4 border-b border-earth-100">
                            <h2 className="text-xl font-bold text-earth-900">{title}</h2>
                            <button
                                onClick={onClose}
                                className="p-2 hover:bg-earth-100 rounded-full transition-colors"
                            >
                                <svg className="w-5 h-5 text-earth-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                                </svg>
                            </button>
                        </div>
                    )}
                    <div className="p-6">
                        {children}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Modal;
