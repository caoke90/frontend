/*
* 相当于全局变量
* 通信bus
*/
import Vue from 'vue';

const Bus = new Vue();
window.Bus = Bus;
export default Bus;

