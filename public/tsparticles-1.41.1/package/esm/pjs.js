const initPjs = (engine) => {
  const particlesJS = (tagId, options) => {
    return engine.load(tagId, options);
  };
  particlesJS.load = (tagId, pathConfigJson, callback) => {
    engine
      .loadJSON(tagId, pathConfigJson)
      .then((container) => {
        if (container) {
          callback(container);
        }
      })
      .catch(() => {
        callback(undefined);
      });
  };
  particlesJS.setOnClickHandler = (callback) => {
    engine.setOnClickHandler(callback);
  };
  const pJSDom = engine.dom();
  return { particlesJS, pJSDom };
};
export { initPjs };
