<img src="https://github.com/matijanjic/Kalender/blob/master/client/src/components/Navbar/resources/logo.svg" width="120px"/>

##### MERN stack calendar app for group usage

---

_Note: it's not responsive at the moment since I needed to rush it because of a deadline. That means I'll have the pleasure of combing through everything and fixing it after the fact, but such are the simple pleasures in life.
If it helps visualize what it is supposed to look like, I made it with 16:10 screen._

---

Kalen is a first bigger practice project of mine.
It's a shared calendar app, where multiple people have access to a one or more calendars. You can create multiple calendars for different groups and add or remove events and people.

It's a full stack SPA CSR app built with the MERN stack. I'm already a bit angry I didn't go the SQL or at least graphQL route since I believe it would make my life easier, but it will do for now.
State is managed using Redux and Tailwind is used for styling.

It's not currently functional since I started with the backend, so I will need more time on the frontend. Basic functionallity should be implemented this week.

Future features:

- friends and friend requests
- free time slots - so you can mark when you are open to make plans
- sharing of information between calendars, or, even better, one combined preview of all events you are part of
- google calendar API integration

---

install dependencies:

```
npm install
```

run server in development mode in the root:

```
npm run dev
```

run client inside client folder:

```
npm start
```

rename the .env-example to .env and replace keys and secrets inside:

```
MONGODB_URI = Production MongoDB key
TEST_MONGODB_URI = MongoDB key for testing
PORT = Server port for development
SECRET = Any string used for JWT hashing
```

Thanks to Mars for heroku-cra-node template, helped me a ton since I started with one shared repository with both frontend and backend inside https://github.com/mars/heroku-cra-node
