<template>
  <div class="home">
    <img alt="Vue logo" src="../assets/logo.png" />
    <h1>Vue A11y Utils Examples</h1>
    <p>
      <router-link class="link" to="/accordion">Accordion</router-link>
      <router-link class="link" to="/alert">Alert</router-link>
      <router-link class="link" to="/modal-dialog">Modal Dialog</router-link>
      <router-link class="link" to="/alertdialog">Alert Dialog</router-link>
      <router-link class="link" to="/combobox">Combobox</router-link>
      <router-link class="link" to="/listbox">Listbox</router-link>
      <router-link class="link" to="/listbox-rearrangeable"
        >Listbox Rearrangeable</router-link
      >
      <router-link class="link" to="/menubar">Menubar</router-link>
      <router-link class="link" to="/menu-button">Menu Button</router-link>
    </p>
  </div>
</template>

<style>
.home {
  text-align: center;
}
.link {
  display: inline-block;
  margin: 0 0.25em;
}
</style>
