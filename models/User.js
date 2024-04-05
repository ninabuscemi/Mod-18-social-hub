const { Schema, model } = require('mongoose');

// Define the schema for users
const userSchema = new Schema(
    {
        // Username of the user
        username: { 
            type: String, 
            unique: true, 
            required: "Username is required", 
            trim: true 
        },
        // Email of the user
        email: { 
            type: String, 
            unique: true, 
            required: "Email is required", 
            lowercase: true, 
            match: [/.+@.+\..+/], 
        },
        // Array of thought IDs associated with the user
        thoughts: [
            { 
                type: Schema.Types.ObjectId, 
                ref: 'thought' 
            }
        ],
        // Array of user IDs representing the user's friends
        friends: [
            {
              type: Schema.Types.ObjectId,
              ref: "user",
            },
        ],
    },
    {
        // Include virtuals when converting to JSON
        toJSON: {
            virtuals: true
        },
        // Exclude _id field
        id: false,
    }
);

// Define a virtual field to get the count of friends for each user
const friendCount = userSchema.virtual('friendCount');

// Define the getter function for the virtual field
friendCount.get(function () {
    return this.friends.length;
});

// Create the User model based on the userSchema
const User = model('user', userSchema);

module.exports = User;