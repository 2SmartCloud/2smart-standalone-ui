import { MAX_SCREEN_WIDTH_TABLET } from '../assets/constants';


export function isMobileDevice() {
    return window.innerWidth <= MAX_SCREEN_WIDTH_TABLET;
}

export function detectIOS() {
    return /iPad|iPhone|iPod/.test(navigator.userAgent) && !window.MSStream;
}

export function isTouchDevice() {
    return 'ontouchstart' in window;
}
