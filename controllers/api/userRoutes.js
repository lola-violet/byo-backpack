const router = require('express').Router();
const { User, Event } = require('../../models');
const bcrypt = require("bcrypt");


router.post('/login', async (req, res) => {
  User.findOne({
    where: {
      user_name: req.body.user_name
    }
  }).then(foundUser => {
    console.log(foundUser)
    if (!foundUser) {
      return res.status(400).json({ msg: "wrong login credentials" })

    }
    if (bcrypt.compareSync(req.body.password, foundUser.password)) {

      req.session.user = {
        id: foundUser.id,
        user_name: foundUser.user_name,
        logged_in: true
      }

      return res.json(foundUser)
    } else {
      return res.status(400).json({ msg: "wrong login credentials" })
    }
  }).catch(err => {
    res.status(500).json({ msg: "an error occured", err });
  });
});



router.put('/chnagePassword/:id', async (req, res) => {

  try {
    const userDb = await User.findOne({
      where: {
        id: req.params.id
      }
    })
    if (userDb) {

      if (bcrypt.compareSync(req.body.currentPass, userDb.password)) {

        const dbPass = await User.update(
          {
            user_name: userDb.user_name,
            password: req.body.newPass,
          }, {
          where: {
            id: req.params.id
          },
          individualHooks: true
        });

        res.send("password changed");
     
      }
      else {
        res.send("The current password does not match");
      }
    }
  } catch (err) {

    res.statusCode(500).send({ err, msg: "the new password is not valid" })
  }
});


router.post("/signup", (req, res) => {
  User.create(req.body)
    .then(newUser => {
      req.session.user = {
        id: newUser.id,
        user_name: newUser.user_name,
        logged_in: true
      }
      res.json(newUser);
    })
    .catch(err => {
      console.log(err);
      res.status(500).json({ msg: "This username  exist.Please use another username ", err });
    });
});
module.exports = router;
