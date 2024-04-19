# News Site API

A _reddit-esque_ news site API, for the handling of a messageboard where users can post, and comment on articles about various topics of their choice.

**Example Hosted at**: https://news-server-api.onrender.com/

## Local Setup:

Please ensure you have at least:

**Node** version: _21.7.1_ or later\
**PSQL** version: _14.11_ or later

1. Create a local clone of this repo using _"git clone https://github.com/OniUnderscore/News-Server-API.git_

2. Install necessary dependencies using _"npm i -d"_

3. Create local databases using _"npm run setup-dbs"_

4. Create _.env.development_ and _.env.test_ files, which point to:\
   _nc_news_\
   and\
   _nc_news_test_\
   respectively.\
   For an example of how this should look, refer to _.env-example_

5. If you are planning on exploring the example development database, please run _"npm run seed"_

6. If you would like to run the local tests files, use _"npm test"_

## Endpoints:

A list of endpoints, and a description of their use, can be found by accessing the **/api** endpoint, using a GET method.
