const mongoose=require("mongoose");

var CabHistory =mongoose.model('cabhistory',{
	mapid:{type:String,required:true},
	name:{type:String},
	empid:{type:String,required:true},
	address: { type: String, required: true },
	time:{type:String,required: true},
	date:{type:Date,required: true}
});

module.exports={CabHistory};