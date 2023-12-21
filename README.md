# Games World Magazine API

Back-end project that is incorporated in a front-end project Games World Magazine.

## Content

[General Info](#general-info)

[Link To Deployed Version](#link-to-deployed-version)

[Cloning, Setup And Work With A Project](#cloning-setup-and-work-with-a-project)

## General Info

This project was created in order to improve my back-end coding skills during participation in Northcoders Bootcamp, using Express, Postgres and Jest.

This project is an API that allows you to search through reviews of different board games. All of them contain useful information about different games both popular and lesser known, including game designer, review author, description of the game, image etc.

This back-end project is used later in a front-end project named Games World Magazine, you can find it [here on Github](https://github.com/melsem08/frontend_games), or deployed version [here](https://nc-games-magazine.netlify.app/)

## Link To Hosted Version

https://games-api-project.onrender.com/api

## Cloning, Setup And Work With A Project

To clone and run this application, you'll need [Git](https://git-scm.com) and [Node.js](https://nodejs.org/en/download/) (which comes with [npm](http://npmjs.com)) installed on your computer.

### Cloning

To clone this repo to your desktop run a command from your command line:

```bash
$ git clone https://github.com/melsem08/frontend_games.git
```

After you clone this repo to your desktop, make sure you cd to its root directory:

```bash
$ cd frontend_games
```

### Setup

Now you have to be able to type `npm install` to install its dependencies:

```bash
$ npm install
```

Once the dependencies are installed, you can set up the test and development databases and seed them, typing the following:

- `npm run setup-dbs` command for setting up your databases

```bash
$ npm run setup-dbs
```

- `npm run seed` command for seeding databases with data

```bash
$ npm run seed
```

### Work With A Project

Before start to work with this repo you will have to create two database environment files, as them were added to .gitignore.
To do this, please follow next steps:

- create file with name `.env.test` in the main folder, add `PGDATABASE=<database_name_here>` text inside (please use test database name here);
- create file with name `.env.development` in the main folder, add `PGDATABASE=<database_name_here>` text inside (please use development database name here).

You can find example .env-example file in main folder.

Tests are also included in this project. To run them you can use `npm run test` command:

```bash
$ npm run test
```

Tests are divided into two categories: app tests (you can find them in a file app.test.js) and utility tests (you can find them in a file utils.test.js). To specifically run one of these categories you can use the following commands:

```bash
$ npm run test app.test.js
$ npm run test utils.test.js
```
