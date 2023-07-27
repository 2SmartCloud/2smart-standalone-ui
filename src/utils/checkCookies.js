function checkCookies() {
    const { cookieEnabled } = navigator;

    return cookieEnabled;
}

export default checkCookies;
