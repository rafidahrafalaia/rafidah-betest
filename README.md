## Running The API
heroku url:
```
https://radiant-shelf-24338.herokuapp.com
```
- POST login

to get acces JWT run login with "test@test.com" in email body and "test1234" in password body.
```
POST https://radiant-shelf-24338.herokuapp.com/login
Content-Type: application/json

{
    "email" : "test@test.com",
    "password": "test1234"
}
```
- POST user
```
POST https://radiant-shelf-24338.herokuapp.com/user
Authorization:Bearer ******
Content-Type: application/json

{
    "userName": "TEST NAMA",
    "accountNumber":"1234567",
    "emailAddress":"test@mail.com",
    "identityNumber":"123-456-789"
}
```
- PUT user
```
PUT https://radiant-shelf-24338.herokuapp.com/user
Authorization:Bearer ******
Content-Type: application/json

{
    "Id": "uuidv4"
    "userName": "TEST NAMA",
    "accountNumber":"1234567",
    "emailAddress":"test@mail.com",
    "identityNumber":"123-456-789"
}
```
- GET user/all
```
GET https://radiant-shelf-24338.herokuapp.com/user/all?page=1
Authorization:Bearer ******
```
- GET user by IdentityNumber
```
GET https://radiant-shelf-24338.herokuapp.com/user?IdentityNumber=******
Authorization:Bearer ******
```
- GET user by accountNumber 
```
GET https://radiant-shelf-24338.herokuapp.com/user?accountNumber=******
Authorization:Bearer ******
```
- DELETE user
```
DELETE https://radiant-shelf-24338.herokuapp.com/user
Authorization:Bearer ******
Content-Type: application/json

{
    "Id": "uuidv4"
}
```
