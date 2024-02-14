import "../css/login.css";
import { useState } from "react";
import {
  Box,
  Center,
  FormControl,
  Input,
  InputGroup,
  Button,
  Checkbox,
  Divider,
  useToast,
  Fade,
  HStack,
  PinInput,
  PinInputField,
} from "@chakra-ui/react";
import { library } from "@fortawesome/fontawesome-svg-core";
import { faEye, faEyeSlash } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import AnimatedBackground from "../components/AnimatedBackground";
import { useNavigate } from "react-router-dom";
import { logInUser, needOTP } from "../services/usersService";
import { writeToLocalStorage } from "../utils/usersUtils";
import { useCustomToast } from "../utils/Toast";

library.add(faEye);

const PasswordInput = ({ value, onChange }) => {
  const [show, setShow] = useState(false);
  const handleClick = () => setShow(!show);

  const handleChange = (e) => {
    onChange(e.target.value);
  };

  return (
    <InputGroup size="sm">
      <Input
        pr="4.5rem"
        type={show ? "text" : "password"}
        placeholder="Mot de passe"
        value={value}
        onChange={handleChange}
      />
      <Button
        h="1.75rem"
        size="sm"
        position="absolute"
        right={1}
        top={1 / 2}
        onClick={handleClick}
      >
        {show ? (
          <FontAwesomeIcon icon={faEyeSlash} />
        ) : (
          <FontAwesomeIcon icon={faEye} />
        )}
      </Button>
    </InputGroup>
  );
};

