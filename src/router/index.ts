import { createRouter, createWebHistory } from 'vue-router';

const router = createRouter({
    history: createWebHistory(import.meta.env.BASE_URL),
    routes: [
        {
            path: '/',
            name: 'home',
            component: () => import('@/views/HomeView.vue'),
        },
        {
            path: '/about',
            name: 'about',
            component: () => import('@/views/AboutView.vue'),
        },
        {
            path: '/manage',
            name: 'manage',
            component: () => import('@/views/ManageView.vue'),
        },
        {
            path: '/lost',
            name: 'lost',
            component: () => import('@/views/LostView.vue'),
        },
        {
            path: '/import',
            name: 'import',
            component: () => import('@/views/ImportView.vue'),
        },
        {
            path: '/help',
            name: 'help',
            component: () => import('@/views/HelpView.vue'),
        },
    ],
});

export default router;
