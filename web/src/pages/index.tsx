import { GetServerSideProps } from "next";

interface HomeProps {
  count: number;
}

export default function Home({ count }: HomeProps) {
  return (
    <h1 className="text-violet-500 font-bold text-4xl">Contagem: {count}!</h1>
  );
}

export const getServerSideProps: GetServerSideProps<HomeProps> = async () => {
  const response = await fetch("http://localhost:3333/pools/count");
  const data: HomeProps = await response.json();

  return {
    props: data,
  };
};
