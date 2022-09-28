const router = require('express').Router();
const authRoutes = require('./auth.route');
const userRoutes = require('./user.route');
const roomRoutes = require('./room.route');

const appRoutes = [
  {
    path: "/auth",
    routes: authRoutes
  },
  {
    path: "/users",
    routes: userRoutes
  },
  {
    path: "/rooms",
    routes: roomRoutes
  }
]

appRoutes.forEach(({ path, routes }) => {
  router.use(path, routes)
})

module.exports = router;
