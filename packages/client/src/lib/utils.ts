import { clsx, type ClassValue } from 'clsx';
import { Bounce, toast } from 'react-toastify';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs: ClassValue[]) {
    return twMerge(clsx(inputs));
}

export function showErrToast(errMsg: string) {
    toast(errMsg, {
        position: 'top-center',
        autoClose: 5000,
        closeOnClick: false,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        theme: 'light',
        transition: Bounce,
        hideProgressBar: true,
        icon: () => '❌',
    });
}

type LoadingPhaseTexts = {
    pendingText: string;
    successText: string;
    errorText: string;
};

export function showToastWhileLoading<T>(
    promise: Promise<T>,
    texts: LoadingPhaseTexts
) {
    const { pendingText, successText, errorText } = texts;
    return toast.promise(
        promise,
        {
            pending: {
                render: () => pendingText,
                icon: () => '⌛️',
                hideProgressBar: true,
            },
            success: {
                render: () => successText,
                icon: () => '🤓',
                hideProgressBar: true,
            },
            error: {
                render: () => errorText,
                icon: () => '🤯',
                hideProgressBar: true,
            },
        },
        {
            position: 'top-center',
        }
    );
}
