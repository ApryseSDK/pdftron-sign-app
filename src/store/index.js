import Vue from "vue";
import Vuex from "vuex";
import router from "@/router";
import { auth } from "@/firebase";

Vue.use(Vuex);

export default new Vuex.Store({
  state: {
    user: null,
    signees: [],
    docToSign: null,
    docToView: null
  },
  mutations: {
    setUser(state, payload) {
      state.user = payload;
    },
    addSignee(state, payload) {
      state.signees = [...state.signees, { key: payload.key, name: payload.name, email: payload.email }]
    },
    resetSignee(state) {
      state.signees = [];
    },
    setDocToSign(state, payload) {
      state.docToSign = payload;
    },
    resetDocToSign(state) {
      state.docToSign = null;
    },
    setDocToView(state, payload) {
      state.docToView = payload;
    },
    resetDocToView(state) {
      state.docToView = null;
    }
  },
  actions: {
    userLogout({ commit }) {
      auth
        .signOut()
        .then(() => {
          commit("setUser", null);
          router.push("/login");
        })
        .catch(() => {
          commit("setUser", null);
          router.push("/login");
        });
    },
    addSignee({ commit }, payload) {
      commit("addSignee", payload);
    },
    resetSignee({ commit }) {
      commit("resetSignee");
    },
    setDocToSign({ commit }, payload) {
      commit("setDocToSign", payload);
    },
    resetDocToSign({ commit }) {
      commit("resetDocToSign");
    },
    setDocToView({ commit }, payload) {
      commit("setDocToView", payload);
    },
    resetDocToView({ commit }) {
      commit("resetDocToView");
    }
  },
  getters: {
    user(state) {
      return state.user;
    },
    signees(state) {
      return state.signees
    },
    doc(state) {
      return state.docToSign
    },
    docToView(state) {
      return state.docToView
    }
  },
  modules: {}
});
