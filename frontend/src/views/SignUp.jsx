import "../css/login.css";
import { useState } from "react";
import AnimatedBackground from "../components/AnimatedBackground";
import {
  Box,
  Center,
  Flex,
  Input,
  Select,
  Text,
  Button,
  useToast,
  Progress,
  Checkbox,
} from "@chakra-ui/react";
import {
  Step,
  StepDescription,
  StepIcon,
  StepIndicator,
  StepNumber,
  StepStatus,
  StepTitle,
  Stepper,
} from "@chakra-ui/react";
import { useNavigate } from "react-router-dom";
import { signUpUser } from "../services/usersService";

const steps = [
  { description: "Utilisateur" },
  { description: "Sécurité" },
  { description: "Résumé" },
];

export const SignUp = () => {
  const navigate = useNavigate();
  const toast = useToast();
  const [step, setStep] = useState(0);
  const [isChecked, setIsChecked] = useState(false);
  const [formData, setFormData] = useState({
    lastName: "",
    firstName: "",
    mail: "",
    birthday: "",
    gender: "",
    password: "",
    confirmPassword: "",
  });
  const handleCheckboxChange = (event) => {
    setIsChecked(event.target.checked);
  };
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };
  const validateStep1Form = () => {
    if (formData.lastName.trim() === "") {
      toast({
        title: "Erreur !",
        description: "Merci de rentrer un nom valide.",
        status: "error",
        position: "top-right",
        variant: "left-accent",
        duration: 5000,
        isClosable: true,
      });
      return false;
    }
    if (formData.firstName.trim() === "") {
      toast({
        title: "Erreur !",
        description: "Merci de rentrer un prénom valide.",
        status: "error",
        position: "top-right",
        variant: "left-accent",
        duration: 5000,
        isClosable: true,
      });
      return false;
    }
    const mailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!mailPattern.test(formData.mail)) {
      toast({
        title: "Erreur !",
        description: "Merci de rentrer un mail valide.",
        status: "error",
        position: "top-right",
        variant: "left-accent",
        duration: 5000,
        isClosable: true,
      });
      return false;
    }
    const currentDate = new Date();
    const selectedDate = new Date(formData.birthday);
    if (selectedDate >= currentDate) {
      toast({
        title: "Erreur !",
        description: "Merci de rentrer une date de naissance valide.",
        status: "error",
        position: "top-right",
        variant: "left-accent",
        duration: 5000,
        isClosable: true,
      });
      return false;
    }
    return true;
  };
  const validateStep2Form = () => {
    if (
      formData.password.trim() === "" ||
      formData.confirmPassword.trim() === ""
    ) {
      toast({
        title: "Erreur !",
        description: "Merci de rentrer un mot de passe valide.",
        status: "error",
        position: "top-right",
        variant: "left-accent",
        duration: 5000,
        isClosable: true,
      });
      return false;
    }
    if (formData.password.trim() !== formData.confirmPassword.trim()) {
      toast({
        title: "Erreur !",
        description: "Les mots de passe sont différents.",
        status: "error",
        position: "top-right",
        variant: "left-accent",
        duration: 5000,
        isClosable: true,
      });
      return false;
    }
    if (formData.password.trim().length < 8) {
      toast({
        title: "Erreur !",
        description: "Le mot de passe doit avoir minimum 8 caractères.",
        status: "error",
        position: "top-right",
        variant: "left-accent",
        duration: 5000,
        isClosable: true,
      });
      return false;
    }
    if (isChecked === false) {
      toast({
        title: "Erreur !",
        description: "Merci d'accepter les CGU / CGV.",
        status: "error",
        position: "top-right",
        variant: "left-accent",
        duration: 5000,
        isClosable: true,
      });
      return false;
    }
    return true;
  };

  const handleStep1 = () => {
    if (validateStep1Form()) {
      setStep(step + 1);
    }
  };
  const handleStep2 = async () => {
    if (validateStep2Form()) {
      const response = await signUpUser(formData);
      if (response.type === "success") {
        setStep(step + 2);
      }
      toast({
        title: response.title,
        description: response.message,
        status: response.type,
        position: "top-right",
        variant: "left-accent",
        duration: 5000,
        isClosable: true,
      });
    }
  };
  const handleBack = () => {
    setStep(step - 1);
  };

  const calculatePasswordStrength = () => {
    const password = formData.password;
    let strength = 0;
    if (password.length >= 8) {
      strength += 25;
    }
    if (/[a-z]/.test(password) && /[A-Z]/.test(password)) {
      strength += 25;
    }
    if (/\d/.test(password)) {
      strength += 25;
    }
    if (/[!@#$%^&*(),.?":{}|<>_]/.test(password)) {
      strength += 25;
    }

    let strengthClass;
    if (strength < 50) {
      strengthClass = "red";
    } else if (strength < 75) {
      strengthClass = "orange";
    } else {
      strengthClass = "green";
    }
    return { strength, strengthClass };
  };

  const { strength, strengthClass } = calculatePasswordStrength();

  const renderForm = () => {
    switch (step) {
      case 0:
        return (
          <form className="step1">
            <Flex mt={"15px"}>
              <div style={{ marginRight: "6px" }}>
                <Text textAlign="left !important">Nom *</Text>
                <Input
                  m={"0px 6px 6px 0"}
                  size="sm"
                  name="lastName"
                  value={formData.lastName}
                  onChange={handleChange}
                />
              </div>
              <div style={{ marginLeft: "6px" }}>
                <Text textAlign="left !important">Prénom *</Text>
                <Input
                  m={"0 0 6px 0px"}
                  size="sm"
                  name="firstName"
                  value={formData.firstName}
                  onChange={handleChange}
                />
              </div>
            </Flex>
            <Text textAlign="left !important">Adresse mail *</Text>
            <Input
              mb={"6px"}
              size="sm"
              name="mail"
              value={formData.mail}
              onChange={handleChange}
            />
            <Text textAlign="left !important" fontSize="xl">
              Date de naissance
            </Text>
            <Input
              mb="6px"
              type="date"
              size="sm"
              name="birthday"
              value={formData.birthday}
              onChange={handleChange}
            />
            <Text textAlign="left !important">Genre</Text>
            <Select
              mb={"6px"}
              size="sm"
              name="gender"
              value={formData.gender}
              onChange={handleChange}
            >
              <option value="">Sélectionnez votre genre</option>
              <option value="Homme">Homme</option>
              <option value="Femme">Femme</option>
              <option value="Autre">Autre</option>
            </Select>
            <div
              style={{
                display: "flex",
                width: "100%",
                justifyContent: "center",
                marginTop: "10px",
              }}
            >
              <Button colorScheme="green" onClick={handleStep1}>
                Suivant
              </Button>
            </div>
          </form>
        );
      case 1:
        return (
          <form style={{ marginTop: "15px" }} className="step2">
            <Text textAlign="left !important">Mot de passe *</Text>
            <Input
              mb={"6px"}
              type="password"
              size="sm"
              name="password"
              value={formData.password}
              onChange={handleChange}
            />
            <Text textAlign="left !important">Confirmer *</Text>
            <Input
              mb={"6px"}
              type="password"
              size="sm"
              name="confirmPassword"
              value={formData.confirmPassword}
              onChange={handleChange}
            />
            <div style={{ margin: "10px 0" }}>
              <Text textAlign="left !important">Niveau de sécurité</Text>
              <Progress
                hasStripe
                isAnimated
                max={100}
                value={strength}
                colorScheme={strengthClass}
              />
            </div>
            <Checkbox
              isChecked={isChecked}
              onChange={handleCheckboxChange}
              size={"sm"}
              colorScheme="green"
            >
              J'accepte les CGU / CGV
            </Checkbox>
            <div
              style={{
                display: "flex",
                width: "100%",
                justifyContent: "space-around",
                marginTop: "10px",
              }}
            >
              <Button
                colorScheme="green"
                variant="outline"
                onClick={handleBack}
              >
                Retour
              </Button>
              <Button colorScheme="green" onClick={handleStep2}>
                Suivant
              </Button>
            </div>
          </form>
        );
      case 3:
        return (
          <form style={{ marginTop: "15px" }} className="step3">
            <h3 style={{ textAlign: "center" }}>Merci de votre insciption !</h3>
            <p>
              Un mail a été envoyé à l'adresse{" "}
              <span style={{ fontWeight: "600" }}>{formData.mail}</span> afin de
              valider votre compte.
            </p>
            <div
              style={{
                display: "flex",
                width: "100%",
                justifyContent: "space-around",
                marginTop: "10px",
              }}
            >
              <Button colorScheme="green" onClick={() => navigate("/")}>
                Retour à l'accueil
              </Button>
            </div>
          </form>
        );
      default:
        return null;
    }
  };

  return (
    <div className="loginContainer">
      <AnimatedBackground />
      <Center h="100vh">
        <Box
          bg="white"
          className="loginBox"
          boxShadow="md"
          borderRadius="md"
          p={6}
          mx="auto"
          maxW="md"
        >
          <div className="signUp">
            <h2>Inscription</h2>
            <StepperSignUp activeStep={step} />
            {renderForm()}
            <div className="loginOptions">
              <p onClick={() => navigate("/")}>Déjà un compte ?</p>
            </div>
          </div>
        </Box>
      </Center>
    </div>
  );
};

function StepperSignUp({ activeStep }) {
  return (
    <Stepper size="lg" colorScheme="green" index={activeStep}>
      {steps.map((step, index) => (
        <Step key={index}>
          <StepIndicator>
            <StepStatus
              complete={<StepIcon />}
              incomplete={<StepNumber />}
              active={<StepNumber />}
            />
          </StepIndicator>
          <Box flexShrink="0">
            <StepTitle>{step.title}</StepTitle>
            <StepDescription>{step.description}</StepDescription>
          </Box>
        </Step>
      ))}
    </Stepper>
  );
}
