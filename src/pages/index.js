import React, { useEffect, useState } from "react";
import * as _ from "underscore";
import axios from "axios";
import { handleNodes } from "../utils/bracket";
import Bracket from "../components/Bracket";
import BracketGame from "../components/BracketGame";

export default function Home() {
  const [data, setData] = useState(null);

  useEffect(() => {
    async function load() {
      try {
        const { data } = await axios.get(
          "https://playbyplay.maisesports.com.br/placements/league-of-legends-mid-invitational-2023-playoffs/brackets"
        );

        setData(handleNodes(data));
      } catch (error) {
        console.log(error);
      }
    }

    load();
  }, []);

  return (
    <>
      <div style={{ background: "white" }}>
        {data && (
          <Bracket game={data} homeOnTop GameComponent={gameComponent} />
        )}
      </div>
    </>
  );
}

const gameComponent = (props) => {
  return <BracketGame {...props} />;
};
