import React, { useState, useEffect } from "react";
import ScroolToBottom from "react-scroll-to-bottom";
import io from "socket.io-client";
import axios from "axios";
import api from "../../config/axiosCg";
import "./Dashboard.css";
import BotsList from "./BotsList/BotsList";
import BotConfiguration from "./BotConfiguration/BotConfiguration";
import BotAvailable from "./BotAvailable/BotAvailable";

const Dashboard = () => {
  const [botNames, setBotNames] = useState([]);
  const [statusBotStr, setStatusBotStr] = useState("");
  const [botStatus, setBotStatus] = useState(false);
  const [botViewer, setBotViewer] = useState("");
  const [pingInStatus, setPingInStatus] = useState([]);
  const [humanError, setHumanError] = useState();
  const [botId, setBotId] = useState({});
  const [showedBotMenu, setShowedBotMenu] = useState("");
  //const [socket, setSocket] = useState('')
  const [testMod, setTestMod] = useState("A");

  const socket = io("http://localhost:3002");

  useEffect(() => {
    /*const getStatusBot = async () => {
      const response = await axios.get("http://localhost:3002/botapi/statuschat");
      const resStr = response.data
      setPingInStatus([...pingInStatus, resStr])

    };*/
    //let botStats
    socket.on("dataPlayer", (dataP) => {
      if (!dataP) setHumanError("lol socket gagal");
      const [name = "None", health = "0", hunger = "0"] = dataP || [];

      const botStats = {
        name,
        health,
        hunger,
      };

      setBotNames([...botNames, botStats]);
    });

    //getStatusBot()
  }, []);

  useEffect(() => {
    socket.on("message", (pesan) => {
      setPingInStatus([...pingInStatus, pesan]);
    });
    /*
    setSocket(initSocket)
    if(!socket) return
    initSocket.on('message', (pesan) => {
      setPingInStatus([...pingInStatus, pesan])
    })*/
  }, []);

  const botOn = () => {
    setBotStatus(false);
    setStatusBotStr("menyala");
    // const response = axios.post("http://localhost:3002/api/dashboard", {
    //   botStatus,
    // });
    const response = api.post('/api/dashboard', {
      botStatus,
    });
  };
  const botOff = () => {
    setBotStatus(true);
    setStatusBotStr("matek");
    const response = axios.post("http://localhost:3002/api/dashboard", {
      botStatus,
    });
  };

  const pingStatus = () => {
    const ping = "hallo";

    setPingInStatus([...pingInStatus, ping]);
  };

  const addingBot = () => {
    //const response = axios.post('http://localhost:3002/api/dashboard')
    socket.on("testInc", (data) => {
      const botStats = {
        name: "hibiki",
        health: data,
        hunger: "5",
      };

      const botStats2 = {
        name: "konata",
        health: "100",
        hunger: data,
      };

      setBotNames([...botNames, botStats]);
      setTimeout(() => {
        setBotNames([...botNames, botStats2]);
      }, 5000);
    });
  };

  const displayWorld = () => {
    const httpsc = "http://localhost:3007";
    setBotViewer(httpsc);
  };

  const displayBotMenu = (returner) => {
    //if (!showedBotMenu) {
    setShowedBotMenu(returner);
    //} else { setShowedBotMenu(false) }
  };

  const testAddBot = () => {
    if (!testMod) {
      setTestMod("true");
      const attac = {
        1: {
          name: "ale",
          health: "10",
          hunger: "75",
        },
      };
      setBotId(attac);
    } else {
      setBotId({});
      setTestMod(undefined);
    }
  };

  let statsBots; // kode use effect salah di bagian switch sebagai objek
  useEffect(() => {
    const updaterBotStats = () => {
      socket.on("testInc", (stat) => {
        // const stats = {
        //   1: {
        //     name: stat,
        //     health: stat,
        //     hunger: stat,
        //   },
        // };

        let listUpdateBot = { ...botId };

        switch (stat.id) {
          case 1:
            listUpdateBot[1] = {
              name: stat.name,
              health: stat.health,
              hunger: stat.hunger,
            };
            break;
          case 2:
            listUpdateBot[2] = {
              name: stat.name,
              health: stat.health,
              hunger: stat.hunger,
            };
            break;
          case 3:
            break;
        }

        setBotId(listUpdateBot);
      });
    };
    updaterBotStats();

    return () => {
      socket.off("testInc");
    };
  }, [botId, socket]);

  return (
    <div className="slot">
      <div className="navigate-bar">
        <div className="title-nav">
          <h4>Menu</h4>
        </div>
      </div>
      <h1>Adminstrator</h1>
      <div className="status-chat">
        <ScroolToBottom className="status-scrool">
          <h4>status</h4>
          <p> status: {statusBotStr}</p>
          {pingInStatus.map((message, index) => (
            <div className="status-message" key={index}>
              <p>{message}</p>
            </div>
          ))}
        </ScroolToBottom>
      </div>
      <div className="bot-stay">
        <ScroolToBottom className="bot-container">
          {/* {botNames.map((bot, index) => (
          <div className="bot-list" key={index}>
            <p>{bot.name}</p>
            <div className="bot-bar">
              <div className="health" style={{ width: `${bot.health}%` }}></div>
            </div>
            <div className="bot-bar-H">
              <div className="hunger" style={{ width: `${bot.hunger}%` }}></div>
            </div>
          </div>
        ))} */}
          <div
            className="wrap-config"
            style={
              showedBotMenu
                ? { height: `${showedBotMenu}px` }
                : { height: `75px` }
            }
          >
            <BotsList
              onToggle={displayBotMenu}
              name="example"
              health="1"
              hunger="2"
            />
            {showedBotMenu ? <BotConfiguration /> : <></>}
          </div>
          <BotAvailable
            name={botId[1]?.name}
            health={botId[1]?.health}
            hunger={botId[1]?.hunger}
          />
          <BotAvailable
            name={botId[2]?.name}
            health={botId[2]?.health}
            hunger={botId[2]?.hunger}
          />
          {/* <BotAvailable name="loi" health="23" hunger="74" />
          <BotAvailable name="aru" health="10" hunger="67" />
          <BotAvailable name="liki" health="43" hunger="34" />
          <BotAvailable name="aruji" health="23" hunger="34" />
          <BotAvailable name="arudongo" health="10" hunger="7" /> */}
        </ScroolToBottom>
      </div>
      <div className="the-viewer-bot">
        <p>name: </p>
        <p>code: </p>
        {botViewer ? <iframe src={botViewer} frameborder="30"></iframe> : <></>}
      </div>
      <div className="toolkit-bot">
        <button onClick={addingBot}>create</button>
        {botStatus ? (
          <button onClick={botOn}>OFF</button>
        ) : (
          <button onClick={botOff}>ON</button>
        )}
        <button onClick={pingStatus}>ping message</button>
        <button onClick={displayWorld}>viewer</button>
        <button onClick={testAddBot}>TestBtn-addbot</button>
        <p>{humanError}</p>
      </div>
    </div>
  );
};

export default Dashboard;
