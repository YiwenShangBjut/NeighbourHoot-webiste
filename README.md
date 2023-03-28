#  NeighbourHoot Website

The project makes an attempt at gamifying the concept of community exchange, which aims to lessen environmental clutter while engaging the community with passive ways of sustainable behaviour. 

The code presented in these files describes the functions on the website for users to request a barter and for community volunteers to review and approve the requests.

## Deployment

To deploy this project run, on both terminal of the client and server, use  commands


```bash
yarn add
yarn start
```

## Environment

Ubuntu-20.04

If the frontend fails to compile, try 

``nvm use 16``

to change the npm version

## Folders

### client

This file contains code that builds the front end of the website.

It includes four pages: Login page, user dashboard, form page, and admin dashboard. Users would use the login page to enter their account, from the dashboard to see their barter history and the state of their requests, use the form page to submit a new barter request and admin users would use the admin dashboard to browse all the barter as well as change the status of requests.

For the convenience of the demo, we exclude the step of registering. The user accounts are fixed in the database. Currently, there are two users named Peter and Chris as test accounts. The password for these accounts is whatever.

### server

This file contains code that builds the back end of the website.

The code in index.js writes SQL statements API for the front end code to support the data website needs.

The backend database is currently hosted by AWS. There is a database called 'project', which has two tables called 'barter' and 'user'. The hostname is http://server-dev.eu-west-2.elasticbeanstalk.com.
