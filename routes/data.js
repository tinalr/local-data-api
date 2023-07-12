const express = require('express')
const router = express.Router()

router.get('/', (req, res, next)=> {
    res.send('data endpoint')
  })

router
    .route('/:oldUrl')
    .get((req, res)=> {
        res.send(`GET data from object with oldUrl of: ${req.params.oldUrl}`)
        })
    .post((req, res)=> {
        res.send(`POST data to object with oldUrl of: ${req.params.oldUrl}`)
        })

router.param('oldUrl', (res, res, next, oldUrl)=> {
    console.log(oldUrl)
})

module.exports = router