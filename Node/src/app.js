const express = require('express')
const bodyParser = require('body-parser')
const cors = require('cors')


const app = express()
app.use(bodyParser.json())
app.use(cors())




app.get('/', (req, res) => {
    res.send('Hello from node')
});

const port = 3000

app.listen(port, () => console.log(`App listening on port ${port}`))