export const Login = () => {
  const navigate = useNavigate();
  const toast = useToast();
  const showToast = useCustomToast();
  const [pinValues, setPinValues] = useState(Array(6).fill(""));

  const [user, setUser] = useState({
    mail: "",
    password: "",
    stayOnline: false,
  });
  const [showFirstConnexionBox, setShowFirstConnexionBox] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setUser({ ...user, [name]: value });
  };
  const handleCheckboxChange = () => {
    setUser({
      ...user,
      stayOnline: !user.stayOnline,
    });
  };

  const handlePinInputChange = (index, value) => {
    const newPinValues = [...pinValues];
    newPinValues[index] = value;
    setPinValues(newPinValues);
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (user.mail === "" || user.password === "") {
      toast({
        title: "Erreur !",
        description: "Merci de remplir correctement les champs.",
        status: "error",
        position: "top-right",
        variant: "left-accent",
        duration: 3000,
        isClosable: true,
      });
    } else {
      const response = await logInUser(user);
      if (response) {
        if (response === "2FA ON") {
          setShowFirstConnexionBox(true);
        } else {
          writeToLocalStorage("reactTemplate-token", response);
          toast({
            title: "Succès !",
            description: "Connexion réussite.",
            status: "success",
            position: "top-right",
            variant: "left-accent",
            duration: 5000,
            isClosable: true,
          });
          navigate("/");
        }
      }
    }
  };

  const handleConfirmOTP = async () => {
    const code = pinValues.join("");
    const response = await needOTP(code, user);
    if (response) {
      writeToLocalStorage("reactTemplate-token", response);
      toast({
        title: "Succès !",
        description: "Connexion réussite.",
        status: "success",
        position: "top-right",
        variant: "left-accent",
        duration: 5000,
        isClosable: true,
      });
      navigate("/");
    } else {
      showToast("Erreur !", "Code incorrect.", "error");
    }
  };

  return (
    <div className="loginContainer">
      <AnimatedBackground />
      <Center h="100vh">
        {showFirstConnexionBox ? (
          <Fade in={showFirstConnexionBox}>
            <Box
              bg="white"
              className="loginBox"
              boxShadow="md"
              borderRadius="md"
              p={6}
              mx="auto"
              maxW="md"
            >
              <form>
                <h2>Double authentification requise</h2>
                <p>
                  Merci de fournir le code présent dans votre application Google
                  Authenticator afin de confirmer votre identité.
                </p>
                <HStack
                  width={"100%"}
                  display={"flex"}
                  justifyContent={"center"}
                >
                  <PinInput wid otp>
                    {pinValues.map((value, index) => (
                      <PinInputField
                        key={index}
                        margin={"10px 3px"}
                        value={value}
                        onChange={(e) =>
                          handlePinInputChange(index, e.target.value)
                        }
                      />
                    ))}
                  </PinInput>
                </HStack>
                <Box
                  width={"100%"}
                  display={"flex"}
                  justifyContent={"center"}
                  marginTop={"15px"}
                >
                  <Button colorScheme="green" onClick={handleConfirmOTP}>
                    Valider
                  </Button>
                </Box>
              </form>
            </Box>
          </Fade>
        ) : (
          <Fade in={!showFirstConnexionBox}>
            <Box
              bg="white"
              className="loginBox"
              boxShadow="md"
              borderRadius="md"
              p={6}
              mx="auto"
              maxW="md"
            >
              <form>
                <h2>Connexion</h2>
                <p>Bon retour parmi nous !</p>
                <FormControl isRequired mt={4} mb={4}>
                  <Input
                    type="email"
                    name="mail"
                    placeholder="Adresse mail"
                    size="sm"
                    p={3}
                    value={user.mail}
                    onChange={handleChange}
                  />
                </FormControl>
                <FormControl isRequired>
                  <PasswordInput
                    value={user.password}
                    onChange={(value) => setUser({ ...user, password: value })}
                  />
                </FormControl>
                <div className="loginOptions">
                  <Checkbox
                    colorScheme="green"
                    isChecked={user.stayOnline}
                    onChange={handleCheckboxChange}
                    size={"sm"}
                    mt={2}
                    mb={2}
                  >
                    Rester connecté
                  </Checkbox>
                  <Button
                    colorScheme="green"
                    onClick={(e) => handleLogin(e)}
                    type="submit"
                  >
                    Connexion
                  </Button>
                  <Box position="relative" padding="5">
                    <Divider />
                    <div className="socialNetwork">
                      <Button colorScheme="red" size={"sm"}>
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          height={15}
                          viewBox="0 0 488 512"
                        >
                          <path
                            fill="#ffffff"
                            d="M488 261.8C488 403.3 391.1 504 248 504 110.8 504 0 393.2 0 256S110.8 8 248 8c66.8 0 123 24.5 166.3 64.9l-67.5 64.9C258.5 52.6 94.3 116.6 94.3 256c0 86.5 69.1 156.6 153.7 156.6 98.2 0 135-70.4 140.8-106.9H248v-85.3h236.1c2.3 12.7 3.9 24.9 3.9 41.4z"
                          />
                        </svg>
                      </Button>
                      <Button colorScheme="facebook" size={"sm"}>
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          height={15}
                          viewBox="0 0 512 512"
                        >
                          <path
                            fill="#ffffff"
                            d="M512 256C512 114.6 397.4 0 256 0S0 114.6 0 256C0 376 82.7 476.8 194.2 504.5V334.2H141.4V256h52.8V222.3c0-87.1 39.4-127.5 125-127.5c16.2 0 44.2 3.2 55.7 6.4V172c-6-.6-16.5-1-29.6-1c-42 0-58.2 15.9-58.2 57.2V256h83.6l-14.4 78.2H287V510.1C413.8 494.8 512 386.9 512 256h0z"
                          />
                        </svg>
                      </Button>
                      <Button colorScheme="gray" size={"sm"}>
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          height={15}
                          viewBox="0 0 384 512"
                        >
                          <path
                            fill="#000000"
                            d="M318.7 268.7c-.2-36.7 16.4-64.4 50-84.8-18.8-26.9-47.2-41.7-84.7-44.6-35.5-2.8-74.3 20.7-88.5 20.7-15 0-49.4-19.7-76.4-19.7C63.3 141.2 4 184.8 4 273.5q0 39.3 14.4 81.2c12.8 36.7 59 126.7 107.2 125.2 25.2-.6 43-17.9 75.8-17.9 31.8 0 48.3 17.9 76.4 17.9 48.6-.7 90.4-82.5 102.6-119.3-65.2-30.7-61.7-90-61.7-91.9zm-56.6-164.2c27.3-32.4 24.8-61.9 24-72.5-24.1 1.4-52 16.4-67.9 34.9-17.5 19.8-27.8 44.3-25.6 71.9 26.1 2 49.9-11.4 69.5-34.3z"
                          />
                        </svg>
                      </Button>
                    </div>
                  </Box>
                  <p onClick={() => navigate("/sign-up")}>
                    Pas encore de compte ?
                  </p>
                </div>
              </form>
            </Box>
          </Fade>
        )}
      </Center>
    </div>
  );
};
