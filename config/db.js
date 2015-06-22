/**
 * Created by kunag_000 on 22-06-2015.
 */
var uri = 'mongodb://localhost:27017/social';
var mongo = require('mongodb').MongoClient;

exports.fetch = function(doc, callback)
{
    var onConnect = function(err, db)
    {
        if(err)
        {
            callback(err);
        }
        else
        {
            var onFind = function(err, user)
            {
                db.close();
                if(err)
                {
                    callback(err);
                }
                else
                {
                    callback(null, user);
                }
            };
            db.collection('users').findOne({_id : require('mongodb').ObjectID(doc)}, onFind);
        }
    };
    mongo.connect(uri, onConnect);
};

exports.find = function(doc, callback)
{
    var onConnect = function(err, db)
    {
        if(err)
        {
            callback(err);
        }
        else
        {
            var onFind = function(err, user)
            {
                db.close();
                if(err)
                {
                    callback(err);
                }
                else
                {
                    callback(null, user);
                }
            };
            db.collection('users').findOne(doc, onFind);
        }
    };
    mongo.connect(uri, onConnect);
};

exports.save = function(doc, callback)
{
    var onConnect = function(err, db)
    {
        if(err)
        {
            callback(err);
        }
        else
        {
            var onSave = function(err, user)
            {
                db.close();
                if(err)
                {
                    callback(err);
                }
                else
                {
                    callback(null, user);
                }
            };
            db.collection('users').save(doc, onSave);
        }
    };
    mongo.connect(uri, onConnect);
};