import { useCallback, useMemo, useRef, useState } from "react";
import ReactQuill from "react-quill";
import { marked } from "marked";

import "react-quill/dist/quill.snow.css";
import styles from "./styles.modules.css";

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
  }, []);

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
    <div className={styles.MyEditor}>
      <div className="bg-purple-500 flex justify-center items-center pb-3 pt-3">
        <h1 className="text-3xl font-bold text-white">Forms Editor</h1>
      </div>
      <div className="flex">
        <div className="w-1/4 bg-white p-6 shadow-lg rounded-lg h-screen fixed overflow-y-auto">
          <div className="mb-4">
            <div className="bg-purple-500 flex justify-center items-center pb-3 pt-3 mb-3">
              <h1 className="text-2xl font-bold text-white">User Prompt</h1>
            </div>
            <textarea
              id="prompt"
              value={promptValue}
              onChange={(e) => setPromptValue(e.target.value)}
              rows="10"
              className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Enter your prompt here..."
            ></textarea>
          </div>
          <div className="space-y-2">
            <button
              onClick={handler}
              className="w-full bg-purple-500 text-white py-2 px-4 rounded-lg hover:bg-purple-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              Generate
            </button>
            <button
              className="w-full bg-red-500 text-white py-2 px-4 rounded-lg hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-500"
            >
              Cancel
            </button>
            <button
              className="w-full bg-green-500 text-white py-2 px-4 rounded-lg hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-500"
            >
              Finalize
            </button>
          </div>
        </div>
        <div className="w-3/4 ml-auto bg-white p-6 shadow-lg rounded-lg">
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
