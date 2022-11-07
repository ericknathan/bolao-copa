import { useState, useEffect } from "react";
import { Share } from "react-native";
import { useRoute } from "@react-navigation/native";
import { HStack, useToast, VStack } from "native-base";
import {
  EmptyMyPoolList,
  Guesses,
  Header,
  Loading,
  Option,
  PoolCardProps,
  PoolHeader,
} from "../components";
import { api } from "../services/api";

interface RouteParams {
  id: string;
}

export function Details() {
  const [selectedTabOption, setSelectedTabOption] = useState<
    "guesses" | "ranking"
  >("guesses");
  const [fetchIsLoading, setFetchIsLoading] = useState(true);
  const [poolDetails, setPoolDetails] = useState<PoolCardProps>(
    {} as PoolCardProps
  );

  const toast = useToast();
  const route = useRoute();
  const { id } = route.params as RouteParams;

  async function fetchPoolDetails() {
    try {
      setFetchIsLoading(true);

      const response = await api.get(`/pools/${id}`);
      setPoolDetails(response.data.pool);
    } catch (error) {
      console.log({ instance: "fetchPoolDetails", error });

      return toast.show({
        title: "Não foi possível carregar dados do bolão.",
        placement: "top",
        bgColor: "red.500",
      });
    } finally {
      setFetchIsLoading(false);
    }
  }

  async function handleCodeShare() {
    Share.share({
      message: poolDetails?.code,
      url: poolDetails?.code,
    });
  }

  useEffect(() => {
    fetchPoolDetails();
  }, [id]);

  if (fetchIsLoading) {
    return <Loading />;
  }

  return (
    <VStack flex={1} bgColor="gray.900">
      <Header
        title={poolDetails?.title}
        showBackButton
        showShareButton
        onShare={handleCodeShare}
      />

      {poolDetails?._count?.participants > 0 ? (
        <VStack px={5} flex={1}>
          <PoolHeader data={poolDetails} />
          <HStack bgColor="gray.800" p={1} rounded="sm" mb={5}>
            <Option
              title="Seus palpites"
              isSelected={selectedTabOption === "guesses"}
              onPress={() => setSelectedTabOption("guesses")}
            />
            <Option
              title="Ranking do grupo"
              isSelected={selectedTabOption === "ranking"}
              onPress={() => setSelectedTabOption("ranking")}
            />
          </HStack>

          <Guesses poolId={poolDetails?.id} code={poolDetails?.code} />
        </VStack>
      ) : (
        <EmptyMyPoolList code={poolDetails?.code} />
      )}
    </VStack>
  );
}
