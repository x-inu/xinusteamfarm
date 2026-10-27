<template>
  <div class="navigation-category__title">
    <span>{{ name }}</span>
  </div>
</template>

<script>
  export default {
    name: 'NavigationCategoryTitle',
    props: {
      name: {
        type: String,
        required: true,
      },
    },
  };
</script>

<style lang="scss">
  @import '../../style/settings';

  .navigation-category__title {
    align-items: center;
    border-bottom: 1px solid var(--color-line-soft);
    color: var(--color-text-disabled);
    display: flex;
    font-size: 0.66em;
    font-weight: 500;
    letter-spacing: 0.18em;
    padding: 0.85em 1.25em;
    text-transform: uppercase;
    width: var(--navigation-width);

    .app--small-navigation & {
      display: none;
    }
  }
</style>
