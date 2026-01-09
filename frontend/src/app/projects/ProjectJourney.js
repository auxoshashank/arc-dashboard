import React, { useState, useRef } from 'react';
import HorizontalNonLinearStepper from './StepWiseModal';

export default function ProjectJourney({id, loadProjects}) {
  return (
    <>        
        <div style={{width:"100%", marginTop: "10px"}}>
          <HorizontalNonLinearStepper loadProjects={loadProjects} id={id}></HorizontalNonLinearStepper>           
        </div>        
    </>  
  );
}