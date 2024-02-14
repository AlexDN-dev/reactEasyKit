import { Button, useToast } from "@chakra-ui/react";
import { removeFromLocalStorage } from "../utils/usersUtils";
import { useNavigate } from "react-router-dom";

export const DecoButton = () => {
  const navigate = useNavigate();
  const toast = useToast();
  const handleDisconnect = () => {
    removeFromLocalStorage("reactTemplate-token");
    toast({
      title: "Succès",
      description: "Déconnexion réussite.",
      status: "success",
      position: "top-right",
      variant: "left-accent",
      duration: 3000,
      isClosable: true,
    });
    navigate("/login");
  };

  return (
    <Button onClick={handleDisconnect} colorScheme="red">
      Déconnexion
    </Button>
  );
};
