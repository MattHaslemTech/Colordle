export const getUser = () => {
  return fetch( process.env.REACT_APP_API_URL + "/getUser?user=" + localStorage.getItem("userId"))
      .then(res => res.json())
      .then(data => {
        return data;
      });
}
