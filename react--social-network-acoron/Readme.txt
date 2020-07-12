#Acoron Social Network

It is a simple social network, somehow inspired in Twitter

You can view this full website here:
http://acoron.netlify.com

Please, be patient, it's hosted in Heroku, so you have to wait until the dyno's wake up process start (usually between 5 or 10 seconds)


To make this code work locally, remember you should set your env variables:
.env && .env.development.local in Frontend:
 - REACT_APP_BACKEND_URL (backend url)
variables.env in Backend:
 - SECRET (secret word for jwt)
 - DB_MONGO (mongodb database url)
