import express from 'express';
import { createTrip, getTrips } from '../controllers/tripController.js';

const router = express.Router();

router.route('/').get(getTrips).post(createTrip);

export default router;
