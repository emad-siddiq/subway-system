# Subway system challenge
Your task is to model the subway system (e.g. the New York subway). We would prefer that you use Typescript as your programming language, Postgres as database and Docker to run the application, but you will not be disqualified if you use different tools. You can use any other library or tool you think will make it easier implementing this challenge.


### Challenge 1
Construct an API for your train system. You should make sure that each of these methods is as efficient as possible. Your API should support the following methods:

##### POST /train-line
- stations - each station (or stop) on the train line
  - You can assume each station stop is a unique name. e.g. “14th” on the “1 train" in the example below refers to the same stop as “14th” on the “E train”.
- name - of the train line
- returns confirmation of the line creation
- The lines should be saved to the database. 

Example input:
```
POST /train-line
{
    "stations": ["Canal", "Houston", "Christopher", "14th"],
    "name": "1"
}
```
```
POST /train-line
{
    "stations": ["Spring", "West 4th", "14th", "23rd"],
    "Name": "E"
}
```


##### GET /route?origin=[origin]&destination=[destination]
- origin - station
- destination - station
- returns the optimal station list from the origin station to the destination station
  - The optimal station list is the fewest stations possible. Note: there is no penalty for changing trains.

Example input:
```
GET /route?origin=Houston&destination=23rd
{
    "route": ["Houston", "Christopher", "14th", "23rd"]
}
```

### Challenge 2
Add support for charging fares from pre-paid cards when entering and exiting stations.

You should support the following changes:

##### POST /train-line
- Additional parameter: fare
  - The amount users should pay when taking trains from this line

Example input:
```
POST /train-line
{
    "stations": ["Canal", "Houston", "Christopher", "14th"],
    "name": "1",
    "fare": 2.75
}
```

##### POST /card
- number - unique identification of the card
- amount - the amount of money to be added to the pre-paid card
- returns confirmation of the card creation
- If the card already exists, the amount should be added to the balance of the card.

Example input:
```
POST /card
{
    "number": "1234",
    "amount": 10.0
}
```

##### POST /station/[station]/enter
- card_number - unique identification of the card being used to pay for the ride
- returns the amount left in the card after paying for the ride


##### POST /station/[station]/exit
- card_number - unique identification of the card being used to pay for the ride
- returns the amount left in the card after paying for the ride

Note: logs of the rides should be saved in the database.

Example input:
```
POST /station/Houston/enter
{
    "card_number": "1234"
}

Response:
{
    "amount": 7.25
}
```
```
POST /station/23rd/exit
{
    "card_number": "1234"
}

Response:
{
    "amount": 7.25
}
```

### Evaluation
While completing this, please include a README file that includes how to run your code. This should include how to run Challenge 1 and Challenge 2. You will be evaluated on:
- Does your code completely solve the questions?
- Is your code organized and well thought-out?
- Would it be easy to extend your code to a more complex solution with more requirements?
- How did you test your solution?
