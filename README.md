# Assessment
### both challenges are combined on one server:
## _First Challenge_ =>

>  Add a new endpoint to allow Users to Bid on certain Pet certain amount of money.
>  Add endpoint to allow pet owner to list all bids

Note: As a prerequisite user should be logged in and the token contains the user id
### #Post Place Bid Endpoint => /challenge1/pet/:petId/placeBid
routes to add bids takes the following params in body:
```
{ amount: 100 } // required
```

### #Get Bids Endpoint => /challenge1/pet/:petId/getBids
to get all bids you should be the pet owner otherwise you will get 'Pet Not Found' error

## Seconde Challenge_ =>

>  Develop a small script to calculate the amount to be paid by the winner and the losing bidders

### #Post Place Bid Endpoint => /challenge2/placeBid
routes to add bids takes the following params in body:
```
{ name: 'e.g. Ali', amount: 100 } // both are required
```

### #Get Auction Result Endpoint => /challenge2/result
routes to get the auction resault 
if there is no bids it will respond with No Winners 
else it will respond with the result list 

### How does Get Auction Result work?!

after calling the endpoint the function will run and get all bids sorted by amount 
using the `.map` func we shift the amounts as needed to get the result under the the Generalized second-price 
auction mechanism and then we return the list 

```
      // get all bids sorted by amount
      const bidList = await bid.find({}).sort({ amount: -1 }).exec() 
      // if list is empty return No Winners
      if (bidList.length === 0) {
        return res.status(200).send({ description: 'No Winners' })
      }
      // loop on the list 
      const resultList = bidList.map((ele, i) => {
        // check if it's the last element 
        if (bidList[i + 1]) {
          //highest bidder pays the price bid by the second-highest bidder
          ele.amount = bidList[i + 1].amount
          return ele
        }
        // if it's the last bid return the bid with amount Lost 
        return { _id: ele._id, name: ele.name, amount: 'Lost' }
      })
```

## .env 
Setup .env needed variables:
```
PORT=<running_port>
MONGO_URL=<your_db_url>
jWT_PRIVATE_KEY=<your_jwt_private_key>
SECRETS=testsecret1 testsecret2
```

## Installation
Start with installing dependencies:
```
npm i
```
## Run Server
Start with installing dependencies:
```
npm run serve
```
## Run Tests
Run tests command:
```
npm run test
```




