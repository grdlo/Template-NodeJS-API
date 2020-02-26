<p align="center">
    <img src="https://cdn.pixabay.com/photo/2015/04/23/17/41/node-js-736399_960_720.png" width="300" />
</p>

# NodeJS API Template

This template provide you a full base for starting an API project, it contain a full working authentification system and a full working user routes system with Role

## Summury

- **Installation**
- **Documentation**
- **Development**
- **Support**
- **Contribute**
- **Conclusion**

## Installation

To use  this project, please execute in terminal the following commands

```Bash
# Clone the template
$ git clone git@github.com:grdlo/Template-NodeJS-API.git
# Remove template repostory
$ rm -r .git
```
Then you can use it for your own project by using the following commands for linking your git project :
```Bash
# Init your git folder
$ git init
# Add all the file and stage them
$ git add .
# Commit the trakcet changes
$ git commit -m "First Commit"
# Link a remote repository
$ git remote add origin <repository-URL>
# Check if the remote is working
$ git remote -v
# Push the template on you're repository
$ git push origin master
```

You can now develop your API with the template base, for more information on how follow the used guide line of the template please check the **Development** Section

You can use the following commands to launch the project (before starting, you need to define a mongodb uri in the config file `config/default.json`):
```Bash
npm run coverage # Run the test coverage
npm run start # Run the project 
npm run lint # Run the eslint coverage
npm run dev # Run the project with nodemon
```

## Documentation

The document is not, but i make a postman environnement & collection that you can use for create manual request on this template, you can found them in the `documentation` folder in the repository or download directly the file with this links :
    - [Environnement](https://raw.githubusercontent.com/grdlo/Template-NodeJS-API/master/documentation/Template-NodeJS-API.postman_environment.json)
    - [Collection](https://raw.githubusercontent.com/grdlo/Template-NodeJS-API/master/documentation/Template-NodeJS-API.postman_collection.json)

## Development

In this section i will show you how to manipulate this Template for adding contents

### **1. adding Routes**

First create a folder for the route in `src/routes/<your folder>`, the folder name must be the plural top route name, then you can create the route file, the name must be the same as the folder but at singular

When the route file is created in the folder you can start to create all your sub-routes following the [HTTP protocol](https://www.w3.org/Protocols/rfc2616/rfc2616-sec9.html) on this format :
```JavaScript
Router.get('/',
    celebrate(/* Celebrate Schema */),
    authenticator(/* Authentication restriction */),
    async (req, res, next) => {
        /* Your f*/
    });
```
#### Celebrate

Schema must be created in a separated file named `schema.js` in the same folder than the route file, you must export all the rules without default value exemple: 
```JavaScript
/** If the id value is not specified, joi send a error to the requester without calling the route */
const withArticleId = Joi.object().keys({
  id: Joi.objectId().required()
});
```

#### Authenticator

Using the middleware `authenticator` lock the route and need the requester to send an authorization token in the Header, i can pass a Array in the function using the `src/constant.js` for the role values for exemple :
```JavaScript
/** The roles Array define all the roles allowed, here, only admin user can access the route */
authenticator({ roles: [UserRole.ADMIN] })
```

#### Route content

You must use a try and catch with contains `the entire route logic` the catch must be write like this for handling correctly all the thrown error:
```JavaScript
try {
    ...
}  catch (err) {
    handleHttpError(err, res, next);
}
```
the route file must only call the multiple controller methods, you must never write db request in route

### **2. adding Controllers**

Controllers must be created in `src/controllers` with name of the top route name, you are free to write your method as you like, but, you must throw error with the `https-error` package.

### **3. adding Models**

Models must be created in `src/models` with the name of the top route name, you are free to write your models as you like but you must implements a view models methods with all the field return in a get request.

### **4. addings Tests**

You are free to decide if you want's to implements test, a basic exemple is provide with the authentification, it's recommanded to write test.

### **5. adding Middlewares**

middlewares must be created in `src/middlewares` with the name of your choice, you are free to write your middlewares as you like, you juste nead to have the 3 express.js parameters `(req, res, next)`

## Support

If you found a bug, please [create an issue](https://github.com/grdlo/Template-NodeJS-API/issues) and i will process it when i have time.

## Contribute

In case of any contents you would like to integrate into this template, please [Create a Merge Request](https://help.github.com/en/github/collaborating-with-issues-and-pull-requests/creating-a-pull-request) with all the feature in it. If all seem's to be good i will merge it or i will make some commentary

## Conclusion

Thanks if you use this project, it's a 100% free project and i will not accept donation for this work, i use it for myself and i was thinking it could be usefull for other developper, feel free to create all the things you want's
