import React, { useState, useEffect, useCallback } from "react";

import { connect } from "react-redux";
import moment from "moment";
import { Link } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { makeStyles } from "@material-ui/core/styles";
import { KeyboardDatePicker } from "@material-ui/pickers";
import GridItem from "components/Grid/GridItem.js";
import GridContainer from "components/Grid/GridContainer.js";
import { DrawingManager } from "react-google-maps/lib/components/drawing/DrawingManager";

import ApiOrderService, { OrderStatus } from "services/api/ApiOrderService";
import ApiAssignmentService from "services/api/ApiAssignmentService";
import useViewportDimensions from "helper/useViewportDimensions";

import gBlack from "assets/img/maps/g-black.png";
import gBlue from "assets/img/maps/g-blue.png";
import gBrown from "assets/img/maps/g-brown.png";
import gGray from "assets/img/maps/g-gray.png";
import gOrange from "assets/img/maps/g-orange.png";
import gPurple from "assets/img/maps/g-purple.png";
import gYellow from "assets/img/maps/g-yellow.png";
import gPink from "assets/img/maps/g-pink.png";
import gLightBlue from "assets/img/maps/g-lightblue.png";
import gDarkYellow from "assets/img/maps/g-darkyellow.png";
import gLightGreen from "assets/img/maps/g-lightgreen.png";

import gRed from "assets/img/maps/g-red.png";
import gGreen from "assets/img/maps/g-green.png";

// import useMediaQuery from "@material-ui/core/useMediaQuery";
import {
  withScriptjs,
  withGoogleMap,
  GoogleMap,
  Marker,
  Polyline
  // MarkerWithLabel
} from "react-google-maps";

import ApiAccountService from "services/api/ApiAccountService";
import { setDeliverDate } from "redux/actions/order";

const useStyles = makeStyles({
  page: {
    height: "100%"
  }
});


export const UNASSIGNED_DRIVER_ID = "unassigned";
export const UNASSIGNED_DRIVER_NAME = "Unassigned";

const N_COLORS = 11;
const COLOR_MAP = {
  gBlack: { url: gBlack, val: "#000000" },
  gBlue: { url: gBlue, val: "#0000ff" },
  gBrown: { url: gBrown, val: "#a52a2a" },
  gLightGreen: { url: gLightGreen, val: "#7fffd4" },
  gOrange: { url: gOrange, val: "#ff4500" },
  gPurple: { url: gPurple, val: "#663399" },
  gYellow: { url: gYellow, val: "#ffff00" },
  gPink: { url: gPink, val: "#ff69b4" },
  gLightBlue: { url: gLightBlue, val: "#add8e6" },
  gDarkYellow: { url: gDarkYellow, val: "#daa520" },
  gGray: { url: gGray, val: "#a9a9a9" },
  // special
  gRed: { url: gRed, val: "#ff0000" },
  gGreen: { url: gGreen, val: "#000" }
};

