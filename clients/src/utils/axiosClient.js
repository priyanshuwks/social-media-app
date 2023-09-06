import axios from "axios";
import { KEY_ACCESS_TOKEN, removeItem, setItem } from "./localStorageManager";
import { getItem } from "./localStorageManager";

export const axiosClient = axios.create({
  baseUrl: "http://localhost:4000",
  withCredentials: true,
});

axiosClient.interceptors.request.use(
  (request) => {
    const accessToken = getItem(KEY_ACCESS_TOKEN); // get the access key from local storage of frontend
    request.headers["Authorization"] = `Bearer ${accessToken}`;  // send AT in headers
    
    return request;
  }
);

axiosClient.interceptors.response.use(
    async (response) => {
        // console.log('entered response interceptor => printing the response received from the backend =>', response)

        const data = response.data;
        // console.log('this is response.data =>', data);
        if(data.status === 'ok'){
            return data;
        }
        const originalRequest = response.config;
        // console.log('this is original request =>', originalRequest);
        const statusCode = data.statusCode;
        const error = data.error;
        
        //when refresh token expires, send user to login page
        if(statusCode === 401 && originalRequest.url === 'http://localhost:4000/auth/refresh'){
            removeItem(KEY_ACCESS_TOKEN);
            window.location.replace('/login','_self');
            return Promise.reject(error);
        }

        if(statusCode === 401){
            const response = await axiosClient.get('http://localhost:4000/auth/refresh');
            if(response.status === 'ok'){
                setItem(KEY_ACCESS_TOKEN, response.result.accessToken);
                originalRequest.headers['Authorizatioin'] = `Bearer ${response.result.accessToken}`;

                return axios(originalRequest); //call original request
            }
        }
        // return Promise.reject(error);
        return response;
    }
)
