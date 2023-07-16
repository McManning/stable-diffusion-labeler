import { Color } from "@osuresearch/ui";

/**
 * Match category ID to color
 *
 * @see https://danbooru.donmai.us/wiki_pages/help:tags
 */
export function getBooruCategoryColor(category: number): Color {
  return [
    'accent01', // general.. again?
    'accent05', // artist
    'neutral', // general ???
    'accent06', // copyright
    'accent03', // character
    'accent02', // meta
  ][category] as Color;
}

// 0 = ???
// 1 = artist = red
// 2 = general = blue
// 3 = copyright = purple
// 4 = character = green
// 5 = meta = orange

export function getBooruCategoryName(category: number) {
  return [
    'general',
    'artist',
    'general',
    'copyright',
    'character',
    'meta',
  ][category];
}

export function arraysEqual(a: any[], b: any[]) {
  if (a === b) return true;
  if (a.length !== b.length) return false;

  for (let i = 0; i < a.length; i++) {
    if (a[i] !== b[i]) return false;
  }

  return true;
}

export function searchTags(search: ImageSearchFilter, tags: string[]) {
  const pattern = `.*${search.terms.split(' ').join('.*')}.*`;
  const re = new RegExp(pattern, 'gi');

  return tags.find((tag) => tag.search(re) >= 0);
}

export function isMatch(image: TrainingImage, search: ImageSearchFilter) {
  const hasTagMatches = search.terms.length > 0 && searchTags(search, image.tags) !== undefined;
  const hasUntaggedMatch = search.untagged && image.tags.length < 1;

  return hasUntaggedMatch || hasTagMatches;
}

export function filterBySearch(images: TrainingImage[], search: ImageSearchFilter) {
  return images.filter((img) => isMatch(img, search));
}
