import Vue from "vue";
import VueRouter from "vue-router";
import Home from "../views/Home.vue";
import { auth } from "@/firebase";
import store from "@/store";

Vue.use(VueRouter);

const routes = [
  {
    path: "/",
    name: "Home",
    component: Home
  },
  {
    path: "/signed-list",
    name: "Signed",
    // route level code-splitting
    // this generates a separate chunk (about.[hash].js) for this route
    // which is lazy-loaded when the route is visited.
    component: () =>
      import(/* webpackChunkName: "about" */ "../views/SignedListView.vue")
  },
  {
    path: "/prepare-document",
    name: "Docuement",
    // route level code-splitting
    // this generates a separate chunk (about.[hash].js) for this route
    // which is lazy-loaded when the route is visited.
    component: () =>
      import(/* webpackChunkName: "about" */ "../views/PrepareDocument.vue")
  },
  {
    path: "/prepare-sign",
    name: "Prepare",
    // route level code-splitting
    // this generates a separate chunk (about.[hash].js) for this route
    // which is lazy-loaded when the route is visited.
    component: () =>
      import(/* webpackChunkName: "about" */ "../views/AssignUser.vue")
  },
  {
    path: "/sign-document",
    name: "SignDocument",
    // route level code-splitting
    // this generates a separate chunk (about.[hash].js) for this route
    // which is lazy-loaded when the route is visited.
    component: () =>
      import(/* webpackChunkName: "about" */ "../views/SignDocument.vue")
  },
  {
    path: "/view-document",
    name: "ViewDocument",
    // route level code-splitting
    // this generates a separate chunk (about.[hash].js) for this route
    // which is lazy-loaded when the route is visited.
    component: () =>
      import(/* webpackChunkName: "about" */ "../views/ViewDocument.vue")
  },
  {
    path: "/about",
    name: "About",
    // route level code-splitting
    // this generates a separate chunk (about.[hash].js) for this route
    // which is lazy-loaded when the route is visited.
    component: () =>
      import(/* webpackChunkName: "about" */ "../views/About.vue")
  },
  {
    path: "/login",
    name: "Login",
    component: () =>
      import(/* webpackChunkName: "login" */ "../views/auth/Login.vue"),
    meta: {
      allowAnonymous: true
    }
  },
  {
    path: "/sign-up",
    name: "SignUp",
    component: () =>
      import(/* webpackChunkName: "login" */ "../views/auth/Signup.vue"),
    meta: {
      allowAnonymous: true
    }
  },
  {
    path: "*",
    name: "Not found",
    component: () =>
      import(/* webpackChunkName: "not-found" */ "../views/NotFound.vue")
  }
];

const router = new VueRouter({
  mode: "history",
  base: process.env.BASE_URL,
  routes
});

router.beforeEach((to, from, next) => {
  const currentUser = auth.currentUser;
  const allowAnonymous = to.matched.some(record => record.meta.allowAnonymous);

  if (!allowAnonymous && currentUser) {
    store.commit("setUser", currentUser);
    next();
  } else if (allowAnonymous && currentUser) {
    store.commit("setUser", currentUser);
    next("/");
  } else if (!allowAnonymous && !currentUser) {
    if (to.fullPath == "/") {
      next("login");
    } else {
      next({
        path: "login",
        query: { redirect: to.fullPath }
      });
    }
  } else {
    next();
  }
});

export default router;
