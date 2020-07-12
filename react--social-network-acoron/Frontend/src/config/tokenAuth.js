import axiosClient from './axios';

export default (token) => {
    if (token) {
        axiosClient.defaults.headers.common['X-Auth-Token'] = token;
    } else {
        delete axiosClient.defaults.headers.common['X-Auth-Token'];
    }
}