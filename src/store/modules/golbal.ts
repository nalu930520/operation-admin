const golbal = {
  state: {
    country: [],
    currency: []
  },

  mutations: {
    SET_COUNTRY: (state, country) => {
      state.country = country
    },
    SET_CURRENCY: (state, currency) => {
      state.currency = currency
    }
  }
}

export default golbal
