// file-upload.service.js

import * as axios from 'axios';
axios.defaults.withCredentials = true;
// const BASE_URL = 'http://auto_parts.local:8080/api/';
const BASE_URL = 'http://safyauto.com/api/';

function upload(formData) {
    const url = `${BASE_URL}/photos/upload`;
    return axios.post(url, formData)
        // get data
        .then(x => x.data)
        // add url field
        .then(x => x.map(img => Object.assign({},
            img, { url: `${BASE_URL}/images/${img.id}` })));
}

export { upload }
