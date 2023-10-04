# Forum

This project was done to create a simple bulletin board system where users can create topics, boards, and posts similar to forums from the web. 

## Program Features

- Create topics, boards, threads, and posts
- Create a normal account from the account creation page
- See recent posts by a user
- Sign in and sign out using django-rest-knox as the authentication library
- See date of most recent post
- Lock threads (users cannot create new posts)
- Each topic contains boards. Boards contain threads, and threads can have posts
- Posts accept markdowns with a markdown guide available 

## User Permissions
1. Admin
- Create view and delete topics, boards, threads and posts
- Ban and unban moderators, and normal users
- Lock and unlock threads
2. Moderators
- Create threads, posts
- Ban and unban moderators and normal users
- Lock and unlock threads
3. Users
- Create and view posts
- View topics, posts, threads, and boards
4. Banned Users
- Can view all threads, topics, posts, and boards
- Unable to create threads and posts
5. Unauthenticated Users
- View topics, boards, threads, and posts

## Features

- Django with Python and Django REST Framework
- React <Insert version> with Typescript, mobx-keystone, and react-router
- Postgres

## Dependencies

- Python <Insert Version>
- Yarn <insert Version>
- Poetry <insert Version>

## Set up

### 1. Django

From home directory run the following commands:
```
poetry install
poetry run python manage.py makemigrations
poetry run python manage.py migrate
```

Create a new admin to manage the forum
```
poetry run python manage.py createsuperuser
```

### 2. React

To install the modules needed for the frontend, run the following command from the home repository:
```
cd frontend
yarn install
```

### 3. Environment Variables

Create a new .env file in the home repository using the .env.example as a base

## Quick Start

From the home repository, run the backend server using the following command:
```
poetry run python manage.py runserver
```

Then, run the frontend server using the following command:
```
cd frontend
yarn start
```

The development server will be located at the following address unless changed otherwise:
http://localhost:3000/

## Django Admin

The administration page for the program is located at the following address:
http://localhost:8000/admin/

Using the superuser created earlier, you can log-in in the admin page. There you can 
- create more users
- change the level of authority of users
- create or delete posts, threads, topics, or boards



