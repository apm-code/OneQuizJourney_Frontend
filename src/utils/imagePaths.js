// Imagen por defecto si falla la carga principal
export const PLACEHOLDER_IMAGE = '/images/characters/luffy.webp';

// Imagen de respaldo final si también falla el placeholder
export const SAFE_FALLBACK_IMAGE = '/images/characters/zoro.webp';

// Lista de personajes disponibles para usar como avatar
// Sirve para generar el selector de avatares y validar claves
export const CHARACTER_IMAGE_KEYS = [
  'shanks', 'usopp', 'sanji', 'nami', 'roger', 'chopper', 'ace', 'enel', 'franky',
  'lucci', 'robin', 'brook', 'rayleigh', 'hancock', 'crocodile', 'whitebeard',
  'jinbe', 'law', 'doflamingo', 'katakuri', 'zoro', 'kaido', 'teach', 'mihawk', 'luffy',
];

// Alias para islas cuyo nombre en la base de datos no coincide
// exactamente con el nombre del archivo de imagen
// Ejemplo: "Isla del Amanecer" → dawn-island.webp
const islandAliases = {
  'isla del amanecer': 'dawn-island',
};

// Función que normaliza texto:
// - Convierte a string
// - Elimina espacios extra
// - Pasa a minúsculas
// - Elimina acentos
function normalize(input) {
  return (input || '')
    .toString()
    .trim()
    .toLowerCase()
    .normalize('NFD') // separa letras y acentos
    .replace(/[\u0300-\u036f]/g, ''); // elimina los acentos
}

// Convierte un texto en formato kebab-case
// Ej: "Isla del Amanecer" → "isla-del-amanecer"
function toKebab(input) {
  return normalize(input)
    .replace(/[^a-z0-9]+/g, '-') // reemplaza espacios y símbolos por "-"
    .replace(/^-+|-+$/g, '');    // elimina "-" al inicio o final
}

// Genera una clave limpia para personajes
// Elimina todo lo que no sea letra o número
function toCharacterKey(name) {
  return normalize(name).replace(/[^a-z0-9]/g, '');
}

// Genera automáticamente la ruta de imagen de un personaje
export function getCharacterImagePath(name) {
  const key = toCharacterKey(name);
  return `/images/characters/${key}.webp`;
}

// Genera automáticamente la ruta de imagen de una isla
// Primero busca si existe alias, si no genera kebab-case
export function getIslandImagePath(name) {
  const normalizedName = normalize(name);

  // Si existe alias lo usa, si no convierte el nombre a kebab-case
  const islandKey = islandAliases[normalizedName] || toKebab(name);

  return `/images/islands/${islandKey}.webp`;
}