import { useToast } from "@chakra-ui/react";

export const useCustomToast = () => {
  const toast = useToast();

  const showToast = (title, description, status) => {
    toast({
      title: title,
      description: description,
      status: status,
      position: "top-right",
      variant: "left-accent",
      duration: 5000,
      isClosable: true,
    });
  };

  return showToast;
};
