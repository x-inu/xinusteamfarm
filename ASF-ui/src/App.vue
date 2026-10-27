<template>
  <div class="app" :class="[{ 'app--not-authorized': !authenticated, 'app--small-navigation': smallNavigation, 'app--boxed-layout': boxedLayout, 'app--daylight': !darkMode }, themeClass]">
    <AppHeader></AppHeader>
    <AppNavigation></AppNavigation>
    <AppSideMenu></AppSideMenu>

    <section class="content">
      <router-view></router-view>
      <AppFooter @click="smallNavigation = !smallNavigation"></AppFooter>
    </section>

    <AppModal></AppModal>
    <vue-snotify></vue-snotify>
  </div>
</template>

<script>
  import { mapGetters, mapActions } from 'vuex';
  import AppHeader from './components/App/Header.vue';
  import AppNavigation from './components/App/Navigation.vue';
  import AppFooter from './components/App/Footer.vue';
  import AppSideMenu from './components/App/SideMenu.vue';
  import AppModal from './components/App/Modal.vue';
  import { STATUS } from './utils/getStatus';

  export default {
    name: 'App',
    metaInfo: {
      title: 'XinuSteamFarm',
      titleTemplate: 'XinuSteamFarm | %s',
    },
    components: {
      AppHeader, AppNavigation, AppFooter, AppSideMenu, AppModal,
    },
    computed: {
      ...mapGetters({
        authenticated: 'auth/authenticated',
        smallNavigation: 'layout/smallNavigation',
        sideMenu: 'layout/sideMenu',
        boxedLayout: 'layout/boxed',
        theme: 'storage/theme',
        darkMode: 'storage/darkMode',
        version: 'asf/version',
        buildVariant: 'asf/buildVariant',
        status: 'auth/status',
      }),
      themeClass() {
        return `theme-${this.theme}`;
      },
    },
    watch: {
      $route: {
        immediate: true,
        handler(value) {
          document.body.style.overflowY = (value.meta.modal) ? 'hidden' : 'auto';
        },
      },
      status: {
        immediate: true,
        handler(value) {
          switch (value) {
            case STATUS.GATEWAY_TIMEOUT:
            case STATUS.RATE_LIMITED:
            case STATUS.UNAUTHORIZED:
            case STATUS.NETWORK_ERROR:
              if (this.$route.name && this.$route.name !== 'setup') this.$router.replace({ name: 'setup' });
              break;
          }
        },
      },
    },
    mounted() {
      window.addEventListener('resize', this.handleResize);
    },
    beforeDestroy() {
      window.removeEventListener('resize', this.handleResize);
    },
    methods: {
      ...mapActions({
        toggleNavigation: 'layout/toggleNavigation',
      }),
      handleResize() {
        const width = document.body.clientWidth;

        if ((width <= 700 && !this.smallNavigation) || (width > 700 && this.smallNavigation)) {
          this.toggleNavigation();
        }
      },
    },
  };
</script>

