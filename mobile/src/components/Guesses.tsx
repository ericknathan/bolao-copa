import { useState, useEffect } from "react";
import { FlatList, useToast } from "native-base";
import { api } from "../services/api";
import { Game, GameProps } from "./Game";
import { Loading } from "./Loading";
import { EmptyMyPoolList } from ".";

interface Props {
  poolId: string;
  code: string;
}

export function Guesses({ poolId, code }: Props) {
  const [fetchIsLoading, setFetchIsLoading] = useState(false);
  const [games, setGames] = useState<GameProps[]>([] as GameProps[]);

  const [firstTeamPoints, setFirstTeamPoints] = useState("");
  const [secondTeamPoints, setSecondTeamPoints] = useState("");

  const toast = useToast();

  async function fetchGames() {
    try {
      setFetchIsLoading(true);

      const response = await api.get(`/pools/${poolId}/games`);

      setGames(response.data.games);
    } catch (error) {
      console.log({ instance: "fetchGames", error });

      return toast.show({
        title: "Não foi possível carregar os jogos do bolão.",
        placement: "top",
        bgColor: "red.500",
      });
    } finally {
      setFetchIsLoading(false);
    }
  }

  async function handleConfirmGuess(gameId: string) {
    try {
      if (!firstTeamPoints.trim() || !secondTeamPoints.trim()) {
        return toast.show({
          title: "Informe o placar do palpite.",
          placement: "top",
          bgColor: "red.500",
        });
      }

      await api.post(`/pools/${poolId}/games/${gameId}/guess`, {
        firstTeamPoints: Number(firstTeamPoints),
        secondTeamPoints: Number(secondTeamPoints),
      });

      toast.show({
        title: "Palpite realizado com sucesso!",
        placement: "top",
        bgColor: "green.500",
      });

      fetchGames();
    } catch (error) {
      console.log({ instance: "fetchGames", error });

      return toast.show({
        title: "Não foi possível enviar o palpite.",
        placement: "top",
        bgColor: "red.500",
      });
    }
  }

  useEffect(() => {
    fetchGames();
  }, [poolId]);

  if (fetchIsLoading) {
    return <Loading />;
  }

  return (
    <FlatList
      data={games}
      keyExtractor={(item) => item.id}
      renderItem={({ item }: { item: GameProps }) => (
        <Game
          data={item}
          setFirstTeamPoints={setFirstTeamPoints}
          setSecondTeamPoints={setSecondTeamPoints}
          onGuessConfirm={() => handleConfirmGuess(item.id)}
        />
      )}
      ListEmptyComponent={() => <EmptyMyPoolList code={code} />}
    />
  );
}
