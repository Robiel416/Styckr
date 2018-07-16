var map;
var service;
var marker;
var pos;
var infowindow;
var typs = [];
var clicker;
var test = 0;
var queryUrl = "https://cors-anywhere.herokuapp.com/https://api.yelp.com/v3/businesses/search?";
// "https://cors-anywhere.herokuapp.com/https://api.yelp.com/v3/businesses/search?location=oakville&term=Starbucks"
var result = [];
var address = [];
var queryUrl2 = "";
//console.log(typs);
  
 
function initialize() {
    var mapOptions = {
    zoom: 16,
    mapTypeId: google.maps.MapTypeId.ROADMAP,
    };
    map = new google.maps.Map(document.getElementById('map'), mapOptions);
    //HTML5 geolocation
    if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(function(position) {
            pos = new google.maps.LatLng(position.coords.latitude,position.coords.longitude);
            infowindow = new google.maps.InfoWindow({map: map,position: pos,content: "You're Here!"});
           
            // Request from Typs Array
            var request = {location:pos,radius:1000, types:typs};
            map.setCenter(pos);
            infowindow = new google.maps.InfoWindow();
            var service = new google.maps.places.PlacesService(map);
            service.nearbySearch(request,callback);
        }, 
        function() { 
        handleNoGeolocation(true);
        });
    } 
    else {
    handleNoGeolocation(false);
    }
 
   //button click for marker
    $("#cafe").on("click",function(){
        clicker = true;
        initialize();
        typs = [];
        typs.push("cafe");
        console.log("clicked" + "  " + clicker + "" + typs);
    }); 
    $("#restaurants").on("click",function(){
        clicker = true;
        initialize();
        typs= [];
        typs.push("restaurant");
        console.log("clicked" + "  " + clicker + "" + typs);
    }); 
    $("#bars").on("click",function(){
        clicker = true;
        initialize();
        typs = [];
        typs.push("bar");
        console.log("clicked" + "  " + clicker + "" + typs);
    }); 
    function createMarker(place, icon) {
        var placeLoc = place.geometry.location;
        var marker = new google.maps.Marker({
            map: map,
            position: place.geometry.location,
            icon: {
                url: icon,
                scaledSize: new google.maps.Size(10, 10) // pixels
                },
                animation: google.maps.Animation.DROP
            });
            
            google.maps.event.addListener(marker, 'click', function() {
                infowindow.setContent(place.name+ '<br>' +place.vicinity);
                infowindow.open(map, this);
            });
    }
    function cards(number){
        var num = number.toString();
        var card_class = "card-title"+num;
        var card_desc = "card-description"+num;
        id_string = "cards" + num;
        var card_append = $('<div class="card blue-grey darken-1" id="card"'+id_string+'><div class="card-content white-text"><span class='+card_class+'>Card Title</span><section id="card-image"'+id_string+'></section><p class ='+card_desc+'>I am a very simple card.</div></div>');
        $(".card_div").append(card_append);
    }

    function query_switcher(index){
        queryUrl2 = queryUrl + "location=" + address[index] + "&term="+result[index] + "&limit=1";
    }

  //retrieves results
    function callback(results, status) {
        if (status == google.maps.places.PlacesServiceStatus.OK) {
            for (var i = 0; i < results.length; i++) {    
                createMarker(results[i]);
                cards(i);
                //console.log(results[i]);
                result.push(results[i].name);
                address.push(results[i].vicinity);

            queryUrl2 = queryUrl + "location=" + address[1] + "&term="+result[1] + "&limit=1";
            $.ajax({
                method: "GET",
                url: queryUrl2,
                dataType: "json",
                headers: {
                    "Authorization": "Bearer gqqI1WuGp5Wr7QmZmrtJleBqhRGAVHibKExf_CtV2P7CFQ4LJgOI9gOX0zJ_-JdArDZXuvb-1mOFBsDfSoy7Rr9KJqJka3b837KqtJgQbROVBnOpbZSlgyEcKhVKW3Yx",
                }}).then(function (response) {
                    //console.log(response);
                    for(i=0;i<results.length;i++){
                        console.log(results);
                        var card_title = ".card-title" +i.toString();
                        console.log(card_title);
                        var card_description = ".card-description" +i.toString();
                        $(card_title).empty();
                        $(card_title).append(response.businesses[0].name+ " rating: "+response.businesses[0].rating + " closed : "+ response.businesses[0].is_closed);
                        $(card_description).empty();
                        $(card_description).append("contact "+ response.businesses[0].name+ " at " + response.businesses[0].phone);
                        query_switcher(index);
                        console.log(i);
                    }
            })
            }
        }
    }
    
}
//Makes a marker

        
//zomato api
/*$.ajax({
    method: "GET",
    url: queryUrl,
    dataType: "json",
    headers: {
        "user-key": "cf5804bac687763220c3be71ce79923b"
    },
})
*/
//console.log(result);

