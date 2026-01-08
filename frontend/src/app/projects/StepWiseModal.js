import * as React from 'react';
import Box from '@mui/material/Box';
import Stepper from '@mui/material/Stepper';
import Step from '@mui/material/Step';
import StepButton from '@mui/material/StepButton';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';
import Create from './Create';
import ChatGPTInterface from './ChatGPTInterface';
import { useState , Fragment} from 'react';
import Alert from '@mui/material/Alert';
import CheckIcon from '@mui/icons-material/Check';
import Stack from '@mui/material/Stack';

const steps = ['Create Project', 'Upload Data', 'Business Analysis', 'Research Query', 'EDA', 'ML Engine'];

export default function HorizontalNonLinearStepper() {
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

  const handleNext = () => {
    const newActiveStep =
      isLastStep() && !allStepsCompleted()
        ? // It's the last step, but not all steps have been completed,
          // find the first step that has been completed
          steps.findIndex((step, i) => !(i in completed))
        : activeStep + 1;
    setActiveStep(newActiveStep);

    if (newActiveStep == 1)
        handleSubmit();
    else if (newActiveStep == 2)
        handleDataUpload();
    else if (newActiveStep == 3)
        runBusinessAnalysis('business-analysis');
    else if (newActiveStep == 4)
        runBusinessAnalysis('research-query');
    else if (newActiveStep == 5)
        runBusinessAnalysis('eda');
     else if (newActiveStep == 6)
        runBusinessAnalysis('ml-engine');
  };

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
      const response = await fetch(`http://127.0.0.1:8000/api/projects/${projectId}/upload/data`, {
        method: 'POST',
        headers: {},
        body: formData
      });

      if (!response.ok) {
        throw new Error('Something went wrong');
      }
      //setIsSuccess(true);
      setIsDataUploaded(true);
      const result = await response.json();
      //setMessage('User successfully added!');
    } catch (error) {
      //setIsSuccess(true);
      //setMessage('Error posting data');
    }
  };

  const handleSubmit = async () => {
    //event.preventDefault();

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
      //setIsSuccess(true);
      const result = await response.json();

      setProjectId(result["project_id"]);
      
      setIsProjectCreated(true);

      //setMessage('User successfully added!');
    } catch (error) {
      //setIsSuccess(true);
      //setMessage('Error posting data');
    }
  };

  const runBusinessAnalysis = async (module_name) => {
    //event.preventDefault();

    const data = { "project_id":projectId };

    try {
      const response = await fetch(`http://127.0.0.1:8000/api/${module_name}/run`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(data)
      });

      if (!response.ok) {
        throw new Error('Something went wrong');
      }
      //setIsSuccess(true);
      const result = await response.json();

      if (module_name == 'business-analysis')
        setIsRunBusiness(true);
      else if (module_name == 'research-query')
        setIsRunResearch(true);
      else if (module_name == 'eda')
        setIsRunEDA('eda');
      else if (module_name == 'ml-engine')
        setIsRunML('ml-engine');

      //setMessage('User successfully added!');
    } catch (error) {
      //setIsSuccess(true);
      //setMessage('Error posting data');
    }
  };
  
  return (
    <>
    {(isProjectCreated ? 
    <Stack sx={{ width: '100%' }} spacing={2}>
        <Alert icon={<CheckIcon fontSize="inherit" />} severity="success">
        Project created successfully.
        </Alert>
    </Stack> : null)}
    
     {(isDataUploaded ? 
    <Stack sx={{ width: '100%' }} spacing={2}>
        <Alert icon={<CheckIcon fontSize="inherit" />} severity="success">
        Data uploaded successfully.
        </Alert>
    </Stack> : null)}

     {(isRunBusiness ? 
    <Stack sx={{ width: '100%' }} spacing={2}>
        <Alert icon={<CheckIcon fontSize="inherit" />} severity="success">
        Business Analytics Engine triggered successfully.
        </Alert>
    </Stack> : null)}

     {(isRunEDA ? 
    <Stack sx={{ width: '100%' }} spacing={2}>
        <Alert icon={<CheckIcon fontSize="inherit" />} severity="success">
        EDA Engine triggered successfully.
        </Alert>
    </Stack> : null)}

    {(isRunResearch ? 
    <Stack sx={{ width: '100%' }} spacing={2}>
        <Alert icon={<CheckIcon fontSize="inherit" />} severity="success">
        Researcher Engine triggered successfully.
        </Alert>
    </Stack> : null)}

    {(isRunML ? 
    <Stack sx={{ width: '100%' }} spacing={2}>
        <Alert icon={<CheckIcon fontSize="inherit" />} severity="success">
        ML Engine triggered successfully.
        </Alert>
    </Stack> : null)}

    <Box sx={{ width: '100%', marginTop: '10px' }}>
          
      <Stepper nonLinear activeStep={activeStep}>
        {steps.map((label, index) => (
          <Step key={label} completed={completed[index]}>
            <StepButton color="inherit" onClick={handleStep(index)}>
              {label}
            </StepButton>
          </Step>
        ))}
      </Stepper>
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
              <Button
                color="inherit"
                disabled={activeStep === 0}
                onClick={handleBack}
                sx={{ mr: 1 }}
              >
                Back
              </Button>
              <Box sx={{ flex: '1 1 auto' }} />
              <Button variant="contained" onClick={handleNext} sx={{ mr: 1 }}>
                Next
              </Button>              
              {/*activeStep !== steps.length &&
                (completed[activeStep] ? (
                  <Typography variant="caption" sx={{ display: 'inline-block' }}>
                    Step {activeStep + 1} already completed
                  </Typography>
                ) : (
                  <Button onClick={handleComplete}>
                    {completedSteps() === totalSteps() - 1
                      ? 'Finish'
                      : 'Complete Step'}
                  </Button>
                ))*/}
            </Box>
          </React.Fragment>
        )}
      </div>
    </Box>
    </>
  );
}
