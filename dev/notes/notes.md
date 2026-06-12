# NOTES
Simple notes app that replicates Google Keep UI.

## Tech Stack - MERN
Using **MERN** for primary tech stack due to the fact that it perfectly fits the data model and purpose of learning backend work (rather than using a full stack framework that abstracts a lot of the underlying logic away like next.js)
- **Frontend:** HTML + CSS
    - **Template Engine:** EJS
    - **CSS Templates:** Bootstrap
- **Backend:** Node.js
    - **Framework:** Node.js + Express
    - **Database:** MongoDB + Mongoose ODM
    - **Sessions:** express-session, stored in db with connect-mongo
    - **Authentication:** passport (passport-local)
    - **Security:** bcrypt for password hashing
- **Testing:** Mocha + Chai

## Models
Only two primary models will be used for MVP:

#### User
Fields:
**username (email)**
`type:` string, 
`index:` true, 
`required:` true, 
`trim:` true,
`lowercase:` true 

**password (hashed)**
`type:` hashed string, 
`required:` true, 
`trim:` true, 
`minLength:` 8

**preferences**
`type:` Object, 
`required:` true, 
options:
- **theme**
    `type:` string,
    `required:` true, 
    `default:` "dark"
    `enum:` ["dark", "light"]

#### Note
Fields:
**userId**
`type:` objectId ("User"), 
`index:` true, 
`required:` true, 

**title**
`type:` string, 
`index:` true

**content**
`type:` string

**color**
`type:` string, 
`enum:` ["default", "red", "orange", "yellow", "green", "blue", "purple"], 
`default:` "default" 

**pinned**
`type:` boolean, 
`index:` true

May be added in the future:
- **archived**
`type:` boolean, 
`index:` true


> All models will have { createdAt } and { updatedAt } timestamps.

Later iterations of this project may include a **`subject`** model which will add more granular filtering + potential analytics, as well as **`tasks`** to combine the functionality of a to do list. 

Perhaps will also include an **`event`** + **`calendar`** system that is directly interconnected to tasks to create a full productivity suite.

## Routes
Simple API and page routes (dashboard, login, register, settings). To fulfill MVC best practices all routes will require the use of external controllers as well as separate view routes (res.render rather than res.json)

#### GET /
`GET /` will default to dashboard if logged in, otherwise will lead to login page. 

### Pages
#### Dashboard
- **GET** /dashboard
Gets dashboard and data, renders `dashboard.ejs`. Handles filters, note rendering, etc. 
    - **requires:** notes, user

#### Auth
- **GET** auth/register
Gets `register.ejs` view and renders it - no data required

- **POST** auth/register
Registers user and redirects to `/login`

- **GET** auth/login
Gets `login.ejs` view and renders it - no data required

- **POST** auth/login
Logs in user and redirects to `/dashboard`

- **POST** auth/logout
Logs out user and redirects to `/login`

> Note: All authentication routes must be rate-limited to ensure that 

#### Settings
- **GET** /settings
Gets `settings.ejs` and renders it 
    - **requires:** user
> Note: Only settings are required for now. Later will have multiple pages to render

### API
#### Note
- **GET** /api/notes
Gets all notes. 
- **POST** /api/notes
Creates note.
- **PATCH** /api/notes/:id
Updates note. Check ownership with MongoDB filter object. *Requires no PUT as with Google Keep style UI only one thing is updated at once.*
- **DELETE** /api/notes/:id
Deletes note using an ID. Check ownership with MongoDB filter object.

#### Error Handling

#### Settings
- **PATCH** /api/settings
Updates user preferences. 
    - **requires:** user object

> Note: The API route is minimalistic with only note and basic settings functionalities for now, in the MVP phase - later functionality with tasks and subjects will be provided later

## Testing
Unit tests for models, integration tests for API routes

// =============================
save this for dividers