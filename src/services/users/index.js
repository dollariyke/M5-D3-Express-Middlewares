const express = require("express")
const fs = require("fs")
const path = require("path")
const uniqid = require("uniqid")

const router = express.Router()

const readFile = fileName => {
  const buffer = fs.readFileSync(path.join(__dirname, fileName))
  const fileContent = buffer.toString()
  return JSON.parse(fileContent)
}

router.get("/:id", (req, res) => {
  const usersDB = readFile("users.json")
  const user = usersDB.filter(user => user.ID === req.params.id)
  res.send(user)
})

router.get("/", (req, res) => {
  const usersDB = readFile("users.json")
  if (req.query && req.query.name) {
    const filteredUsers = usersDB.filter(
      user =>
        user.hasOwnProperty("name") &&
        user.name.toLowerCase() === req.query.name.toLowerCase()
    )
    res.send(filteredUsers)
  } else {
    res.send(usersDB)
  }
})

router.post("/", (req, res) => {
  const usersDB = readFile("users.json")
  const newUser = {
    ...req.body,
    ID: uniqid(),
    modifiedAt: new Date(),
  }

  usersDB.push(newUser)

  fs.writeFileSync(path.join(__dirname, "users.json"), JSON.stringify(usersDB))

  res.status(201).send({ id: newUser.ID })
})

router.delete("/:id", (req, res) => {
  const usersDB = readFile("users.json")
  const newDb = usersDB.filter(user => user.ID !== req.params.id)
  fs.writeFileSync(path.join(__dirname, "users.json"), JSON.stringify(newDb))

  res.status(204).send()
})

router.put("/:id", (req, res) => {
  const usersDB = readFile("users.json")
  const newDb = usersDB.filter(user => user.ID !== req.params.id)

  const modifiedUser = {
    ...req.body,
    ID: req.params.id,
    modifiedAt: new Date(),
  }

  newDb.push(modifiedUser)
  fs.writeFileSync(path.join(__dirname, "users.json"), JSON.stringify(newDb))

  res.send({ id: modifiedUser.ID })
})

module.exports = router
