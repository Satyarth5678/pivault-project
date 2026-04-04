import { createRouter, createWebHistory } from "vue-router";

import Home from "../pages/Home.vue";
import Login from "../pages/Login.vue";

import AppLayout from "../layouts/AppLayout.vue";
import Dashboard from "../pages/Dashboard.vue";
import Storage from "../pages/Storage.vue";
import Backup from "../pages/Backup.vue";
import Services from "../pages/Services.vue";

const routes = [
    // 🌐 PUBLIC ROUTES
    { path: "/", component: Home },
    { path: "/login", component: Login },

    // 🔐 APP ROUTES (WITH LAYOUT)
    {
        path: "/app",
        component: AppLayout,
        children: [
            { path: "dashboard", component: Dashboard },
            { path: "storage", component: Storage },
            { path: "backup", component: Backup },
            { path: "services", component: Services },
        ],
    },

    // 🔄 DEFAULT REDIRECT
    { path: "/dashboard", redirect: "/app/dashboard" },
];

const router = createRouter({
    history: createWebHistory(),
    routes,
});

export default router;