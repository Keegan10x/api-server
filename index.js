const Joi = require('joi');
const express = require('express');
const path = require('path')
const app = express();
const bodyParser = require('body-parser')
//Middle ware
app.use(bodyParser.json());
const urlencodedParser = bodyParser.urlencoded({ extended:false })
const products = [
    {id: 1, name:'Blender', price:280},
    {id: 2, name:'Oven', price:350},
    {id: 3, name:'Pan', price:57},
]


//Get requests
app.get('/', (req, res) => {
    res.send('hello world');
});

app.get('/add/products', (req, res) => {
    res.sendFile(path.join(__dirname, './views/addProducts.html'));
});

app.get('/api/products', (req, res) => {
    res.send(products);
});

app.get('/api/products/:id', (req, res) => {
    const product = products.find(p => p.id === parseInt(req.params.id));
    if (!product) return res.status(404).send('Data was not found :(');
    res.send(product)
})


//Post requests
app.post('/api/products', urlencodedParser, (req, res) => {
    //VALIDATION-----------------------------------
    const schema = Joi.object({
        name: Joi.string().min(2).required(),
        price: Joi.number().min(0).required()
    });
    const result = schema.validate(req.body)
    //VALIDATION-----------------------------------
    if (result.error) return res.status(400).send("INVALID INPUT")

    const product = {
        id: products.length + 1,
        name: req.body.name,
        price: req.body.price
    }

    products.push(product)
    res.send(products)
});


//Update request
app.put('/api/products/:id', (req, res) => {
    //look up product
    let product = products.find(p => p.id === parseInt(req.params.id));
    if (!product) return res.status(404).send('Data was not found :(');

    //VALIDATION-----------------------------------
    const schema = Joi.object({
        name: Joi.string().min(2).required(),
        price: Joi.number().min(0).required()
    });
    const result = schema.validate(req.body)
    //VALIDATION-----------------------------------
    
    if (result.error){
        console.log(result.error.details)
        res.status(400).send("INVALID INPUT")
        return
    }

    //update product
    product.name = req.body.name
    product.price = req.body.price
    //return update product
    res.send(products);
})


//Delete request
app.delete('/api/products/:id', (req, res)=>{
    //look up product
    let product = products.find(p => p.id === parseInt(req.params.id));
    if (!product) {
        res.status(404).send('Data was not found :(')
        return
    }

    //Delete product
    const index = products.indexOf(product)
    products.splice(index, 1)

    res.send(products)
})


//PORT
const port = process.env.PORT || 8080
app.listen(port, ()=>{
    console.log(`Listening on port ${port}...`)
})