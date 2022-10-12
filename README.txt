Implemented:
-login
-view boards, threads, and posts

To Implement
-user profiles
-paginate threads and posts
-update threads and posts
-postgresql migration

Done
1. Fix post api permission
2. 

Sample users USED

Moderator:
moderator
P@ssword123

Administrator:
administrator
P@ssword123

Banned:
banned123
P@ssword123

Poster:
poster123
P@ssword123



API ENDPOINTS USED

AUTHORIZATION

1. POST /auth/login
 - Logs user

 Requires:
    Body:
        username
        password

2. POST /auth/logout
 - Logs user out

 Requires:
    Header:
        Authorization: Token <token>

3. POST /auth/registration
 - Creates a new user (poster)

 Requires:
    Body:
        "first_name",
        "last_name",
        "email",
        "password",
        "about_myself",
        "date_of_birth",
        "hometown",
        "present_location",

 CONTENT

1. GET /content/topics/

2. GET /content/topic/<topic_pk>/boards

- Returns list of boards of the topic

3. GET /content/board/<board_pk>

- Returns information of the board

4. GET /content/board/<board_pk>/threads

- Returns the list of threads of the board

5. GET /content/thread/<thread_pk>/

- Returns the information of the thread

6. GET /content/thread/<thread_pk>/posts

- Returns the list of posts

7. /content/post/

GET - Get list (no authentication needed)
POST - Create post (authenticated)
DELETE - OWNER
PUT - OWNER
PATCH - OWNER


CSS Defaults

Main Background - bg-slate-200
Card Background - white
Main - text-gray-800
Secondary - 
Header Background - bg-sky-700


thread 
get - any
post - isauthenticated, not banned
patch, put - mod or admin
delete - isauthenticated, isowner

board
get - any
post - admin, authenticated
delete - admin, authenticated
patch, put - admin, authenticated

