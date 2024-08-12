import mongoose, { Schema, Document, PaginateModel} from "mongoose";
import mongoosePaginate from "mongoose-paginate-v2";

export interface IStagiare extends Document {
    username?: string;
    email?: string;
    password?: string;
}

const StagiareSchema: Schema = new Schema ({
    username :{
        type : String,
        required : true
    },
    email: { 
        type : String,
        required : true,
    },
    password:{
        type : String ,
        required : false,
    },
    createdBy: {
        type: Schema.Types.ObjectId,
        ref: 'User',
        required: true
    }
},{
    timestamps: true,
    versionKey: false,
}
)

StagiareSchema.plugin(mongoosePaginate)

export default mongoose.model<IStagiare,PaginateModel<IStagiare>>('Stagiare',StagiareSchema)