const router = require('express').Router();
const categoryCtl = require("../controllers/categoryCtl");
const auth = require('../middleware/auth');
const authAdmin = require('../middleware/authAdmin');


router.route('/category')
    .get(categoryCtl.getCategories)
    .post(auth, authAdmin, categoryCtl.createCategory)

router.route('/category/:id')
    .delete(auth, authAdmin, categoryCtl.deleteCategory)
    .put(auth, authAdmin, categoryCtl.updateCategory)

module.exports = router;