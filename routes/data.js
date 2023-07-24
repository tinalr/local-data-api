const express = require('express')
const router = express.Router()
// const { sampleUrlReplacements } = require('../data_files/sampleUrlReplacements.js')
const { urlReplacements } = require('../data_files/urlReplacements.js')

router.get('/', (req, res, next)=> {
    res.send('data endpoint')
  })

// router
//     .route('/sampleUrlReplacements')
//     // GET obj by oldUrl
//     .get((req, res)=> {
//         const obj = sampleUrlReplacements.find(e => e.oldUrl == req.query.oldUrl)
//         res.send(obj)
//         })

router
    .route('/urlReplacements')
    // GET obj by oldUrl
    .get((req, res)=> {
        const obj = urlReplacements.find(e => e.oldUrl == req.query.oldUrl)
        res.send(obj)
        })


    // .post((req, res)=> {
    //     res.send()
    //     })

// router.param('dataFileName', (req, res, next, dataFileName)=> {
//     // run some script before request
//     next()
    
// })

module.exports = router