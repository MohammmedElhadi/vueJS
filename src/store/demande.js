import {HTTP} from "../http-constants";

export default{
    namespaced: true,
    state: {
        types : [],

    },
    mutations: {
       SET_TYPES(state , types){
           state.types = types;
       },
    },
    actions :{
        loadTypes({commit}){
            HTTP.get('api/type').then((response) =>{
                commit('SET_TYPES' , response.data);
            });

        },
     
    },

}

