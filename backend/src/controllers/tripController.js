import TripRequest from '../models/TripRequest.js';
import { generateItinerary } from '../services/llmService.js';

const requiredFields = [
  'name',
  'email',
  'source',
  'destination',
  'startDate',
  'endDate',
  'budget',
  'travelers',
  'travelType',
];

const getMissingFields = (body) =>
  requiredFields.filter((field) => body[field] === undefined || body[field] === null || body[field] === '');

const normalizePreferences = (preferences) => {
  if (!preferences) {
    return [];
  }

  if (Array.isArray(preferences)) {
    return preferences;
  }

  if (typeof preferences === 'string') {
    return preferences
      .split(',')
      .map((preference) => preference.trim())
      .filter(Boolean);
  }

  return [];
};

export const createTrip = async (req, res) => {
  try {
    const missingFields = getMissingFields(req.body);

    if (missingFields.length > 0) {
      return res.status(400).json({
        message: 'Missing required fields',
        missingFields,
      });
    }

    const startDate = new Date(req.body.startDate);
    const endDate = new Date(req.body.endDate);
    const budget = Number(req.body.budget);
    const travelers = Number(req.body.travelers);

    if (Number.isNaN(startDate.getTime()) || Number.isNaN(endDate.getTime())) {
      return res.status(400).json({ message: 'startDate and endDate must be valid dates' });
    }

    if (endDate < startDate) {
      return res.status(400).json({ message: 'endDate must be greater than or equal to startDate' });
    }

    if (!Number.isFinite(budget) || budget < 0) {
      return res.status(400).json({ message: 'budget must be a valid non-negative number' });
    }

    if (!Number.isInteger(travelers) || travelers < 1) {
      return res.status(400).json({ message: 'travelers must be a positive integer' });
    }

    const trip = await TripRequest.create({
      name: req.body.name,
      email: req.body.email,
      source: req.body.source,
      destination: req.body.destination,
      startDate,
      endDate,
      budget,
      travelers,
      travelType: req.body.travelType,
      preferences: normalizePreferences(req.body.preferences),
    });

    const itinerary = await generateItinerary(trip);

    trip.llmResponse = itinerary;
    await trip.save();

    return res.status(201).json({
      message: 'Trip request created successfully',
      trip,
      itinerary,
    });
  } catch (error) {
    console.error('Create trip failed:', error);
    return res.status(500).json({
      message: 'Failed to create trip request',
      error: error.message,
    });
  }
};

export const getTrips = async (req, res) => {
  try {
    const trips = await TripRequest.find().sort({ createdAt: -1 });

    return res.status(200).json({
      count: trips.length,
      trips,
    });
  } catch (error) {
    console.error('Get trips failed:', error);
    return res.status(500).json({
      message: 'Failed to fetch trip requests',
      error: error.message,
    });
  }
};