import express from 'express';

const app = express()

const port = 4000

app.get('/', (req, res) => {
  res.send('Hello World!')
})

app.get('/usib', (req, res) => {
    const jokes = [
        {
            name:"joke1",
            id:1,
            joke:"joke1"
        },
        {
            name:"joke2",
            id:2,
            joke:"joke2"
        },
        {
            name:"joke3",
            id:3,
            joke:"joke3"
        }
        
    ]
    res.send(jokes)
  })

app.listen(port, () => {
    console.log("jnk")
  console.log(`Example app listening on port ${port}`)
})