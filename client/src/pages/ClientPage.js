import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { Button, Dialog, DialogActions, DialogContent, DialogTitle } from "@material-ui/core";
import Axios from "axios";
import "../styles.css";
import Radio from '@mui/material/Radio';
import RadioGroup from '@mui/material/RadioGroup';
import FormControlLabel from '@mui/material/FormControlLabel';
import Box from '@mui/material/Box';
import Slider from '@mui/material/Slider';
import ArrowBackIosIcon from '@mui/icons-material/ArrowBackIos';
import { HOST_URL } from "../configure";
import { createBrowserHistory } from 'history'
import logoImg from '../assets/logo_white.png'

function ClientPage() {
  const [showModal, setModal] = useState(false)
  const [name, setName] = useState("");
  const [category, setCategory] = useState(1);
  const [condition, setCondition] = useState(50);
  const [price, setPrice] = useState(3);
  const [description, setDescription] = useState("");
  const sliderMarks = [
    {
      value: 25,
      label: 'Fair'
    },
    {
      value: 50,
      label: 'Good'
    },
    {
      value: 75,
      label: 'Very Good'
    },
    {
      value: 100,
      label: 'Never Worn'
    },
  ]
  const radioStyle = {
    color: "white",
    '& .Mui-checked': {
      color: "#ec5990",
    },
  }

  const sliderStyle = {
    color: "#ec5990",
    '& .MuiSlider-markLabel': {
      color: "white",
      width: '30px'
    },
  }

  const {
    handleSubmit,
    formState: { errors }
  } = useForm();

  const onSubmit = () => {
    let formValues = {
      name: name,
      category: category,
      condition_cat: condition,
      price: price,
      description: description,
      user_id: localStorage.getItem('userId'),
      status: 0,
    }

    console.log("Submit: ", formValues)

    Axios.post(HOST_URL + "/create", formValues).then(() => {
      setModal(true);
    });

  }; // your form submit function which will invoke after successful validation

  const handleClose = () => {
    setModal(false);
    setName("")
    setCategory(1)
    setCondition(50)
    setPrice(3)
    setDescription("")
  };

  const history = createBrowserHistory()

  const handleBackClick = () => {
    history.replace({ pathname: '/user', state: {} })
    history.go(0)
  }

  const handleLogout = () => {
    localStorage.clear()
    history.replace({ pathname: '/', state: {} })
    history.go(0)
  }


  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between' }}>
        <Button variant="text" onClick={handleBackClick}>
          <div style={{ color: 'white', display: 'flex', alignItems: 'center' }}>
            <ArrowBackIosIcon sx={{ color: 'white', fontSize: '25px' }} />
            <div style={{ color: "white", fontSize: '20px', marginLeft: '5px' }}> Back to barter history</div>
          </div>
        </Button>
        <Button type="text" style={{ paddingRight: '20px' }} onClick={() => { handleLogout() }} >
          <div style={{ color: "white", fontSize: '20px' }}> Logout</div>
        </Button>
      </div>
      <div className="title">
        <img style={{ width: '500px', margin: '30px' }} src={logoImg} alt="" />
      </div>
      <form id='form' onSubmit={handleSubmit(onSubmit)} style={{ marginTop: '30px' }}>
        {/* register your input into the hook by invoking the "register" function */}
        <label>Name</label>
        <input required placeholder="Name of the item" value={name} onChange={(event) => {
          setName(event.target.value)
        }} />
        {errors.name && <p>This field is required</p>}

        <label>Category</label>

        <RadioGroup
          row
          aria-labelledby="demo-row-radio-buttons-group-label"
          name="category"
          defaultValue={category}
          value={category}
          onChange={(event) => {
            setCategory(event.target.value)
          }}
        >
          <FormControlLabel value={1} control={<Radio sx={radioStyle} />} label="Clothing" />
          <FormControlLabel value={2} control={<Radio sx={radioStyle} />} label="Electronics" />
          <FormControlLabel value={3} control={<Radio sx={radioStyle} />} label="Books" />
          <FormControlLabel value={4} control={<Radio sx={radioStyle} />} label="Others" />

        </RadioGroup>


        <label>Condition</label>


        <Box sx={{ width: 300 }}>
          <Slider
            defaultValue={75}
            valueLabelDisplay="off"
            step={25}
            marks={sliderMarks}
            className="condition-slder"
            sx={sliderStyle}
            min={25}
            max={100}
          />
        </Box>

        <label>Price at time of purchase</label>
        <div className="price">
          <input defaultValue={price} value={price} type="number" min="1" max="100" className="price-input" required onChange={(event) => {
            setPrice(event.target.value)
          }} />
          <span className="pound">£</span>
        </div>

        <label>Description</label>
        <textarea defaultValue={description} value={description} placeholder="" onChange={(event) => {
          setDescription(event.target.value)
        }} />


        <button type="submit" >Submit</button>
      </form>


      <Dialog
        open={showModal}
        onClose={handleClose}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
        sx={{ height: '100px' }}
      >
        <DialogTitle id="alert-dialog-title">
          {"New barter create successful"}
        </DialogTitle>
        <DialogContent>
          {"Please wait for the review to pass, it will take about 24 hours"}
        </DialogContent>
        <DialogActions>
          <div style={{ display: 'flex', flexDirection: 'row' }}>
            <Button type="text" onClick={handleClose} >
              Create a new
            </Button>
            <Button type="text" onClick={() => { setModal(false) }} >
              Close
            </Button>
          </div>
        </DialogActions>

      </Dialog>
    </div>
  );
}
export default ClientPage;

