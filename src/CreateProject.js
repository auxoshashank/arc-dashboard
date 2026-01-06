import React, { useState, useRef } from 'react';
import Alert from '@mui/material/Alert';
import CheckIcon from '@mui/icons-material/Check';
import CheckCircleOutlineIcon from '@mui/icons-material/CheckCircleOutline';
import Stack from '@mui/material/Stack';
import Button from '@mui/material/Button';
import SendIcon from '@mui/icons-material/Send';
import Box from '@mui/material/Box';
import TextField from '@mui/material/TextField';

export default function CreateProject() {
  const [message, setMessage] = useState('');
  const textareaRef = useRef(null);
  const [name, setName] = useState('');
  const [isSuccess, setIsSuccess] = useState(false);

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
    }
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    const data = { name };

    try {
      const response = await fetch('http://127.0.0.1:8000/api/projects', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(data)
      });

      if (!response.ok) {
        throw new Error('Something went wrong');
      }
      setIsSuccess(true);
      const result = await response.json();
      setMessage('User successfully added!');
      console.log(result);
    } catch (error) {
      setIsSuccess(true);
      setMessage('Error posting data');
      console.error('Error:', error);
    }
  };

  return (
    <>         
        <div style={{width:"100%", height:"100vh", background: "#fff"}}>
            {isSuccess ? 
            <Stack sx={{ width: '100%' }} spacing={2}>
              <Alert icon={<CheckIcon fontSize="inherit" />} severity="success">
                The Project has been created.
              </Alert>
            </Stack> : ''}

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
              <Button type="submit" onClick={handleSubmit} variant="contained" style={{width: 200, height: 54}}>
                Create Project
              </Button>
            </Box>
        </div>     
    </>
  );
}