const ConnectToMongo = require('./config/db');
const express = require('express');
const cors = require('cors');
const cookieParser = require('cookie-parser')


ConnectToMongo();

const app = express()
const port = process.env.PORT || 5003;
app.use(express.json())

app.use(cookieParser()) 


app.use((req, res, next) => {
  res.header('Access-Control-Allow-Origin', '*');
  res.header('x-auth-token', '*' )
  next();
});
app.use(cors());



app.get('/', (req, res) => {
  res.send( req.protocol)
})




app.use('/auth', require('./routes/auth'))
app.use('/category', require('./routes/category'))
app.use('/subcategory', require('./routes/subCategory'))
app.use('/products', require('./routes/product'))
app.use('/orders', require('./routes/order'))
app.use('/payment', require('./routes/payment'))
app.use('/tiers', require('./routes/tier'))
app.use('/tags', require('./routes/tag'))
app.use('/uploads/images', express.static('uploads/images'))
app.use('/inven', require('./invenrouter') )


app.listen(port, () => {
  console.log(`App listening on port ${port}`)
})
