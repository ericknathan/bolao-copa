import { useState, useCallback } from "react";
import { useFocusEffect, useNavigation } from "@react-navigation/native";
import { Octicons } from "@expo/vector-icons";
import { VStack, Icon, useToast, FlatList } from "native-base";

import {
  Button,
  EmptyPoolList,
  Header,
  Loading,
  PoolCard,
  PoolCardProps,
} from "../components";
import { api } from "../services/api";

export function Pools() {
  const [fetchIsLoading, setFetchIsLoading] = useState(true);
  const [pools, setPools] = useState<PoolCardProps[]>([]);

  const { navigate } = useNavigation();
  const toast = useToast();

  async function fetchPools() {
    try {
      setFetchIsLoading(true);
      const response = await api.get("/pools");
      setPools(response.data.pools);
    } catch (error) {
      console.log({ instance: "fetchPools", error });

      return toast.show({
        title: "Não foi possível carregar os bolões.",
        placement: "top",
        bgColor: "red.500",
      });
    } finally {
      setFetchIsLoading(false);
    }
  }

  function handleGoToPoolScreen(poolId: string) {
    navigate("details", {
      id: poolId,
    });
  }

  useFocusEffect(
    useCallback(() => {
      fetchPools();
    }, [])
  );

  return (
    <VStack flex={1} bgColor="gray.900">
      <Header title="Meus bolões" />
      <VStack
        mt={6}
        mx={5}
        borderBottomWidth={1}
        borderBottomColor="gray.600"
        pb={4}
        mb={4}
      >
        <Button
          title="Buscar bolão por código"
          leftIcon={
            <Icon as={Octicons} name="search" color="black" size="md" />
          }
          onPress={() => navigate("findPool")}
        />
      </VStack>

      {fetchIsLoading ? (
        <Loading />
      ) : (
        <FlatList
          data={pools}
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => (
            <PoolCard
              data={item}
              onPress={() => handleGoToPoolScreen(item.id)}
            />
          )}
          showsVerticalScrollIndicator={false}
          _contentContainerStyle={{
            paddingBottom: 10,
          }}
          ListEmptyComponent={() => <EmptyPoolList />}
          px={5}
        />
      )}
    </VStack>
  );
}
