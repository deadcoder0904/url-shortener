# url-shortener

### Create a `private.js` file in the root directory of the project
```
module.exports = {
	MONGODB_URI: process.env.MONGODB_URI || "mongodb://<username>:<password>@<url>/<db_name>"
};
```
