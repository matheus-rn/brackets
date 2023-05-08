// Montagem do payload usando recursão

const handleSides = ({prevLeft = null, prevRight = null, name}) =>{
  const nameSplit = name.includes(':') ? name.split(':')[1] : name

  const [teamHome, teamVisitor] = nameSplit.replace(/\s+/g, '').toUpperCase().split('VS')

  const visitor = {
    team: {
      name: teamVisitor,
      score: null,
    },
    seed: {
      sourceGame: prevRight ? handleNodes(prevRight): null, 
      displayName: "TBD",
      rank:1,
    },
  };
  const home = {
    team: {
      name: teamHome,
      score: null,
    },
    seed: {
      sourceGame: prevLeft ? handleNodes(prevLeft): null, 
      displayName: "TBD",
      rank: 1,
    },
  };

  return {
    visitor,
    home
  }
}

export const handleNodes = (mock) => {
  const name = mock?.name.includes(':') ? mock.name.split(':')[0] : null

  const node = {
    id: mock.id,
    name,
    ignoreStandings: false,
    cancelled: false,
    eventType: "Game",
    sides: handleSides(mock)
  }

  return node
}
