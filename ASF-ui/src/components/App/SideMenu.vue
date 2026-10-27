<template>
  <aside id="side-menu" class="side-menu" :class="{ 'side-menu--hidden': !sideMenu }">
    <SideMenuSwitch class="side-menu__switch--boxed" :name="$t('sidebar-boxed-layout')" icon="square" :checked="boxedLayout" @click="toggleBoxed"></SideMenuSwitch>
    <SideMenuSwitch :name="$t('sidebar-dark-mode')" icon="moon" :checked="darkMode" @click="toggleDarkMode"></SideMenuSwitch>

    <div class="side-menu__category">
      <FontAwesomeIcon icon="palette" fixedWidth></FontAwesomeIcon>
      <span>{{ $t('sidebar-theme') }}</span>
    </div>

    <div class="theme-switcher">
      <div v-for="(theme, i) in availableThemes" :key="i" class="theme-switcher__theme" :class="[`theme-${theme}`]" @click="changeTheme(theme)"></div>
    </div>

    <div class="side-menu__info">
      <span v-html="$t('sidebar-info')"></span>
    </div>
  </aside>
</template>

<script>
  import { mapActions, mapGetters } from 'vuex';
  import SideMenuSwitch from './partials/SideMenuSwitch.vue';

  export default {
    name: 'AppSideMenu',
    components: { SideMenuSwitch },
    computed: mapGetters({
      sideMenu: 'layout/sideMenu',
      availableThemes: 'layout/availableThemes',
      boxedLayout: 'layout/boxed',
      darkMode: 'storage/darkMode',
    }),
    methods: {
      ...mapActions({
        changeTheme: 'storage/changeTheme',
        toggleBoxed: 'layout/toggleBoxed',
        toggleDarkMode: 'storage/toggleDarkMode',
      }),
    },
  };
</script>

<style lang="scss">
  @import '../../style/settings';

  .side-menu {
    background: var(--color-background-light);
    border-left: 1px solid var(--color-border);
    bottom: 0;
    padding-top: var(--navigation-height);
    position: fixed;
    right: -15em;
    top: 0;
    transform: translate(-15em, 0);
    transition: transform #{$move} #{$ease-out};
    width: 15em;
    z-index: 1001;

    .app--boxed-layout & {
      @media screen and (min-width: 1250px) {
        position: absolute;
      }
    }
  }

  .side-menu--hidden {
    transform: none;
  }

  .theme-switcher {
    display: grid;
    grid-gap: 0.5em;
    grid-template-columns: repeat(6, 1fr);
    padding: 1em;
  }

  .theme-switcher__theme {
    background: var(--color-theme);
    border: 1px solid var(--color-border);
    border-radius: var(--radius, 2px);
    box-sizing: border-box;
    cursor: pointer;
    height: 20px;
    margin: auto;
    transition: border-color #{$snap} #{$ease-out};
    width: 20px;

    &:hover {
      border-color: var(--color-text);
    }
  }

  .side-menu__category {
    box-sizing: border-box;
    color: var(--color-text-dark);
    font-size: 0.75em;
    font-weight: 500;
    letter-spacing: 0.14em;
    margin: 1em 0 0.5em;
    padding: 0 1em;
    text-transform: uppercase;
  }

  .side-menu__switch--boxed {
    @media screen and (max-width: 1249px) {
      display: none;
    }
  }

  .side-menu__info {
    bottom: 0;
    color: var(--color-text-disabled);
    font-size: 0.8em;
    margin-bottom: 0.5em;
    padding: 1em 0.5em;
    position: absolute;
    text-align: center;

    a {
      color: var(--color-theme);
    }
  }
</style>
