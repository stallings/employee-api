# Employee API #

The Employee API is a RESTful API to get information from each employee.  The information includes:

* Background information
* Skill Ratings (protected access)
* Current and past projects
* Deparment information
* Virtual Team (V-Team) information

## Framework ##

* NodeJS + Express + Mongoose + MongoDB <http://localhost:28017/>
* JSONP compatible



## Security ##

* Authentication required for skills: login and auto-expiring keys
* Passwords are Bcrypted (Hash + Salt) before storing
* IP Whitelisting (if necessary) [List of IPs](https://wiki.intra.sears.com/confluence/display/ECOMMIT/Do+Not+Shun+for+InfoProt)
* Password Protection for skill ratings




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
curl -i -X POST -H 'Content-Type: application/json' -d '{"name": "Jose Pulgar", "headshot": "http://goo.gl/dofijdf", "startDate": "2014-01-01", "jobTitle": "Manager"}' http://localhost:5000/users?key={validKey}
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


# Departments #

## GET /departments (public)
Returns JSON feed of all department names and their IDs

```
curl -i -X GET http://localhost:5000/departments
```

## GET /departments/{id},{id} (public)
Returns JSON feed of one and more departments with user IDs that belong to them

```
curl -i -X GET http://localhost:5000/departments/{id},{id}
```

## POST /departments (protected)
Adds a new department

```
curl -i -X POST -H 'Content-Type: application/json' -d '{"name": "Project Managers" }' http://localhost:5000/departments?key={validKey}
```

## PUT /departments/{id} (protected)
Modify a department name

```
curl -i -X PUT -H 'Content-Type: application/json' -d '{"name": "Awesome Project Managers" }' http://localhost:5000/departments/{id}?key={validKey}
```

## PUT /departments/{id}/members/{id} (protected)
Add a user(s) to a department

```
curl -i -X PUT http://localhost:5000/departments/{id}/members/{id}?key={validKey}
```

## DELETE /departments/{id}/members/{id} (protected)
Deletes a user from a department

```
curl -i -X DELETE http://localhost:5000/departments/{id}/members/{id}?key={validKey}
```

## DELETE /departments/{id} (protected)
Deletes a department

```
curl -i -X DELETE http://localhost:5000/departments/{id}?key={validKey}
```



# Virtual Teams

## GET /vteams (public)
Returns JSON feed of all v-team names and their IDs

```
curl -i -X GET http://localhost:5000/vteams
```

## GET /vteams/{id},{id} (public)
Returns JSON feed of one and more v-teams with user IDs that belong to them

```
curl -i -X GET http://localhost:5000/vteams/{id},{id}
```

## POST /vteams (protected)
Adds a new v-team

```
curl -i -X POST -H 'Content-Type: application/json' -d '{"name": "Baseball Card" }' http://localhost:5000/vteams?key={validKey}
```

## PUT /vteams/{id} (protected)
Modify a v-team name

```
curl -i -X PUT -H 'Content-Type: application/json' -d '{"name": "Awesome Baseball Card" }' http://localhost:5000/vteams/{id}?key={validKey}
```

## PUT /vteams/{id}/members/{id} (protected)
Add a user(s) to a v-team

```
curl -i -X PUT http://localhost:5000/vteams/{id}/members/{id}?key={validKey}
```

## DELETE /vteams/{id}/members/{id} (protected)
Deletes a user from a v-team

```
curl -i -X DELETE http://localhost:5000/vteams/{id}/members/{id}?key={validKey}
```

#### DELETE /vteams/{id} (protected)
Deletes a v-team

```
curl -i -X DELETE http://localhost:5000/vteams/{id}?key={validKey}
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
    "_id" : ObjectId("5328bf85e1711fd3d24ce442"),
    "name": "John Smith",
    "headshot": "http://goo.gl/oafjewnefa",
    "startDate": ISODate("2014-02-01T06:00:00Z"),
    "jobTitle": "UX Architect",
    "email": "jsmith@searshc.com",
    "skype": "johnsmithsears",
    "employeeType": "FTE",
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

## Departments
````
{
    "_id" : ObjectId("532b1d1db09bcfff1020a9aa"),
    "name" : "Project Managers",
    "members" : [  ObjectId("5329f663c43b5a461b507c5a") ]
 }
````

## Virtual Teams
````
{
    "_id" : ObjectId("532a02a910536e2128234c8b"),
    "name" : "Baseball Cards",
    "members" : [  ObjectId("5329f663c43b5a461b507c5a") ]
}
````

 
## Logins
````
{ 
    "_id" : ObjectId("5328bf85e1711fd3d24ce442"),
    "username" : "jpulgar",
    "password" : "$2a$10$VhRfJASWXb5qVhqH2TUsdOCdtMpyI8cwpTBOviB70T/ca6Dv9S616",
    "level" : 3
}
````

## Keys
````
{
    "_id" : ObjectId("532b0ded565784050ab40b02"),
    "level" : 3,
    "createdAt" : ISODate("2014-03-20T15:49:01.537Z")
}

````



## How to Install MongoDB ##
These instructions are for Mac.  It assumes you already have Homebrew installed. Lines 3-4 set Mongo to autostart with Mac.  Lines 5-6 sets a location for the databases.

````
brew update
brew install mongodb
ln -sfv /usr/local/opt/mongodb/*.plist ~/Library/LaunchAgents
launchctl load ~/Library/LaunchAgents/homebrew.mxcl.mongodb.plist
sudo mkdir -p /data/db
sudo chown `id -u` /data/db
````

## How to Create a Database ##
These instructions launch the mongo console, set a particular database, create a users collection and add a user to a collection.

````
mongo
use baseball
show databases
db.createCollection("users")
show collections
db.users.find()
````


## Other Notes ##
* Example RESTful API: <http://developers.flattr.net/api/resources/things/>
* IP White Listing: <https://www.npmjs.org/package/express-ipfilter> <https://www.npmjs.org/package/ipfilter>
* Mongoose Schema validation: <http://mongoosejs.com/docs/validation.html>

