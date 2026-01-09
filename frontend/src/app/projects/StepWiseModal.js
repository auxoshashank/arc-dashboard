import * as React from 'react';
import Box from '@mui/material/Box';
import Stepper from '@mui/material/Stepper';
import Step from '@mui/material/Step';
import StepButton from '@mui/material/StepButton';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';
import Create from './Create';
import ChatGPTInterface from './ChatGPTInterface';
import { useState , Fragment, useEffect} from 'react';
import Alert from '@mui/material/Alert';
import CheckIcon from '@mui/icons-material/Check';
import Info from '@mui/icons-material/Info';

import Stack from '@mui/material/Stack';

export default function HorizontalNonLinearStepper({id, loadProjects}) {
  const [activeStep, setActiveStep] = React.useState(0);
  const [completed, setCompleted] = React.useState({});
  const [isLoaded, setIsLoaded] = useState(0);
  const [isExpanded, setIsExpanded] = useState(1);
  const [countUser, setCountUser] = useState(false);
  const [projectId, setProjectId] = useState('');
  const [count, setCount] = useState(false);
  const [activeLink, setActiveLink] = useState('');
  const [name, setName] = useState('');
  const [msg, setMsg] = useState('');
  const [steps, setSteps] = useState(['Create Project', 'Upload Data']);

  const [files, setFiles] = useState([]);
  const [isProjectCreated, setIsProjectCreated] = useState(false);
  const [isDataUploaded, setIsDataUploaded] = useState(false);
  const [isRunBusiness, setIsRunBusiness] = useState(false);
  const [isRunResearch, setIsRunResearch] = useState(false);
  const [isRunEDA, setIsRunEDA] = useState(false);
  const [isRunML, setIsRunML] = useState(false);

  const [businessStatus, setBusinessStatus] = useState('');
  const [researchStatus, setResearchStatus] = useState('');
  const [mlStatus, setMlStatus] = useState('');
  const [edaStatus, setEdaStatus] = useState('');

  const totalSteps = () => {
    return steps.length;
  };

  const completedSteps = () => {
    return Object.keys(completed).length;
  };

  const isLastStep = () => {
    return activeStep === totalSteps() - 1;
  };

  const allStepsCompleted = () => {
    return completedSteps() === totalSteps();
  };

  const handleNext = async () => {  
    
    if (!id && activeStep == 0)
        await handleSubmit();
    else if (!id && activeStep == 1){
        await handleDataUpload();
    }
    else if (id && activeStep == 0){
      getStatus('research-query', setResearchStatus);
      await runModule('business-analysis');
    }
    else if (id && activeStep == 1){
      getStatus('eda-engine', setEdaStatus);
      await runModule('research-query');
    }
    else if (id && activeStep == 2){
      getStatus('ml-engine', setMlStatus);
      await runModule('eda');
    }
    else if (id && activeStep == 3){
      await runModule('ml-engine');
    }
  };


  const createNew = async () => {
    setActiveStep(0);
    setName('');
    setIsProjectCreated(false);
    setIsDataUploaded(false);
    setIsRunBusiness(false);
    setIsRunResearch(false);
    setIsRunEDA(false);
    setIsRunML(false);    
  };

  useEffect(() => {
    createNew();
  },[id])

  useEffect(() => {
       if ((!id && isProjectCreated && activeStep == 0) ||
          (!id && isDataUploaded && activeStep == 1) ||
          (id && isRunBusiness && activeStep == 0) ||
          (id && isRunResearch && activeStep == 1) ||
          (id && isRunEDA && activeStep == 2) ||
          (id && isRunML && activeStep == 3)) {
              if (id && activeStep<3){
                var newActiveStep = activeStep + 1;
                setActiveStep(newActiveStep);               
              }
              if ((!id && isDataUploaded))
                  loadProjects();
      }
  }, [isProjectCreated, isDataUploaded, isRunBusiness, isRunResearch, isRunEDA, isRunML]);


  const getStatus = async (module_name, setStatusFun) => {    
    try {
      const response1 = await fetch(`http://127.0.0.1:8000/api/${module_name}/status/${projectId}`, {
        method: 'GET',
        headers: {'Content-Type': 'application/json'}
      });

      if (!response1.ok) {
        throw new Error('Something went wrong');
      }
      const result = await response1.json();
     
      setStatusFun(result.status ? result.status.toUpperCase() : 'NOT STARTED');

    } catch (error) {
      setStatusFun('NOT STARTED');
    }
  };

  useEffect(() => {      
    if (id){
      setProjectId(id);
      setSteps(['Business Analysis', 'Research Query', 'EDA', 'ML Engine']);
      getStatus('business-analysis', setBusinessStatus);     
    }
  }, [id]);


  const handleBack = () => {
    if (id && activeStep==1){
      setIsRunResearch(false);
      setIsRunBusiness(false);
      getStatus('business-analysis', setBusinessStatus);     
    }
    if (id && activeStep==2){
      setIsRunEDA(false);
      setIsRunResearch(false);
      getStatus('research-query', setResearchStatus);
    }
    if (id && activeStep==3){
      setIsRunML(false);
      setIsRunEDA(false);
      getStatus('eda-engine', setEdaStatus);
    }
    setActiveStep((prevActiveStep) => prevActiveStep - 1);
  };

  const handleStep = (step) => () => {
    setIsRunBusiness(false);
    setIsRunEDA(false);
    setIsRunResearch(false);
    setIsRunML(false);
    if (id && step==0)
      getStatus('business-analysis', setBusinessStatus);
    if (id && step==1)
      getStatus('research-query', setResearchStatus);
    if (id && step==2)
      getStatus('eda-engine', setEdaStatus);
    if (id && step==3)
      getStatus('ml-engine', setMlStatus);
    setActiveStep(step);
  };

  const handleReset = () => {
    setActiveStep(0);
    setCompleted({});
  };
  
  function toggleLoaded(isLoad){
     setIsLoaded(isLoad => !isLoad);
  };

  function toggleDropDown(val) {
    setCount(val);
  }

  const handleDataUpload = async () => {

    const formData = new FormData();

    for (const file of files) {
        formData.append('files', file);
    }
    
    try {
      const response1 = await fetch(`http://127.0.0.1:8000/api/projects/${projectId}/upload/data`, {
        method: 'POST',
        headers: {},
        body: formData
      });

      if (!response1.ok) {
        throw new Error('Something went wrong');
      }
      const result = await response1.json();
      setIsDataUploaded(true);
    } catch (error) {
      setIsDataUploaded(false);
    }

    try {
      const response2 = await fetch(`http://127.0.0.1:8000/api/projects/${projectId}/chat`, {
        method: 'POST',
        headers: {'Content-Type': 'application/json'},
        body: JSON.stringify({
          "text": msg
        })
      });

      if (!response2.ok) {
        throw new Error('Something went wrong');
      }
      const result = await response2.json();
    } catch (error) {
    }
  };

  const handleSubmit = async () => {

    const data = { "display_name":name, "msg":msg };

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

      const result = await response.json();

      setProjectId(result["project_id"]);
      
      setIsProjectCreated(true);

    } catch (error) {
      setIsProjectCreated(false);
    }
  };

  const runModule = async (module_name) => {

    const data = { "project_id":projectId };

    try {
      var response = await fetch(`http://127.0.0.1:8000/api/${module_name}/run`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(data)
      });

      if (module_name == 'business-analysis')
        setIsRunBusiness(true);
      else if (module_name == 'research-query')
        setIsRunResearch(true);
      else if (module_name == 'eda')
        setIsRunEDA(true);
      else if (module_name == 'ml-engine'){
        setIsRunML(true);
      }
    } catch (error) {
       if (module_name == 'business-analysis')
        setIsRunBusiness(false);
      else if (module_name == 'research-query')
        setIsRunResearch(false);
      else if (module_name == 'eda')
        setIsRunEDA(false);
      else if (module_name == 'ml-engine')
        setIsRunML(false);
    }
  };
  
  return (
    <>  
    {((isProjectCreated && activeStep == 1) ? 
    <Stack sx={{ width: '100%' }} spacing={2}>
        <Alert icon={<CheckIcon fontSize="inherit" />} severity="success">
        Project created successfully.
        </Alert>
    </Stack> : null)}
    
    {((isDataUploaded && activeStep == 2) ? 
    <Stack sx={{ width: '100%' }} spacing={2}>
        <Alert icon={<CheckIcon fontSize="inherit" />} severity="success">
        Data uploaded successfully.
        </Alert>
    </Stack> : null)}

    {((isRunBusiness && activeStep == 1)? 
    <Stack sx={{ width: '100%' }} spacing={2}>
        <Alert icon={<CheckIcon fontSize="inherit" />} severity="success">
        Business Analytics Engine triggered successfully.
        </Alert>
    </Stack> : null)}  

    {((isRunResearch && activeStep == 2)? 
    <Stack sx={{ width: '100%' }} spacing={2}>
        <Alert icon={<CheckIcon fontSize="inherit" />} severity="success">
        Researcher Engine triggered successfully.
        </Alert>
    </Stack> : null)}

   {((isRunEDA && activeStep == 3)? 
    <Stack sx={{ width: '100%' }} spacing={2}>
        <Alert icon={<CheckIcon fontSize="inherit" />} severity="success">
        EDA Engine triggered successfully.
        </Alert>
    </Stack> : null)}

    {((isRunML && activeStep == 3)? 
    <Stack sx={{ width: '100%' }} spacing={2}>
        <Alert icon={<CheckIcon fontSize="inherit" />} severity="success">
        ML Engine triggered successfully.
        </Alert>
    </Stack> : null)}

    <Box sx={{ width: '50%', margin: '10px auto' }}>
      {(activeStep < 6) ? 
      <Stepper nonLinear activeStep={activeStep}>
        {steps.map((label, index) => (
          <Step key={label} completed={completed[index]}>
            <StepButton color="inherit" onClick={handleStep(index)}>
              {label}
            </StepButton>
          </Step>
        ))}
      </Stepper>: (<div class="p-4">Congratulations, all steps are completed for your project.</div>)}
        <div>
        {allStepsCompleted() ? (
          <React.Fragment>
            <Typography sx={{ mt: 2, mb: 1 }}>
              All steps completed - you&apos;re finished
            </Typography>
            <Box sx={{ display: 'flex', flexDirection: 'row', pt: 2 }}>
              <Box sx={{ flex: '1 1 auto' }} />
              <Button onClick={handleReset}>Reset</Button>
            </Box>
          </React.Fragment>
        ) : (
          <React.Fragment>
            <Typography sx={{ mt: 2, mb: 1, py: 1 }}>              
              {(!id && activeStep == 0) ? (<Create name={name} setName={setName}></Create>) : 
               (!id && activeStep == 1) ? (<ChatGPTInterface files={files} setFiles={setFiles} message = {msg} setMessage = {setMsg} toggleDropDown={toggleDropDown} count = {count} toggleLoaded={toggleLoaded} isLoaded = {isLoaded}></ChatGPTInterface>) :
               (id && activeStep == 0) ? (
               <div style={{width:"100%", background: "#fff", borderRadius: "10px", padding:"20px", boxSizing:"border-box"}}>
                  <div style={{paddingBottom:0, cursor: "pointer", paddingRight:10, paddingTop:10,marginTop:10, paddingBottom:10 }}>
                   <Stack sx={{ width: '100%' }} spacing={2}>
                      <Alert icon={<Info fontSize="inherit" />} severity="info">
                      Status : {businessStatus}
                      </Alert>
                   </Stack>
                  </div>
                </div>
                ):
               (id && activeStep == 1) ? (<div style={{width:"100%", background: "#fff", borderRadius: "10px", padding:"20px", boxSizing:"border-box"}}><div style={{paddingBottom:0, cursor: "pointer", paddingRight:10, paddingTop:10,marginTop:10, paddingBottom:10 }}>
                   <Stack sx={{ width: '100%' }} spacing={2}>
                      <Alert icon={<Info fontSize="inherit" />} severity="info">
                      Status : {researchStatus}
                      </Alert>
                   </Stack>
                </div></div>) : 
               (id && activeStep == 2) ? (<div style={{width:"100%", background: "#fff", borderRadius: "10px", padding:"20px", boxSizing:"border-box"}}><div style={{paddingBottom:0, cursor: "pointer", paddingRight:10, paddingTop:10,marginTop:10, paddingBottom:10 }}>
                  <Stack sx={{ width: '100%' }} spacing={2}>
                      <Alert icon={<Info fontSize="inherit" />} severity="info">
                      Status : {edaStatus}
                      </Alert>
                   </Stack>
                </div></div>) : 
               (id && activeStep == 3) ? (<div style={{width:"100%", background: "#fff", borderRadius: "10px", padding:"20px", boxSizing:"border-box"}}><div style={{paddingBottom:0, cursor: "pointer", paddingRight:10, paddingTop:10,marginTop:10, paddingBottom:10 }}>
                 <Stack sx={{ width: '100%' }} spacing={2}>
                      <Alert icon={<Info fontSize="inherit" />} severity="info">
                      Status : {mlStatus}
                      </Alert>
                   </Stack>
                </div></div>) : null
               }            
            </Typography>
            <Box sx={{ display: 'flex', flexDirection: 'row', pt: 2 }}>
              {(!id && activeStep < 2) || (id && activeStep < 5) ?
              <Button
                color="inherit"
                disabled={activeStep === 0}
                onClick={handleBack}
                sx={{ mr: 1 }}
              >
                Back
              </Button> : null}
              <Box sx={{ flex: '1 1 auto' }} />
              {              
              (!id && activeStep < 2) ? 
              <Button variant="contained" onClick={handleNext} sx={{ mr: 1 }}>
                Next
              </Button> :
              (!id ? 
              <Button variant="contained" onClick={createNew} sx={{ mr: 1 }}>
                Create New Project
              </Button> : null)
              }
              {
              (
                ((id && activeStep==0) || 
                 (id && activeStep==1) ||
                 (id && activeStep==2) 
                ) ? 
                  <Button variant="contained" onClick={handleNext} sx={{ mr: 1 }}>
                    Trigger and Proceed
                  </Button> :
                  null
              )
              }

              {
                 ((id && activeStep==3) ?  <Button variant="contained" onClick={handleNext} sx={{ mr: 1 }}>
                    Trigger
                  </Button> :
                  null)
              }
            </Box>
          </React.Fragment>
        )}
        </div>
    </Box>
    </>
  );
}
