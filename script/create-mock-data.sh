#!/bin/bash
HOST=${1:-localhost:3000}


function run {
  #cd "$(dirname "$0")"
  #createPlayers
 
  #local CHAMPIONSHIP=$(createChampionship)


  #createUserTournaments $CHAMPIONSHIP

  createMatchInfo "6314540c64324ae1716108fc" 
  #cd -
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
  while read data
  do 
    curl -s -H "Content-Type: application/json" -d "$data" http://$HOST/api/championships/$CHAMPIONSHIP/matchInfo > /dev/null
  done < data/matchInfo.json
}

function createChampionship {


  MATCH_ID=1

  createMatchGroup "6314540c64324ae1716108fc" $((MATCH_ID + (0*6))) "A" "Qatar" "Ecuador" "Senegal" "Nederländerna"
  createMatchGroup "6314540c64324ae1716108fc" $((MATCH_ID + (1*6))) "B" "England" "Iran" "USA" "Wales"
  createMatchGroup "6314540c64324ae1716108fc" $((MATCH_ID + (2*6))) "C" "Argentina" "Saudiarabien" "Mexiko" "Poland"
  createMatchGroup "6314540c64324ae1716108fc" $((MATCH_ID + (3*6))) "D" "Frankrike" "Australien" "Danmark" "Tunisen"
  createMatchGroup "6314540c64324ae1716108fc" $((MATCH_ID + (4*6))) "E" "Spanien" "CostaRica" "Tyskland" "Japan"
  createMatchGroup "6314540c64324ae1716108fc" $((MATCH_ID + (5*6))) "F" "Belgien" "Kanada" "Morocko" "Kroatien"
  createMatchGroup "6314540c64324ae1716108fc" $((MATCH_ID + (6*6))) "G" "Brasilien" "Serbien" "Schweiz" "Kamerun"
  createMatchGroup "6314540c64324ae1716108fc" $((MATCH_ID + (7*6))) "H" "Portugal" "Ghana" "Uruguay" "Sydkorea"



  createMatchInfo "6314540c64324ae1716108fc" 

  echo "6314540c64324ae1716108fc"
}

createMatchInfo "6314540c64324ae1716108fc" 

