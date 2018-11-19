// 请求失败后的统一拦截，以及ajax的基本设置
import axios from 'axios';
import qs from 'qs';
import Vue from 'vue';

// import {showLoading} from '../common/js/external/index'
import Bus from '../marvel/bus';
import calert from '../views/common/calert.vue';
Bus.addModalComponent(calert);

function cleanRequest(req) {
  for (const i in req) {
    /* eslint guard-for-in: 0 */
    if (req[i] !== 0 && !req[i]) {
      delete req[i];
    }
  }
}

axios.defaults.withCredentials = true;
axios.defaults.xsrfCookieName = null;
// axios.defaults.headers['Access-Control-Allow-Headers'] = 'Origin, X-Requested-With, Content-Type, Accept, Connection, User-Agent, Cookie';
// axios.defaults.headers.common['X-Requested-With'] = 'XMLHttpRequest';
axios.defaults.headers.post['Content-Type'] = 'application/x-www-form-urlencoded';



axios.defaults.baseURL =window.zybaseURL;

Vue.prototype.$http = axios;
Vue.http = axios;

axios.interceptors.request.use(
  function (request) {

    const params = request.params;
    const body = request.data;

    if (params) {
      cleanRequest(params);
    }
    if (body) {
      cleanRequest(body);
      if (body.append) {
      } else {
        // 普通表单
        request.data = qs.stringify(body);
        // console.log(request.url,qs.parse(request.data))
      }
    }
    return request;
  },
  function (error) {

    return Promise.reject(error);
  }
);

// Add a response interceptor
axios.interceptors.response.use(
  function (response) {
    if(response.data.message == 'No Authenticated'){
      location.href = window.centerbaseURL+'/index.vpage';
    }

    return response;

  },
  function (error) {
    // Do something with response error
    // Bus.calert.alert();

    let errorInfo = {
      msg: error.toString(),
      url: error.config.url,
      method: error.config.method,
      params: error.config.data
    };
    console.error(errorInfo);
    return Promise.reject(error);
  }
);
export default axios;
