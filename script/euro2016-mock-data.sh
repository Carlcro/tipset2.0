#!/bin/bash
HOST=${1:-localhost:3010}

function run {
  cd "$(dirname "$0")"
  createPlayers
  local CHAMPIONSHIP=$(createChampionship)
  createUserTournaments $CHAMPIONSHIP
  cd -
}

function create {
  while read data
  do 
    curl -s -H "Content-Type: application/json" -d "$data" http://$HOST/api/$1 > /dev/null
  done < data/$1.json
}

function createUsers {
  create users
}

function createPlayers {
  create players
}

function createUserTournaments {
  CHAMPIONSHIP=$1
  createOne user-tournaments '{"name":"En turnering", "championshipId":"'"$CHAMPIONSHIP"'"}' > /dev/null
}

function createOne {
  echo $(curl -s -H "Content-Type: application/json" -d "$2" http://$HOST/api/$1)
}

function getId {
  local ID_REGEX='_id":"([a-z,0-9]*)'
  [[ $1 =~ $ID_REGEX ]]
  echo ${BASH_REMATCH[1]}
}

function createTeam {
  local NAME=$1
  local RESPONSE=$(createOne teams '{"name":"'"$NAME"'"}')
  echo $(getId $RESPONSE)
}

function createMatch {
  local CHAMPIONSHIP=$1
  local MATCH_ID=$2
  local MATCHGROUP=$3
  local TEAM1=$4
  local TEAM2=$5

  createOne championships/$CHAMPIONSHIP/matchgroups/$MATCHGROUP '{"team1":"'"$TEAM1"'", "team2":"'"$TEAM2"'", "matchId": "'$MATCH_ID'"}' > /dev/null
}

function createMatchGroup {
  local CHAMPIONSHIP=$1
  local MATCH_ID=$2
  local MATCHGROUP_NAME=$3
  local TEAM1=$(createTeam "$4")
  local TEAM2=$(createTeam "$5")
  local TEAM3=$(createTeam "$6")
  local TEAM4=$(createTeam "$7")

  local RESPONSE=$(createOne championships/$CHAMPIONSHIP/matchgroups '{"name":"'"$MATCHGROUP_NAME"'", "teams": [
    "'"$TEAM1"'", "'"$TEAM2"'", "'"$TEAM3"'", "'"$TEAM4"'"
  ]}')
  local MATCHGROUP=$(getId $RESPONSE)

  createMatch $CHAMPIONSHIP $(($MATCH_ID + 0)) $MATCHGROUP $TEAM1 $TEAM2
  createMatch $CHAMPIONSHIP $(($MATCH_ID + 1)) $MATCHGROUP $TEAM1 $TEAM3
  createMatch $CHAMPIONSHIP $(($MATCH_ID + 2)) $MATCHGROUP $TEAM1 $TEAM4
  createMatch $CHAMPIONSHIP $(($MATCH_ID + 3)) $MATCHGROUP $TEAM2 $TEAM3
  createMatch $CHAMPIONSHIP $(($MATCH_ID + 4)) $MATCHGROUP $TEAM2 $TEAM4
  createMatch $CHAMPIONSHIP $(($MATCH_ID + 5)) $MATCHGROUP $TEAM3 $TEAM4
}

function createMatchInfo {
  local CHAMPIONSHIP=$1
  local MATCHGROUP=$2
  local MATCHES=$3

  for ORDER in $(eval echo "{1..$MATCHES}")
  do
    createOne championships/$CHAMPIONSHIP/matchinfo '{"order": "'$ORDER'","date":"2019-08-01", "location": "Wembley Stadium, London", "matchGroupId":"'"$MATCHGROUP"'"}'
  done
}

function createChampionship {
  local RESPONSE=$(createOne championships '{"name":"Europeiska mästerskapen 2020"}')
  local CHAMPIONSHIP=$(getId $RESPONSE)

  MATCH_ID=1

  createMatchGroup $CHAMPIONSHIP $((MATCH_ID + (0*6))) "A" "France" "Romania" "Albania" "Switzerland"
  createMatchGroup $CHAMPIONSHIP $((MATCH_ID + (1*6))) "B" "Wales" "England" "Slovakia" "Russia"
  createMatchGroup $CHAMPIONSHIP $((MATCH_ID + (2*6))) "C" "Germany " "Poland" "Northern Ireland" "Ukraine"
  createMatchGroup $CHAMPIONSHIP $((MATCH_ID + (3*6))) "D" "Spain" "Croatia" "Turkey " "Czech Republic"
  createMatchGroup $CHAMPIONSHIP $((MATCH_ID + (4*6))) "E" "Italy" "Sweden" "Ireland" "Belgiun"
  createMatchGroup $CHAMPIONSHIP $((MATCH_ID + (5*6))) "F" "Hungary" "Iceland" "Portugal" "Austria"

  createMatchInfo $CHAMPIONSHIP "A" 6
  createMatchInfo $CHAMPIONSHIP "B" 6
  createMatchInfo $CHAMPIONSHIP "C" 6
  createMatchInfo $CHAMPIONSHIP "D" 6
  createMatchInfo $CHAMPIONSHIP "E" 6
  createMatchInfo $CHAMPIONSHIP "F" 6
  createMatchInfo $CHAMPIONSHIP "Åttondelsfinaler" 8
  createMatchInfo $CHAMPIONSHIP "Kvartsfinaler" 4
  createMatchInfo $CHAMPIONSHIP "Semifinaler" 2
  createMatchInfo $CHAMPIONSHIP "Final" 1

  echo $CHAMPIONSHIP
}

run
