import { Application, Router } from "https://deno.land/x/oak/mod.ts";

const env = Deno.env.toObject();
const PORT = env.PORT || 8000;
const HOST = env.HOST || "127.0.0.1";

let users = [
  {
    name: "John",
    age: 24,
  },
  {
    name: "Adam",
    age: 23,
  },
];

// @route GET /users
// @desc Get all users
export const getUsers = ({ response }) => (response.body = users);

// @route GET /users/:name
// @desc Get a user by name
export const getUserByName = ({ params, response }) => {
  const user = users.filter(
    (user) => user.name.toLowerCase() === params.name.toLowerCase()
  );

  if (user.length) {
    response.status = 200;
    response.body = user[0];
    return;
  }

  response.status = 404;
  response.body = { msg: `User ${params.name} not found` };
};

// @route POST /users
// @desc Add a user
export const addUser = async ({ request, response }) => {
  const body = await request.body();
  const user = body.value;
  users.push(user);

  response.body = user;
  response.status = 200;
};

// @route PUT /users/:name
// @desc Update a user
export const updateUser = async ({ params, request, response }) => {
  const temp = users.filter(
    (user) => user.name.toLowerCase() === params.name.toLowerCase()
  );

  const body = await request.body();
  const { age } = body.value;

  if (temp.length) {
    temp[0].age = age;
    response.status = 200;
    response.body = temp;
    return;
  }

  response.status = 404;
  response.body = { msg: `User ${params.name} not found` };
};

// @route DELETE /users/:name
// @desc Delete a user
export const deleteUser = ({ params, response }) => {
  const lengthBefore = users.length;
  users = users.filter(
    (user) => user.name.toLowerCase() !== params.name.toLowerCase()
  );

  if (users.length === lengthBefore) {
    response.status = 404;
    response.body = { msg: `User ${params.name} not found` };
    return;
  }

  response.body = users;
  response.status = 200;
};

const router = new Router();
router
  .get("/users", getUsers)
  .get("/users/:name", getUserByName)
  .post("/users", addUser)
  .put("/users/:name", updateUser)
  .delete("/users/:name", deleteUser);

const app = new Application();

app.use(router.routes());
app.use(router.allowedMethods());

console.log(`Listening on port ${PORT}...`);
await app.listen(`${HOST}:${PORT}`);
