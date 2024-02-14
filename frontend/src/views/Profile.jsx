import {
  Button,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
  HStack,
  PinInput,
  PinInputField,
  Box,
} from "@chakra-ui/react";
import { DecoButton } from "../components/DecoButton";
import {
  getUserInformations,
  setupOTP,
  confirmOTP,
  removeOTP,
} from "../services/usersService";
import { readFromLocalStorage } from "../utils/usersUtils";
import { useEffect, useState } from "react";
import AnimatedBackground from "../components/AnimatedBackground";
import { useCustomToast } from "../utils/Toast";

export const Profile = () => {
  const showToast = useCustomToast();
  const [user, setUser] = useState({});
  const [showModal, setShowModal] = useState(false);
  const [pinValues, setPinValues] = useState(Array(6).fill(""));
  const [OTP, setOTP] = useState({
    secret: "",
    img: "",
  });

  const getProfileData = async () => {
    const token = readFromLocalStorage("reactTemplate-token");
    const data = await getUserInformations(token);
    setUser(data);
  };

  useEffect(() => {
    getProfileData();
  }, []);

  const toggleModal = () => {
    setShowModal(!showModal);
  };

  const handleButtonClicked = async () => {
    toggleModal();
    const token = readFromLocalStorage("reactTemplate-token");
    const response = !user.doubleAuth ? await setupOTP(token) : { secret: "" }; // Faux objet pour éviter les erreurs dans l'initialisation
    setOTP((prevOTP) => ({ ...prevOTP, secret: response.secret }));
    setOTP((prevOTP) => ({ ...prevOTP, img: response.qrCodeUrl }));
  };

  const handlePinInputChange = (index, value) => {
    const newPinValues = [...pinValues];
    newPinValues[index] = value;
    setPinValues(newPinValues);
  };

  const handleConfirmButtonClick = async () => {
    const token = readFromLocalStorage("reactTemplate-token");
    const code = pinValues.join("");
    const response = !user.doubleAuth
      ? await confirmOTP(token, code, OTP.secret)
      : await removeOTP(token, code);
    if (response) {
      showToast(
        "Succès !",
        `La double authentification ${
          user.doubleAuth ? "désactivée" : "activée"
        }.`,
        "success"
      );
      setShowModal(!showModal);
      getProfileData();
    } else {
      showToast("Erreur !", "Code incorrect.", "error");
    }
  };

  const modalTitle = user.doubleAuth ? "Désactivation" : "Activation";
  const modalContent = !user.doubleAuth ? (
    <>
      <p style={{ textAlign: "center" }}>
        Veuillez scanner le QRCode avec l'application Google Authenticator et
        ensuite de fournir le code qu'il vous donnera.
      </p>
      <img style={{ width: "60%" }} src={OTP.img} alt="QRcode 2FA" />
      <p style={{ margin: "10px 0" }}>Votre code</p>
      <HStack>
        <PinInput otp>
          {pinValues.map((value, index) => (
            <PinInputField
              key={index}
              value={value}
              onChange={(e) => handlePinInputChange(index, e.target.value)}
            />
          ))}
        </PinInput>
      </HStack>
    </>
  ) : (
    <div>
      <p style={{ textAlign: "center", marginBottom: "10px" }}>
        Merci d'entrer le code présent dans votre application Google Authticator
        afin de désactiver la double authentification.
      </p>
      <Box width={"100%"} display={"flex"} justifyContent={"center"}>
        {" "}
        <PinInput otp>
          {pinValues.map((value, index) => (
            <PinInputField
              key={index}
              value={value}
              margin={"2px"}
              onChange={(e) => handlePinInputChange(index, e.target.value)}
            />
          ))}
        </PinInput>
      </Box>
    </div>
  );
  return (
    <div className="loginContainer">
      <AnimatedBackground />
      <DecoButton />
      <p>
        Double authentification :{" "}
        <Button
          colorScheme={user.doubleAuth ? "red" : "green"}
          onClick={handleButtonClicked}
        >
          {user.doubleAuth ? "Désactiver" : "Activer"}
        </Button>
      </p>
      <Modal isOpen={showModal} onClose={toggleModal}>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader textAlign={"center"}>
            {modalTitle} de la double authentification
          </ModalHeader>
          <ModalBody
            display={"flex"}
            flexDirection={"column"}
            alignItems={"center"}
          >
            {modalContent}
          </ModalBody>
          <ModalFooter display={"flex"} justifyContent={"center"}>
            <Button colorScheme="green" mr={3} onClick={toggleModal}>
              Annuler
            </Button>
            <Button variant="ghost" onClick={handleConfirmButtonClick}>
              Confirmer
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
      {showModal && (
        <div
          style={{
            position: "fixed",
            top: 0,
            left: 0,
            width: "100%",
            height: "100%",
            backgroundColor: "rgba(0, 0, 0, 0.1)",
            zIndex: 999,
          }}
        />
      )}
    </div>
  );
};
