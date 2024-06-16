import React, { useState, useEffect, Component } from "react";
import { toast, ToastContainer } from "react-toastify";
import apiXios from "../../config/axiosCg";
import 'react-toastify/dist/ReactToastify.css';
import "./Registrasi.css";

const Registrasi = () => {

  const [userpop, setUserpop] = useState("");
  const [passcode, setPasscode] = useState("");
  const [email, setEmail] = useState("");

  const [nextSide, setNextSide] = useState(false);
  const [verifGen, setVerifGen] = useState("");
  const [submCode, setSubmCode] = useState("");
  const [status, setStatus] = useState(false);

  useEffect(() => {
    const transferData = async () => {

    }
    transferData()
  }, [])

  const generatorCode = () => {
    const codeGen = Math.floor(100000 + Math.random() * 900000)
    setVerifGen(codeGen.toString())
    setTimeout(() => {
      toast(`here your fucking code { ${codeGen.toString()} } it's only available for 7 second and need to regenerate`);
    }, 1700)
  }

  const registerAcc = (e) => {
    try {
      e.preventDefault();
      if (email) setNextSide(true);
      generatorCode()
    } catch (err) {
      console.error(err);
    }
  };


  const registerVerif = (e) => {
    try {
      e.preventDefault()
      if (submCode === verifGen) {
        setStatus(true)
        const response = apiXios.post("/api/register", {
        userpop,
        passcode
        })
        
      } else {
        setStatus(false)
      }
    } catch (err) {
      console.error(err)
    }
  }

  return (
    <div className="regis-body">
      <ToastContainer />
      {!nextSide ? (
        <div>
          <h1>mau Registrasi ya!</h1>
          <form onSubmit={registerAcc}>
            <div className="input-box1">
              <input
                type="text"
                placeholder="username"
                value={userpop}
                onChange={(e) => setUserpop(e.target.value)}
                required
              />
            </div>
            <div className="input-box1">
              <input
                type="password"
                placeholder="password"
                value={passcode}
                onChange={(e) => setPasscode(e.target.value)}
                required
              />
            </div>
            <div className="input-box1">
              <input
                type="text"
                placeholder="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>

            <button type="submit">create</button>
            <p>punya akun? <a href="/login">login</a></p>
          </form>
        </div>
      ) : (
        <div>
          <h1>Verifikasi akun</h1>
          {/* <p>Vcode : {verifGen}</p> */}
          { status ?  <p>Status : Succes</p>  : <p>Status : failed</p> }
          <div className="verif-class">
            <form onSubmit={registerVerif}>
              <div className="verif-box">
                <input type="text" placeholder="6 digit" value={submCode} onChange={(e) => setSubmCode(e.target.value)} required/>
              </div>
              <div className="button-veriv">
              <button type="submit">verifikasi</button>
              </div>
            </form>
          <div className="regen-code">
              <button onClick={() => generatorCode()}>Gen-code</button>
          </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Registrasi;
