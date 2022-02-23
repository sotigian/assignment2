const express = require('express');
const db = require('../models/index');
const Trainer = db.sequelize.models.Trainer;
const router = express.Router();
const mysql = require('mysql2');


// list
router.get('/', async function(req, res){
    let trainers = await Trainer.findAll();
    res.render('trainers/list',
        {
            title: 'Express 002 - Trainers page',
            list: trainers
        }
    )
});

// GET create
router.get('/create', async function (req, res){
    res.render('trainers/create-update',
     {
        title: 'Express 002 - New Trainer page',
        message: 'New Trainer',
        action: 'create',
        trainer: {}
     });
});

// POST create 
router.post('/create', async (req, res) => {
    await Trainer.create({
        firstName: req.body.firstName,
        lastName: req.body.lastName,
        subject: req.body.subject
    });
    res.redirect('/trainers');
});

// GET update
router.get('/edit/:id', async (req, res) => {
    let trainer = await Trainer.findByPk(req.params.id, { attributes: ['id', 'firstName', 'lastName', 'subject'] });
    res.render('trainers/create-update', {
        title: 'Express 002 - Edit Trainer page',
        message: 'Edit a Trainer',
        action: 'update',
        trainer: trainer
    });
})

// POST update 
router.post('/update', async (req, res) => {
    let trainer = await Trainer.findByPk(req.body.id, { attributes: ['id', 'firstName', 'lastName', 'subject'] });
    if (trainer.id == req.body.id) {
        trainer.firstName = req.body.firstName;
        trainer.lastName = req.body.lastName;
        trainer.email = req.body.email;
        await trainer.save();
    }
    res.redirect('/trainers');
})


router.get('/listjson', async function (req, res) {
    // let customers = await getCustomers();
    let trainers = await Trainer.findAll({ attributes: ['id', 'firstName', 'lastName', 'subject'] });
    res.json(trainers);
});


// GET delete
router.get('/delete', async function (req, res) {
    await Trainer.destroy({ where: { id: req.query.id } }).then((deleted) => {
        if (deleted === 1) {
            res.render('trainers/deleted',
                {
                    title: 'Express 002 - Trainers delete page',
                    message: `You deleted trainer with id: ${req.query.id}`
                });
        }
    },
        (error) => {
            res.render('trainers/deleted',
                {
                    title: 'Express 002 - Trainers delete page',
                    message: `<div><p>There was an error deleting customer with id: ${req.query.id}</p>
                                   <p>Error: ${error}</p></div>`
                });
        });

});



















module.exports = router;

