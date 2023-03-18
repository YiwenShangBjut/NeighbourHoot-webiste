import React, { useState } from "react";
import ReactDOM from "react-dom";
import { useForm } from "react-hook-form";
import {Button, Dialog, DialogActions, DialogContent, DialogTitle} from "@material-ui/core";
import Axios from "axios";


import "./styles.css";
import Barcode from 'react-barcode'

function App() {
  const [showModal, setModal]=useState(false)
  const [formValues, setFormValues]=useState({
    name: '',
    category: '1',
    condition: '50',
    price: 10,
    description: '',
  })

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors }
  } = useForm({
    defaultValues: {
      name: '',
      category: '1',
      condition: '50',
      price: 10,
      description: '',
    }
  });
  
  const onSubmit = (data) => {
    console.log(data);
    setFormValues(data)

    Axios.post("http://localhost:3001/create", {
        name: formValues.name,
        category: formValues.category,
        condition_cat: formValues.condition,
        price: formValues.price,
        description: formValues.description,
      }).then(() => {
        setModal(true);
      });
    
  }; // your form submit function which will invoke after successful validation

  const handleClose = () => {
    setModal(false);
  };

  const generateBarcode = () =>{
    let price = formValues.price
    price=price*0.01*formValues.condition
    console.log('price: ',price)
    let code=formValues.name.substring(0,5).concat(price)
    console.log('code: ',code)
    return code
  }

  console.log(watch("name")); // you can watch individual input by pass the name of the input

  return (
    <div>
      <div className="title" >
        Name of our project
      </div>
      <form id='form' onSubmit={handleSubmit(onSubmit)} style={{ marginTop: '30px' }}>
        {/* register your input into the hook by invoking the "register" function */}
        <label>Name</label>
        <input {...register("name", { required: true })} placeholder="Name of the item" />
        {errors.name && <p>This field is required</p>}

        <label>Category</label>

        <label className="radio-label">Clothing<input {...register("category")} className="radio" type="radio" id="category1" value="1" name="category" defaultChecked /> </label>

        <label className="radio-label">Electronics<input {...register("category")} className="radio" type="radio" id="category2" value="2" name="category" /></label>

        <label className="radio-label">Books<input {...register("category")} className="radio" type="radio" id="category3" value="3" name="category" /></label>

        <label>Condition</label>

        <select {...register("condition")}>
          <option value="100">Never Worn</option>
          <option value="75">Very good</option>
          <option select value="50">Good</option>
          <option value="25">Fair</option>
        </select>

        <label>Price at time of purchase</label>
        <div className="price">
        <input  type="number" min="1" max="100" className="price-input" {...register("price", { required: true })} />
        <span className="pound">£</span>
        </div>

        <label>Description</label>
        <textarea placeholder="" {...register("description")} />


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
          <Barcode value={generateBarcode()} displayValue={false} />

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
export default App;

// const rootElement = document.getElementById("root");
// ReactDOM.render(<App />, rootElement);
