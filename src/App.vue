<template>
  <div id="app">
    <div id="nav">
      <router-link to="/">Home</router-link> |
      <router-link to="/about">About</router-link>
    </div>
    <VueLive><router-view /></VueLive>
    <KeyboardOver class="overlay" />
  </div>
</template>

<script>
import { VueLive } from "vue-a11y-utils";
import KeyboardOver from "vue-keyboard-over";
export default {
  components: { VueLive, KeyboardOver }
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
  bottom: 0;
  left: 0;
  right: 0;
  text-align: center;
  font-size: 64px;
  padding: 2em;
}
</style>
