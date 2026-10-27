<template>
  <footer class="footer">
    <div class="footer__links">
      <FooterLink name="GitHub" prefix="fab" icon="github" to="https://github.com/x-inu/xinusteamfarm"></FooterLink>
      <FooterLink :name="$t('wiki')" icon="book-open" :to="wikiLink"></FooterLink>
    </div>

    <div v-if="authenticated" class="footer__statistic">
      <FontAwesomeIcon v-if="newReleaseAvailable" v-tooltip="$t('update-available')" class="footer__statistic-notify" icon="exclamation" size="sm" @click="redirectToReleases"></FontAwesomeIcon>
      <span class="footer__statistic-name">XSF</span>
      <span class="footer__statistic-value">{{ versionString }}</span>
    </div>
  </footer>
</template>

<script>
  import { mapGetters } from 'vuex';
  import FooterLink from './partials/FooterLink.vue';
  import { ui, isReleaseAvailable } from '../../utils/ui';
  import delay from '../../utils/delay';

  export default {
    name: 'AppFooter',
    components: { FooterLink },
    data() {
      return {
        newReleaseAvailable: false,
        uiHash: ui.gitCommitHash,
      };
    },
    computed: {
      ...mapGetters({
        authenticated: 'auth/authenticated',
        version: 'asf/version',
        buildVariant: 'asf/buildVariant',
        notifyRelease: 'settings/notifyRelease',
        updatesEnabled: 'asf/updatesEnabled',
        canUpdate: 'asf/canUpdate',
      }),
      versionString() {
        return `${this.version} - ${this.buildVariant} - ${this.uiHash}`;
      },
      wikiLink() {
        return 'https://github.com/JustArchiNET/ASF-ui/wiki';
      },
    },
    async mounted() {
      await delay(3000);
      if (this.authenticated && this.updatesEnabled && this.canUpdate) this.checkForNewRelease();
    },
    methods: {
      async checkForNewRelease() {
        try {
          this.newReleaseAvailable = await isReleaseAvailable();
          if (this.newReleaseAvailable && this.notifyRelease && this.$route.name !== 'releases') {
            const notification = this.$snotify.info(this.$t('update-available'), this.$t('info'));
            notification.on('click', toast => this.redirectToReleases());
          }
        } catch (err) {
          if (err.message === 'HTTP Error 504') return;
          this.$error(err.message);
        }
      },
      redirectToReleases() {
        if (this.$route.name !== 'releases') this.$router.push({ name: 'releases' });
      },
    },
  };
</script>

<style lang="scss">
  @import '../../style/settings';

  .footer {
    align-items: center;
    border-top: 1px solid var(--color-line-soft);
    box-sizing: border-box;
    display: flex;
    font-size: 0.8125em;
    grid-area: footer;
    height: var(--navigation-height);
    padding: 0 0.5em;
    width: 100%;
  }

  .footer__links {
    display: flex;
    height: 100%;
  }

  .footer__statistic {
    color: var(--color-text-disabled);
    font-family: var(--font-mono);
    font-size: 0.85em;
    margin-left: auto;
    text-align: center;
  }

  .footer__statistic-name {
    color: var(--color-theme);
    font-weight: 700;
  }

  .footer__statistic-notify {
    color: var(--color-theme);
    cursor: pointer;
    padding-right: 0.2em;
  }
</style>
