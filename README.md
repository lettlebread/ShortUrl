# Short url service
This is project provides web application and http API for creating and managing short url entries.

User can login to the service to manage their own short url entries, or simply do the creation.

## Install
To run or deploy this service on local machine, please see to the information below.

### Requirements
* Node.js >= 14
* A Postgresql instance

### Steps
#### Clone this repostory and install dependencies
```
$ git clone https://github.com/lettlebread/ShortUrl.git

$ cd ShortUrl

$ npm install
```

#### Prepare a Postgresql connection string
The format is formed as follows:
```
postgresql://<user>:<password>@<net_location>:<port>/<db_name>
```

#### Ccreate .env file
Create a text file `.env.development` in repostory root dir with two keys:
* `DATABASE_URL`: Postgresql connection string
* `COOKIE_PASSWORD`: a string longer than 32 characters

For example:
```
DATABASE_URL=<postgres_connect_string>
COOKIE_PASSWORD=<cookie_password>
```

#### Generate prisma module
This command need to be run at the first time of installing the service, or after modify prisma schema file(`./src/database/schema.prisma`).
```
$ DATABASE_URL="<postgres_connect_string>" \
  npx prisma generate --schema="src/database/schema.prisma"
```

## Deploy
### Local
For test and development, you can start the service by
```
$ npm run dev
```
The command will build and start the service; it listens to port 3000 by default, so you can access the web application or http API, like `localhost:3000`

Or, you can also build this service to docker image, with this command
```
$ docker build -t <tag_name> .
```
and deploy to a docker container with enviroment variable `DATABASE_URL`, for example
```
$ docker run -d -p 3000:3000 -e DATABASE_URL="<postgres_connect_string>" [<tag_name>]
```

### Production
#### Service instance
This project deploy the service instance of production version on `GCP Cloud Run`.

Since this project is hooked with github action, you can deploy a new version on production environment by start a pull request to `main` branch.

Once the pull request is completed, the githib action will do the check and use GCP services to build and deploy the service.

The production version service can be accessed here [https://short-url-yisp5qgdea-uc.a.run.app](https://short-url-yisp5qgdea-uc.a.run.app).

Only commits of `main` branch will deploy to production environment.

##### Github Action configuration
* The Github Action will execute the script in `.github/workflow/deploy-cloud-run.yml`, you can change the CI/CD flow here.
* The secrets used in Github Action is stored in `Secrets and Variables -> Actions` of repository settings.

#### Database
The database in production environment is a Postgresql instance running on `GCP Cloud SQL`.

Service instance on Cloud Run has the permission to access the database.

If you want to modify the database setting, please contact the GCP project owner.

## Usage
### Web Application
User can open the url of service instance with following path in browser to use these features.
#### Pages
##### Home page
* Path: / (root)
* Create short url or find the link to sign in/sign up page.
  * Short urls created here doesn't belongs to any user
  * Access this page with logged in status will redrict to `/urlentry` page

##### Sign in page
* Path: /login
* User sign in page.
  * Once user login succesed, the page will redrict to `/urlentry`
  * Access this page with logged in status will redrict to `/urlentry` page

##### Sign up page
* Path: /register
* User sign up page.
  * Once user login succesed, the page will redrict to `/urlentry`
  * Access this page with logged in status will redrict to `/urlentry` page

##### Short url view page
* Path: /urlentry
* Browse and manage user's short urls.
  * List user's short urls with entry information
  * Edit properties of each short url
  * Delete short url entry
  * Create new short url with name and description
  * Logout the service
  * Access this page without logged in status will redrict to `/` page

### Http APIs
User can send http request to the url of service instance with following path and payload.

#### Session
##### Check user session
* Path: `/api/users/`
* Method: `POST`
* Request body: null
* Response:
  * status: 200
  * payload:
    ```
    {
      isLoggedIn: boolean
      id: string
      email: string
    }
    ```

#### Url Entry
##### Redrict to short url's target
* Path: `/api/urlentry/[entryHash]`
* Method: `GET`
* Request body: null
* Response:
  * status: 307 // redrict to target url
  * payload: {}

##### Update short url entry
* Path: `/api/urlentry/[entryHash]`
* Method: `PATCH`
* Request body
  ```
  {
    name?: string
    targetUrl: string
    description?: string
  }
  ```
* Response:
  * status: 200
  * payload:
    ```
    {
      id: number
      createdAt: Date
      updatedAt: Date
      userId: string
      hashKey: string
      targetUrl: string
      name: string
      viewTimes: Int
      description: string
    }
    ```

##### Delete a short url entry
* Path: `/api/urlentry/[entryHash]`
* Method: `DELETE`
* Request body: null
* Response:
  * status: 200
  * payload: {}

##### Create a short url entry
* Path: `/api/urlentry`
* Method: `POST`
* Request body:
  ```
  {
    name?: string
    targetUrl: string
    description?: string
  }
  ```
* Response:
  * status: 200
  * payload:
    ```
    {
      id: number
      createdAt: Date
      updatedAt: Date
      userId: string
      hashKey: string
      targetUrl: string
      name: string
      viewTimes: number
      description: string
    }
    ```

##### Get user's url entries
* Path: `/api/urlentry`
* Method: `GET`
* Request body: null
* Response:
  * status: 200
  * payload:
    ```
    [
      {
        hashKey: string
        targetUrl: string
        name: string
        createdAt: Date
        updatedAt: Date
        description: string
      }
      ,...
    ]
    ```

#### User
##### User login
* Path: `/api/user/login`
* Method: `POST`
* Request body:
  ```
  {
    email: string
    password: string
  }
  ```
* Response:
  * status: 200
  * payload: {}

##### User logout
* Path: `/api/user/logout`
* Method: `POST`
* Request body: null
* Response:
  * status: 200
  * payload: {}

##### User logout
* Path: `/api/user/register`
* Method: `POST`
* Request body:
  ```
  {
    email: string
    password: string
  }
  ```
* Response:
  * status: 200
  * payload: {}
