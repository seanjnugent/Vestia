import React, { useState, useRef } from 'react';
import {
  Box,
  TextField,
  Button,
  Typography,
  Grid,
  Paper,
  MenuItem,
  InputAdornment,
  Stepper,
  Step,
  StepLabel,
  StepContent,
  Alert, // Import Alert for displaying messages
} from '@mui/material';

const countries = [
  'United States',
  'United Kingdom',
  'Canada',
  'Germany',
  'Australia',
];

const riskProfiles = [
  { id: 'low', label: 'Low Risk: Preservation of capital with minimal fluctuations.' },
  { id: 'medium', label: 'Medium Risk: Moderate growth with some risk of loss.' },
  { id: 'high', label: 'High Risk: Aggressive growth with higher risk of loss.' },
];

const NewClient = () => {
  const steps = ['Basic Information', 'Residential Address', 'Contact Information', 'Risk Profile'];
  const [activeStep, setActiveStep] = useState(0);
  const formRef = useRef(null);
  const [formData, setFormData] = useState({
    firstName: '',
    surname: '',
    dateOfBirth: '',
    countryOfResidence: '',
    residentialAddress: { street: '', city: '', postcode: '', country: '' },
    clientProfile: '',
    emailAddress: '',
    phoneNumber: '',
  });
  const [successMessage, setSuccessMessage] = useState(null);
  const [errorMessage, setErrorMessage] = useState(null);

  const handleFieldChange = (e) => setFormData({ ...formData, [e.target.name]: e.target.value });
  const handleAddressChange = (e) => setFormData({
    ...formData,
    residentialAddress: { ...formData.residentialAddress, [e.target.name]: e.target.value },
  });
  const handleNext = () => {
    if (formRef.current.checkValidity()) setActiveStep((prevActiveStep) => prevActiveStep + 1);
  };
  const handleBack = () => setActiveStep((prevActiveStep) => prevActiveStep - 1);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSuccessMessage(null); // Clear previous messages
    setErrorMessage(null);

    const clientData = { ...formData, dateOfBirth: formData.dateOfBirth.toString()}; // Important: Convert date to string

    try {
      const response = await fetch('http://localhost:5000/api/clients/new-client', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(clientData),
      });

      if (!response.ok) {
        const errorData = await response.json();// Try to get error message from backend
        throw new Error(errorData?.error || `HTTP error! status: ${response.status}`); // Improved error handling
      }

      setSuccessMessage('Client created successfully!');
      setFormData({ // Clear the form after successful submission
        firstName: '', surname: '', dateOfBirth: '', countryOfResidence: '',
        residentialAddress: JSON.stringify(formData.residentialAddress), // Convert residentialAddress to JSON string
        clientProfile: '', emailAddress: '', phoneNumber: '',
      });
      setActiveStep(0);
    } catch (error) {
      console.error('Error creating client:', error);
      setErrorMessage(error.message); // Display the error message to the user
    }
  };

  const getStepContent = (step) => {
    switch (step) {
      case 0: return (
        <Grid container spacing={3}>
          <Grid item xs={12} sm={6}>
            <TextField label="First Name" name="firstName" fullWidth variant="outlined" required value={formData.firstName} onChange={handleFieldChange} />
          </Grid>
          <Grid item xs={12} sm={6}>
            <TextField label="Surname" name="surname" fullWidth variant="outlined" required value={formData.surname} onChange={handleFieldChange} />
          </Grid>
          <Grid item xs={12} sm={6}>
            <TextField label="Date of Birth" name="dateOfBirth" type="date" fullWidth variant="outlined" required InputLabelProps={{ shrink: true }} value={formData.dateOfBirth} onChange={handleFieldChange} />
          </Grid>
          <Grid item xs={12} sm={6}>
            <TextField label="Country of Residence" name="countryOfResidence" select fullWidth variant="outlined" required value={formData.countryOfResidence} onChange={handleFieldChange}>
              {countries.map((country) => (<MenuItem key={country} value={country}>{country}</MenuItem>))}
            </TextField>
          </Grid>
        </Grid>
      );
      case 1: return (
        <>
          <Typography variant="h6" gutterBottom>Residential Address</Typography>
          <Grid container spacing={2}>
            <Grid item xs={12} sm={6}>
              <TextField label="Street" name="street" fullWidth variant="outlined" required value={formData.residentialAddress.street} onChange={handleAddressChange} />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField label="City" name="city" fullWidth variant="outlined" required value={formData.residentialAddress.city} onChange={handleAddressChange} />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField label="Postcode" name="postcode" fullWidth variant="outlined" required value={formData.residentialAddress.postcode} onChange={handleAddressChange} />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField label="Country" name="country" select fullWidth variant="outlined" required value={formData.residentialAddress.country} onChange={handleAddressChange}>
                {countries.map((country) => (<MenuItem key={country} value={country}>{country}</MenuItem>))}
              </TextField>
            </Grid>
          </Grid>
        </>
      );
      case 2: return (
        <Grid container spacing={3}>
          <Grid item xs={12} sm={6}>
            <TextField label="Email Address" name="emailAddress" type="email" fullWidth variant="outlined" required value={formData.emailAddress} onChange={handleFieldChange} InputProps={{ startAdornment: <InputAdornment position="start">@</InputAdornment> }} />
          </Grid>
          <Grid item xs={12} sm={6}>
            <TextField label="Phone Number" name="phoneNumber" type="tel" fullWidth variant="outlined" required value={formData.phoneNumber} onChange={handleFieldChange} InputProps={{ startAdornment: <InputAdornment position="start">+</InputAdornment> }} />
          </Grid>
        </Grid>
      );
      case 3: return (
        <>
          <Typography variant="h6" gutterBottom>Risk Appetite</Typography>
          <TextField name="clientProfile" select fullWidth variant="outlined" label="Select Risk Profile" required value={formData.clientProfile} onChange={handleFieldChange}>
            {riskProfiles.map((profile) => (<MenuItem key={profile.id} value={profile.id}>{profile.label}</MenuItem>))}
          </TextField>
        </>
      );
      default: return <div>Something went wrong</div>;
    }
  };

  return (
    <Box sx={{ padding: 4, maxWidth: '900px', margin: 'auto' }}>
      <Typography variant="h4" gutterBottom sx={{ fontWeight: 700, mb: 2 }}>Add New Client</Typography>
      <Paper elevation={6} sx={{ padding: 4, borderRadius: 4, backgroundColor: '#f9f9f9' }}>
        {successMessage && <Alert severity="success" sx={{ mb: 2 }}>{successMessage}</Alert>}
        {errorMessage && <Alert severity="error" sx={{ mb: 2 }}>{errorMessage}</Alert>}
        <form ref={formRef} onSubmit={handleSubmit}>
          <Stepper activeStep={activeStep} orientation="vertical" sx={{ width: '100%' }}>
            {steps.map((label, index) => (
              <Step key={label}>
                <StepLabel>{label}</StepLabel>
                <StepContent>
                  {getStepContent(index)}
                  <Box sx={{ mb: 2, mt: 2 }}>
                    <Button disabled={activeStep === 0} onClick={handleBack} sx={{ mr: 1 }}>Back</Button>
                    <Button variant="contained" onClick={handleNext}>
                      {activeStep === steps.length - 1 ? 'Finish' : 'Next'}
                    </Button>
                  </Box>
                </StepContent>
              </Step>
            ))}
          </Stepper>
          {activeStep === steps.length && (
            <Box sx={{ display: 'flex', justifyContent: 'center', mt: 2 }}>
              <Button type="submit" variant="contained" color="primary" sx={{ paddingX: 5, paddingY: 1.5, fontWeight: 'bold', fontSize: '16px', borderRadius: '8px', backgroundColor: '#007bff' }}>
                Save Client
              </Button>
            </Box>
          )}
        </form>
      </Paper>
    </Box>
  );
};

export default NewClient;