import type { ImageMetadata } from 'astro';

const files = import.meta.glob<{ default: ImageMetadata }>('../assets/img/*.{png,jpg,jpeg,webp}', { eager: true });

/** Devuelve la imagen de src/assets/img por nombre (sin extensión), o undefined si aún no existe. */
export function img(name: string): ImageMetadata | undefined {
  const key = Object.keys(files).find((k) => k.split('/').pop()?.replace(/\.\w+$/, '') === name);
  return key ? files[key].default : undefined;
}
