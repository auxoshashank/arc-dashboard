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

export default function CreateProject({loadProjects}) {
  return (
    <>        
        <div style={{width:"100%", height:"100vh", marginTop: "10px"}}>
          <HorizontalNonLinearStepper loadProjects={loadProjects}></HorizontalNonLinearStepper>           
        </div>        
    </>  
  );
}