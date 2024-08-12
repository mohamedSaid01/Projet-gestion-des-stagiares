import mongoose, { Date, Document, PaginateModel, Schema} from "mongoose";
import mongoosePaginate from "mongoose-paginate-v2";

export interface IUser extends Document {
    username?: string;
    email?: string;
    password?: string;
    profilePictureUrl?: string; 
    role?: string;
    hiringDate?: Date;
    birthday?: Date;
    typeOfStage?: string;
    studyLocation?: string;
    phoneNumber?: number;
    gender?: string;
    adress?: string;
    numCIN?: number;  
    encadrant?: string;
    departement?: string;
    duration?: Number;
}

const userSchema: Schema = new Schema ({
    username :{
        type : String,
        required : true
    },
    email: { 
        type : String,
        required : true,
        unique : true,
    },
    password:{
        type : String ,
        required : false,
    },
    profilePictureUrl: {
        type : String,
    },
    role:{
        type: String,
        default: 'stagiare',
    },
    gender:{
        type: String,
        enum: ['male', 'female']
    }
    ,
    birthday:{
        type: Date,
    }
    ,
    adress:{
        type: String,
    }
    ,
    phoneNumber:{
        type: Number,
    }
    ,
    hiringDate:{
        type: Date,
    },
    typeOfStage:{
        type: String,
    },
    studyLocation:{
        type: String,
    },
    assignmentLetter:{
        type: String,
    },
    numCIN:{
        type: Number,
    },
    encadrant:{
        type: String,
    },
    departement:{
        type: String,
    },
    duration:{
        type: Number,
    },
},{
    timestamps: true,
    versionKey: false,
}
)

userSchema.plugin(mongoosePaginate)
export default mongoose.model<IUser,PaginateModel<IUser>>('User',userSchema)