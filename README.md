# TIC TAC TOE WEB GAME WITH RAILS

version: 1.0.0 by Rendy Reynaldy A.

## Features
- Both Player are Human/User Input
- Users can input their names
- Leaderboards for 10 latest games
- Game state are saved for 7 days in session if the browser closed. So, the game will continue even though the browser closed or refresh accidentally
- All movements are logged in the database
- All movements, winning or draw state are checked in the backend logic

## Tech Used
- [Ruby on Rails](https://rubyonrails.org/)
- [PostgreSQL](https://www.postgresql.org/)
- HTML
- CSS
- Javascript
- [Slim](https://slim-template.github.io/)

## Installation
- Download or clone this repository
- Adjust the database config in:
```sh
config/database.yml
```
- My database config are:
```sh
host: localhost
port: 5432
username: rendy
password: password
database: tictactoe_rendy
```
- create your database with the name based on config
- run this command to migrate database:
```sh
rails db:migrate
```
- after migration successfull, run this command to run the server in your local machine:
```sh
rails s
```
- Browser the application in your browser. By default the url will be: <code>localhost:3000</code>