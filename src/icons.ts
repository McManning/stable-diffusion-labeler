import { addIcon } from '@osuresearch/iconography';
import tableOfContents from '@iconify/icons-mdi/book-open-outline';
import comment from '@iconify/icons-mdi/comment-outline';
import multipleComments from '@iconify/icons-mdi/comment-multiple-outline';
import addComment from '@iconify/icons-mdi/comment-plus-outline';
import questioningComment from '@iconify/icons-mdi/comment-question-outline';
import suggestionComment from '@iconify/icons-mdi/comment-edit-outline';
import resolvedComment from '@iconify/icons-mdi/comment-check-outline';
import alertComment from '@iconify/icons-mdi/comment-alert-outline';

import gridView from '@iconify/icons-mdi/grid-large';
import listView from '@iconify/icons-mdi/format-list-text';
import regex from '@iconify/icons-mdi/regex';

// TODO: Replace with a round edged icon. Didn't find a good one on iconify.
import replaceAll from '@iconify/icons-codicon/replace';

/* Iconify icons used by this app */

const icons: Record<string, any> = {
  gridView,
  listView,
  regex,
  replaceAll,
}

export function loadAllIcons() {
  Object.keys(icons).forEach((name) => {
    addIcon(name, icons[name]);
  });
}
