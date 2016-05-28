angular.module('shpCrt.services', ['ngCordova'])

.factory('cart', function($cordovaSQLite,$q) {

  var _this = this;
   _this.db = null;
  var CURR_UNIT = 'INR';
    // Some fake testing data
  var cart = [{
    "item":"Sugar",
    "quantity":2,
    "unit":"Kg",
    "picked":false,
    "amount":{
      "price":0,
      "unit":"INR"
    },
    "location":"",
    "desc":""
  },
  {
    "item":"Maggi",
    "quantity":2,
    "unit":"Packets",
    "picked":false,
    "amount":{
      "price":0,
      "unit":"INR"
    },
    "location":"",
    "desc":"Rs 10 Packet"
  },
  {
    "item":"Onion",
    "quantity":2,
    "unit":"Kg",
    "picked":false,
    "amount":{
      "price":0,
      "unit":"INR"
    },
    "location":"",
    "desc":""
  },
  {
    "item":"Rice",
    "quantity":10,
    "unit":"Kg",
    "picked":true,
    "amount":{
      "price":0,
      "unit":"INR"
    },
    "location":"",
    "desc":"Rs 46 Rated"
  },
  {
    "item":"FaceWash",
    "quantity":1,
    "unit":"",
    "picked":false,
    "amount":{
      "price":0,
      "unit":"INR"
    },
    "location":"",
    "desc":"Himalaya Neem"
  }];

  //function to initiate test data
  function setTestValues() {
      console.log("In SetValues");
      var query = "INSERT INTO cart (item,quantity,unit,picked,description) VALUES (?,?,?,?,?)";
      var currObj = {};
      for (var i = 0; i < cart.length; i++) {
        currObj = cart[i];
        $cordovaSQLite.execute(_this.db,query,[currObj.item,currObj.quantity,currObj.unit,0,currObj.desc]).then(function(result){
        },function(error){
        });  
      }
      
  };

  // Might use a resource here that returns a JSON array
  return {
    getCart: function() {
        console.log("In GetCart");
        var newCart = [],
         deferred = $q.defer(),
         item = {},
         idxItem = {},
         binding = [];
         $cordovaSQLite.execute(_this.db,"SELECT * FROM cart",binding).then(function(result){
            var len = result.rows.length
            console.log(result);
              for (var i = 0; i < result.rows.length; i++) {
                idxItem = result.rows.item(i)
                item={
                      "id":idxItem.id,
                      "item":idxItem.item,
                      "quantity":idxItem.quantity,
                      "unit":idxItem.unit,
                      "picked":(idxItem.picked === 1) ? true : false,
                      "amount":{
                        "price":idxItem.price,
                        "unit":CURR_UNIT
                      },
                      "location":idxItem.location,
                      "desc":idxItem.description
                    };
                newCart.push(item);
              }
              console.log("newCart:" + newCart.length);
              console.log(newCart);
              deferred.resolve(newCart);
          },function (error){
            deferred.reject("");
          });
          //deferred.resolve(cart);
         return deferred.promise;
    },
    setDb: function(dbConnection,scope) {
        _this.db = dbConnection;
    },
    insert: function(item) {
      var query = "INSERT INTO cart (item) VALUES (?)"
      $cordovaSQLite.execute(_this.db,query,[item]).then(function(result){
        },function(error){
        });
    },
    picked: function(id,bool) {
      query = "UPDATE cart SET picked = ? WHERE id = ?";
      var picked = bool ? 1 : 0;
      $cordovaSQLite.execute(_this.db,query,[picked,id]).then(function(){
        console.log(id + ' has been set to picked: ' + bool);
      },function(error) {

      });
    },
    initDb: function() {
          console.log("In initDb");
          var defer=$q.defer();
          $cordovaSQLite.execute(_this.db,"CREATE TABLE IF NOT EXISTS cart (id integer primary key, item text, quantity number, unit text, picked number, price real, location, description)").then(function(){
             //$cordovaSQLite.execute(_this.db,"DELETE FROM cart");
            //test data initiation
            console.log("In createDB");
            $cordovaSQLite.execute(_this.db,"SELECT Count(id) AS count FROM cart").then(function(result){
                console.log("count:",result.rows.item(0).count);
                if (result.rows.item(0).count === 0) {
                  console.log("Before SetDB");
                   setTestValues();
                } else {
                  console.log("DB already Created");
                }
            },function (Error){
            });
            defer.resolve("success");
          },function(error){
            defer.reject(error);
            console.log("could not create DB");
          });
          return defer.promise;
        }
  };
});
