const localStore = {
  clear(){
    localStorage.clear();
  },
  setStore: (key, data) => {
    localStorage.setItem(key, data);
  },
  getStore: (key) => {
    return localStorage.getItem(key);
  }
};

export default localStore;