// data --- [{ _id, lat, lng, icon }]
// zoom --- 9
// center --- { lat: 43.856098, lng: -79.337021 }
const OrderMap = withScriptjs(
  withGoogleMap(
    ({
      lines,
      markers,
      zoom,
      center,
      onPolygonComplete,
      onOverlayComplete,
      onReloadMarkers,
      googleMapURL,
      loadingElement,
      containerElement,
      mapElement
    }) => (
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
                { hue: "#0088ff" }
              ]
            },
            {
              featureType: "road",
              elementType: "geometry.fill",
              stylers: [
                { hue: "#ff0000" },
                { saturation: -100 },
                { lightness: 99 }
              ]
            },
            {
              featureType: "road",
              elementType: "geometry.stroke",
              stylers: [{ color: "#808080" }, { lightness: 54 }]
            },
            {
              featureType: "landscape.man_made",
              elementType: "geometry.fill",
              stylers: [{ color: "#ece2d9" }]
            },
            {
              featureType: "poi.park",
              elementType: "geometry.fill",
              stylers: [{ color: "#ccdca1" }]
            },
            {
              featureType: "road",
              elementType: "labels.text.fill",
              stylers: [{ color: "#767676" }]
            },
            {
              featureType: "road",
              elementType: "labels.text.stroke",
              stylers: [{ color: "#ffffff" }]
            },
            { featureType: "poi", stylers: [{ visibility: "off" }] },
            {
              featureType: "landscape.natural",
              elementType: "geometry.fill",
              stylers: [{ visibility: "on" }, { color: "#b8cb93" }]
            },
            { featureType: "poi.park", stylers: [{ visibility: "on" }] },
            {
              featureType: "poi.sports_complex",
              stylers: [{ visibility: "on" }]
            },
            { featureType: "poi.medical", stylers: [{ visibility: "on" }] },
            {
              featureType: "poi.business",
              stylers: [{ visibility: "simplified" }]
            }
          ]
        }}
      >
        <DrawingManager
          // defaultDrawingMode={window.google.maps.drawing.OverlayType.POLYGON}
          defaultOptions={{
            drawingControl: true,
            drawingControlOptions: {
              position: window.google.maps.ControlPosition.TOP_CENTER,
              drawingModes: [window.google.maps.drawing.OverlayType.POLYGON]
            },
            circleOptions: {
              fillColor: `#ffff00`,
              fillOpacity: 1,
              strokeWeight: 5,
              clickable: false,
              editable: true,
              zIndex: 1
            }
          }}
          onOverlayComplete={onOverlayComplete}
          onPolygonComplete={onPolygonComplete}
        />

        {markers && markers.length > 0 &&
          markers.map(d => (
            <Marker
              key={d.orderId}
              position={{ lat: d.lat, lng: d.lng }}
              icon={{
                url:
                  d.icon === "gRed"
                    ? gRed
                    : d.icon === "gGreen"
                      ? gGreen
                      : COLOR_MAP[d.icon].url
              }}
              label={{ text: d.clientName, fontSize: "11px" }}
            // labelAnchor={{ x: 30 , y: 80 }}
            // labelStyle={{
            //   marginLeft: '30px',
            //   paddingLeft: '50px'
            // }}
            />
          ))}
        {lines &&
          lines.length > 0 &&
          lines.map(line => {
            return line.driverId !== 'unassigned' && (
              <Polyline
                key={line.driverId}
                path={line.route}
                geodesic={true}
                options={{
                  strokeColor: line.color,
                  strokeOpacity: 0.75,
                  strokeWeight: 2,
                  icons: [
                    {
                      // icon: lineSymbol,
                      offset: "0",
                      repeat: "20px"
                    }
                  ]
                }}
              />
            )
          })}
      </GoogleMap>
    )
  )
);

