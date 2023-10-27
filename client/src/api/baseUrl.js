import axios from 'axios';

const ROOT_API_URL = `http://localhost:3000/api/`;

export const basicCallApi = () => {
    const instance = axios.create({
        baseURL: ROOT_API_URL,
        headers: {
            'Content-Type': 'application/json',
        },
        timeout: 10000,
        withCredentials: true,
    });

    return instance;
}