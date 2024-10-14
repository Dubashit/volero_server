const router = require('express').Router()
const middleWare = require('../../utils/auth.middleware')
const jwt = require('jsonwebtoken')


router.post("/token", async (req, res) => {
    const { username, password } = req.body
    const token = await middleWare.authenticateUser(username, password)
    if (!token) {
        return res.status(401).json({ message: 'Invalid username or password' });
    }
    res.json({ access_token: token });
})

router.get("/users/me", middleWare.authenticateJWT, (req, res) => {
    res.json(req.user)
})

module.exports = router