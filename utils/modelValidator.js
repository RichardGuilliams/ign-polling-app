const mongoose = require('mongoose')

exports.limitArray = function(min, max){
    return function(value){
        return value.length >= min && value.length <= max
    }
}

exports.matchProperty = function(obj1, obj2, propertyName){
    return obj1[propertyName] == obj2[propertyName];            
}

exports.populate = function(Schema, path, select, next){
    if(Schema[path] == null) next();
    Schema.populate({
        path,
        select
    })
    next();
}