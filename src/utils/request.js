import Axios from "axios";

const request = Axios.create({
    baseURL: 'http://localhost:8080', 
    timeout: 50000,
});

export default request;
