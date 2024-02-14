import { readFromLocalStorage } from "./usersUtils";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useToast } from "@chakra-ui/react";

export const NotAllowForConnectedPeople = ({ children }) => {
  const navigate = useNavigate();
  const [allowRender, setAllowRender] = useState(false);
  const toast = useToast();

  useEffect(() => {
    if (readFromLocalStorage("reactTemplate-token") !== null) {
      toast({
        title: "Erreur !",
        description: "Vous êtes déjà connecté.",
        status: "error",
        position: "top-right",
        variant: "left-accent",
        duration: 3000,
        isClosable: true,
      });
      navigate("/");
    } else {
      setAllowRender(true);
    }
  }, [navigate, toast]);

  return allowRender ? <>{children}</> : null;
};

export const NotAllowForDisconnectedPeople = ({ children }) => {
  const navigate = useNavigate();
  const [allowRender, setAllowRender] = useState(false);
  const toast = useToast();

  useEffect(() => {
    if (readFromLocalStorage("reactTemplate-token") === null) {
      toast({
        title: "Erreur !",
        description: "Vous devez être connecté pour accéder à cette page.",
        status: "error",
        position: "top-right",
        variant: "left-accent",
        duration: 3000,
        isClosable: true,
      });
      navigate("/");
    } else {
      setAllowRender(true);
    }
  }, [navigate, toast]);

  return allowRender ? <>{children}</> : null;
};
