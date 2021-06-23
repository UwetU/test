function isEmpty(obj) {
  for (let key in obj) {
    return false;
  }
  return true;
}

function flatPolyfill(items) {
  function flat(items) {
    for (let i = 0; i < items.length; i++) {
      const element = items[i];

      if (!Array.isArray(element)) {
        result.push(element);
      } else {
        flat(element);
      }
    }
  }
  let result = [];

  flat(items);

  return result;
}

export { flatPolyfill, isEmpty };