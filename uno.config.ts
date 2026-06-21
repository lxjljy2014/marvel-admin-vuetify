import { defineConfig, presetWind4, transformerDirectives, transformerVariantGroup } from 'unocss';
import * as breakpoints from './src/theme/breakpoints';
import { presetSoybeanAdmin } from '@sa/uno-preset';
import { themeVars } from './src/theme/vars';

export default defineConfig({
  presets: [
    presetWind4({
      preflights: {
        reset: false
      },
      dark: {
        dark: '.v-theme--dark',
        light: '.v-theme--light'
      }
    }),
    presetSoybeanAdmin()
  ],
  transformers: [transformerDirectives(), transformerVariantGroup()],
  theme: {
    ...themeVars,
    breakpoint: breakpoints.forUnoCSS,
    font: {
      heading: 'Roboto, sans-serif',
      body: 'Roboto, sans-serif',
      mono: '"Roboto Mono", sans-serif'
    }
  },
  rules: [],
  safelist: [
    'font-heading',
    'font-body',
    'font-mono',
    ...Array.from({ length: 6 }, (_, i) => `elevation-${i}`),
    ...['', '-0', '-sm', '-lg', '-xl', '-pill', '-circle', '-shaped'].map(suffix => `rounded${suffix}`),
    ...['', '-thin', '-sm', '-lg', '-xl'].map(suffix => `border${suffix}`)
  ],
  outputToCssLayers: {
    cssLayerName: layer => (layer === 'properties' ? null : `uno-${layer}`)
  },
  shortcuts: {
    'card-wrapper': 'rd-8px shadow-sm',

    'elevation-0': 'shadow-none',
    'elevation-1': 'shadow-xs',
    'elevation-2': 'shadow-sm',
    'elevation-3': 'shadow-md',
    'elevation-4': 'shadow-xl',
    'elevation-5': 'shadow-2xl',

    'text-display-large': '  font-heading normal-case text-[3.5625rem] font-[400] leading-[1.1228] tracking-[-.0044em]',
    'text-display-medium': ' font-heading normal-case text-[2.8125rem] font-[400] leading-[1.1556] tracking-[normal]',
    'text-display-small': '  font-heading normal-case text-[2.25rem]   font-[400] leading-[1.2222] tracking-[normal]',
    'text-headline-large': ' font-heading normal-case text-[2rem]      font-[400] leading-[1.25]   tracking-[normal]',
    'text-headline-medium': 'font-heading normal-case text-[1.75rem]   font-[400] leading-[1.2857] tracking-[normal]',
    'text-headline-small': ' font-heading normal-case text-[1.5rem]    font-[400] leading-[1.3333] tracking-[normal]',
    'text-title-large': '    font-heading normal-case text-[1.375rem]  font-[400] leading-[1.2727] tracking-[normal]',
    'text-title-medium': '   font-body    normal-case text-[1rem]      font-[500] leading-[1.5]    tracking-[.0094em]',
    'text-title-small': '    font-body    normal-case text-[.875rem]   font-[500] leading-[1.4286] tracking-[.0071em]',
    'text-body-large': '     font-body    normal-case text-[1rem]      font-[400] leading-[1.5]    tracking-[.0313em]',
    'text-body-medium': '    font-body    normal-case text-[.875rem]   font-[400] leading-[1.4286] tracking-[.0179em]',
    'text-body-small': '     font-body    normal-case text-[.75rem]    font-[400] leading-[1.3333] tracking-[.0333em]',
    'text-label-large': '    font-body    normal-case text-[.875rem]   font-[500] leading-[1.4286] tracking-[.0071em]',
    'text-label-medium': '   font-body    normal-case text-[.75rem]    font-[500] leading-[1.3333] tracking-[.0417em]',
    'text-label-small': '    font-body    normal-case text-[.6875rem]  font-[500] leading-[1.4545] tracking-[.0455em]',

    'rounded-0': 'rounded-none',
    'rounded-sm': 'rounded-[2px]',
    rounded: 'rounded-[4px]',
    'rounded-lg': 'rounded-[8px]',
    'rounded-xl': 'rounded-[24px]',
    'rounded-pill': 'rounded-full',
    'rounded-circle': 'rounded-[50%]',
    'rounded-shaped': 'rounded-[24px_0]',

    // directional variants
    'rounded-t-0': 'rounded-t-none',
    'rounded-t-sm': 'rounded-tl-[2px] rounded-tr-[2px]',
    'rounded-t': 'rounded-tl-[4px] rounded-tr-[4px]',
    'rounded-t-lg': 'rounded-tl-[8px] rounded-tr-[8px]',
    'rounded-t-xl': 'rounded-tl-[24px] rounded-tr-[24px]',
    'rounded-t-pill': 'rounded-tl-full rounded-tr-full',

    'rounded-b-0': 'rounded-b-none',
    'rounded-b-sm': 'rounded-bl-[2px] rounded-br-[2px]',
    'rounded-b': 'rounded-bl-[4px] rounded-br-[4px]',
    'rounded-b-lg': 'rounded-bl-[8px] rounded-br-[8px]',
    'rounded-b-xl': 'rounded-bl-[24px] rounded-br-[24px]',
    'rounded-b-pill': 'rounded-bl-full rounded-br-full',

    'rounded-s-0': 'rounded-ss-none rounded-es-none',
    'rounded-s-sm': 'rounded-ss-[2px] rounded-es-[2px]',
    'rounded-s': 'rounded-ss-[4px] rounded-es-[4px]',
    'rounded-s-lg': 'rounded-ss-[8px] rounded-es-[8px]',
    'rounded-s-xl': 'rounded-ss-[24px] rounded-es-[24px]',
    'rounded-s-pill': 'rounded-ss-full rounded-es-full',

    'rounded-e-0': 'rounded-se-none rounded-ee-none',
    'rounded-e-sm': 'rounded-se-[2px] rounded-ee-[2px]',
    'rounded-e': 'rounded-se-[4px] rounded-ee-[4px]',
    'rounded-e-lg': 'rounded-se-[8px] rounded-ee-[8px]',
    'rounded-e-xl': 'rounded-se-[24px] rounded-ee-[24px]',
    'rounded-e-pill': 'rounded-se-full rounded-ee-full',

    border: 'border-1px',
    'border-thin': 'border-1px',
    'border-sm': 'border-1px',
    'border-md': 'border-2px',
    'border-lg': 'border-4px',
    'border-xl': 'border-8px'
  }
});
