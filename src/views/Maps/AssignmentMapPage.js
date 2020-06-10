import React, { useState, useEffect } from "react";
import moment from "moment";

import { KeyboardDatePicker } from "@material-ui/pickers";
import GridItem from "components/Grid/GridItem.js";
import GridContainer from "components/Grid/GridContainer.js";

import gBlack from 'assets/img/maps/g-black.png';
import gBlue from 'assets/img/maps/g-blue.png';
import gBrown from 'assets/img/maps/g-brown.png';
import gGray from 'assets/img/maps/g-gray.png';
import gOrange from 'assets/img/maps/g-orange.png';
import gPurple from 'assets/img/maps/g-purple.png';
import gYellow from 'assets/img/maps/g-yellow.png';
import gPink from 'assets/img/maps/g-pink.png';
import gRed from 'assets/img/maps/g-red.png';
import gLightBlue from 'assets/img/maps/g-lightblue.png';
import gDarkYellow from 'assets/img/maps/g-darkyellow.png';

import gWhite from 'assets/img/maps/g-white.png';
import gGreen from 'assets/img/maps/g-green.png';

// import useMediaQuery from "@material-ui/core/useMediaQuery";
import ApiOrderService from "services/api/ApiOrderService";
import {
  withScriptjs,
  withGoogleMap,
  GoogleMap,
  Marker,
} from "react-google-maps";
import ApiAccountService from "services/api/ApiAccountService";

const urls = {
  'gBlack': gBlack,
  'gBlue': gBlue,
  'gBrown': gBrown,
  'gGray': gGray,
  'gOrange': gOrange,
  'gPurple': gPurple,
  'gYellow': gYellow,
  'gPink': gPink,
  'gRed': gRed,
  'gLightBlue': gLightBlue,
  'gDarkYellow': gDarkYellow,
  // special
  'gWhite': gWhite,
  'gGreen': gGreen
}

// data --- [{ _id, lat, lng, icon }]
// zoom --- 9
// center --- { lat: 43.856098, lng: -79.337021 }
const AssignmentMapPage = withScriptjs(
  withGoogleMap(({ data, zoom, center, googleMapURL, loadingElement, containerElement, mapElement }) => (
    <GoogleMap
      defaultZoom={zoom}
      defaultCenter={center}
      defaultOptions={{
        scrollwheel: true,
        zoomControl: true,
        fullscreenControl: false,
        mapTypeControl: false,
        streetViewControl: false,
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
            key={d.orderId}
            position={{ lat: d.lat, lng: d.lng }}
            icon={{url: urls[d.icon]}}
          />
        )}
    </GoogleMap>
  ))
);

const OrderMapPage = () => {
  // const matches = useMediaQuery('max-width:767px');

  const [markers, setMarkers] = useState([]);
  const [drivers, setDrivers] = useState([]);
  const [deliverDate, setDeliverDate] = useState(moment().toISOString());
  useEffect(() => {
    ApiAccountService.getAccounts({type:'driver', status:'A'}).then(({data}) => {
      setDrivers(data.data);
      const deliverDate = moment().format('YYYY-MM-DD');
      ApiOrderService.getMapMarkers(deliverDate).then(({ data }) => {
  
      });
    });
  }, []);

  const updateMarkers = (deliverDate) => {
    // {markers: [{orderId, lat, lng, type, status, icon}], driverMap:{driverId:{driverId, driverName}} }
    ApiOrderService.getMapMarkers(deliverDate).then(({ data }) => {
      setMarkers(data.data.markers);
    });
  }

  const handleDateChange = (m) => {
    const date = m.format('YYYY-MM-DD');
    setDeliverDate(date);
    updateMarkers(date);
  }

  const KEY = "AIzaSyCEd6D6vc9K-YzMH-QtQWRSs5HZkLKSWyk";
  return (
    <div>

      {/* <GridItem xs={12} lg={12}> */}
      <KeyboardDatePicker
        variant="inline"
        label="Date"
        format="YYYY-MM-DD"
        value={moment.utc(deliverDate)}
        onChange={handleDateChange}
      />
      {/* </GridItem> */}

      <GridContainer>
        <GridItem xs={12} sm={12} md={2}>
          <div className="driverList" style={{ width: '100%', height: '100px' }}>
          {
            drivers.map(d => 
              <div className="leftCol">{d.username}</div>
              // <div className="rightCol">Driver 2</div>
            )
          }
          </div>
        </GridItem>
        <GridItem xs={12} sm={12} md={10}>
          <div style={{ width: '100%', height: '500px', display: 'flex', justifyContent: 'center' }}>
            <OrderMap
              googleMapURL={`https://maps.googleapis.com/maps/api/js?key=${KEY}&v=3.exp&libraries=geometry,drawing,places`}
              loadingElement={<div style={{ height: `100%` }} />}
              containerElement={
                <div style={{ height: "100%", width: `100%` }} />
              }
              mapElement={<div style={{ height: `100%` }} />}
              data={markers}
              zoom={9}
              center={{ lat: 43.856098, lng: -79.337021 }}
              />
          </div>
        </GridItem>
        </GridContainer>
    </div>
      )
    }
    
export default AssignmentMapPage;