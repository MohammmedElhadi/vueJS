import Vue from 'vue'
import Vuex from 'vuex'
import {HTTP} from "../http-constants";
import auth from "./auth";
import createPersistedState from 'vuex-persistedstate'

Vue.use(Vuex)

const store = new Vuex.Store({
    state: {
        wilayas : [],
        etats : [],
        types : [],
        continents : [],
    },
    plugins:[
        createPersistedState()
    ],
    mutations: {
       SET_WILAYAS(state , wilayas){
           state.wilayas = wilayas;
       },
        SET_ETATS(state , etats){
           state.etats = etats;
       },
       SET_TYPES(state , types){
        state.types = types;
    },
       SET_CONTINENT(state , continents){
        state.continents = continents;
    },
    },
    actions :{
         loadWilayas({commit}){
            HTTP.get('api/wilaya').then((response)=>{
                commit('SET_WILAYAS' , response.data);
            });
            
        },
        loadEtats({commit}){
            HTTP.get('api/etat').then((response)=>{                
                commit('SET_ETATS' , response.data);
            });
        },
        loadTypes({commit}){
            HTTP.get('api/type').then((response) =>{
                commit('SET_TYPES' , response.data);
            });
        },
        loadContinents({commit}){
            HTTP.get('api/continent').then((response) =>{
                commit('SET_CONTINENT' , response.data);
            });

        },
     
    },
    modules :{auth  }
})
export default store;
