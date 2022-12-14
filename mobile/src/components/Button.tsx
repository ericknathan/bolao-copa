import { Button as NativeBaseButton, Text, IButtonProps } from "native-base";

interface ButtonProps extends IButtonProps {
  title: string;
  type?: "primary" | "secondary";
}

export function Button({ title, type = "primary", ...props }: ButtonProps) {
  return (
    <NativeBaseButton
      w="full"
      h={14}
      rounded="sm"
      fontSize="md"
      bg={type === "secondary" ? "red.500" : "yellow.500"}
      _pressed={{
        bg: type === "secondary" ? "red.700" : "yellow.600",
      }}
      _loading={{
        _spinner: { color: type === "secondary" ? "white" : "black" },
      }}
      {...props}
    >
      <Text
        textTransform="uppercase"
        fontSize="sm"
        fontFamily="heading"
        color={type === "secondary" ? "white" : "black"}
      >
        {title}
      </Text>
    </NativeBaseButton>
  );
}
