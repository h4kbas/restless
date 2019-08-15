import { Restless, ContentType, Method } from "./Restless";

/*
User.get(1)
User.get(1, {rank: 5})
User.update(1, {username: "Deneme"})
*/
document.addEventListener("DOMContentLoaded", async () => {
  const R = new Restless("https://jsonplaceholder.typicode.com", ContentType.FORM_URL_ENCODED, {
    "todos": Method.GET
  });
  const User = R.client();
  console.log(await User.todos(1));

})