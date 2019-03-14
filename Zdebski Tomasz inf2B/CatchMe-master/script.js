let map;
let marker;

//inicjacja mapy
function initMapCallback() {
    let startPosition = {
        lat: 40.7128, 
        lng: -74.0060
    };
    map = new google.maps.Map(
        document.getElementById('mapDiv'), 
        {
            zoom: 16, 
            center: startPosition
        }
    );
    marker = new google.maps.Marker({
        position: startPosition, 
        icon: "img/walk.png",
        map: map
    });
}

//prosba o pozycje
navigator.geolocation.getCurrentPosition(geoSuccess,geoFail,{enableHighAccuracy:true});

//pozycja sciagnieta
function geoSuccess(position){
    marker.setPosition({
        lat: position.coords.latitude,
        lng: position.coords.longitude
    });
    map.panTo({
        lat: position.coords.latitude,
        lng: position.coords.longitude
    });
}

//pozycja odrzucona
function geoFail(error){
    alert(error.message);
}

//marker moving direction [w,a,s,d]
let isMoving = [false,false,false,false];

window.addEventListener("keydown",(e)=>{
    switch(e.key){
        case "w":
        isMoving[0] = true;
        break;
        case "a":
        isMoving[1] = true;
        break;
        case "s":
        isMoving[2] = true;
        break;
        case "d":
        isMoving[3] = true;
        break;
    }
});

window.addEventListener("keyup",(e)=>{
    switch(e.key){
        case "w":
        isMoving[0] = false;
        break;
        case "a":
        isMoving[1] = false;
        break;
        case "s":
        isMoving[2] = false;
        break;
        case "d":
        isMoving[3] = false;
        break;
    }
});

function moveMarker(){
    if(!(isMoving[0]||isMoving[1]||isMoving[2]||isMoving[3]))
        return;

    let pos = {
        lat: marker.getPosition().lat(),
        lng: marker.getPosition().lng()
    };

    if(isMoving[0])
        pos.lat+=0.0001;
    if(isMoving[1])
        pos.lng-=0.00015;
    if(isMoving[2])
        pos.lat-=0.0001;
    if(isMoving[3])
        pos.lng+=0.00015;

    marker.setPosition(pos);
    map.panTo(pos);
}
setInterval(moveMarker,40);