import { selector } from "recoil";
import { getOneChampionship } from "../../services/championshipService";

export const championshipState = selector({
  key: "currentChampionship",
  get: async () => {
    const data = await getOneChampionship();
    return data;
  },
});
