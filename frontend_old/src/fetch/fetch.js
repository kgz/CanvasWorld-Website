// create a function to handling retriving data from config.apiUrl

import Cookies from 'universal-cookie';

const config = {
    apiUrl: '/api/'
}

const fetch_api = (url, method = "GET", callback = (_) => {}, err = (_) => {}) => {
    fetch(config.apiUrl + url, {
        method: method,

    }).then(res => res.json()).then(data => {
        callback(data)
    }).catch(errr => {
        err(errr)
    });
}

export default fetch_api