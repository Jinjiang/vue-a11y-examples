<template>
  <div id="app">
    <div id="nav" role="nav" @keydown="bindTravel">
      <template v-for="(route, index) in routes">
        <VueAria
          :key="index"
          :aria="{ current: isCurrent(route) ? 'page' : false }"
          :tabindex="index === focusedIndex ? 0 : -1"
        >
          <router-link
            ref="links"
            :to="route.to"
            :class="{ 'router-link-exact-active': isCurrent(route) }"
            @click.native="focusedIndex = index;"
            >{{ route.title }}</router-link
          >
        </VueAria>
        <template v-if="index !== routes.length - 1">
          |
        </template>
      </template>
    </div>
    <VueLive><router-view /></VueLive>
    <KeyboardOver class="overlay" />
  </div>
</template>

<script>
import { VueLive, VueAria, MixinTravel } from "vue-a11y-utils";
import KeyboardOver from "vue-keyboard-over";
const travelOption = {
  orientation: "horizontal",
  looped: true,
  getItems(vm) {
    return vm.$refs.links;
  },
  getIndex(vm) {
    return vm.focusedIndex;
  },
  setIndex(vm, index, items) {
    vm.focusedIndex = index;
    items[index].$el.focus();
  },
  move(vm, event, newIndex, oldIndex, items) {
    event.preventDefault();
    this.setIndex(vm, newIndex, items);
  }
};
export default {
  components: { VueLive, VueAria, KeyboardOver },
  mixins: [MixinTravel],
  $travel: travelOption,
  data() {
    return {
      focusedIndex: 0,
      routes: [
        { to: "/", title: "Home" },
        { to: "/accordion", title: "Accordion" },
        { to: "/alert", title: "Alert" },
        { to: "/modal-dialog", title: "Modal Dialog" },
        { to: "/alertdialog", title: "Alert Dialog" },
        { to: "/combobox", title: "Combobox" },
        { to: "/listbox", title: "Listbox" },
        { to: "/listbox-rearrangeable", title: "Listbox Rearrangeable" },
        { to: "/menubar", title: "Menubar" },
        { to: "/menu-button", title: "Menu Button" },
        { to: "/treegrid", title: "Treegrid" }
      ]
    };
  },
  methods: {
    isCurrent(route) {
      return route.to === this.$router.currentRoute.path;
    }
  }
};
</script>

<style>
#app {
  font-family: "Avenir", Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  color: #2c3e50;
}
#nav {
  padding: 30px;
  text-align: center;
}

#nav a {
  font-weight: bold;
  color: #2c3e50;
}

#nav a.router-link-exact-active {
  color: #42b983;
}

/* https://w3c.github.io/aria-practices/examples/css/core.css */
kbd {
  display: inline-block;
  padding: 0.1em 0.3em;
  color: #555;
  vertical-align: middle;
  background-color: #fcfcfc;
  border: solid 1px #ccc;
  border-bottom-color: #bbb;
  border-radius: 0.2em;
  box-shadow: inset 0 -1px 0 #bbb;
}

.overlay {
  position: fixed;
  bottom: 1em;
  left: 50%;
  transform: translateX(-50%);
  text-align: center;
  font-size: 64px;
}
</style>
