const mongoose = require('mongoose');

const diagnosisSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    crop: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Crop',
      default: null,
    },
    cropName: {
      type: String,
      required: [true, 'Crop name is required'],
      trim: true,
    },
    diseaseName: {
      type: String,
      required: [true, 'Disease name is required'],
      trim: true,
    },
    confidence: {
      type: Number,
      min: [0, 'Confidence must be between 0 and 100'],
      max: [100, 'Confidence must be between 0 and 100'],
      default: 0,
    },
    status: {
      type: String,
      enum: ['Detected', 'Under Treatment', 'Treated'],
      default: 'Detected',
    },
    treatment: {
      type: String,
      trim: true,
      default: '',
    },
    preventiveMeasures: {
      type: String,
      trim: true,
      default: '',
    },
    imageUrl: {
      type: String,
      default: null,
    },
    diagnosisDate: {
      type: Date,
      default: Date.now,
    },
  },
  {
    timestamps: true, // adds createdAt & updatedAt
  }
);

// Map _id to id for the frontend
diagnosisSchema.set('toJSON', {
  virtuals: true,
  transform: (doc, ret) => {
    ret.id = ret._id;
    delete ret._id;
    delete ret.__v;
  }
});

module.exports = mongoose.model('Diagnosis', diagnosisSchema);
