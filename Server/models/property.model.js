const express=require('express');
const mongoose=require('mongoose');
const {propertySchema}=require('../schema/property.schema');

const property=new mongoose.model('property',propertySchema);

module.exports={
    "property":property
}