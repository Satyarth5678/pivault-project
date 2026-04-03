import { createRouter, createWebHistory } from "vue-router";

import Login from "../pages/Login.vue";
import Dashboard from "../pages/Dashboard.vue";
import Storage from "../pages/Storage.vue";
import Backup from "../pages/Backup.vue";
import Services from "../pages/Services.vue";

const routes = [
    { path: "/", redirect: "/dashboard" },
    { path: "/login", component: Login },

    { path: "/dashboard", component: Dashboard },
    { path: "/storage", component: Storage },
    { path: "/backup", component: Backup },
    { path: "/services", component: Services },
];

const router = createRouter({
    history: createWebHistory(),
    routes,
});

export default router;
