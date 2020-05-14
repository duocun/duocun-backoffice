import React, { useState } from "react";
// @material-ui/core components
import { makeStyles } from "@material-ui/core/styles";
// core components
import GridItem from "components/Grid/GridItem.js";
import GridContainer from "components/Grid/GridContainer.js";
import Table from "components/Table/Table.js";
import Card from "components/Card/Card.js";
import CardHeader from "components/Card/CardHeader.js";
import CardBody from "components/Card/CardBody.js";

import * as uuid from 'uuid';
import ApiService from "services/api/ApiService";

const styles = {
  cardCategoryWhite: {
    "&,& a,& a:hover,& a:focus": {
      color: "rgba(255,255,255,.62)",
      margin: "0",
      fontSize: "14px",
      marginTop: "0",
      marginBottom: "0"
    },
    "& a,& a:hover,& a:focus": {
      color: "#FFFFFF"
    }
  },
  cardTitleWhite: {
    color: "#FFFFFF",
    marginTop: "0px",
    minHeight: "auto",
    fontWeight: "300",
    fontFamily: "'Roboto', 'Helvetica', 'Arial', sans-serif",
    marginBottom: "3px",
    textDecoration: "none",
    "& small": {
      color: "#777",
      fontSize: "65%",
      fontWeight: "400",
      lineHeight: "1"
    }
  }
};

const useStyles = makeStyles(styles);

export default function TableList() {
  const classes = useStyles();
  const [fname, setFileName] = useState('');
  const size = {};
  const uploadUrl = '/files/upload';

  const onFileChange = (event) => {
    const image = new Image();
    const reader = new FileReader();
    if (event.target.files && event.target.files.length > 0) {
      const file = event.target.files[0];

      image.onload = function (imageEvent) {
        const blob = getBlob(image, 'sm'); // type:x, size:y
        const picFile = new File([blob], file.name);
        const ext = file.name.split('.').pop();
        const fname = uuid.v4();
        postFile(uploadUrl, fname, ext, picFile).then((x) => {
          setFileName(fname + '.' + ext);
          // if (x) {
          //   self.afterUpload.emit({
          //     fname: fname + '.' + ext,
          //     file: picFile
          //   });
          // } else {
          //   // self.snackBar.open('', 'upload file failed.', { duration: 1000 });
          // }
        });
      };

      reader.onload = (readerEvent) => {
        // use for trigger image.onload event
        image.src = readerEvent.target.result;
      };

      reader.readAsDataURL(file);
    }
  }

  // ---------------------------------------------------------------------
  // url --- api/files/upload
  // file --- { name:x, size:y, type: z }
  const postFile = (url, fname, ext, file) => {
    const formData = new FormData();
    formData.append('fname', fname);
    formData.append('ext', ext);
    formData.append('file', file);
    return ApiService.v2().postV2(url, formData);
  }

  const dataURLToBlob = (dataURL) => {
    const BASE64_MARKER = ';base64,';
    if (dataURL.indexOf(BASE64_MARKER) === -1) {
      const parts = dataURL.split(',');
      const contentType = parts[0].split(':')[1];
      const raw = parts[1];

      return new Blob([raw], { type: contentType });
    } else {
      const parts = dataURL.split(BASE64_MARKER);
      const contentType = parts[0].split(':')[1];
      const raw = window.atob(parts[1]);
      const rawLength = raw.length;

      const uInt8Array = new Uint8Array(rawLength);

      for (let i = 0; i < rawLength; ++i) {
        uInt8Array[i] = raw.charCodeAt(i);
      }
      return new Blob([uInt8Array], { type: contentType });
    }
  }

  // scale image inside frame
  const resizeImage = (frame_w, frame_h, w, h) => {
    return { 'w': Math.round(frame_w), 'h': Math.round(frame_h), 'padding_top': 0 };
  }

  const getBlob = (image, size = 'sm') => {
    const canvas = document.createElement('canvas');
    if (size === 'sm') {
      const d = resizeImage(480, 360, image.width, image.height);
      canvas.width = d.w;
      canvas.height = d.h;
    } else if (size === 'lg') {
      const d = resizeImage(480, 360, image.width, image.height);
      canvas.width = d.w;
      canvas.height = d.h;
    } else {
      const d = resizeImage(480, 360, image.width, image.height);
      canvas.width = image.width;
      canvas.height = image.height;
    }
    canvas.getContext('2d').drawImage(image, 0, 0, canvas.width, canvas.height);
    const dataUrl = canvas.toDataURL('image/jpeg');
    return dataURLToBlob(dataUrl);
  }


  return (
    <GridContainer>
      <GridItem xs={12} sm={12} md={12}>
        {fname}
        <input type="file" onChange={onFileChange} />
      </GridItem>
      <GridItem xs={12} sm={12} md={12}>
        <Card>
          <CardHeader color="primary">
            <h4 className={classes.cardTitleWhite}>Simple Table</h4>
            <p className={classes.cardCategoryWhite}>
              Here is a subtitle for this table
            </p>
          </CardHeader>
          <CardBody>
            <Table
              tableHeaderColor="primary"
              tableHead={["Name", "Country", "City", "Salary"]}
              tableData={[
                ["Dakota Rice", "Niger", "Oud-Turnhout", "$36,738"],
                ["Minerva Hooper", "Curaçao", "Sinaai-Waas", "$23,789"],
                ["Sage Rodriguez", "Netherlands", "Baileux", "$56,142"],
                ["Philip Chaney", "Korea, South", "Overland Park", "$38,735"],
                ["Doris Greene", "Malawi", "Feldkirchen in Kärnten", "$63,542"],
                ["Mason Porter", "Chile", "Gloucester", "$78,615"]
              ]}
            />
          </CardBody>
        </Card>
      </GridItem>
      <GridItem xs={12} sm={12} md={12}>
        <Card plain>
          <CardHeader plain color="primary">
            <h4 className={classes.cardTitleWhite}>
              Table on Plain Background
            </h4>
            <p className={classes.cardCategoryWhite}>
              Here is a subtitle for this table
            </p>
          </CardHeader>
          <CardBody>
            <Table
              tableHeaderColor="primary"
              tableHead={["ID", "Name", "Country", "City", "Salary"]}
              tableData={[
                ["1", "Dakota Rice", "$36,738", "Niger", "Oud-Turnhout"],
                ["2", "Minerva Hooper", "$23,789", "Curaçao", "Sinaai-Waas"],
                ["3", "Sage Rodriguez", "$56,142", "Netherlands", "Baileux"],
                [
                  "4",
                  "Philip Chaney",
                  "$38,735",
                  "Korea, South",
                  "Overland Park"
                ],
                [
                  "5",
                  "Doris Greene",
                  "$63,542",
                  "Malawi",
                  "Feldkirchen in Kärnten"
                ],
                ["6", "Mason Porter", "$78,615", "Chile", "Gloucester"]
              ]}
            />
          </CardBody>
        </Card>
      </GridItem>
    </GridContainer>
  );
}
