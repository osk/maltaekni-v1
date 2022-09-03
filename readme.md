# Simple Classifier Interface

Create a postgres db, create schema, migrate from sqlite (using `sequel`)

```bash
# install sequel
> gem install sequel
> gem install pg sqlite3

# from root of project
> createdb classifier

# note the url, add to .env, e.g. postgres://:@localhost/classifier

# migrate from sqlite db from project
> sequel -C sqlite://path/sqlite.db postgres://:@localhost/<db name>
# create the table for classifications
> psql -d classifier -f ./schema.sql
```

Run the app:

```bash
> node app.js
```

Classify some sentences!

## Deploy to Heroku

1. Create the repo and connect to GitHub (or push straight).
2. Add postgres, e.g. `heroku addons:create heroku-postgresql:hobby-dev -a <app-name>`
3. Dump local db to file, plain text is easiest
4. Import to heroku, e.g. `heroku pg:psql -a <app name> < dump.db`
5. Add a logging service, e.g. `papertrail`
