const { Schema, model, Types } = require('mongoose');

// Define the schema for reactions
const reactionSchema = new Schema(
  {
    // Unique identifier for each reaction
    reactionId: {
      type: Schema.Types.ObjectId, 
      default: () => new Types.ObjectId(),
    },  
    // Body of the reaction
    reactionBody: {
      type: String,
      required: "Reaction is required",
      maxLength: 280,
    },
    // Username of the user who made the reaction
    username: {
      type: String,
      required: "Username is required"
    },
    // Timestamp of when the reaction was created
    createdAt: { 
      type: Date, 
      default: Date.now, 
    },
  },
  {
    // Include virtuals when converting to JSON
    toJSON: {
      getters: true,
    },
    // Exclude _id field
    id: false,
  }
);

// Define the schema for thoughts
const thoughtSchema = new Schema({
    // Text of the thought
    thoughtText: { 
      type: String, 
      required: "Thought is required", 
      minLength: 1, 
      maxLength: 280 
    },
    // Timestamp of when the thought was created
    createdAt: { 
      type: Date, 
      default: Date.now, 
    },
    // Username of the user who created the thought
    username: { 
      type: String, 
      required: true 
    },
    // Array of reactions associated with the thought
    reactions: [reactionSchema],
  },
  {
    // Include virtuals when converting to JSON
    toJSON: {
        virtuals: true
    },
    // Exclude _id field
    id: false,
  });

// Define a virtual field to get the count of reactions for each thought
const reactionCount = thoughtSchema.virtual('reactionCount');

// Define the getter function for the virtual field
reactionCount.get(function () {
  return this.reactions.length;
});

// Create the Thought model based on the thoughtSchema
const Thought = model('thought', thoughtSchema);

module.exports = Thought;