<style lang="scss">
  @import './style/settings';
  @import './style/components';

  /* ---- Self-hosted typefaces (no external CDN) ---- */
  @font-face {
    font-family: "Fraunces Variable";
    src: url('./static/fonts/fraunces-variable.woff2') format('woff2');
    font-weight: 100 900;
    font-style: normal;
    font-display: swap;
  }

  @font-face {
    font-family: "Space Grotesk Variable";
    src: url('./static/fonts/space-grotesk-variable.woff2') format('woff2');
    font-weight: 300 700;
    font-style: normal;
    font-display: swap;
  }

  @font-face {
    font-family: "Space Mono";
    src: url('./static/fonts/space-mono-400.woff2') format('woff2');
    font-weight: 400;
    font-style: normal;
    font-display: swap;
  }

  @font-face {
    font-family: "Space Mono";
    src: url('./static/fonts/space-mono-700.woff2') format('woff2');
    font-weight: 700;
    font-style: normal;
    font-display: swap;
  }

  :root {
    --font-sans: #{$f-sans};
    --font-display: #{$f-display};
    --font-mono: #{$f-mono};
    --radius: #{$radius};

    --navigation-width: #{$size-navigation};
    --navigation-height: #{$size-navigation-small};

    /* Paper (default edition: amaterasu) */
    --color-background: #000;
    --color-background-light: #0a0a0a;
    --color-background-dark: #050505;
    --color-background-modal: rgb(0 0 0 / 88%);

    /* Ink */
    --color-text: #{$ink};
    --color-text-secondary: #{$ink-dim};
    --color-text-dark: #{$ink-muted};
    --color-text-disabled: #{$ink-faint};
    --color-text-info: #{$color-level-warning};
    --color-on-theme: #{$ink-on-signal};

    /* Hairlines & tints */
    --color-border: rgb(205 196 186 / #{$line-alpha});
    --color-line-soft: rgb(205 196 186 / #{$line-soft-alpha});
    --color-line-strong: rgb(205 196 186 / #{$line-strong-alpha});
    --color-tint-5: rgb(205 196 186 / #{$tint-5-alpha});
    --color-tint-10: rgb(205 196 186 / #{$tint-10-alpha});
    --color-tint-16: rgb(205 196 186 / #{$tint-16-alpha});

    /* Signal (amaterasu: burnt orange) */
    --color-theme: #ce5e32;
    --color-theme-dark: #{darken(#ce5e32, 10)};
    --color-theme-light: #{lighten(#ce5e32, 6)};

    /* Navigation — same paper, separated by hairline */
    --color-navigation: #000;
    --color-navigation-dark: rgb(205 196 186 / 5%);
    --color-navigation-darker: #050505;

    --color-button-default: #0a0a0a;
    --color-button-cancel: transparent;
    --color-button-cancel-active: rgb(211 101 77 / 12%);

    --color-releases-pre: var(--color-text-dark);
    --color-releases-code: rgb(205 196 186 / 8%);
  }

  html {
    font-family: #{$f-sans};
    font-size: 16px;
    height: 100%;
  }

  body {
    background: var(--color-background-dark);
    height: 100%;
    margin: 0;
  }

  /* Paper grain, laid over everything */
  body::after {
    background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='180' height='180'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.85' numOctaves='2' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)' opacity='0.55'/%3E%3C/svg%3E");
    content: '';
    inset: 0;
    opacity: .04;
    pointer-events: none;
    position: fixed;
    z-index: 2147483647;
  }

  @media screen and (max-height: 835px), screen and (max-width: 1366px) {
    html {
      font-size: 14px;
    }
  }

  @media screen and (max-height: 720px), screen and (max-width: 1000px) {
    html {
      font-size: 12px;
    }
  }

  ::selection {
    background: var(--color-theme);
    color: var(--color-on-theme);
  }

  ::-webkit-scrollbar {
    background-color: var(--color-background-dark);
    height: 8px;
    width: 8px;
  }

  ::-webkit-scrollbar-thumb {
    background: var(--color-line-strong);
    border-radius: 1px;
  }

  ::-webkit-scrollbar-thumb:hover {
    background: var(--color-text-disabled);
  }

  a {
    text-decoration: none;
  }

  :focus-visible {
    outline: 1px solid var(--color-theme);
    outline-offset: 1px;
  }

  /* ---- Xicons (inline SVG icon set) ---- */
  svg.xicon {
    display: inline-block;
    fill: none;
    height: 1em;
    overflow: visible;
    stroke: currentColor;
    stroke-linecap: round;
    stroke-linejoin: round;
    stroke-width: 1.5;
    vertical-align: -.125em;
  }

  .xicon--fw {
    width: 1.25em;
  }

  .xicon--lg {
    font-size: 1.3333em;
    line-height: .75em;
    vertical-align: -.225em;
  }

  .xicon--sm {
    font-size: .875em;
  }

  .xicon--spin {
    animation: xicon-spin 1.2s linear infinite;
  }

  @keyframes xicon-spin {
    0% { transform: rotate(0deg); }
    100% { transform: rotate(360deg); }
  }

  .xicons-layers {
    display: inline-block;
    height: 1em;
    position: relative;
    vertical-align: -.125em;
    width: 1.25em;

    > svg {
      height: 1em;
      left: 50%;
      margin-left: -.5em;
      position: absolute;
      top: 0;
    }
  }

  .app {
    background: var(--color-background);
    color: var(--color-text);
    font-family: var(--font-sans);
    width: 100%;
    -webkit-overflow-scrolling: touch;
  }

  .app--small-navigation {
    --navigation-width: #{$size-navigation-small};
  }

  .app--boxed-layout {
    @media screen and (min-width: 1250px) {
      border: 1px solid var(--color-line-soft);
      margin: 0 auto;
      max-width: 1250px;
      overflow-x: hidden;
      position: relative;
    }
  }

  /* ---- Edition themes (dark papers) ---- */
  @each $name, $pal in $editions {
    .theme-#{$name} {
      --color-theme: #{map-get($pal, 'dark-signal')};
      --color-theme-dark: #{darken(map-get($pal, 'dark-signal'), 10)};
      --color-theme-light: #{lighten(map-get($pal, 'dark-signal'), 6)};
      --color-background: #{map-get($pal, 'dark-paper')};
      --color-background-light: #{map-get($pal, 'dark-raised')};
      --color-navigation: #{map-get($pal, 'dark-paper')};
    }
  }

  /* ---- Daylight papers (inverted mode) ---- */
  .app--daylight {
    --color-background: #efe9df;
    --color-background-light: #f8f4ed;
    --color-background-dark: #e4ddcf;
    --color-background-modal: rgb(21 17 13 / 55%);
    --color-text: #211b15;
    --color-text-secondary: #4a423a;
    --color-text-dark: #6b625a;
    --color-text-disabled: #8a8178;
    --color-text-info: #9c6b1f;
    --color-on-theme: #f8f4ed;
    --color-border: rgb(33 27 21 / 22%);
    --color-line-soft: rgb(33 27 21 / 11%);
    --color-line-strong: rgb(33 27 21 / 38%);
    --color-tint-5: rgb(33 27 21 / 4%);
    --color-tint-10: rgb(33 27 21 / 8%);
    --color-tint-16: rgb(33 27 21 / 13%);
    --color-navigation: #efe9df;
    --color-navigation-dark: rgb(33 27 21 / 5%);
    --color-navigation-darker: #e4ddcf;
    --color-releases-pre: var(--color-text-dark);
    --color-releases-code: rgb(33 27 21 / 7%);
  }

  @each $name, $pal in $editions {
    .app--daylight.theme-#{$name} {
      --color-theme: #{map-get($pal, 'light-signal')};
      --color-theme-dark: #{darken(map-get($pal, 'light-signal'), 8)};
      --color-theme-light: #{lighten(map-get($pal, 'light-signal'), 6)};
      --color-background: #{map-get($pal, 'light-paper')};
      --color-background-light: #{map-get($pal, 'light-raised')};
      --color-navigation: #{map-get($pal, 'light-paper')};
    }
  }

  .content {
    box-sizing: border-box;
    display: grid;
    grid-template-rows: 1fr auto;
    grid-template-areas: 'main' 'footer';
    min-height: 100vh;
    padding-left: var(--navigation-width);
    padding-top: var(--navigation-height);
    position: relative;
    transition: ease-in-out padding .3s;

    > main {
      box-sizing: border-box;
      grid-area: main;
      min-width: 0;

      &.main-container--fullheight {
        height: calc(100vh - 2 * var(--navigation-height));
      }
    }

    @media screen and (max-width: 700px) {
      padding-left: $size-navigation-small;
    }
  }
</style>
