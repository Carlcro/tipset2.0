import React from "react";

function PointSystem() {
  return (
    <div className="flex w-full justify-center">
      <div className="flex flex-col bg-white rounded shadow-lg mx-5 p-3 max-w-6xl space-y-1">
        <h1 className="font-bold">Poängsystem</h1>
        <div>
          <h2 className="font-semibold text-gray-500">Gruppspel:</h2>
          <ul>
            <li>{`Rätt resultat: 25 p`}</li>
            <li>{`Rätt segrare/oavgjort: 20 p minus antal mål fel för resp. lag`}</li>
            <li>{`Fel segrare/oavgjort: 10 p minus antal mål fel för resp.lag`}</li>
            <li>{`Rätt placering i gruppen (1-4): 5 p vardera`}</li>
            <li>
              {`Rätt lag vidare till slutspel (oavsett gruppspelsplats): 10 p var`}
            </li>
          </ul>
        </div>
        <div className="flex flex-col sm:flex-row sm:space-x-5 justify-items-center">
          <table className="table-auto">
            <thead>
              <tr>
                <th></th>
                <th>RR</th>
                <th>RS/O</th>
                <th>RLV</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td className="font-semibold">Åttondelsfinal:</td>
                <td>15p</td>
                <td>15p</td>
                <td>25p</td>
              </tr>
              <tr>
                <td className="font-semibold">Kvartsfinal:</td>
                <td>15p</td>
                <td>15p</td>
                <td>25p</td>
              </tr>
              <tr>
                <td className="font-semibold">Semifinal:</td>
                <td>20p</td>
                <td>20p</td>
                <td>30p</td>
              </tr>
              <tr>
                <td className="font-semibold">Final:</td>
                <td>25p</td>
                <td>25p</td>
                <td>35p</td>
              </tr>
            </tbody>
          </table>
          <div className="flex sm:flex-col sm:justify-end space-x-3 sm:space-x-0">
            <div>
              <span className="font-bold">RR</span> = Rätt resultat
            </div>
            <div>
              <span className="font-bold">RS/O</span> = Rätt 1/X/2
            </div>
            <div>
              <span className="font-bold">RLV</span> = Rätt lag vidare
            </div>
          </div>
        </div>

        <div className="flex space-x-1">
          <span className="font-bold">Rätt skyttekung</span>
          <span>Antal mål gjorda av honom x10</span>
        </div>
      </div>
    </div>
  );
}

export default PointSystem;
