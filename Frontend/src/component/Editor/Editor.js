import React, {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import ReactQuill from "react-quill";
import { useParams } from "react-router-dom";
import {
  RiSave3Line,
  RiCheckLine,
  RiDownload2Line,
  RiUpload2Line,
  RiHome2Line,
} from "react-icons/ri";
import "react-quill/dist/quill.snow.css";
import "./styles.modules.css";
import { useNavigate } from "react-router-dom";
import { marked } from "marked"; // Import 'marked' correctly
import { FiRefreshCcw, FiMinus, FiPlus, FiTrash } from "react-icons/fi";

const Editor = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const [editorValue, setEditorValue] = useState("");
  const [promptValue, setPromptValue] = useState("");
  const [error, setError] = useState(null);
  const [isDocumentUpdated, setIsDocumentUpdated] = useState(false);
  const [isPopupOpen, setIsPopupOpen] = useState(false);
  const [documentTitle, setDocumentTitle] = useState(""); // State to store document title
  const [contextMenu, setContextMenu] = useState({
    visible: false,
    top: 0,
    left: 0,
  });
  const [message, setMessage] = useState("");

  const quill = useRef();

  useEffect(() => {
    const fetchDocument = async (documentId) => {
      const token = localStorage.getItem("auth_token");
      if (!token) {
        console.error("No token found in local storage");
        return;
      }

      try {
        const response = await fetch(
          `http://192.168.0.114:8000/api/documents/${documentId}/`,
          {
            method: "GET",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Token ${token}`,
            },
          }
        );

        if (!response.ok) {
          throw new Error("Failed to fetch document data");
        }

        const data = await response.json();
        setEditorValue(data.content || "");
        setDocumentTitle(data.title || ""); // Update document title from server
      } catch (error) {
        console.error("An error occurred while fetching the document:", error);
        setError("Failed to fetch document. Please try again later.");
      }
    };

    if (id) {
      fetchDocument(id);
    }
  }, [id]);

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

  const handleFinalize = async () => {
    const token = localStorage.getItem("auth_token");
    if (!token) {
      console.error("No token found in local storage");
      return;
    }

    try {
      const response = await fetch(
        `http://192.168.0.114:8000/api/documents/${id}/`,
        {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Token ${token}`,
          },
          body: JSON.stringify({
            status: "final",
            content: editorValue,
          }),
        }
      );

      if (!response.ok) {
        throw new Error("Failed to finalize document");
      }

      // Handle success response
      console.log("Document finalized successfully");
      setIsDocumentUpdated(true);
    } catch (error) {
      console.error("An error occurred while finalizing the document:", error);
      setError("Failed to finalize document. Please try again later.");
    }
  };

  const handleSave = async () => {
    const token = localStorage.getItem("auth_token");
    if (!token) {
      console.error("No token found in local storage");
      return;
    }

    try {
      const response = await fetch(
        `http://192.168.0.114:8000/api/documents/${id}/`,
        {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Token ${token}`,
          },
          body: JSON.stringify({
            status: "draft",
            content: editorValue,
          }),
        }
      );

      if (!response.ok) {
        throw new Error("Failed to save document");
      }

      // Handle success response
      console.log("Document saved successfully");
      setIsPopupOpen(true);
    } catch (error) {
      console.error("An error occurred while saving the document:", error);
      setError("Failed to save document. Please try again later.");
    }
  };

  const generate = async () => {
    if (!promptValue.trim()) {
      setError("Prompt cannot be empty");
      return;
    }

    if (
      editorValue.trim() &&
      !window.confirm(
        "Do you want to continue? It will erase the previous content."
      )
    ) {
      return;
    }

    try {
      const response = await fetch(
        "https://b7cb-2407-d000-d-2495-e9c0-259e-4c55-e69f.ngrok-free.app/generate",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            question: promptValue, // Send the prompt value to the server
          }),
        }
      );

      if (!response.ok) {
        throw new Error("Failed to generate");
      }

      const data = await response.json();
      console.log(data);
      const htmlContent = marked(data); // Convert markdown to HTML
      setEditorValue(htmlContent); // Update the editor value with the generated HTML content
    } catch (error) {
      console.error("An error occurred while generating:", error);
    }
  };
  const summarize = async () => {
    // console.log(editorValue)
    try {
      const response = await fetch(
        "https://1bf9-2407-d000-d-2495-e9c0-259e-4c55-e69f.ngrok-free.app/summarize",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            contract: editorValue, // Send the editor content to the server for summarization
          }),
        }
      );
  
      if (!response.ok) {
        throw new Error("Failed to summarize");
      }
  
      const data = await response.json();
      console.log(data); // Log the summarized data to the console
    } catch (error) {
      console.error("An error occurred while summarizing:", error);
    }
  };
  
  const handleSelectionChange = () => {
    const quillEditor = quill.current.getEditor();
    const selection = quillEditor.getSelection();

    if (selection && selection.length > 0) {
      const bounds = quillEditor.getBounds(selection.index, selection.length);
      const editorBounds = quillEditor.container.getBoundingClientRect();
      setContextMenu({
        visible: true,
        top: editorBounds.top + bounds.bottom + window.scrollY,
        left: editorBounds.left + bounds.left + window.scrollX,
      });
    } else {
      setContextMenu({ visible: false, top: 0, left: 0 });
    }
  };

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
 <div className="header flex justify-between items-center">
        <div className="flex items-center space-x-4">
          <h1 className="space-left header-title">{documentTitle}</h1>
          <div className="flex space-x-4 items-center">
            <div
              className="bg-gray-300 p-2 rounded-full cursor-pointer text-gray-500 hover:bg-gray-200"
              onClick={() => {
                handleSave();
                setIsPopupOpen(true);
              }}
            >
              <RiSave3Line className="h-6 w-6" title="Save" />
            </div>
            <div
              className="bg-gray-300 p-2 rounded-full cursor-pointer text-gray-500 hover:bg-gray-200"
              onClick={() => {
                handleFinalize();
                setIsDocumentUpdated(true);
              }}
            >
              <RiCheckLine className="h-6 w-6" title="Approve" />
            </div>
            <div className="bg-gray-300 p-2 rounded-full cursor-pointer text-gray-500 hover:bg-gray-200">
              <RiUpload2Line className="h-6 w-6" title="Import" />
            </div>
            <div className="bg-gray-300 p-2 rounded-full cursor-pointer text-gray-500 hover:bg-gray-200">
              <RiDownload2Line className="h-6 w-6" title="Export" />
            </div>
          </div>
        </div>
        <div className="bg-gray-300 p-2 rounded-full cursor-pointer text-gray-500 hover:bg-gray-200">
          <RiHome2Line
            className="h-6 w-6"
            onClick={() => navigate("/Dashboard")}
            title="Home"
          />
        </div>
      </div>
      <div className="content">
        <div className="user-prompt">
          <div className="user-prompt-header">
            <h1 className="user-prompt-title">LAW-LLM</h1>
          </div>
          <p className="user-prompt-description text-bold">Request:</p>
          <textarea
            id="prompt"
            value={promptValue}
            onChange={(e) => setPromptValue(e.target.value)}
            rows="10"
            className="user-prompt-textarea ql-editor"
          />
          {error && <div className="text-red-500 text-lg">{error}</div>}

          <div className="text-center mt-4">
            <button onClick={generate} className="generate-button">
              Generate
            </button>
          </div>

          <div className="text-center mt-4">
            <button onClick={summarize} className="generate-button">
              Summarize this Document
            </button>
          </div>

          <div className="text-center mt-4">
            <button  className="generate-button">
              Add New Clause
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
            onChangeSelection={handleSelectionChange}
          />
          {contextMenu.visible && (
            <div
              className="context-menu"
              style={{ top: contextMenu.top, left: contextMenu.left }}
            >
              <input
                type="text"
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                className="w-full p-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              <button className="flex items-center space-x-1">
                <FiRefreshCcw />
                <span className="ml-1">Regenerate</span>
              </button>
              <button className="flex items-center space-x-1">
                <FiMinus />
                <span className="ml-1">Shorter</span>
              </button>
              <button className="flex items-center space-x-1">
                <FiPlus />
                <span className="ml-1">Longer</span>
              </button>
              <button className="flex items-center space-x-1">
                <FiTrash />
                <span className="ml-1">Remove</span>
              </button>
            </div>
          )}
        </div>
      </div>
      {isDocumentUpdated && (
        <div className="popup">
          <div className="popup-content">
            <p>Document updated successfully</p>
            <button onClick={() => setIsDocumentUpdated(false)}>OK</button>
          </div>
        </div>
      )}
      {isPopupOpen && (
        <div className="popup">
          <div className="popup-content">
            <p>Content saved</p>
            <button onClick={() => setIsPopupOpen(false)}>OK</button>
          </div>
        </div>
      )}
    </div>
  );
};

export default Editor;
