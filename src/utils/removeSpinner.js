export function removeSpinner() {
    window.loadingSpinner.stop();
    const loader = document.getElementById('loader');

    if (loader) loader.remove();
}


export function uttachErrorMessageToSpinner() {
    const loader = document.getElementById('loader');
    const message = document.getElementById('message');

    if (loader && !message) {
        const newDiv = document.createElement('div');

        newDiv.setAttribute('id', 'message');
        newDiv.setAttribute('style', 'position:absolute;user-select:"none"; top:62%;left:51%;z-index:10000;transform:translate(-50%);font-family: "Helvetica Neue";text-align:center');

        newDiv.innerText = 'Failed to connect to the server. We are trying to establish connection.';
        loader.appendChild(newDiv);
    }
}

