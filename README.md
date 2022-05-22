# FashionCloud
Node js version used to write this code is: 15.2.0

Run 
-npm install
-npm run dev 

the app starts with logging 2 messages
running on port 4000
db connected



once app starts run the test with 

npm run test


Database used: MongoDb Atlas cluster 

Please Note: There is a counter collection in the database with a single document which keeps track of the number of keys. It's initial value is set to zero.

Postman Collection LInk https://www.getpostman.com/collections/43f072fa7a00eee7cb8a

Logic  when cache crosses max limit.
-If the no of keys in the cache starts to cross the limit (say 1000)
-Extract the key with the lowest timestamp (Least used cache)
-Update that extracted key with the new generated value