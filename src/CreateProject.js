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

export default function CreateProject() {
  const [message, setMessage] = useState('');
  const textareaRef = useRef(null);
  const [name, setName] = useState('');
  const [isSuccess, setIsSuccess] = useState(false);

  return (
    <>
        {isSuccess ?
            <Stack sx={{ width: '100%' }} spacing={2}>
              <Alert icon={<CheckIcon fontSize="inherit" />} severity="success">
                The Project has been created.
              </Alert>
            </Stack> : ''}
        <div style={{width:"100%", height:"100vh", margin: "50px"}}>            
          <HorizontalNonLinearStepper></HorizontalNonLinearStepper>           
        </div>   
    </>  
  );
}