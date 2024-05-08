# Users Data Fetcher

version: 1.0.0 by Rendy Reynaldy A.

## Features
- App will fetch 20 users by default every hour
- At the end of the day or at 23:59, all the data fetch that day will be saved on Daily Records
- There's a simple page view that will present users and daily records in table
- Search functionality & date filter

## Tech Used
- [Ruby on Rails](https://rubyonrails.org/)
- [PostgreSQL](https://www.postgresql.org/)
- HTML
- CSS
- Tailwind
- Liquid

## Installation
- Download or clone this repository
- Go to project root directory & run this command for installing dependencies:
```sh
bundle install
```
- Adjust the database config in:
```sh
config/database.yml
```
- My database configs are:
```sh
host: localhost
port: 5432
username: rendy
password: password
database: peasy_ai_assigment
```
- create your database with the name based on config
- run this command to migrate database:
```sh
rails db:migrate
```
- after migration successfull, run this command to run the server in your local machine:
```sh
./bin/sh
```
- Browser the application in your browser. By default the url will be: <code>localhost:3000</code>
