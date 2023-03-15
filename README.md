# Friender

Tinder like full stack application. 

Built in 3.5 days as part of a sprint w/ @amaesanchez while attending Rithm School.

Frontend repo: https://github.com/chalonlubin/friender-frontend

Deployed on: https://friender-ccl.surge.sh/

--- 

## Features
- Use of AWS S3 Bucket for image storage
- Swiping feature in React, using an algorithm leveraging user zipcode and preferences to find the next potential match. 

## Environment Setup

(Frontend)
```
clone repo
npm install
npm start

Will be running on localhost 3000.
```

(Backend)
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
---

## Tech

Node.js | Express | SQL | Postgres | React.js | HTML | CSS | Bootstrap

## // TODO
- UX / UI improvments
- User messaging interface, possibly with websocket
- Add Auth eature to login with Google/FB
- Add events that users can all signup for in an area based on zip code
- Add friend reviews
- Add mutual friend feature
- Add ability to swipe through multiple photos
- Additional tests for both front and backend
