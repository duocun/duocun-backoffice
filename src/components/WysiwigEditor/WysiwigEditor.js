import React from "react";
import PropTypes from "prop-types";
import CKEditor from "@ckeditor/ckeditor5-react";
import CustomEditor from "@bravemaster619/ckeditor5-custom-build/build/ckeditor";

export default function WysiwigEditor({ initialValue, onChange }) {
  return (
    <CKEditor
      editor={CustomEditor}
      data={initialValue}
      config={{
        toolbar: {
          items: [
            "heading",
            "|",
            "bold",
            "italic",
            "link",
            "bulletedList",
            "numberedList",
            "|",
            "indent",
            "outdent",
            "|",
            "alignment",
            "fontColor",
            "fontBackgroundColor",
            "fontSize",
            "fontFamily",
            "|",
            "imageUpload",
            "blockQuote",
            "insertTable",
            "mediaEmbed",
            "undo",
            "redo"
          ]
        },
        language: "zh",
        image: {
          toolbar: [
            "imageTextAlternative",
            "imageStyle:full",
            "imageStyle:side"
          ]
        },
        table: {
          contentToolbar: ["tableColumn", "tableRow", "mergeTableCells"]
        },
        licenseKey: ""
      }}
      onChange={onChange}
    />
  );
}

WysiwigEditor.propTypes = {
  initialValue: PropTypes.string,
  onChange: PropTypes.func
};
