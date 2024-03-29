import Vue from 'vue'
import App from './App.vue'
import vuetify from './plugins/vuetify';
import router from './router/router';
import store from './store'
import axios from 'axios'
import i18n from './i18n/i18n';
import pagination from 'laravel-vue-pagination'

/*********************************/
Vue.config.productionTip = false
/*********************************/

import Toasted from 'vue-toasted';
Vue.use(Toasted)

/*********************************/
// import VueSweetalert2 from 'vue-sweetalert2';
// Vue.use(VueSweetalert2);

/*********************************/

import VueResizeText from 'vue-resize-text';
Vue.use(VueResizeText)
/*********************************/
import VueEcho from 'vue-echo-laravel';
window.Pusher = require('pusher-js');
Vue.use(VueEcho, {
  broadcaster: 'pusher',
  key: 123 ,// process.env.MIX_PUSHER_APP_KEY,
  forceTLS: false,
  wsHost:"http://safyauto.com",
  // wsHost:"auto_parts.local",
  wsPort: 6001,
  disableStats: true,
  authorizer: (channel, options) => {
    console.log(options);
    return {
      authorize: (socketId, callback) => {
        axios({
          method: "POST",
          url: "http://safyauto.com/api/broadcasting/auth",
          // url: "http://auto_parts.local:8080/api/broadcasting/auth",
          data: {
            socket_id: socketId,
            channel_name: channel.name,
          },
        })
          .then((response) => {
            callback(false, response.data);
          })
          .catch((error) => {
            callback(true, error);
          });
      },
    };
  }
});

/*********************************/
Vue.component('pagination',pagination);
Vue.component('filepond-component', require('./components/FilepondComponent.vue').default);
/*********************************/
// Vue.component('image-box ', 'vue-image-box');

/*********************************/
new Vue({
  vuetify,
  router,
  store,
  render: h => h(App),
  i18n
}).$mount('#app')



