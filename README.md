# Employee API #

The Employee API is a RESTful API to get information from each employee.  The information includes:

* Background information
* Skill Ratings (protected access)
* Current and past projects
* Deparment information
* Project information
* Lower database hits to 1 read for common operations

## Framework ##

API:
* [NodeJS](http://nodejs.org/) 0.10.26
    * [express](http://expressjs.com/) 4.1.1
    * [body-parser](https://github.com/expressjs/body-parser) 1.0.2
    * [morgan](https://github.com/expressjs/morgan) 1.0.0
    * [mongoose](https://github.com/learnboost/mongoose) 3.8.8
    * [bcrypt](https://github.com/ncb000gt/node.bcrypt.js) 0.7.8
    * [cors](https://github.com/troygoode/node-cors/) 2.2.0
* [Mongo DB](https://www.mongodb.org/) 2.6.0

## Security ##

* Authentication required for skills: login and auto-expiring keys
* Passwords are Bcrypted (Hash + Salt) before storing
* Password Protection for skill ratings

## To Do ##

* Finish advanced search
* Clean up Projects API
* Finish org chart for top level

## User Import Utility ##
mongoimport --db baseball --collection users --file sample_users.json --jsonArray --stopOnError

# Users #

## GET /users (public)
Returns JSON feed of all employees and their IDs

```
curl -i -X GET http://localhost:5000/users
```

## GET /users/{id},{id} (public/protected)
Returns JSON feed of one of more users specified by id. If you pass a valid key you will receive protected user information.

```
curl -i -X GET http://localhost:5000/users/{id},{id}
curl -i -X GET http://localhost:5000/users/{id},{id}?key={validKey}
```

## POST /users (protected)
Adds a new user to the collection

```
curl -i -X POST -H 'Content-Type: application/json' -d
'{"name": "Jose Pulgar", "headshot": "http://goo.gl/dofijdf", "startDate": "2014-01-01", "jobTitle": "Manager"}' http://localhost:5000/users?key={validKey}
```

## PUT /users/{id} (protected)
Modifies required user information (name, headshot, job title and start date)

```
curl -i -X PUT -H 'Content-Type: application/json' -d '{"jobTitle": "CEO"}' http://localhost:5000/users/{id}?key={validKey}
```

## PUT /users/{id}/skills (protected)
Modifies a user skill and ratings

```
curl -i -X PUT -H 'Content-Type: application/json' -d '[{"title": "HTML", "rating": "5.0"}, {"title": "CSS", "rating": "4.5"}]' http://localhost:5000/users/{id}/skills?key={validKey}
```

## DELETE /users/{id} (protected)
Deletes a user

```
curl -i -X DELETE http://localhost:5000/users/{id}?key={validKey}
```


# Projects

## GET /projects (public)
Returns JSON feed of all project names and their IDs

```
curl -i -X GET http://localhost:5000/projects
```

## GET /projects/{id},{id} (public)
Returns JSON feed of one and more projects with user IDs that belong to them

```
curl -i -X GET http://localhost:5000/projects/{id},{id}
```

## POST /projects (protected)
Adds a new project

```
curl -i -X POST -H 'Content-Type: application/json' -d '{"name": "Baseball Card" }' http://localhost:5000/projects?key={validKey}
```

## PUT /projects/{id} (protected)
Modify a project

```
curl -i -X PUT -H 'Content-Type: application/json' -d '{"name": "Awesome Baseball Card" }' http://localhost:5000/projects/{id}?key={validKey}
```

## PUT /projects/{id}/members/{id} (protected)
Add a user(s) to a project

```
curl -i -X PUT http://localhost:5000/projects/{id}/members/{id}?key={validKey}
```

## DELETE /projects/{id}/members/{id} (protected)
Deletes a user from a project

```
curl -i -X DELETE http://localhost:5000/projects/{id}/members/{id}?key={validKey}
```

#### DELETE /projects/{id} (protected)
Deletes a project

```
curl -i -X DELETE http://localhost:5000/projects/{id}?key={validKey}
```



# Login

## POST /logins (public)
Returns valid key or empty string. The valid key expires in MongoDB after x number of seconds. You should save this key as a cookie. Only store hashed passwords on server: <http://devsmash.com/blog/password-authentication-with-mongoose-and-bcrypt>

```
curl -i -X POST -H 'Content-Type: application/json' -d '{"username": "jpulgar", "password": "securePassword!!!" }' http://localhost:5000/logins
```


===

# MongoDB JSON Data Sample Entries

## User
```
{
    "_id" : "John Smith",
    "headshot": "http://goo.gl/oafjewnefa",
    "startDate": ISODate("2014-02-01T06:00:00Z"),
    "jobTitle": "UX Architect",
    "username": "jpulgar",
    "password": "$2a$10$FEUvnoMB73s6T4aSZiZDyOi/2KJ92Pz6bQC1UmyRr.EM3bc2I9TXG",
    "level": 1,
    "email": "jsmith@searshc.com",
    "skype": "johnsmithsears",
    "employeeType": "FTE",
    "department": "FED",
    "manager": "First Last",
    "directs": ["First Last", "First Last"],
    "strengths": ["Leadership", "Prototyping"],
    "currentProjects": ["Project Name", "Project Name"],
    "pastProjects": ["Baseball Cards"],
    "skills": [
                {
                  "title": "User Research",
                  "rating": "3.5"
                },
                {
                  "title": "Information Architecture",
                  "rating": "4.0"
                }
    ]
}
```

## Projects
````
{
    "_id" : "Baseball Cards",
    "description" : "An awesome project using NodeJS and RESTful API",
    "tags" : [ "NodeJS", "MongoDB" ]
    "members" : [ "Jose Pulgar" ]
}
````


## Keys
````
{
    "level" : 3,
	"self" : "Jose Pulgar",
	"_id" : ObjectId("534eb2cd483362d60e3356e6"),
	"createdAt" : ISODate("2014-04-16T16:41:49.297Z"),
	"edit" : [
		"Manager1",
		"Manager2",
		"Manager3",
		"Test",
		"Contributor1",
		"Contributor2",
		"Contributor3"
	]
}

````



## How to Install MongoDB ##
These instructions are for Mac.  It assumes you already have Homebrew (<http://brew.sh/>) installed.

**Install MongoDB using Homebrew**

````
brew update
brew install mongodb
````

**Create symbolic link and run background MongoDB service**

````
ln -sfv /usr/local/opt/mongodb/*.plist ~/Library/LaunchAgents
launchctl load ~/Library/LaunchAgents/homebrew.mxcl.mongodb.plist
````

**Create MongoDB's default data directory**

````
sudo mkdir -p /data/db
sudo chown `id -u` /data/db
````

## How to Upgrade MongoDB ##

````
brew upgrade mongodb
````

## Other Notes ##
* Example RESTful API: <http://developers.flattr.net/api/resources/things/>
* IP White Listing: <https://www.npmjs.org/package/express-ipfilter> <https://www.npmjs.org/package/ipfilter>
* Mongoose Schema validation: <http://mongoosejs.com/docs/validation.html>
* Express 3.x to 4.x: <https://github.com/visionmedia/express/wiki/Migrating-from-3.x-to-4.x>
* Error handling: <http://blog.safaribooksonline.com/2014/03/12/error-handling-express-js-applications/>