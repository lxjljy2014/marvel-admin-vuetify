import fs from 'node:fs';
import process from 'node:process';
import path from 'node:path';
import { presetIcons } from 'unocss';
import unocss from 'unocss/vite';

function createSvgIconLoader(dir: string) {
  return async (iconName: string): Promise<string | undefined> => {
    const svgPath = path.join(dir, `${iconName}.svg`);
    try {
      let svg = await fs.promises.readFile(svgPath, 'utf-8');
      svg = svg.replace(/^<svg\s/, '<svg width="1em" height="1em" ');
      return svg;
    } catch {
      return undefined;
    }
  };
}

export function setupUnocss(viteEnv: Env.ImportMeta) {
  const { VITE_ICON_PREFIX, VITE_ICON_LOCAL_PREFIX } = viteEnv;

  const localIconPath = path.join(process.cwd(), 'src/assets/svg-icon');

  /** The name of the local icon collection */
  const collectionName = VITE_ICON_LOCAL_PREFIX.replace(`${VITE_ICON_PREFIX}-`, '');

  return unocss({
    presets: [
      presetIcons({
        prefix: `${VITE_ICON_PREFIX}-`,
        scale: 1,
        extraProperties: {
          display: 'inline-block'
        },
        collections: {
          [collectionName]: createSvgIconLoader(localIconPath)
        },
        warn: true
      })
    ]
  });
}
