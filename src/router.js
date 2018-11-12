import Vue from "vue";
import Router from "vue-router";
import Home from "./views/Home.vue";
import Accordion from "./views/accordion.vue";
import Alert from "./views/alert.vue";
import ModalDialog from "./views/modal-dialog.vue";

Vue.use(Router);

export default new Router({
  routes: [
    { path: "/", name: "home", component: Home },
    { path: "/accordion", name: "accordion", component: Accordion },
    { path: "/alert", name: "alert", component: Alert },
    { path: "/modal-dialog", name: "modal-dialog", component: ModalDialog },
    {
      path: "/about",
      name: "about",
      // route level code-splitting
      // this generates a separate chunk (about.[hash].js) for this route
      // which is lazy-loaded when the route is visited.
      component: () =>
        import(/* webpackChunkName: "about" */ "./views/About.vue")
    }
  ]
});