const OrderMapPage = ({ deliverDate, setDeliverDate }) => {
  const { t } = useTranslation();
  const classes = useStyles();
  const { height } = useViewportDimensions();
  const [markers, setMarkers] = useState([]);
  const [drivers, setDrivers] = useState([]);
  const [overlays, setOverlays] = useState([]);
  const [bounds, setBounds] = useState([]);
  const [lines, setLines] = useState([]);
  const [assignments, setAssignments] = useState([]);

  const updateDriverListFromAssignments = useCallback((assignments, drivers) => {
    const driverMap = getDriverMap(assignments);
    return updateDriverDuty(driverMap, drivers);
  }, []);

  const getMarkerIcon = (marker, colorMap) => {
    if (marker.driverId === UNASSIGNED_DRIVER_ID) {
      return 'gRed';
    } else if (marker.status === OrderStatus.DONE) {
      return 'gGreen';
    } else if (colorMap[marker.driverId]) {
      return colorMap[marker.driverId];
    } else {
      return 'gRed'; // fix me
    }
  }

  const updateMarkers = useCallback((deliverDate, drivers, assignments) => {
    // {markers: [{orderId, lat, lng, type, status, icon}], driverMap:{driverId:{driverId, driverName}} }
    ApiOrderService.getAutoRoutes(deliverDate).then(({ data }) => {
      const routes = data ? data.data.routes : [];
      const colorMap = getColorMap(drivers);
      if (assignments) {
        assignments.forEach(marker => {
          marker.icon = getMarkerIcon(marker, colorMap);
        });

        setMarkers(assignments);
        if (routes && routes.length > 0 && drivers && drivers.length > 0) {
          routes.forEach(r => {
            const driverId = r.driverId;
            const driver = drivers.find(d => d._id === driverId);
            const colorId = driver ? driver.colorId : "gRed";
            r.color = COLOR_MAP[colorId].val;
          });
        }
        setLines(routes);
      }
    });
  }, []);

  useEffect(() => {
    const q = deliverDate ? { deliverDate } : {};
    ApiAssignmentService.getAssignments(q).then(({ data }) => {
      const assignments = data.data;
      ApiAccountService.getAccounts({ type: "driver", status: "A" }).then(
        ({ data }) => {
          let i = 0;
          let colorIds = Object.keys(COLOR_MAP);
          data.data.forEach(d => {
            const index = i % N_COLORS;
            const colorId = colorIds[index];
            const url = COLOR_MAP[colorId].url;
            d.colorId = colorId;
            d.url = url;
            i++;
          });

          const drivers = updateDriverListFromAssignments(assignments, data.data);

          setAssignments(assignments);
          setDrivers(drivers);
          // setLines(routes);
          if (!deliverDate) {
            const date = moment().format("YYYY-MM-DD");
            setDeliverDate(date);
            updateMarkers(date, drivers, assignments);
          } else {
            updateMarkers(deliverDate, drivers, assignments);
          }
        }
      );
    });
  }, [deliverDate, setDeliverDate, updateMarkers, updateDriverListFromAssignments]);

  const getDriverMap = assignments => {
    const driverMap = {};
    assignments.forEach(a => {
      const driverId = a.driverId
        ? a.driverId.toString()
        : UNASSIGNED_DRIVER_ID;
      const driverName = a.driverName ? a.driverName : UNASSIGNED_DRIVER_NAME;
      driverMap[driverId] = { driverId, driverName };
    });
    return driverMap;
  };

  const getColorMap = drivers => {
    let colorMap = {};
    drivers.forEach(d => {
      colorMap[d._id] = d.colorId;
    });
    return colorMap;
  };

  // driverMapFromAssignment
  const updateDriverDuty = (driverMapFromAssignment, drivers) => {
    const onDutyDriverIds = Object.keys(driverMapFromAssignment);

    drivers.forEach(d => {
      const onDuty = onDutyDriverIds.find(id => id === d._id);
      d.onDuty = onDuty ? true : false;
    });
    return drivers;
  };

  const handleDateChange = m => {
    const date = m.format("YYYY-MM-DD");
    setDeliverDate(date);
    ApiAssignmentService.getAssignments({ deliverDate: date }).then(
      ({ data }) => {
        const assignments = data.data;
        setAssignments(assignments);
        const ds = updateDriverListFromAssignments(assignments, drivers);
        setDrivers(ds);

        updateMarkers(date, ds, assignments);
      }
    );
  };

  function getBounds(polygon) {
    const polygonBounds = polygon.getPath();
    const bounds = [];
    for (let i = 0; i < polygonBounds.length; i++) {
      const point = {
        lat: polygonBounds.getAt(i).lat(),
        lng: polygonBounds.getAt(i).lng()
      };
      bounds.push(point);
    }
    return bounds;
  }

  function inPolygon(point, vs) {
    // ray-casting algorithm based on
    // http://www.ecse.rpi.edu/Homepages/wrf/Research/Short_Notes/pnpoly.html

    const x = point.lat,
      y = point.lng;

    let inside = false;
    for (let i = 0, j = vs.length - 1; i < vs.length; j = i++) {
      let xi = vs[i].lat,
        yi = vs[i].lng;
      let xj = vs[j].lat,
        yj = vs[j].lng;

      let intersect = ((yi > y) !== (yj > y))
        && (x < (xj - xi) * (y - yi) / (yj - yi) + xi);

      if (intersect) inside = !inside;
    }

    return inside;
  }

  const handlePolygonComplete = polygon => {
    const points = getBounds(polygon);
    setBounds(points);
    setOverlays([...overlays, polygon]);
  };

  const handleOverlayComplete = e => {
    // const overlay = e.overlay;
    // setOverlays([...overlays, overlay]);
  };

  const handleAssign = driver => {
    const driverId = driver._id;
    const driverName = driver.username;

    if (!bounds) {
      return;
    }
    const r = window.confirm(`确认把已选区域分给司机${driver.username}?`);

    if (r) {
      const orderIdMap = {};
      const orderIds = [];
      markers.forEach(m => {
        if (inPolygon({ lat: m.lat, lng: m.lng }, bounds)) {
          orderIdMap[m.orderId] = true;
          orderIds.push(m.orderId);
        }
      });
      overlays.forEach(overlay => {
        overlay.setMap(null);
      });
      setBounds(null);

      const cloned = assignments && assignments.length > 0 ? [...assignments] : [];

      cloned.forEach(assignment => {
        // { orderId, lat, lng, type, status, driverId, driverName, clientName }
        if (orderIdMap[assignment.orderId]) {
          assignment.driverId = driverId;
          assignment.driverName = driverName;
        }
      });
      setAssignments(cloned);

      ApiAssignmentService.updateAssignments(deliverDate, cloned).then(
        ({ data }) => {
          updateMarkers(deliverDate, drivers, cloned);
          const ds = updateDriverListFromAssignments(assignments, drivers);
          setDrivers(ds);
        }
      );
    }
  };

  const KEY = "AIzaSyCpOl3ou-sgPg5vfHQO0jWXkS1gJ4SDg8M";

  return (
    <div className={classes.page}>
      {/* <GridItem xs={12} lg={12}> */}
      <KeyboardDatePicker
        variant="inline"
        label={`${t("Deliver Date")}`}
        format="YYYY-MM-DD"
        value={moment.utc(deliverDate)}
        InputLabelProps={{
          shrink: deliverDate ? true : false
        }}
        onChange={handleDateChange}
      />
      {/* </GridItem> */}

      <GridContainer>
        <GridItem xs={12} sm={12} md={3}>
          <div
            className="driverList"
            style={{ width: "100%", height: "100px" }}
          >
            <div className="leftCol">
              <div style={{ width: "80%", float: "left" }}>未分配</div>
              <div style={{ width: "20%", float: "left" }}>
                <img src={gRed} alt="unassigned" />
              </div>
            </div>
            <div
              className="leftCol"
              style={{ borderBottom: "1px solid #aaaaaa" }}
            >
              <div style={{ width: "80%", float: "left" }}>已完成</div>
              <div style={{ width: "20%", float: "left" }}>
                <img src={gGreen} alt="finished" />
              </div>
            </div>
            {drivers.map(
              d => {
                const driverLines = lines.find((l) => l.driverId === d._id);
                const routes = driverLines ? driverLines.route : [];
                const data = [];
                routes.forEach((r) => {
                  const index = data.findIndex((d) => d.lat === r.lat && d.lng === r.lng);
                  if (index < 0) {
                    data.push(r);
                  }
                });
                const count = driverLines ? data.length - 1 : 0;
                return (
                  <div className="leftCol" key={d._id}>
                    <div
                      style={{ width: "50%", float: "left" }}
                      onClick={() => handleAssign(d)}
                    >
                      {d.username} ({count})
                      </div>
                    <div style={{ width: "10%", float: "left" }}>
                      <img src={d.url} alt="assigned" />
                    </div>
                    {d.onDuty && (
                      <Link
                        to={`../dashboard/pickup/${d._id}`}
                        style={{ width: "20%", float: "left", fontSize: "12px" }}
                      >
                        查看提货
                      </Link>
                    )}
                    {d.onDuty && (
                      <Link
                        to={`../dashboard/pickup-by-order/${d._id}`}
                        style={{ width: "20%", float: "left", fontSize: "12px" }}
                      >
                        查看按单提货
                      </Link>
                    )}
                  </div>
                )
              }
              // <div className="rightCol">Driver 2</div>
            )}
          </div>
        </GridItem>
        <GridItem xs={12} sm={12} md={9}>
          <div
            style={{
              width: "100%",
              height: `${height - 128}px`,
              display: "flex",
              justifyContent: "center"
            }}
          >
            <OrderMap
              googleMapURL={`https://maps.googleapis.com/maps/api/js?key=${KEY}&v=3.exp&libraries=geometry,drawing,places`}
              loadingElement={<div style={{ height: `100%` }} />}
              containerElement={
                <div style={{ height: "100%", width: `100%` }} />
              }
              mapElement={<div style={{ height: `100%` }} />}
              markers={markers}
              lines={lines}
              zoom={9}
              center={{ lat: 43.856098, lng: -79.337021 }}
              onPolygonComplete={handlePolygonComplete}
              onOverlayComplete={handleOverlayComplete}
            // onReloadMarkers={reloadMarkers}
            />
          </div>
        </GridItem>
      </GridContainer>
    </div>
  );
};

const mapStateToProps = state => ({
  deliverDate: state.deliverDate
});

export default connect(
  mapStateToProps,
  {
    setDeliverDate
  }
)(OrderMapPage);
