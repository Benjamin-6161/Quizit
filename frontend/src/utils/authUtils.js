
export function logout(){
    localStorage.removeItem("token");
    localStorage.removeItem("username");
    localStorage.removeItem("email");
    localStorage.removeItem("userId");
    localStorage.removeItem("favoriteQuestions");
    localStorage.setItem("authenticated", false);
  }