const express = require("express");
const cors = require("cors");

const { v4: uuid, validate: isUuid } = require('uuid');

const app = express();

app.use(express.json());
app.use(cors());

const repositories = [];

app.get("/repositories", (request, response) => {
  return response.json(repositories)
});

const validateId = (request, response, next) => {
  const { id } = request.params;

  if(!isUuid(id)){
    response.status(400).send({error: "Project id invalid"})
  }
  return next()
}

app.post("/repositories", (request, response) => {
  const {title, url, techs} = request.body;
  const repository = {id: uuid(), title, url, techs, likes: 0}

  repositories.push(repository)

  return response.json(repository)
});

app.put("/repositories/:id", validateId, (request, response) => {
  const {id} = request.params
  const {title, url, techs} = request.body;
  const repository = {title, url, techs}

  const repositoryIndex = repositories.findIndex(repo => repo.id === id)
  if(repositoryIndex === -1) {
    return response.status(400).json({error: "Repository id not found"})
  }
  repositories[repositoryIndex] = {id, ...repository, likes: repositories[repositoryIndex].likes};

  return response.json(repositories[repositoryIndex])
});

app.delete("/repositories/:id", validateId, (request, response) => {
    const {id} = request.params

  const repositoryIndex = repositories.findIndex(repo => repo.id === id)
  if(repositoryIndex === -1) {
    return response.status(400).json({error: "Repository id not found"})
  }
    repositories.splice(repositoryIndex, 1)
  
  return response.status(204).send();
});

app.post("/repositories/:id/like", validateId, (request, response) => {
  const {id} = request.params

  const repositoryIndex = repositories.findIndex(repo => repo.id === id)

  if(repositoryIndex === -1) {
    return response.status(400).json({error: "Repository id not found"})
  }
  repositories[repositoryIndex].likes ++
  
  return response.json(repositories[repositoryIndex]);
});

module.exports = app;
