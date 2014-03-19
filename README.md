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

## PUT /users/{id}/profile (protected)
Modifies a user profile

```
curl -i -X PUT -H 'Content-Type: application/json' -d '[{"title": "Past Projects", "details": "Kmart Fashion"}, {"title": "Top Strengths", "details": "Arm Wrestling"}]' http://localhost:5000/users/{id}/profile?key={validKey}
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

## PUT /departments/{id}/members (protected)
Add a user(s) to a department

```
curl -i -X PUT -H 'Content-Type: application/json' -d '{"user": "531f6a31cf9b3bdb1580eef9"}' http://localhost:5000/departments/{id}/members?key={validKey}
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

## PUT /vteams/{id}/members (protected)
Add a user(s) to a v-team

```
curl -i -X PUT -H 'Content-Type: application/json' -d '["5opldghdfgha8927","cvfdgrnb7xh8927"]' http://localhost:5000/vteams/{id}/members?key={validKey}
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

## MongoDB JSON Data Structure Examples ##

#### User ####
```
{
   "_id": "2o3jr42398rjorj234f",
   "name": "John Smith",
   "headshot": "http://goo.gl/oafjewnefa",
   "startDate": ISODate("2014-02-01T06:00:00Z"),
   "jobTitle": "UX Architect",
   "email": "jpulgar@searshc.com",
   "skype": "josepulgarbird",
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
              ],
   "profile": [
                {
                  "title": "Current Project",
                  "details": "PDP"
                },
                {
                  "title": "Past Projects",
                  "details": "Parts & Services, Profile"
                },
                {
                  "title": "Top Strengths",
                  "details": "Collaborator.  Ability to lead large projects.  Well-rounded in design, UX and technology."
                }
              ]
 }
```

#### Departments ####
````
{
   "_id": "2oeargargarg98rjorj234f",
   "name": "Project Managers",
   "members": [ "2o3jr42398rjorj234f", "2o3jrgsbtahthsh234f", "2o3jrjkhdjhjorj234f", "2o3jhmgjfhjkgjkhgfjk234f" ]
 }
````

#### Virtual Teams ####
````
{
   "_id": "2oeargargarg98rjorj234f",
   "name": "Kmart Fashion",
   "4dfy": "203948093",
   "members": [ "2o3jr42398rjorj234f", "2o3jrgsbtahthsh234f", "2o3jrjkhdjhjorj234f", "2o3jhmgjfhjkgjkhgfjk234f" ]
 }
````

 
#### Logins ####
````
{
   "_id": "2oeargargarg98rjorj234f",
   "username": "jpulgar",
   "password": "securepassword"
 }
````

#### Keys ####
````
{
   "_id": "2oeargargarg98rjorj234f",
   "createdAt" : ISODate("2014-03-10T19:17:12.487Z"),
   "key": "dasfoisjfoaffdsafsdafdsafsadfdoafmadsfoj"
}
````

===

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
db.users.find({ _id: ObjectId("5319ebfde454ce0ad42d6464")})
````

# MongoDB Syntax #

## Add a Document ##
Example of adding a user.

````
db.users.insert(
	{ 
		name: "Jose Pulgar", 
		headshot: "http://goo.gl/dofijdf", 
		startDate: new Date(2014,1,1) 
	}
)
````

## Update Document Field ##
Example of updating a user user.

````
db.users.update(
   { _id: ObjectId("5319ebfde454ce0ad42d6464")},
   {
      $set: { name: "John Smith" }
   }
)
````

## Remove a Document ##
Example of removing a user.

````
db.users.remove( { _id: ObjectId("5319ebfde454ce0ad42d6464")} )
````

## Remove Document Field ##
Example of removing a user field.

````
db.users.update(
   { _id: ObjectId("5319ebfde454ce0ad42d6464")},
   {
      $unset: {
         startDate: ""
      }
   }
)
````

## Insert/Update Subdocument Field ##
Example of adding a user skill.

````
db.users.update(
   { _id: ObjectId("5319ebfde454ce0ad42d6464")},
   {
      $set: {
         skills: [
            {
               title: "User Research",
               rating: 3.5
            }
         ]
      }
   },
   { upsert: true }
)
````

## Remove Subdocument Field ##
Example of removing a user skill.

````
db.users.update(
   { _id: ObjectId("5319ebfde454ce0ad42d6464")},
   {
      $pull: {
         skills: { title: "User Research" }
      }
   }
)
````


## Add member(s) to a team ##
Example of adding members to a team

````
db.departments.update(
   { _id: ObjectId("531a2875e454ce0ad42d6465")},
   {
      $addToSet: {
         members: { 
         	$each: [ 
         		ObjectId("531a2875e454ce0ad42d6461"), 				ObjectId("531a2875e454ce0ad42d6462")
         	]
         }
      }
   }
)
````

## Remove member from a team ##
Example of removing member from a department or v-team

````
db.departments.update(
   { _id: ObjectId("531a2875e454ce0ad42d6465")},
   {
      $pull: {
         members: ObjectId("531a2875e454ce0ad42d6461")
      }
   }
)
````

## Add Login ##
Add a login to the list.

````
db.logins.insert(
    { 
        username: "jpulgar", 
        password: "securepassword"
    }
)
````

## Set global Key expiration time ##

````
db.keys.ensureIndex( { "createdAt": 1 }, { expireAfterSeconds: 10 } )
````


## Add Key ##
Add a key to the list. They auto expire based on the seconds above.

````
db.keys.insert(
    { 
	    "createdAt": new Date(),
        key: "afjodifmoew24o52nm3oi4nmroim4nrt"    }
)
````

## Other Notes ##
* RESTful API example: <http://developers.flattr.net/api/resources/things/#get-multiple-things>
* ensureAuthentication example: <https://github.com/jaredhanson/passport-google/blob/master/examples/signon/app.js>

