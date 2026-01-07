import React, { useState, useRef } from 'react';
import Alert from '@mui/material/Alert';
import CheckIcon from '@mui/icons-material/Check';
import CheckCircleOutlineIcon from '@mui/icons-material/CheckCircleOutline';
import Stack from '@mui/material/Stack';
import Button from '@mui/material/Button';
import SendIcon from '@mui/icons-material/Send';
import Box from '@mui/material/Box';
import TextField from '@mui/material/TextField';
import HorizontalNonLinearStepper from './StepWiseModal';

export default function Create({name, setName}) {
  const [message, setMessage] = useState('');
  const textareaRef = useRef(null);

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
    }
  };

  return (
        <div style={{width:"100%", "height":"200px", boxSizing:"border-box", background: "#fff", border: "1px solid #ccc", padding:"20px", borderRadius: "15px"}}>

            <div style={{paddingBottom:0, cursor: "pointer", paddingRight:10, paddingTop:10,marginTop:10, paddingBottom:10, paddingLeft:20 }}>
                <span class="borderBottom" style={{fontWeight: 200,  fontSize: 16}}> 
                  Please enter the name of the project to be created.
                </span>
            </div>

            <Box
            sx={{ '& > :not(style)': { m: 1, width: '125ch' } }}
            noValidate
            autoComplete="off"
            >
              <TextField id="outlined-basic" value={name}  onChange={(e) => setName(e.target.value)}  label="Name" variant="outlined" style={{width: 400}}/>             
              {/*<Button type="submit" onClick={handleSubmit} variant="contained" style={{width: 200, height: 54}}>
                Create Project
              </Button>*/}
            </Box>
        </div>     
  );
}