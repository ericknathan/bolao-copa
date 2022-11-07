import { useState } from "react";
import { Heading, useToast, VStack } from "native-base";
import { Button, Header, Input } from "../components";
import { AxiosError } from "axios";
import { api } from "../services/api";
import { useNavigation } from "@react-navigation/native";

export function FindPool() {
  const [fetchIsLoading, setFetchIsLoading] = useState(false);
  const [poolCode, setPoolCode] = useState("");

  const toast = useToast();
  const { navigate } = useNavigation();

  async function handleJoinPool() {
    try {
      setFetchIsLoading(true);

      if (!poolCode.trim()) {
        setFetchIsLoading(false);
        return toast.show({
          title: "Informe o código do bolão.",
          placement: "top",
          bgColor: "red.500",
        });
      }

      await api.post("/pools/join", { code: poolCode });

      navigate("pools");
    } catch (error) {
      console.log({ instance: "handleJoinPool", error });
      setFetchIsLoading(false);

      if ((error as AxiosError).response?.status === 404) {
        return toast.show({
          title: "Bolão não encontrado.",
          placement: "top",
          bgColor: "red.500",
        });
      }

      if ((error as AxiosError).response?.status === 409) {
        return toast.show({
          title: "Você já está participando deste bolão.",
          placement: "top",
          bgColor: "red.500",
        });
      }

      return toast.show({
        title: "Não foi possível carregar dados do bolão.",
        placement: "top",
        bgColor: "red.500",
      });
    }
  }

  return (
    <VStack flex={1} bgColor="gray.900">
      <Header title="Buscar por código" showBackButton />

      <VStack mt={8} mx={5} alignItems="center">
        <Heading
          fontFamily="heading"
          color="white"
          fontSize="xl"
          mb={8}
          textAlign="center"
        >
          Encontre um bolão através de {"\n"} seu código único
        </Heading>

        <Input
          mb={2}
          placeholder="Qual o código do bolão?"
          onChangeText={setPoolCode}
          value={poolCode}
          autoCapitalize="characters"
        />

        <Button
          title="Buscar bolão"
          isLoading={fetchIsLoading}
          onPress={handleJoinPool}
        />
      </VStack>
    </VStack>
  );
}
