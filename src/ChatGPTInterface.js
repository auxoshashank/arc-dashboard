import React, { useState, useRef, useEffect } from 'react';
import { Send } from 'lucide-react';
import Dropdown from './Dropdown';

export default function ChatGPTInterface({toggleLoaded, toggleDropDown, isLoaded, count}) {
  const [message, setMessage] = useState('');
  const [messages, setMessages] = useState([]);
  const textareaRef = useRef(null);
  const messagesEndRef = useRef(null);

  useEffect(() => {
    /*messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });*/
  }, [messages]);

  useEffect(() => {
    if (textareaRef.current) {
      /*textareaRef.current.style.height = 'auto';
      textareaRef.current.style.height = Math.min(textareaRef.current.scrollHeight, 200) + 'px';*/
    }
  }, [message]);

  const sendMessage = () => {
    if (message.trim()) {
      const userMsg = message;
      setMessages(prev => [...prev, { text: userMsg, sender: 'user' }]);
      setMessage('');
      toggleLoaded(false);
      setTimeout(() => {
        setMessages(prev => [...prev, { 
          text: `This is a simulated AI response to: "${userMsg}"`, 
          sender: 'ai' 
        }]);
      }, 800);
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  return (
    <>
          <div className="input-box">
              <div className="curvedPanel fullWidth padding-5 chatTextBox">
                <textarea
                  ref={textareaRef}
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  onKeyDown={handleKeyDown}
                  placeholder="Ask ARM..."
                  rows={1}
                  id="queryText"                             
                />
                <div class="flexRow borderTop">
                  <Dropdown count={count} toggleDropDown={toggleDropDown}/>
                  <button
                    onClick={sendMessage}
                    className="send-btn"
                  >
                    <Send size={18} />
                  </button>
                </div>     
              </div>          
          </div>
          {messages.length === 0 ? (
                    <p></p>
                  ) : (
                    <div className="input-box">    
                      <div className="fullWidth margin-top-20">
                        {<div className="messages-section">
                          <div className="messages-container">
                            
                              {messages.map((msg, idx) => (
                                <div key={idx} className={`message-wrapper ${msg.sender}`}>
                                  <div className={`message-bubble ${msg.sender}`}>
                                    {msg.text}
                                  </div>
                                </div>
                              ))}
                            
                            <div ref={messagesEndRef} />
                          </div>
                        </div>}
                      </div>
                    </div>           
          )}
    </>
  );
}