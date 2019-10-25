const storage = window.localStorage;

export const saveToken = token => {
    storage.setItem("x-token", token);
}

export const getToken = token => {
    storage.getItem("x-token");
}

export const deleteToken = token => {
    storage.removeItem("x-token");
}