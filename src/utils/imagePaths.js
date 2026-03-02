// Importaciones de imágenes disponibles localmente
import luffyImg from '../assets/images/characters/luffy.webp';
import zoroImg from '../assets/images/characters/zoro.webp';
import lawImg from '../assets/images/characters/law.webp';
import shanksImg from '../assets/images/characters/shanks.webp';
import teachImg from '../assets/images/characters/teach.webp';
import whitebeardImg from '../assets/images/characters/whitebeard.webp';

// Mapa de personajes con imagen local disponible
// Clave: nombre normalizado del personaje (sin espacios, sin acentos, minúsculas)
export const REWARD_CHARACTER_IMAGES = {
  luffy: luffyImg,
  zoro: zoroImg,
  law: lawImg,
  shanks: shanksImg,
  teach: teachImg,
  whitebeard: whitebeardImg,
};

// Imagen por defecto si falla la carga principal
export const PLACEHOLDER_IMAGE = luffyImg;

// Imagen de respaldo final si también falla el placeholder
export const SAFE_FALLBACK_IMAGE = zoroImg;

// Lista de personajes disponibles para usar como avatar
// Sirve para generar el selector de avatares y validar claves
export const AVATAR_CHARACTER_KEYS = [
  'shanks', 'usopp', 'sanji', 'nami', 'roger', 'chopper', 'ace', 'enel', 'franky',
  'lucci', 'robin', 'brook', 'rayleigh', 'hancock', 'crocodile', 'whitebeard',
  'jinbe', 'law', 'doflamingo', 'katakuri', 'zoro', 'kaido', 'teach', 'mihawk', 'luffy',
];

// Alias para mantener compatibilidad con imports antiguos
export const CHARACTER_IMAGE_KEYS = AVATAR_CHARACTER_KEYS;

// Alias para islas cuyo nombre en la base de datos no coincide
// exactamente con el nombre del archivo de imagen
// Ejemplo: "Isla del Amanecer" → dawn-island.webp
const islandAliases = {
  'isla del amanecer': 'dawn-island',
};

// Aliases para nombres completos de personajes → nombre corto del archivo de imagen
// Necesario porque los nombres del seed (ej: "Monkey D. Luffy") generan una clave
// distinta al nombre del archivo (ej: "luffy.webp")
const characterAliases = {
  'monkeydluffy': 'luffy',
  'roronoazoro': 'zoro',
  'trafalgardwaterlaw': 'law',
  'shankselpellirrojo': 'shanks',
  'marshalldteach': 'teach',
  'edwardnewgate': 'whitebeard',
  'vinsmokesanji': 'sanji',
  'goldroger': 'roger',
  'tonytonychopper': 'chopper',
  'portgasdace': 'ace',
  'roblucci': 'lucci',
  'nicorobin': 'robin',
  'silversrayleigh': 'rayleigh',
  'boahancock': 'hancock',
  'donquixotedoflamingo': 'doflamingo',
  'charlottekatakuri': 'katakuri',
  'draculemihawk': 'mihawk',
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

function toCharacterShortKey(name) {
  const key = toCharacterKey(name);
  return characterAliases[key] || key;
}

// Imagen de perfil: siempre sale de public/images/characters
export function getAvatarImagePath(name) {
  const shortKey = toCharacterShortKey(name);
  return `/images/characters/${shortKey}.webp`;
}

// Imagen de personaje para recompensas:
// 1) intenta la imagen local de recompensa
// 2) si no existe, usa imagen de perfil
export function getCharacterImagePath(name) {
  const shortKey = toCharacterShortKey(name);
  return REWARD_CHARACTER_IMAGES[shortKey] || getAvatarImagePath(shortKey);
}

// Genera automáticamente la ruta de imagen de una isla
// Primero busca si existe alias, si no genera kebab-case
export function getIslandImagePath(name) {
  const normalizedName = normalize(name);

  // Si existe alias lo usa, si no convierte el nombre a kebab-case
  const islandKey = islandAliases[normalizedName] || toKebab(name);

  return `/images/islands/${islandKey}.webp`;
}