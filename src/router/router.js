import Vue from 'vue';
import VueRouter from 'vue-router'
import DemandesList from '../views/DemandesList'
import MyDemandesList from '../views/MyDemandesList'
import DemandesAime from '../views/DemandesAime'
import DemandesVues from '../views/DemandesVues'
import DemandesRepondue from '../views/DemandesRepondue'
import detail from "../views/detail";
import profile from "../views/profile";



Vue.use(VueRouter);

const routes = [

    {
        path: '/',
        name: 'accueil',
        component: DemandesList
    },
    {
        path: '/profile/',
        name: 'profile',
        component: profile
    },

    {
        path: '/demande/my_demandes/:id',
        name: 'my-demandes',
        props: true,
        component: MyDemandesList
    },
    {
        path: '/demande/DemandesVues',
        name: 'demandes-vues',
        component: DemandesVues
    },
    {
        path: '/demande/DemandesAime',
        name: 'demandes-aime',
        component: DemandesAime
    },
    {
        path: '/demande/DemandesRepondue',
        name: 'demandes-repondue',
        component: DemandesRepondue
    },

    {
        path: '/demande/:id',
        name: 'demande',
        props: true,
        component: detail
    },
    
];

const router = new VueRouter({
    mode: 'history',
    base: '',
    routes
});

export default router;
