import React, {useState, useRef, useEffect} from "react";
import "./Dropdown.css";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faAngleDown , faFile, faImage, faPaperclip, faSun } from '@fortawesome/free-solid-svg-icons';
import { Send, Paperclip, X } from 'lucide-react';

const UserLogin = ({count, toggleDropDown}) => {
  const [open, setOpen] = useState(false);

  useEffect(() => {
    setOpen(count);
  }, [count]);

  return (
    <div className="dropdown">
      <button className="userLogin" onClick={() => {toggleDropDown(true);}}>
        SS
      </button>

      {open && (
        <ul className="dropdown-menu-right dropdown-menu">
          <li className="dropdown-item"><FontAwesomeIcon style={{fontSize:12, marginTop:2}} icon={faImage} /> &nbsp;Profile</li>
          <li className="dropdown-item"><FontAwesomeIcon style={{fontSize:12, marginTop:2}} icon={faSun} /> &nbsp;Sign Out</li>         
        </ul>
      )}
    </div>
  );
};

export default UserLogin;