import { XICONS } from './icons-data';

/*
 * XinuSteamFarm icon system ("xicons").
 *
 * Replaces the FontAwesome runtime with a self-contained inline SVG set:
 * 24px grid, hairline strokes, currentColor. Component names and the icon
 * prop contract match the old FontAwesome setup, so existing templates
 * (`icon="name"`, `:icon="[prefix, name]"`, fixedWidth, size, spin) keep
 * working without changes.
 */

const XIcon = {
  name: 'XIcon',
  functional: true,
  props: {
    icon: { type: [String, Array], required: true },
    fixedWidth: Boolean,
    size: { type: String, default: undefined },
    spin: Boolean,
  },
  render(createElement, ctx) {
    const { props, data } = ctx;

    let name = props.icon;
    if (Array.isArray(name)) name = name[1] || name[0];
    if (typeof name !== 'string') return createElement('span');

    const body = XICONS[name] || XICONS.question;

    const classes = ['xicon', `xicon--${name}`];
    if (data.staticClass) classes.unshift(data.staticClass);
    if (data.class) classes.push(data.class);
    if (props.fixedWidth) classes.push('xicon--fw');
    if (props.size) classes.push(`xicon--${props.size}`);
    if (props.spin) classes.push('xicon--spin');

    return createElement('svg', {
      ...data,
      attrs: {
        ...data.attrs,
        viewBox: '0 0 24 24',
        'aria-hidden': true,
        focusable: false,
        role: 'img',
      },
      class: classes,
      domProps: { innerHTML: body },
    });
  },
};

const XLayers = {
  name: 'XLayers',
  render(createElement) {
    return createElement('span', { class: 'xicons-layers' }, this.$slots.default);
  },
};

export default {
  install(Vue) {
    Vue.component('FontAwesomeIcon', XIcon);
    Vue.component('FontAwesomeLayers', XLayers);
  },
};
