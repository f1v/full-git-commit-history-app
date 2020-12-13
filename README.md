## Local Development

### Starting the project

```
npm i
npm start
```

### Authenticating with GitHub Token for local development

- Follow [this guide](https://docs.github.com/en/free-pro-team@latest/github/authenticating-to-github/creating-a-personal-access-token) to generate a token.
- Create a `.env` file at the root of the project and add your token.

.env

```
REACT_APP_GITHUB_TOKEN=<your token>
```
