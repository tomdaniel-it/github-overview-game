# GitHub Overview Game
A web based game which displays the repositories of a user in an original way.
A PHP & Node.js (TypeScript) project
### Setup
```sh
$ cp keys.php-example keys.php
$ cp ts/tsconfig.json-example ts/tsconfig.json
```
default_settings.php: fill in custom username

Add a `GitHub-Overview-Info.json` file to every repository which you want in your game (you can customize the file name):
```json
{
  "description": "The description of the project."
}
```
### Edit starting biographies
You can configure `ts/DefaultSettings.ts` to create your own biographies, such like 'About me' and 'My skills'.
