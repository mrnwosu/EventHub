const app = require('express')()
const port = 8000


app.get('/venues', (req, res) => {
    res.send(['The Fillmore @ Silver Spring', 'The Fillmore @ Chicago or whatever'])
})

app.listen(port, () => {
    console.log(`Example app listening on port ${port}`)
})