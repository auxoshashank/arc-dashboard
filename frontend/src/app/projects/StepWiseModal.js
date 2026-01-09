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
import Stack from '@mui/material/Stack';

const steps = ['Create Project', 'Upload Data', 'Business Analysis', 'Research Query', 'EDA', 'ML Engine'];

export default function HorizontalNonLinearStepper({loadProjects}) {
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
  const [files, setFiles] = useState([]);
  const [isProjectCreated, setIsProjectCreated] = useState(false);
  const [isDataUploaded, setIsDataUploaded] = useState(false);
  const [isRunBusiness, setIsRunBusiness] = useState(false);
  const [isRunResearch, setIsRunResearch] = useState(false);
  const [isRunEDA, setIsRunEDA] = useState(false);
  const [isRunML, setIsRunML] = useState(false);

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
    if (activeStep == 0)
        await handleSubmit();
    else if (activeStep == 1)
        await handleDataUpload();
    else if (activeStep == 2)
        await runBusinessAnalysis('business-analysis');
    else if (activeStep == 3)
        await runBusinessAnalysis('research-query');
    else if (activeStep == 4)
        await runBusinessAnalysis('eda');
     else if (activeStep == 5)
        await runBusinessAnalysis('ml-engine');
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
       if ((isProjectCreated && activeStep == 0) ||
          (isDataUploaded && activeStep == 1) ||
          (isRunBusiness && activeStep == 2) ||
          (isRunResearch && activeStep == 3) ||
          (isRunEDA && activeStep == 4) ||
          (isRunML && activeStep == 5)) {
              var newActiveStep = activeStep + 1;
              setActiveStep(newActiveStep);
              if (isRunML)
                loadProjects();
      }
  }, [isProjectCreated, isDataUploaded, isRunBusiness, isRunResearch, isRunEDA, isRunML]);

  const handleBack = () => {
    setActiveStep((prevActiveStep) => prevActiveStep - 1);
  };

  const handleStep = (step) => () => {
    setActiveStep(step);
  };

  const handleComplete = () => {
    setCompleted({
      ...completed,
      [activeStep]: true,
    });
    handleNext();
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

  function scrollToTop() {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }

  function scrollToBottom() {
    window.scrollTo(0, (window.document.body.scrollHeight - window.innerHeight));
  }


  function toggleDropDownUser(val) {
    setCountUser(val);
  }

  function toggleExpanded(isExpanded){
    setIsExpanded(isExpanded => !isExpanded);
  };

  function applyActiveLink(myLink){
    setActiveLink(myLink);
  };

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

  const runBusinessAnalysis = async (module_name) => {

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

     {((isRunBusiness && activeStep == 3)? 
    <Stack sx={{ width: '100%' }} spacing={2}>
        <Alert icon={<CheckIcon fontSize="inherit" />} severity="success">
        Business Analytics Engine triggered successfully.
        </Alert>
    </Stack> : null)}  

    {((isRunResearch && activeStep == 4)? 
    <Stack sx={{ width: '100%' }} spacing={2}>
        <Alert icon={<CheckIcon fontSize="inherit" />} severity="success">
        Researcher Engine triggered successfully.
        </Alert>
    </Stack> : null)}

   {((isRunEDA && activeStep == 5)? 
    <Stack sx={{ width: '100%' }} spacing={2}>
        <Alert icon={<CheckIcon fontSize="inherit" />} severity="success">
        EDA Engine triggered successfully.
        </Alert>
    </Stack> : null)}

    {((isRunML && activeStep == 6)? 
    <Stack sx={{ width: '100%' }} spacing={2}>
        <Alert icon={<CheckIcon fontSize="inherit" />} severity="success">
        ML Engine triggered successfully.
        </Alert>
    </Stack> : null)}

    <Box sx={{ width: '100%', marginTop: '10px' }}>
          
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
              {/*Step {activeStep + 1}*/}
              {(activeStep == 0) ? (<Create name={name} setName={setName}></Create>) : 
               (activeStep == 1) ? (<ChatGPTInterface files={files} setFiles={setFiles} message = {msg} setMessage = {setMsg} toggleDropDown={toggleDropDown} count = {count} toggleLoaded={toggleLoaded} isLoaded = {isLoaded}></ChatGPTInterface>) :
               (activeStep == 2) ? (<div style={{width:"100%", background: "#fff", borderRadius: "10px", height:"200px", padding:"20px", boxSizing:"border-box"}}><div style={{paddingBottom:0, cursor: "pointer", paddingRight:10, paddingTop:10,marginTop:10, paddingBottom:10, paddingLeft:20 }}>
                <span class="borderBottom" style={{fontWeight: 200,  fontSize: 16}}> 
                  Please click NEXT to run the business analysis for this project .
                </span>
                </div></div>): 
               (activeStep == 3) ? (<div style={{width:"100%", background: "#fff", borderRadius: "10px", height:"200px", padding:"20px", boxSizing:"border-box"}}><div style={{paddingBottom:0, cursor: "pointer", paddingRight:10, paddingTop:10,marginTop:10, paddingBottom:10, paddingLeft:20 }}>
                <span class="borderBottom" style={{fontWeight: 200,  fontSize: 16}}> 
                  Please click NEXT to run the Research Query for this project.
                </span>
                </div></div>) : 
               (activeStep == 4) ? (<div style={{width:"100%", background: "#fff", borderRadius: "10px", height:"200px", padding:"20px", boxSizing:"border-box"}}><div style={{paddingBottom:0, cursor: "pointer", paddingRight:10, paddingTop:10,marginTop:10, paddingBottom:10, paddingLeft:20 }}>
                <span class="borderBottom" style={{fontWeight: 200,  fontSize: 16}}> 
                  Please click NEXT to run the EDA for this project.
                </span>
                </div></div>) : 
               (activeStep == 5) ? (<div style={{width:"100%", background: "#fff", borderRadius: "10px", height:"200px", padding:"20px", boxSizing:"border-box"}}><div style={{paddingBottom:0, cursor: "pointer", paddingRight:10, paddingTop:10,marginTop:10, paddingBottom:10, paddingLeft:20 }}>
                <span class="borderBottom" style={{fontWeight: 200,  fontSize: 16}}> 
                  Please click NEXT to run the ML for this project.
                </span>
                </div></div>) : null
               }            
            </Typography>
            <Box sx={{ display: 'flex', flexDirection: 'row', pt: 2 }}>
              {(activeStep < 6) ?
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
              (activeStep < 6  ? 
              <Button variant="contained" onClick={handleNext} sx={{ mr: 1 }}>
                Next
              </Button> :
              <Button variant="contained" onClick={createNew} sx={{ mr: 1 }}>
                Create New Project
              </Button>)
              }
            </Box>
          </React.Fragment>
        )}
      </div>
    </Box>
    </>
  );
}
