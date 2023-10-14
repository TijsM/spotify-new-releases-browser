<script>
  import { scrollFullPage } from "../lib/scroll";
</script>

<div class="conversationalContainer">
  <div class="conversationalHeader">Hi there!</div>
  <div class="conversationalContent">
    We will take a look at your saved artists and display all the recent released
    Albumbs.
    <button class="CTA" on:click={scrollFullPage}>Let's go →</button>
  </div>
</div>

<style>
  .CTA {
    color: white;
    text-decoration: underline;
    background-color: transparent;
    cursor: pointer;
    border: none;
    padding: 0px;
  }
</style>
