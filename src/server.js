const express = require("express")
const listEndpoints = require("express-list-endpoints")
const usersRouter = require("./services/users")
const moviesRouter = require("./services/movies")

const server = express()

const port = process.env.PORT || 3001

server.use(express.json())

server.use("/users", usersRouter)
server.use("/movies", moviesRouter)

console.log(listEndpoints(server))

server.listen(port, () => {
  console.log(`Server is running on port ${port}`)
})
