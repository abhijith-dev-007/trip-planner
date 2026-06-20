import mongoose from 'mongoose';

const tripRequestSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },
    email: {
      type: String,
      required: true,
      trim: true,
      lowercase: true,
    },
    source: {
      type: String,
      required: true,
      trim: true,
    },
    destination: {
      type: String,
      required: true,
      trim: true,
    },
    startDate: {
      type: Date,
      required: true,
    },
    endDate: {
      type: Date,
      required: true,
    },
    budget: {
      type: Number,
      required: true,
      min: 0,
    },
    travelers: {
      type: Number,
      required: true,
      min: 1,
    },
    travelType: {
      type: String,
      required: true,
      trim: true,
    },
    preferences: {
      type: [String],
      default: [],
    },
    llmResponse: {
      type: String,
      default: '',
    },
    createdAt: {
      type: Date,
      default: Date.now,
    },
  },
  {
    versionKey: false,
  }
);

const TripRequest = mongoose.model('TripRequest', tripRequestSchema);

export default TripRequest;