**_ Creating database environment files _**

Before start to work with this repo you will have to create two database environment files, as them were added to .gitignore.
To do this, please follow next steps:

- create file with name ".env.test" in the main folder, add PGDATABASE=<database_name_here> inside (use test database name here);
- create file with name ".env.development" in the main folder, add PGDATABASE=<database_name_here> inside (use development database name here, without \_test addition to db name).

You can find example .env-example file in main folder.
