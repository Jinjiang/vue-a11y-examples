<template>
  <div>
    <h1>Alert Example</h1>
    <button @click="shown = true;">Trigger Alert</button>
    <div class="alert" role="alert">
      <p v-if="shown">
        <span lang="da">Hej</span>, hello, <span lang="it">ciao</span>,
        <span lang="ja">こんにちは</span>, <span lang="ko">안녕</span>
      </p>
    </div>
    <ol>
      <li>
        The screen reader will read the content in the alert when you click the
        button.
      </li>
      <li>
        Ref: <a :href="w3cLink" target="_blank">{{ w3cLink }}</a>
      </li>
    </ol>
  </div>
</template>

<script>
export default {
  data() {
    return {
      shown: false,
      w3cLink: "https://w3c.github.io/aria-practices/examples/alert/alert.html"
    };
  }
};
</script>

<style>
.alert {
  padding: 0.25em 0.5em;
  background-color: silver;
  border-radius: 5px;
}
.alert:empty {
  display: none;
}
</style>
