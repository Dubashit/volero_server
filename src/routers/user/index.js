const router = require('express').Router()
const bcrypt = require('bcrypt')
const User = require('../../models/user')
const axios = require('axios')
const soap = require('soap')

router.get("/", async (req, res) => {
    try {
        const users = await User.findAll()
        res.status(200).json(users)
    } catch (error) {
        res.status(500).json({ error: "Internal server error" })
    }
})

// router.get('/some', async (req, res) => {
//     const wsdlUrl = 'https://www.volero.net/admin/plugins/exportXML/ws/?wsdl';
//     const ACCESS_TOKEN = '043d234bec8ab44cc26e55ed24086061';
//     try {
//         const client = await soap.createClientAsync(wsdlUrl);

//         // Добавляем AuthHeader с токеном в виде SOAP-заголовка
//         client.addSoapHeader({
//             AuthHeader: {
//                 Token: ACCESS_TOKEN,
//             }
//         });

//         // Вызываем метод SOAP-сервиса, например, GetOperationsList
//         client.GetOperationsList({}, (err, result) => {
//             if (err) {
//                 console.error('Ошибка при вызове SOAP-операции:', err);
//                 return res.status(500).send('Ошибка при получении данных');
//             }

//             res.json(result);
//         });

//     } catch (error) {
//         console.error('Ошибка при подключении к SOAP-сервису:', error);
//         res.status(500).send('Ошибка при подключении к сервису');
//     }
// });

router.get("/:username", async (req, res) => {
    const username = req.params.username
    try {
        const user = await User.findOne({ where: { username } })
        res.status(200).json(user)
    } catch (error) {
        res.status(500).json({ error: "Internal server error" })
    }
})

router.post("/", async (req, res) => {
    const { username, password } = req.body
    try {
        const passwordHash = await bcrypt.hash(password, 10)
        const users = await User.create({ username: username, password: passwordHash })
        res.status(200).json(users)
    } catch (error) {
        res.status(400).json({ error: error.message })
    }
})

// router.put("/:username", async (req, res) => {
//     const { password, newPassword } = req.body
//     const username = req.params.username
//     try {
//         const user = await User.findOne({ where: { username } });
//         if (!user) {
//             return res.status(404).json({ message: "User not found" });
//         }
//         const isPasswordCorrect = await bcrypt.compare(password, user.password);
//         if (!isPasswordCorrect) {
//             return res.json({ message: "Current password is incorrect" });
//         }
//         const hashedNewPassword = await bcrypt.hash(newPassword, 10);
//         await User.update(
//             { password: hashedNewPassword },
//             { where: { username } }
//         );
//         res.status(200).json({ message: "Password updated successfully" });
//     } catch (error) {
//         console.error('Error updating password:', error);
//         res.status(500).json({ error: error.message });
//     }
// })

router.put("/:id", async (req, res) => {
    const { username, password } = req.body
    const id = req.params.id
    try {
        const user = await User.findOne({ where: { id } });
        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }
        const hashedNewPassword = await bcrypt.hash(password, 10);
        await user.update({
            username,
            password: hashedNewPassword
        });
        res.status(200).json({ message: "Data changed" });
    } catch (error) {
        console.error('Error updating password:', error);
        res.status(500).json({ error: error.message });
    }
})

router.delete("/:id", async (req, res) => {
    const id = req.params.id
    try {
        await User.destroy({ where: { id } })
        res.status(200).json({ message: "User deleted successfully" })
    } catch (error) {
        res.status(400).json({ error: error.message })
    }
})

module.exports = router