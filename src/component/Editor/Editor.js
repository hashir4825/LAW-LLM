import { useCallback, useMemo, useRef, useState } from "react";
import ReactQuill from "react-quill";
import { marked } from "marked";

import "react-quill/dist/quill.snow.css";
import "./styles.modules.css";

const Editor = () => {
  const [editorValue, setEditorValue] = useState("");
  const [promptValue, setPromptValue] = useState("");

  const quill = useRef();

  const markdownData = `
  # Sample Form
  # Section 1
  **Question 1:** Describe your experience with React.
  - **Question 2:** How do you manage state in React applications?
  
  **Section 2**
  - **Question 1:** What are your thoughts on server-side rendering?
  - **Question 2:** Explain the difference between CSS-in-JS and traditional CSS.
  `;

  useMemo(() => {
    const htmlData = marked(markdownData);
    setEditorValue(htmlData);
  }, [markdownData]);

  const handler = () => {
    console.log(editorValue);
  };

  const imageHandler = useCallback(() => {
    const input = document.createElement("input");
    input.setAttribute("type", "file");
    input.setAttribute("accept", "image/*");
    input.click();

    input.onchange = () => {
      const file = input.files[0];
      const reader = new FileReader();

      reader.onload = () => {
        const imageUrl = reader.result;
        const quillEditor = quill.current.getEditor();

        const range = quillEditor.getSelection(true);
        quillEditor.insertEmbed(range.index, "image", imageUrl, "user");
      };

      reader.readAsDataURL(file);
    };
  }, []);

  const modules = useMemo(
    () => ({
      toolbar: {
        container: [
          [{ header: [2, 3, 4, false] }],
          ["bold", "italic", "underline", "blockquote"],
          [{ color: [] }],
          [
            { list: "ordered" },
            { list: "bullet" },
            { indent: "-1" },
            { indent: "+1" },
          ],
          ["link", "image"],
          ["clean"],
        ],
        handlers: {
          image: imageHandler,
        },
      },
      clipboard: {
        matchVisual: true,
      },
    }),
    [imageHandler]
  );

  const formats = [
    "header",
    "bold",
    "italic",
    "underline",
    "strike",
    "blockquote",
    "list",
    "bullet",
    "indent",
    "link",
    "image",
    "color",
    "clean",
  ];

  return (
    <div className="my-editor">
      <div className="header">
        <h1 className="header-title">Forms Editor</h1>
        <button
              className="finalize-button"
            >
              Finalize
            </button>
      </div>
      <div className="content">
        <div className="user-prompt">
          <div className="user-prompt-header">
            <h1 className="user-prompt-title">LAW-LLM</h1>
          </div>
          <p className="user-prompt-description text-bold">
          Prompt Below:
            </p> 
              
          <textarea
            id="prompt"
            value={promptValue}
            onChange={(e) => setPromptValue(e.target.value)}
            rows="10"
            className="user-prompt-textarea ql-editor"
            placeholder="Enter your prompt here..."
          ></textarea>
          <div className="user-prompt-buttons">
            <button
              onClick={handler}
              className="generate-button"
            >
              Generate
            </button>
            <button
              className="cancel-button"
            >
              Cancel
            </button>
          </div>
        </div>
        <div className="editor-container">
          <ReactQuill
            ref={(el) => (quill.current = el)}
            theme="snow"
            value={editorValue}
            onChange={setEditorValue}
            formats={formats}
            modules={modules}
          />
        </div>
      </div>
    </div>
  );
};

export default Editor;
