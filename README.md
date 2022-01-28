### Features

- Express framework managing requests
- Authentication Using JWT
- mySQL Database
- Password hashing to save in DB

### Steps

- User register through "/api/register" by submitting name, email and password.
- User login through "/api/login". If Right creditionals submiited; user will get a token to use it.
- User view all system users through "/api/all_users". The authentication token should be added as 'Authorization' header to be able to view all users
