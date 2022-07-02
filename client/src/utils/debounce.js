/* eslint-disable import/no-anonymous-default-export */
export default (callback, delay) => {
  if (!callback || !delay) throw new Error("missing a valid/valids parameters");

  let interval;
  return (...args) => {
    clearTimeout(interval);
    interval = setTimeout(() => {
      interval = null;
      callback(...args);
    }, delay);
  };
};
