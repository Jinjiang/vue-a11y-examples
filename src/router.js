import Vue from "vue";
import Router from "vue-router";
import Home from "./views/Home.vue";
import Accordion from "./views/accordion.vue";
import Alert from "./views/alert.vue";
import ModalDialog from "./views/modal-dialog.vue";
import AlertDialog from "./views/alertdialog.vue";
import Combobox from "./views/combobox.vue";
import Listbox from "./views/listbox.vue";
import ListboxRearrangeable from "./views/listbox-rearrangeable.vue";
import Menubar from "./views/menubar.vue";
import MenuButton from "./views/menu-button.vue";

Vue.use(Router);

export default new Router({
  routes: [
    { path: "/", name: "home", component: Home },
    { path: "/accordion", name: "accordion", component: Accordion },
    { path: "/alert", name: "alert", component: Alert },
    { path: "/modal-dialog", name: "modal-dialog", component: ModalDialog },
    { path: "/alertdialog", name: "alertdialog", component: AlertDialog },
    { path: "/combobox", name: "combobox", component: Combobox },
    { path: "/listbox", name: "listbox", component: Listbox },
    {
      path: "/listbox-rearrangeable",
      name: "listbox-rearrangeable",
      component: ListboxRearrangeable
    },
    { path: "/menubar", name: "menubar", component: Menubar },
    { path: "/menu-button", name: "menu-button", component: MenuButton },
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
