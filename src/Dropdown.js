import React, {useState, useRef, useEffect} from "react";
import "./Dropdown.css";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faAngleDown , faFile, faImage, faPaperclip, faSun } from '@fortawesome/free-solid-svg-icons';
import { Send, Paperclip, X } from 'lucide-react';

const Dropdown = ({count, files, setFiles, toggleDropDown}) => {
  const [open, setOpen] = useState(count);
  const [message, setMessage] = useState('');
  const [messages, setMessages] = useState([]);
  const fileInputRef = useRef(null);
  const textareaRef = useRef(null);
  
  useEffect(() => {
    setOpen(count);
  }, [count]);


  const handleFileSelect = (e) => {
    const selectedFiles = Array.from(e.target.files);
    setFiles(prev => [...prev, ...selectedFiles]);
    //setOpen(false);
    //toggleDropDown(false);
  };

  const removeFile = (index) => {
    setFiles(prev => prev.filter((_, i) => i !== index));
  };

  const handleSubmit = () => {
    if (message.trim() || files.length > 0) {
      setMessages(prev => [...prev, {
        text: message,
        files: files.map(f => f.name),
        timestamp: new Date().toLocaleTimeString()
      }]);
      setMessage('');
      setFiles([]);
      if (textareaRef.current) {
        textareaRef.current.style.height = 'auto';
      }
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSubmit();
    }
  };

  const handleTextareaChange = (e) => {
    setMessage(e.target.value);
    e.target.style.height = 'auto';
    e.target.style.height = Math.min(e.target.scrollHeight, 200) + 'px';
  };

  return (
    <div class="flexRow">
      <div className="dropdown">
        <button className="dropdown-btn" onClick={() => {/*setOpen(!open);*/ toggleDropDown(true);}}>
          <FontAwesomeIcon style={{fontSize:12}} icon={faPaperclip} /> Attach  <FontAwesomeIcon style={{fontSize:16}} icon={faAngleDown} /> 
        </button>

        {open && (
          <ul className="dropdown-menu">
            <li className="dropdown-item"><FontAwesomeIcon style={{fontSize:16, marginTop:2}} icon={faFile}/>          
            <input
                ref={fileInputRef}
                type="file"
                multiple
                onChange={handleFileSelect}
                className="hidden"
                visibility="hidden"
            />          
            </li>
            {/*<li className="dropdown-item"><FontAwesomeIcon style={{fontSize:16, marginTop:2}} icon={faImage} /> &nbsp;Image</li>
            <li className="dropdown-item"><FontAwesomeIcon style={{fontSize:16, marginTop:2}} icon={faSun} /> &nbsp;Others</li>*/}       
          </ul>
        )}     
      </div>
      <div class="flexRow">
      {files.map((file, idx) => (
                  <div key={idx} className="margin-10">
                    <Paperclip size={14} /> &nbsp;
                    <span className="text-gray-700">{file.name}</span>
                    &nbsp;<button
                    style={{background:"transparent", border:"1px solid #ccc", borderRadius:30}}                  
                      onClick={() => removeFile(idx)}                                    
                    >
                      <X size={12} />
                    </button>
                  </div>
          ))}
      </div>
    </div>
  );
};

export default Dropdown;