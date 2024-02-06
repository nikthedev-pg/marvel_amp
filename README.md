## Initial Setup:

1. Setup your developer account on Marvel website. Get your public and private apiKeys refer [documentation](https://developer.marvel.com/docs)
2. create `.env` file at the root of the project and copy the contents in it from `.example.env`. Paste the your private & public key which you acquired at above step. and also, set your JWT secret
3. run the server `npm run start` 

## Example of APIs:
- Signup API: 
```curl 
curl --location 'localhost:3000/signup' \
--header 'Content-Type: application/json' \
--data-raw '{
    "name": "test1",
    "password": "test1",
    "email": "test1@nik.com",
    "mobileNumber": 1234567
}'
```

- Login API:
```curl
curl --location 'localhost:3000/login' \
--header 'Content-Type: application/json' \
--data '{
    "password": "test1",
    "mobileNumber": 1234567
}'
```

- get Characters API:
```curl
curl --location 'localhost:3000/superheros/2?nameStartsWith=hul' \
--header 'Authorization: Bearer <JWT_toke_you_got_after_login>'
```

