import React, { useEffect, useState } from 'react';
import * as _ from 'underscore';
import axios from 'axios';
import { handleNodes } from '../utils/bracket';
import { Bracket } from 'react-tournament-bracket';
import BracketGame from '../components/BracketGame'

export default function Home() {
  const [data, setData] = useState(null);

  useEffect(() => {
    async function load(){
      try {
        const { data } = await axios.get('https://api.stattrak.gg/esports/placements/league-of-legends-mid-invitational-2023-group-a/brackets');

        setData(handleNodes(data))
      } catch (error) {
        console.log(error)
      }
    }

    load()
  }, []);

  return (
    <>
      <div style={{background: 'white'}}>
        {data && (
          <Bracket game={data} homeOnTop GameComponent={gameComponent}/>
        )}
      </div> 
    </>
  )
}

const gameComponent = (props) => {
  console.log('props', props)
  return (
    <BracketGame
      {...props}
    />
  );
};
