import React, { useState } from "react";
import { Button, Box } from "@material-ui/core";
import { createBrowserHistory } from 'history'
import logoImg from '../assets/logo192.png'
import Axios from "axios";
import { HOST_URL } from "../configure";

function SplashPage() {
    const [username, setUsername] = useState("");

    const history = createBrowserHistory()

    function handleSubmit(event) {
        event.preventDefault();
        Axios.get(HOST_URL+"/user/"+username).then((data) => {
         
          localStorage.setItem("userId",data.data[0].id);
    });
        
        history.replace({pathname:'/user',state: {}})
        history.go(0)
    } return (
        <div>
            <div className="title" >
                Community Barter
            </div>
            <div className="title" >
                <img src={logoImg} alt="" />
            </div>

            <Box display="flex" justifyContent="center" alignItems="center" >

                <Box p={2}  boxShadow={2} borderRadius={16}>

                    <form onSubmit={handleSubmit}>
                        <Box display="flex" flexDirection="column" justifyContent="center" alignItems="center" gap={2}>
                            <input required placeholder="Username" onChange={(event) => {
                                setUsername(event.target.value)
                            }} />

                            <input required type="password" placeholder="Password" style={{marginTop:'30px'}}/>

                            <Button variant="contained" color="primary" type="submit"> Login </Button>
                        </Box>
                    </form>
                </Box>
            </Box></div>);
} export default SplashPage;
