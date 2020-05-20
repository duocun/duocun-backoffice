import React, { useState, useEffect } from "react";
// import useMediaQuery from "@material-ui/core/useMediaQuery";
import ApiOrderService from "services/api/ApiOrderService";

import {
  withScriptjs,
  withGoogleMap,
  GoogleMap,
  Marker,
} from "react-google-maps";

// data --- [{ _id, lat, lng, iconUrl }]
// zoom --- 9
// center --- { lat: 43.856098, lng: -79.337021 }
const OrderMap = withScriptjs(
  withGoogleMap(({data, zoom, center, googleMapURL, loadingElement, containerElement, mapElement}) => (
    <GoogleMap
      defaultZoom={zoom}
      defaultCenter={center}
      defaultOptions={{
        scrollwheel: true,
        zoomControl: true,
        fullscreenControl: false,
        mapTypeControl: false,
        streetViewControl:false,
        styles: [
          {
            featureType: "water",
            stylers: [
              { saturation: 43 },
              { lightness: -11 },
              { hue: "#0088ff" },
            ],
          },
          {
            featureType: "road",
            elementType: "geometry.fill",
            stylers: [
              { hue: "#ff0000" },
              { saturation: -100 },
              { lightness: 99 },
            ],
          },
          {
            featureType: "road",
            elementType: "geometry.stroke",
            stylers: [{ color: "#808080" }, { lightness: 54 }],
          },
          {
            featureType: "landscape.man_made",
            elementType: "geometry.fill",
            stylers: [{ color: "#ece2d9" }],
          },
          {
            featureType: "poi.park",
            elementType: "geometry.fill",
            stylers: [{ color: "#ccdca1" }],
          },
          {
            featureType: "road",
            elementType: "labels.text.fill",
            stylers: [{ color: "#767676" }],
          },
          {
            featureType: "road",
            elementType: "labels.text.stroke",
            stylers: [{ color: "#ffffff" }],
          },
          { featureType: "poi", stylers: [{ visibility: "off" }] },
          {
            featureType: "landscape.natural",
            elementType: "geometry.fill",
            stylers: [{ visibility: "on" }, { color: "#b8cb93" }],
          },
          { featureType: "poi.park", stylers: [{ visibility: "on" }] },
          {
            featureType: "poi.sports_complex",
            stylers: [{ visibility: "on" }],
          },
          { featureType: "poi.medical", stylers: [{ visibility: "on" }] },
          {
            featureType: "poi.business",
            stylers: [{ visibility: "simplified" }],
          },
        ],
      }}
    >
      {/* <DrawingManager
        // defaultDrawingMode={window.google.maps.drawing.OverlayType.POLYGON}
        defaultOptions={{
          drawingControl: true,
          drawingControlOptions: {
            position: window.google.maps.ControlPosition.TOP_CENTER,
            drawingModes: [window.google.maps.drawing.OverlayType.POLYGON],
          },
          circleOptions: {
            fillColor: `#ffff00`,
            fillOpacity: 1,
            strokeWeight: 5,
            clickable: false,
            editable: true,
            zIndex: 1,
          },
        }}
        onPolygonComplete ={value => console.log(getPaths(value))}
      /> */}

      {data && data.length > 0 &&
        data.map((d) => 
          <Marker
            key={d._id}
            position={{ lat: d.lat, lng: d.lng }}
          />
      )}
    </GoogleMap>
  ))
);

const OrderMapPage = () => {
  // const matches = useMediaQuery('max-width:767px');

  const [orders, setOrders] = useState([]);

  useEffect(() => {
    ApiOrderService.getMapMarkers().then(({data}) => {

    })
  },[]);


  const KEY = "AIzaSyCEd6D6vc9K-YzMH-QtQWRSs5HZkLKSWyk";
  return (
    <div>
    <div className="driverList" style={{width:'100%', height:'100px'}}>
      <div className="leftCol">Driver 1</div>
      <div className="rightCol">Driver 2</div>
    </div>
    <div style={{width:'100%', height:'500px', display:'flex', justifyContent:'center'}}>
    <OrderMap
      googleMapURL={`https://maps.googleapis.com/maps/api/js?key=${KEY}&v=3.exp&libraries=geometry,drawing,places`}
      loadingElement={<div style={{ height: `100%` }} />}
      containerElement={
        <div style={{ height: "100%", width: `100%` }} />
      }
      mapElement={<div style={{ height: `100%` }} />}
      data={orders}
      zoom={9}
      center={{lat: 43.856098, lng: -79.337021}}
    />
    </div>
    </div>
  )
}

export default OrderMapPage;