// 请求失败后的统一拦截，以及ajax的基本设置
import axios from 'axios';
import qs from 'qs';
import Vue from 'vue';

// import {showLoading} from '../common/js/external/index'
import Bus from '../marvel/bus';
import loading from '../marvel/modals/loading.vue';
Bus.addModalComponent(loading);

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

axios.index=0;
axios.defaults.baseURL = process.env.baseUrl;

Vue.prototype.$http = axios;
Vue.http = axios;

axios.interceptors.request.use(
  function (request) {

    //初始化只执行一次
    if(axios.index!=-1){
        axios.index++
      if(axios.index==1){
        Bus.$emit('loading',true)
      }
    }

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
      }
    }
    return request;
  },
  function (error) {
    if(axios.index!=-1){
        axios.index++
      if(axios.index==1){
        Bus.$emit('loading',true)
      }
    }
    return Promise.reject(error);
  }
);

// Add a response interceptor
axios.interceptors.response.use(
  function (response) {
    if(axios.index!=-1){
        axios.index--
      if(axios.index==0){
        setTimeout(()=>{
          if(axios.index==0) {
              axios.index = -1
            Bus.$emit('loading', false)
          }
        },0)

      }
    }

    return response;

  },
  function (error) {
    if(axios.index!=-1){
        axios.index--
      if(axios.index==0){
        setTimeout(()=>{
          if(axios.index==0) {
              axios.index = -1
            Bus.$emit('loading', false)
          }
        },0)

      }
    }
    // Vue.$message({
    //   type:'error',
    //   message:'系统繁忙，请稍后重试!'
    // })
    // Do something with response error
    return Promise.reject(error);
  }
);
export default axios;
