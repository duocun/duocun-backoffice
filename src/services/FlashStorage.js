const FlashStorage = () => {
  const storage = {};
  return {
    set: (key, value) => {
      storage[key] = value;
    },
    get: (key, destroy = true) => {
      const value = storage[key];
      if (destroy) {
        delete storage[key];
      }
      return value;
    }
  };
};

export default new FlashStorage();
