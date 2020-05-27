You can view this full website here:
acoron.netlify.com
Be patient, because it's hosted in Heroku, so you have to wait until the dyno's wake up process (usually between 5 or 10 seconds)
To make this code work, remember you should set your env variables:
.env && .env.development.local in Frontend:
 - REACT_APP_BACKEND_URL (backend url)
variables.env in Backend:
 - SECRET (secret word for jwt)
 - DB_MONGO (mongodb database url)