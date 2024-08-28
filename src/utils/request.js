import Axios from "axios";

const request = Axios.create({
    baseURL: 'http://localhost:8080', 
    timeout: 5000,
});

export default request;
