const mongoose = require('mongoose');

const itineraryItemSchema = new mongoose.Schema({
  day: {
    type: Number,
    required: true,
  },
  title: {
    type: String,
    required: true,
    trim: true,
  },
  description: {
    type: String,
    required: true,
  },
});

const packageSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, 'Please add a package title'],
      trim: true,
      maxlength: [100, 'Title cannot be more than 100 characters'],
    },
    description: {
      type: String,
      required: [true, 'Please add a package description'],
    },
    destination: {
      type: String,
      required: [true, 'Please add a destination'],
      trim: true,
      index: true,
    },
    price: {
      type: Number,
      required: [true, 'Please add a package price'],
      min: [0, 'Price must be greater than or equal to 0'],
    },
    duration: {
      type: Number,
      required: [true, 'Please specify package duration in days'],
      min: [1, 'Duration must be at least 1 day'],
    },
    maxGroupSize: {
      type: Number,
      default: 12,
    },
    difficulty: {
      type: String,
      enum: ['Easy', 'Moderate', 'Challenging', 'Expert'],
      default: 'Moderate',
    },
    image: {
      type: String,
      required: [true, 'Please add a cover image URL'],
    },
    images: {
      type: [String],
      default: [],
    },
    itinerary: {
      type: [itineraryItemSchema],
      default: [],
    },
    included: {
      type: [String],
      default: ['Accommodation', 'Guided tours', 'Select meals', 'Local transportation'],
    },
    excluded: {
      type: [String],
      default: ['International flights', 'Personal travel insurance', 'Optional activities'],
    },
    featured: {
      type: Boolean,
      default: false,
    },
    rating: {
      type: Number,
      default: 4.8,
      min: [1, 'Rating must be at least 1'],
      max: [5, 'Rating cannot exceed 5'],
    },
    reviewsCount: {
      type: Number,
      default: 0,
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model('Package', packageSchema);
