/**
 * returns x, y coordinates for absolute positioning of a span within a given text input
 * at a given selection point
 * @param {object} input - the input element to obtain coordinates for
 * @param {number} selectionPoint - the selection point for the input
 *
 * @author https://jh3y.medium.com/how-to-where-s-the-caret-getting-the-xy-position-of-the-caret-a24ba372990a
 */
const getCursorXY = (input: HTMLInputElement | HTMLTextAreaElement, selectionPoint: number) => {
  const {
    offsetLeft: inputX,
    offsetTop: inputY,
  } = input;

  console.log('recompute', input);

  // create a dummy element that will be a clone of our input
  const div = document.createElement('div');

  // get the computed style of the input and clone it onto the dummy element
  const copyStyle = getComputedStyle(input);

  let styles: Record<string, any> = {};

  Array.from(copyStyle).forEach((prop) => {
    try {
      div.style[prop as any] = copyStyle[prop as any];
    } catch (e) {
      console.error('skip', prop, e);
    }
  });

  // we need a character that will replace whitespace when filling
  // our dummy element if it's a single line <input/>
  const swap = '.';

  const inputValue = input.tagName === 'INPUT' ? input.value.replace(/ /g, swap) : input.value;
  const textContent = inputValue.substr(0, selectionPoint);
  div.textContent = textContent;

  if (input.tagName === 'TEXTAREA') div.style.height = 'auto';
  if (input.tagName === 'INPUT') div.style.width = 'auto';

  const span = document.createElement('span');
  span.textContent = inputValue.substr(selectionPoint) || '.';

  div.appendChild(span);
  document.body.appendChild(div);

  const { offsetLeft: spanX, offsetTop: spanY } = span;

  document.body.removeChild(div);

  return {
    x: inputX + spanX,
    y: inputY + spanY,
  }
}


export function useCursorPosition(ref: React.RefObject<HTMLInputElement | HTMLTextAreaElement>) {
  if (!ref.current) {
    return {};
  }

  const {
    offsetLeft,
    offsetTop,
    offsetHeight,
    offsetWidth,
    scrollLeft,
    scrollTop,
    selectionEnd,
  } = ref.current;

  const { lineHeight, paddingRight } = getComputedStyle(ref.current);
  const { x, y } = getCursorXY(ref.current, selectionEnd ?? 0);

  const left = Math.min(
    x - scrollLeft,
    (offsetLeft + offsetWidth) - parseInt(paddingRight, 10)
  )
  const top = Math.min(
    y - scrollTop,
    (offsetTop + offsetHeight) - parseInt(lineHeight, 10)
  )

  return { left, top };
}

// Alternative: https://codepen.io/erikmartinjordan/pen/gOgwJZZ
// Creates a dummy span with the same dimensions then computes
// the rect for that... not sure how that works though here.
// I guess cuz it's a span and wrapping we see the last wrapped line
// as a client rect?

// Or a contenteditable + spans: https://stackoverflow.com/a/41192022
// https://javascript.plainenglish.io/how-to-find-the-caret-inside-a-contenteditable-element-955a5ad9bf81
// Better solution.
