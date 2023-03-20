import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { Button, Dialog, DialogActions, DialogContent, DialogTitle } from "@material-ui/core";
import Axios from "axios";
import "../styles.css";
import Barcode from 'react-barcode'
import Radio from '@mui/material/Radio';
import RadioGroup from '@mui/material/RadioGroup';
import FormControlLabel from '@mui/material/FormControlLabel';
import Box from '@mui/material/Box';
import Slider from '@mui/material/Slider';

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
  const radioStyle={
    color: "white",
    '&.Mui-checked': {
      color: "#ec5990",
    },
  }

  const sliderStyle={
    color: "#ec5990",
    '& .MuiSlider-markLabel': {
      color: "white",
      width:'30px'
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
    }

    console.log("Submit: ", formValues)

    Axios.post("http://localhost:3001/create", formValues).then(() => {
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

  const generateBarcode = () => {
    let result_price = price
    result_price = price * 0.01 * condition
    console.log('price: ', result_price)
    let code = name.substring(0, 5).concat(result_price)
    console.log('code: ', code)
    return code
  }


  return (
    <div>
      <div className="title" >
        Community Barter
      </div>
      <form id='form' onSubmit={handleSubmit(onSubmit)} style={{ marginTop: '30px' }}>
        {/* register your input into the hook by invoking the "register" function */}
        <label>Name</label>
        <input required placeholder="Name of the item" onChange={(event) => {
          setName(event.target.value)
        }} />
        {errors.name && <p>This field is required</p>}

        <label>Category</label>

        <RadioGroup
          row
          aria-labelledby="demo-row-radio-buttons-group-label"
          name="category"
          defaultValue={category}
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
        {/* <select onChange={(event) => {
          setCondition(event.target.value)
        }}>
          <option value="100">Never Worn</option>
          <option value="75">Very good</option>
          <option select value="50">Good</option>
          <option value="25">Fair</option>
        </select> */}

        <label>Price at time of purchase</label>
        <div className="price">
          <input defaultValue={price} type="number" min="1" max="100" className="price-input" required onChange={(event) => {
            setPrice(event.target.value)
          }} />
          <span className="pound">£</span>
        </div>

        <label>Description</label>
        <textarea defaultValue={description} placeholder="" onChange={(event) => {
          setDescription(event.target.value)
        }} />


        <button type="submit" >Submit</button>
      </form>


      <Dialog
        open={showModal}
        onClose={handleClose}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
      >
        <DialogTitle id="alert-dialog-title">
          {"Here is your barcode"}
        </DialogTitle>
        <DialogContent >
          {showModal ? <Barcode value={showModal ? generateBarcode() : ""} displayValue={false} /> : null}

        </DialogContent>
        <DialogActions>
          <Button type="text" onClick={handleClose} >
            Create a new form
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  );
}
export default ClientPage;

// const rootElement = document.getElementById("root");
// ReactDOM.render(<App />, rootElement);
