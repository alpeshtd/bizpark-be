const express = require('express');

const { getSpaces, createSpace, deleteSpace, updateSpace } = require('../controllers/spaceController');
const { getTenants, createTenant, updateTenant, deleteTenant } = require('../controllers/tenantController');
const { getInvestors, createInvestor, updateInvestor, deleteInvestor } = require('../controllers/investorController');
const { getHotel, createHotel } = require('../controllers/hotelController');
const { getAllExpenses, createExpense, updateExpense, deleteExpense } = require('../controllers/expenseController');
const { getAllTransactions, createTransaction, updateTransaction, createManyTransaction, deleteTransaction } = require('../controllers/transactionController');
const { getInvestments, createInvestment, updateInvestment, deleteInvestment } = require('../controllers/investmentController');
const roleMiddleware = require('../middlewares/roleMiddleware');
const { getDashboard } = require('../controllers/dashboardController');
const { createProfit, getProfit, refreshProfit, deleteProfit } = require('../controllers/profitController');

const router = express.Router();

router.get('/dashboard', getDashboard);

router.post('/spaces', getSpaces);
router.post('/add-space', roleMiddleware(['admin', 'superuser']), createSpace);
router.post('/edit-space', roleMiddleware(['admin']), updateSpace);
router.post('/delete-space', roleMiddleware(['admin']), deleteSpace);


router.post('/tenants', getTenants);
router.post('/add-tenant', roleMiddleware(['admin', 'superuser']), createTenant);
router.post('/edit-tenant', roleMiddleware(['admin']), updateTenant);
router.post('/delete-tenant', roleMiddleware(['admin']), deleteTenant);

router.post('/investors', getInvestors);
router.post('/add-investor', roleMiddleware(['admin', 'superuser']), createInvestor);
router.post('/edit-investor', roleMiddleware(['admin']), updateInvestor);
router.post('/delete-investor', roleMiddleware(['admin']), deleteInvestor);

router.post('/investments', getInvestments);
router.post('/add-investment', roleMiddleware(['admin', 'superuser']), createInvestment);
router.post('/edit-investment', roleMiddleware(['admin']), updateInvestment);
router.post('/delete-investment', roleMiddleware(['admin']), deleteInvestment);

router.post('/hotel', getHotel);
router.post('/add-hotel', roleMiddleware(['admin']), createHotel);

router.post('/expenses', getAllExpenses);
router.post('/add-expense', roleMiddleware(['admin', 'superuser']), createExpense);
router.post('/edit-expense', roleMiddleware(['admin']), updateExpense);
router.post('/delete-expense', roleMiddleware(['admin']), deleteExpense);

router.post('/transactions', getAllTransactions);
router.post('/add-transaction', roleMiddleware(['admin', 'superuser']), createTransaction);
router.post('/edit-transaction', roleMiddleware(['admin']), updateTransaction);
router.post('/add-transactions', roleMiddleware(['admin']), createManyTransaction);
router.post('/delete-transaction', roleMiddleware(['admin']), deleteTransaction);

router.post('/profit', getProfit);
router.post('/add-profit', roleMiddleware(['admin']), createProfit);
// router.post('/refresh-profit', roleMiddleware(['admin']), refreshProfit);
router.post('/delete-profit', roleMiddleware(['admin']), deleteProfit);

module.exports = router;