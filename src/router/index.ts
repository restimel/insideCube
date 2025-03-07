import { createRouter, createWebHistory } from 'vue-router';
import HomeView from '../views/HomeView.vue';

const router = createRouter({
    history: createWebHistory(import.meta.env.BASE_URL),
    routes: [
        {
            path: '/',
            name: 'home',
            component: HomeView,
        },
        {
            path: '/about',
            name: 'about',
            component: () => import('../views/AboutView.vue'),
        },
        {
            path: '/manage',
            name: 'manage',
            component: () => import('../views/ManageView.vue'),
        },
        {
            path: '/lost',
            name: 'lost',
            component: () => import('../views/LostView.vue'),
        },
        {
            path: '/help',
            name: 'help',
            component: () => import('../views/HelpView.vue'),
        },
    ],
});

export default router;
