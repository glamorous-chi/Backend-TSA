import mongoose from  'mongoose';
const {Schema} = mongoose;

const userSchema = new Schema(
    // Creating the User object
    {
        name: {
            type: String,
            required: true,
            trim: true,
        },
        email:{
            type: String,
            required: true,
            unique: true,
            trim: true,
        },
        password: {
            type: String,
            required: true,
            trim: true,
            min: 6,
            max: 64
        },
        image:String,
        imagePublicId:String,
        role:{
            type: Number,
            default: 0
        },
        address:{
            type: Object,
            default:{
                street: 'No 25 Zone street',
                city: 'Lagos',
                state: 'Lagos',
                country: 'Nigeria',
                zip: 12345
            }
        },
        OTP:{
            type: String,
        }
    },
    {timestamps:true}
);

export default mongoose.model('User',userSchema)