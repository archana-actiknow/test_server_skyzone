import React from 'react';
import { Editor } from '@tinymce/tinymce-react';

const TinyMCEEditor = ({ value, onEditorChange, height }) => {
  const editor_key = process.env.REACT_APP_EDITOR_KEY;
  return (
    <>
    <Editor
      apiKey={editor_key}
      onEditorChange={onEditorChange}
      init={{
        height: height,
        menubar: false,
        plugins:
          "advlist autolink lists link image charmap preview anchor emoticons searchreplace visualblocks code fullscreen insertdatetime media table  help wordcount",
        toolbar:
          "undo redo emoticons | formatselect | bold italic backcolor | alignleft aligncenter alignright alignjustify | bullist numlist outdent indent | removeformat | help ",
        content_style: `
          body {
            font-family: Poppins, sans-serif; /* Change to your desired font family */
            font-size: 13px; /* Change to your desired font size */
          }
        `,
        toolbar_sticky: true,
        skin: "oxide",
      }}
      value={value}
    />

</>
  );
};

export default TinyMCEEditor;