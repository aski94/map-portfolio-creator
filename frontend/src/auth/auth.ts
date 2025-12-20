import { ref } from "vue";

const tokenRef = ref<string>(localStorage.getItem("token") || "");

export function useAuth() {
  function setToken(token: string) {
    tokenRef.value = token;
    localStorage.setItem("token", token);
  }

  function logout() {
    tokenRef.value = "";
    localStorage.removeItem("token");
  }

  function token() {
    return tokenRef.value;
  }

  function isLoggedIn() {
    return !!tokenRef.value;
  }

  return { setToken, logout, token, isLoggedIn };
}
