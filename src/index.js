const express = require("express");

const { v4: uuid } = require("uuid");

const app = express();

app.use(express.json());

const repositories = [];

function findRepository(request, response, next) {
    const { id } = request.params;

    const findRepository = repositories.find(
        (repository) => repository.id === id
    );
    if (!findRepository) {
        return response.status(404).json({ error: "Repository not found!" });
    }

    request.repository = findRepository;

    return next();
}

app.get("/repositories", (request, response) => {
    return response.json(repositories);
});

app.post("/repositories", (request, response) => {
    const { title, url, techs } = request.body;

    const repository = {
        id: uuid(),
        title,
        url,
        techs,
        likes: 0,
    };

    repositories.push(repository);

    return response.status(201).json(repository);
});

app.put("/repositories/:id", findRepository, (request, response) => {
    const { repository } = request;
    const { title, url, techs } = request.body;

    repository.title = title;
    repository.url = url;
    repository.techs = techs;

    return response.json(repository);
});

app.delete("/repositories/:id", findRepository, (request, response) => {
    const { repository } = request;

    // const { id } = request.params;
    // const repositoryIndex = repositories.findIndex(
    //     (repository) => repository.id === id
    // );

    const index = repositories.indexOf(repository);

    repositories.splice(index, 1);

    return response.status(204).json();
});

app.post("/repositories/:id/like", findRepository, (request, response) => {
    const { repository } = request;

    repository.likes += 1;

    return response.json(repository);
});

module.exports = app;
