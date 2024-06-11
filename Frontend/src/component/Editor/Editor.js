import {API_BASE_URL} from "../../config";
import {ip} from "../../config";
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
  const [message, setMessage] = useState("");
  const [summarizedContent, setSummarizedContent] = useState(""); // State to store the summarized content
  const [isPopupOpenforSumamry, setIsPopupOpenforSumamry] = useState(false);



  const selectionRangeRef = useRef(null);

  const [selectedText, setSelectedText] = useState('');
  const [buttonPosition, setButtonPosition] = useState({ x: 0, y: 0 });
  const [showButton, setShowButton] = useState(false);
  const [showDropdown, setShowDropdown] = useState(false);
  const [inputtext, setInputText] = useState('');

  const handleMouseUp = (event) => {

    const selection = window.getSelection();
    const selectedText = selection.toString();

    if (selectedText) {

      setSelectedText(selectedText);
      const range = selection.getRangeAt(0).cloneRange();
      const rect = range.getBoundingClientRect();
      setButtonPosition({ x: rect.right, y: rect.bottom });
      setShowButton(true);

    } else {

      setShowButton(false);
      setInputText('');
      setSelectedText('');
      setShowDropdown(false);

    }
  };

  const handleButtonClick = () => {
    setShowDropdown(!showDropdown);
  };

  const handleInputChange = (event) => {
    setInputText(event.target.value);
  }

  const handlemouseup = (e) => {
    e.stopPropagation();
  }

  const handleReplaceText = () => {
    if (selectedText) {
      const updatedText = editorValue.replace(selectedText, "");
      setEditorValue(updatedText);
      setShowDropdown(false);
      setShowButton(false);
      setInputText('');
      setSelectedText('');
    }
  };



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
          `${ip}/api/documents/${documentId}/`,
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
        `${ip}/api/documents/${id}/`,
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
        `${ip}/api/documents/${id}/`,
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
        `${API_BASE_URL}/generate`,
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
      console.log("Hello");

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
    try {
      const response = await fetch(
        `${API_BASE_URL}/summarize`,
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
      setSummarizedContent(data); // Update the state with the summarized content
      setIsPopupOpenforSumamry(true); // Open the popup to display the summarized content
    } catch (error) {
      console.error("An error occurred while summarizing:", error);
    }
  };

  const regenerate = async () => {
    try {
      const response = await fetch(
        `${API_BASE_URL}/regenerate`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            text: selectedText, // Send the selected content to the server for regeneration
            prompt : inputtext   
          }),
        }
      );
  
      if (!response.ok) {
        throw new Error("Failed to regenerate");
      }
  
      const data = await response.json();
      console.log(data);
      if (data) {
        const updatedText = editorValue.replace(selectedText, data);
        setEditorValue(updatedText);
        setShowDropdown(false);
        setShowButton(false);
        setInputText('');
        setSelectedText('');
      }
      // setRegeneratedContent(data); // Update the state with the regenerated content
    } catch (error) {
      console.error("An error occurred while regenerating:", error);
    }

  };
  
  const longer = async () => {
    try {
      const response = await fetch(
        `${API_BASE_URL}/longer`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            text: selectedText, // Send the selected content to the server for regeneration
            prompt : inputtext   
          }),
        }
      );
  
      if (!response.ok) {
        throw new Error("Failed to regenerate");
      }
  
      const data = await response.json();
      console.log(data);
      if (data) {
        const updatedText = editorValue.replace(selectedText, data);
        setEditorValue(updatedText);
        setShowDropdown(false);
        setShowButton(false);
        setInputText('');
        setSelectedText('');
      }
      // setRegeneratedContent(data); // Update the state with the regenerated content
    } catch (error) {
      console.error("An error occurred while regenerating:", error);
    }

  };
  const shorter = async () => {
    try {
      const response = await fetch(
        `${API_BASE_URL}/shorten`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            text: selectedText, // Send the selected content to the server for regeneration
            prompt : inputtext   
          }),
        }
      );
  
      if (!response.ok) {
        throw new Error("Failed to regenerate");
      }
  
      const data = await response.json();
      console.log(data);
      if (data) {
        const updatedText = editorValue.replace(selectedText, data);
        setEditorValue(updatedText);
        setShowDropdown(false);
        setShowButton(false);
        setInputText('');
        setSelectedText('');
      }
      // setRegeneratedContent(data); // Update the state with the regenerated content
    } catch (error) {
      console.error("An error occurred while regenerating:", error);
    }

  };

  // const handleSelectionChange = () => {
  //   const quillEditor = quill.current.getEditor();
  //   const selection = quillEditor.getSelection();

  //   if (selection && selection.length > 0) {
  //     const bounds = quillEditor.getBounds(selection.index, selection.length);
  //     const editorBounds = quillEditor.container.getBoundingClientRect();
  //     setContextMenu({
  //       visible: true,
  //       top: editorBounds.top + bounds.bottom + window.scrollY,
  //       left: editorBounds.left + bounds.left + window.scrollX,
  //     });
  //   } else {
  //     setContextMenu({ visible: false, top: 0, left: 0 });
  //   }
  // };

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
          <h1 className="space-left header-title">Form Editor</h1>
          <div className="flex space-x-4 items-center">
            <div
              className="bg-gray-200 p-2 rounded-full cursor-pointer text-gray-500 hover:bg-gray-300"
              onClick={() => {
                handleSave();
                setIsPopupOpen(true);
              }}
            >
              <RiSave3Line className="h-6 w-6" title="Save" />
            </div>
            <div
              className="bg-gray-200 p-2 rounded-full cursor-pointer text-gray-500 hover:bg-gray-300"
              onClick={() => {
                handleFinalize();
                setIsDocumentUpdated(true);
              }}
            >
              <RiCheckLine className="h-6 w-6" title="Approve" />
            </div>
            <div className="bg-gray-200 p-2 rounded-full cursor-pointer text-gray-500 hover:bg-gray-300">
              <RiUpload2Line className="h-6 w-6" title="Import" />
            </div>
            <div className="bg-gray-200 p-2 rounded-full cursor-pointer text-gray-500 hover:bg-gray-300">
              <RiDownload2Line className="h-6 w-6" title="Export" />
            </div>
          </div>
        </div>
        <div className="bg-gray-200 p-2 rounded-full cursor-pointer text-gray-500 hover:bg-gray-300">
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
          <div className="text-center mt-4">
            <button onClick={generate} className="generate-button">
              Generate
            </button>
          </div>
          {error && <div className="text-red-500 text-lg">{error}</div>}

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

        <div onMouseUp={handleMouseUp}>
                  <ReactQuill
            ref={(el) => (quill.current = el)}
            theme="snow"
            value={editorValue}
            onChange={setEditorValue}
            formats={formats}
            modules={modules}
            // onChangeSelection={handleSelectionChange} // Use handleSelectionChange for context menu positioning
          />

          
      {showButton && (
        <div
          style={{
            position: 'absolute',
            left: `${buttonPosition.x}px`,
            top: `${buttonPosition.y}px`,
          }}
          className="dropdown"
        >
          <button onClick={handleButtonClick}>▼</button>
          {showDropdown && (
            
            <div className="context-menu" style={{ display: 'flex', flexDirection: 'column', marginTop: '5px', background: 'white', border: '1px solid black', padding: '10px' }} 
            onMouseUp={handlemouseup}>

              <input type="text" placeholder="Input field" value={inputtext} onChange={handleInputChange} />
              <button onClick={regenerate}>Regenerate</button>
              <button onClick={longer}>Longer</button>
              <button onClick={shorter}>Shorten</button>
              <button onClick={handleReplaceText}>Remove</button>

            </div>
          )}
        </div>
      )}
    </div>


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
      {isPopupOpenforSumamry && (
  <div className="popup">
    <div className="popup-contentforSummary">
    <p className="text-bold text-2xl mb-4">Summary is as follow</p>
      <p>{summarizedContent}</p>
      <button onClick={() => setIsPopupOpenforSumamry(false)}>OK</button>
    </div>
  </div>
)}
    </div>
  );
};

export default Editor;
