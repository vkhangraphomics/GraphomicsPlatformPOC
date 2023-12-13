import axios from "axios";
//54.210.222.205:8080

const API_URL =
  "http://" + process.env.REACT_APP_BACKEND_IP_PORT + "/api/auth/";

class AuthService {
  login(username: string, password: string) {
    return axios
      .post(API_URL + "signin", {
        username,
        password,
      })
      .then((response) => {
        if (response.data.token) {
          localStorage.setItem("user", JSON.stringify(response.data));
        }
        console.log("test");
        console.log(response.data);
        return response.data;
      });
  }

  logout() {
    console.log("logout");
    localStorage.removeItem("user");
  }

  register(username: string, email: string, password: string) {
    return axios.post(API_URL + "signup", {
      username,
      email,
      password,
    });
  }

  getCurrentUser() {
    const userStr = localStorage.getItem("user");
    console.log("userStr" + userStr);
    if (userStr) return JSON.parse(userStr);

    return null;
  }
}

export default new AuthService();
