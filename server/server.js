const express = require("express");
const session = require("express-session");
const bodyParser = require('body-parser');
const cors = require("cors");
const app = express();
const fs = require('fs');


app.use(cors());
app.use(express.json());
app.use(bodyParser.json());

var urlEncodded = bodyParser.urlencoded({ extended: false })

const { MongoClient } = require("mongodb");
// Replace the uri string with your connection string.
const url = "mongodb+srv://sameralomari2000:2000sameralomari@cluster0.w6otvaj.mongodb.net/?retryWrites=true&w=majority";
const client = new MongoClient(url);
const db = client.db('DB')
const coll = db.collection('React')
var loginUser;

var products = JSON.parse(fs.readFileSync('products.json', 'utf8'));


const isLoggedIn = (req, res, next) => {
    if (req.session && req.session.user) {
        // Check if the session has expired
        const expirationTime = req.session.cookie.expires;
        if (expirationTime && expirationTime < new Date()) {
            req.session.destroy((err) => {
                if (err) {
                    console.error("Error destroying session:", err);
                    res.status(500).send("Internal Server Error");
                } else {
                    res.redirect('/loginin'); // Redirect to login page with session expired error
                }
            });
        } else {
            next(); // User is logged in and the session is valid
        }
    } else {
        res.redirect('/loginin'); // Redirect to login page with login required error
    }
}

app.use(session({
    secret: 'your-secret-key',
    resave: false,
    saveUninitialized: true,
    cookie: {
        maxAge: 15 * 60 * 1000, // 15 minutes in milliseconds
    },
}));

app.get("/loginin", function (req, res) {
    res.sendFile(__dirname + '/login.html')
})


app.post("/loginin", urlEncodded, async (req, res) => {
    const result = await coll.find({ email: req.body.email, password: req.body.password }).toArray();
    loginUser = result;
    if (result.length > 0) {
        // Set user session
        req.session.user = req.body.email;
        res.sendFile(__dirname + "/home.html");
    } else {
        res.redirect('/register'); // Redirect to login page with login required error
    }
})

app.get('/logout', (req, res) => {
    // Destroy the session to log the user out
    req.session.destroy((err) => {
        if (err) {
            console.error("Error destroying session:", err);
            res.status(500).send("Internal Server Error");
        } else {
            res.redirect('/loginin'); // Redirect to login page after logout
        }
    });
});


app.get('/register', (req, res) => {
    res.sendFile(__dirname + '/register.html');
});

app.post("/registerer", urlEncodded, async (req, res) => {
    const result1 = await coll.findOne({ email: req.body.email, name: req.body.name })
    if (result1) {
        res.send("Duplicate user data please change email or name")
    }
    else {
        //res.json({ email: req.body.email, password: req.body.password, name: req.body.name, age: req.body.age, gender: req.body.gender })
        const result = await coll.insertOne({ email: req.body.email, password: req.body.password, name: req.body.name, age: req.body.age, gender: req.body.gender })
        res.send("Register Success")
    }
})

app.post("/edit",isLoggedIn ,urlEncodded ,async (req, res) => {
    const result1 = await coll.findOne({ email: req.body.email, name: req.body.name })
    if (result1) {
        res.send("Duplicate user data please change email or name")
    }
    else {
        //res.json({ email: req.body.email, password: req.body.password, name: req.body.name, age: req.body.age, gender: req.body.gender })
        const result = await coll.insertOne({ email: req.body.email, password: req.body.password, name: req.body.name, age: req.body.age, gender: req.body.gender })
        res.send("Register Success")
    }
})

app.get("/retriveusers",isLoggedIn , async (req, res) => {
    var users = loginUser
    res.json(users)
    //console.log(result)
})


app.post("/addUsers",isLoggedIn , async (req, res) => {

    var users = ''
    var result = await coll.insertOne({ name: 'ward2' }) //once data retrived -> procceed
    console.log(result)

    res.send(result)
})

app.get("/:name",isLoggedIn , async (req, res) => {
    var users = ''
    var result = await coll.findOne({ name: req.params.name })
    res.send(result)
})

app.delete("/:name",isLoggedIn , async (req, res) =>    //postman 
{
    var users = ''
    var result = await coll.deleteOne({ name: req.params.name })
    res.send(result)
})



app.get('/', (req, res) => {
    res.sendFile(__dirname + '/index.html');
});

app.get('/form',isLoggedIn , (req, res) => {
    res.sendFile(__dirname + '/form.html');
});

app.get('/home',isLoggedIn , (req, res) => {
    res.sendFile(__dirname + '/home.html');
});

app.get('/products',isLoggedIn , (req, res) => {
    res.json(products);
});

app.post('/requestProduct',isLoggedIn , express.urlencoded({ extended: true }), (req, res) => {
    const productId = parseInt(req.body.ID);

    const requestedProduct = products.find(product => product && product.id === productId);

    if (requestedProduct) {
        res.json({ message: 'Product requested successfully', product: requestedProduct });
    } else {
        res.status(404).json({ message: 'No product found with that ID' });
    }
});


app.get('/add',isLoggedIn , (req, res) => {
    res.sendFile(__dirname + '/addProduct.html');
});

app.post('/addProduct',isLoggedIn , express.urlencoded({ extended: true }), (req, res) => {
    const newProduct = {
        id: Object.keys(products).length + 1,
        name: req.body.name,
        price: req.body.price
    };

//    products[newProduct.id] = newProduct;
    products.push(newProduct);

    fs.writeFileSync('products.json', JSON.stringify(products));

    res.json({ message: 'Product added successfully', product: newProduct });
});


app.listen(8000, () => {
  console.log(`Server is running on port 8000.`);
});