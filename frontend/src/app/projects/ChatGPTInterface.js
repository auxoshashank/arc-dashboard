import React, { useState, useRef, useEffect } from 'react';
import { Send } from 'lucide-react';
import Dropdown from './Dropdown';

export default function ChatGPTInterface({files, setFiles, toggleLoaded, toggleDropDown, isLoaded, count, message, setMessage}) {
  const textareaRef = useRef(null);
  const messagesEndRef = useRef(null);

  useEffect(() => {
    if (textareaRef.current) {     
    }
  }, [message]);

  return (
    <>
          <div className="input-box margin-5">
              <div className="curvedPanel fullWidth padding-5 chatTextBox">
                <textarea
                  ref={textareaRef}
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  placeholder="Enter Description"
                  rows={1}
                  id="queryText"                             
                />
                <div class="flexRow borderTop">
                  <Dropdown count={count} files={files} setFiles={setFiles} toggleDropDown={toggleDropDown}/>                  
                </div>     
              </div>          
          </div>         
    </>
  );
}