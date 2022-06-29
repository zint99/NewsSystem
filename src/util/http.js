import axios from "axios";
import fetchIntercept from "fetch-intercept";
import { useSelector, useDispatch } from "react-redux";
import { changeLoading } from "../redux/features/loading/loadingSlice";

export function useHttp() {
  //学了RTKQ可以代替这里自己设置loading
  const loadingState = useSelector((state) => state.loading);
  const dispatch = useDispatch();
  /*
    配置axios和fetch路由拦截
*/
  axios.defaults.baseURL = "http://localhost:5000";
  // Add a request interceptor
  axios.interceptors.request.use(
    function (config) {
      // Do something before request is sent
      dispatch(changeLoading(loadingState, true));
      return config;
    },
    function (error) {
      // Do something with request error
      dispatch(changeLoading(loadingState, false));
      return Promise.reject(error);
    }
  );

  // Add a response interceptor
  axios.interceptors.response.use(
    function (response) {
      // Any status code that lie within the range of 2xx cause this function to trigger
      // Do something with response data
      dispatch(changeLoading(loadingState, false));
      return response;
    },
    function (error) {
      // Any status codes that falls outside the range of 2xx cause this function to trigger
      // Do something with response error
      dispatch(changeLoading(loadingState, false));
      return Promise.reject(error);
    }
  );

  const unregister = fetchIntercept.register({
    request: function (url, config) {
      // Modify the url or config here
      dispatch(changeLoading(loadingState, true));
      return [url, config];
    },

    requestError: function (error) {
      // Called when an error occured during another 'request' interceptor call
      dispatch(changeLoading(loadingState, false));
      return Promise.reject(error);
    },

    response: function (response) {
      // Modify the reponse object
      dispatch(changeLoading(loadingState, false));
      return response;
    },

    responseError: function (error) {
      // Handle an fetch error
      dispatch(changeLoading(loadingState, false));
      return Promise.reject(error);
    },
  });
  unregister();
}
