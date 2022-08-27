#!/bin/bash
set -xe

USER_SUB=$1
HOST=${2:-localhost:3010}

function run {
  cd "$(dirname "$0")"
	local CHAMPIONSHIP=$(getChampionship)
	local BETSLIP_TEMPLATE=$(loadBetslipTemplate)
	local BETSLIP=$(substituteIds "$CHAMPIONSHIP" "$BETSLIP_TEMPLATE")
 	createBet "$BETSLIP"
  cd -
}

function getChampionship {
    echo $(curl -s -X GET http://$HOST/api/championships)
}

function loadBetslipTemplate {
	echo $(cat data/bet-euro2016.json)
}

function substituteIds {
	local CHAMPIONSHIP=$1
	local BETSLIP=$(cat data/bet-euro2016.json)
	
	
	for i in France,FRANCE_ID\
			 Romania,ROMANIA_ID\
			 Albania,ALBANIA_ID\
			 Switzerland,SWITZERLAND_ID\
			 Wales,WALES_ID\
			 England,ENGLAND_ID\
			 Russia,RUSSIA_ID\
			 "Germany ",GERMANY_ID\
			 Poland,POLAND_ID\
			 "Northern Ireland",N_IRELAND_ID\
			 Spain,SPAIN_ID\
			 Croatia,CROATIA_ID\
			 Turkey,TURKEY_ID\
			 Italy,ITALY_ID\
			 Sweden,SWEDEN_ID\
			 Ireland,IRELAND_ID\
			 Hungary,HUNGARY_ID\
			 Iceland,ICELAND_ID\
			 Ukraine,UKRAINE_ID\
			 Austria,AUSTRIA_ID\
			 Portugal,PORTUGAL_ID\
			 Belgiun,BELGIUM_ID\
			 "Czech Republic",CZECH_ID\
			 Slovakia,SLOVAKIA_ID; do IFS=","; set -- $i; 
		local COUNTRY_NAME=$1
		local COUNTRY_SUB=$2
		local COUNTRY_ID=$(echo "$CHAMPIONSHIP" | jq -r --arg COUNTRY_NAME "$COUNTRY_NAME" '.matchGroups[] .teams[] | select (.name == $COUNTRY_NAME) ._id')
		local BETSLIP=$(echo "$BETSLIP" | sed s/"$COUNTRY_SUB"/"$COUNTRY_ID"/)	
	done
	
	echo "$BETSLIP"
}

function createBet {
	local BETSLIP=$1
    curl -s -H "Content-Type: application/json" -d "$BETSLIP" http://$HOST/develop/bet-slips/$USER_SUB
}

run
