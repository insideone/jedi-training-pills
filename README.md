# Jedi Training Pills

Helper script for group managing.

# How to install

The script depends on [Greasemonkey](https://addons.mozilla.org/en-US/firefox/addon/greasemonkey/) or [Tampermonkey](https://chrome.google.com/webstore/detail/tampermonkey/dhdgffkkebhmkfjojejmpbldmpobfkfo?hl=en) and you should have it installed first.

Then just click [jedi-training-pills.user.js](https://raw.githubusercontent.com/insideone/jedi-training-pills/master/dist/jedi-training-pills.user.js) and accept the installation. 

# How it works

The script executes only on [Trains Annoncements Page](https://steamcommunity.com/groups/JediTraining/announcements/detail/1689297920480934920). However, it also gets access to fetch need data from these sites:

* https://www.steamgifts.com
* https://steamcommunity.com

The script will place "Report" button under the header of the page. It takes about 7 minutes to fetch all the data and build a report after you hit that button.

### "By Train" report

* Name - name of a train
* User - user who has created the last cart 
* Updated - when was the last post updated?
* Giveaway - link to the giveaway of the last cart
* Store - link to the Steam Store for game from the last cart
* Ending - when does the giveaway end?
* Winners - list of winners (well, there must be only one winner for a train, but someone might have made a mistake)
* No entries - GAs from unread posts (plus the last) that got no entries
* Problems - if the script can't fetch some data it will show the reason here

### "By User" report

* User - user's name whom this row describes
* Ongoing - count of the running trains for the user
* Pending - count of the trains which are waiting for a new cart
* Pending in Points - the same, but value in points. The table is ordered by this column

# Core Technology Stack

* Typescript
* Webpack
* dot-dom

See [package.json](./package.json) dependencies sections for the rest

# How to develop

## First start:

```bash
npm i
```

## Development:

```bash
npm start
```

Replace the installed script with http://localhost:8080/jedi-training-pills.proxy.user.js

While `npm start` is running you can change any `./src` files (except `headers.json`) and webpack will build new version of the script. You should configure Grease\Tampermonkey once this way: Settings &rarr; Externals &rarr; Update Interval &rarr; Always

Then after each update you should reload page __two times__.

### Make a new build

```bash
npm run build
```

### Make sure the tests are fine

```bash
npm t
```
