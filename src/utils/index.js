export * from './constants';

export const setItemInLocalStorage = (key, value) => {
    if (!key || !value){
        console.error("Cannot store in LocalStorage");
    }
    const valueToStore = typeof value !== 'string' ? JSON.stringify(value) : value;

    localStorage.setItem(key, valueToStore);
}

export const getItemFromLocalStorage = (key) => {
    if (!key){
        console.error("Cannot get the value from LocalStorage");
    }
    return localStorage.getItem(key);
}

export const removeItemFromLocalStorage = (key) => {
    if (!key){
        console.error("Cannot remove items in LocalStorage");
    }
    localStorage.removeItem(key);
}

export const getFormBody = (params) => {
    let formBody = [];

    for (let property in params) {
        let encodedKey = encodeURIComponent(property);
        let encodedValue = encodeURIComponent(params[property]);

        formBody.push(encodedKey + '=' + encodedValue);
    }
    return formBody.join('&');
}