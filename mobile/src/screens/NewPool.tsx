import { useState } from "react";
import { Heading, Text, useToast, VStack } from "native-base";
import { Button, Header, Input } from "../components";

import Logo from "../assets/logo.svg";
import { api } from "../services/api";

export function NewPool() {
  const [poolTitle, setPoolTitle] = useState("");
  const [creationIsLoading, setCreationIsLoading] = useState(false);

  const toast = useToast();

  async function handleCreatePool() {
    try {
      setCreationIsLoading(true);

      if (!poolTitle.trim()) {
        return toast.show({
          title: "Informe um nome para o seu bolão.",
          placement: "top",
          bgColor: "red.500",
        });
      }

      await api.post("/pools", { title: poolTitle.toUpperCase() });
      setPoolTitle("");

      return toast.show({
        title: "Bolão criado com sucesso!",
        placement: "top",
        bgColor: "green.500",
      });
    } catch (error) {
      console.log({ instance: "handleCreatePool", error });

      return toast.show({
        title: "Não foi possível criar o bolão.",
        placement: "top",
        bgColor: "red.500",
      });
    } finally {
      setCreationIsLoading(false);
    }
  }

  return (
    <VStack flex={1} bgColor="gray.900">
      <Header title="Criar novo bolão" />

      <VStack mt={8} mx={5} alignItems="center">
        <Logo />

        <Heading
          fontFamily="heading"
          color="white"
          fontSize="xl"
          my={8}
          textAlign="center"
        >
          Crie seu próprio bolão da copa {"\n"} e compartilhe entre amigos!
        </Heading>

        <Input
          mb={2}
          placeholder="Qual nome do seu bolão?"
          onChangeText={setPoolTitle}
          value={poolTitle}
        />

        <Button
          title="Criar meu bolão"
          onPress={handleCreatePool}
          isLoading={creationIsLoading}
        />

        <Text color="gray.200" fontSize="sm" textAlign="center" px={10} mt={4}>
          Após criar seu bolão, você receberá um código único que poderá usar
          para convidar outras pessoas.
        </Text>
      </VStack>
    </VStack>
  );
}
