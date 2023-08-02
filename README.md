# Friender

Tinder like full-stack friend matching application

[Frontend Repo](https://github.com/chalonlubin/friender-frontend)
[Demo Here](https://main--friender-cl.netlify.app/) Deployed with Render and Netlify

**Login**: _BestGuest_ | **Password**: _password_

## 🧐 Motivation & Challenges

> Friender was built as part of a 4 day sprint with @amaesanchez while attending Rithm School. Our major goal was to store images using AWS S3 buckets.

> Other than that, we wanted to build a tinder like application for friends, with a messaging system. We thought of other features as well, however with the limited time we were allotted and the required goals, we ended up just executing the basic requirements of storing and retrieving images with AWS S3 and having a swipe / match system.

> One challenging part was getting up to speed on how to exactly use AWS S3. We ended up leaning heavily on a YouTube tutorial, as the docs for this particular assignment we found unclear. Another challenge was budgeting time. We thought we could finish more features within the timeline, however we fell short of our goal in our estimations.
>
>  Later on, I ended up transferring our AWS S3 to the 2023 version, and I also updated all dependencies. In the process I ended up transferring the entire app to utilize Vite instead of the outdated CRA.

## 💻 Tech Stack & Packages

**Node.js | Express | SQL | Postgres | React | HTML | CSS | Bootstrap**

## ⭐️ Features

Here is a high level overview a few of the features:

- Use of AWS S3 Bucket for image storage

- Swiping feature in React, using an algorithm leveraging user zip code input and distance preferences to find the next potential match

- Authentication and Authorization with jsonwebtoken and localstorage

## 📦 Install & Run


```

clone repo

psql -f jobly.sql jobly

npm install

npm start



Will be running on localhost 3001.



Note: You will need to create an AWS account to populate the following fields in the .env



in .env

AWS_BUCKET_NAME=""

AWS_BUCKET_REGION=""

AWS_ACCESS_KEY=""

AWS_SECRET_KEY=""



```


### ☑️ To-Do's

- UX / UI improvements ✅
- Convert to Vite ✅
- Solve bug with swiping ✅ - wip, but it is better than what it was
- Transfer app to utilize AWS s3 (2023 version) ✅
- User messaging interface
- Add AuthO feature to login with Google / FB
- Add events that users can all signup for in an area based on zip code
- Add friend reviews
- Add mutual friend feature
- Add ability to swipe through multiple photos
- Add testing