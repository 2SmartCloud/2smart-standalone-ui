export function saveData(key, data = {}) {
    try {
        const serializedData = JSON.stringify(data);

        localStorage.setItem(key, serializedData);
    } catch (err) {
        console.error(`Something went wrong on save data in localStorage: ${JSON.stringify(err)}`);

        return void 0;
    }
}

export function getData(key) {
    try {
        const data = localStorage.getItem(key);
        const parsedData = JSON.parse(data);

        return parsedData;
    } catch (err) {
        console.error(`Something went wrong on get data from localStorage: ${JSON.stringify(err)}`);

        return void 0;
    }
}

export default {
    saveData,
    getData
};
