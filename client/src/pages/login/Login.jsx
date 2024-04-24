import { useState, useContext } from "react";
import { Link, useNavigate } from "react-router-dom";
import { AuthContext } from "../../context/authContext";
import VisibilityIcon from '@mui/icons-material/Visibility';
import VisibilityOffIcon from '@mui/icons-material/VisibilityOff';
import Alert from '@mui/material/Alert';
import FormControl from '@mui/material/FormControl';
import OutlinedInput from '@mui/material/OutlinedInput';
import InputLabel from '@mui/material/InputLabel';
import InputAdornment from '@mui/material/InputAdornment';
import IconButton from '@mui/material/IconButton';
import Button from '@mui/material/Button';
import "./login.scss";

const Login = () => {
  const [inputs, setInputs] = useState({
    username: "",
    password: "",
  });
  const [alert, setAlert] = useState(null);
  const [passwordShown, setPasswordShown] = useState(false);
  const navigate = useNavigate();
  const { login } = useContext(AuthContext);

  const handleChange = (e) => {
    setInputs((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const togglePasswordVisibility = () => {
    setPasswordShown(!passwordShown);
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    setAlert(null);

    try {
      const response = await login(inputs);
      setAlert({ severity: "success", message: "Successfully logged in." });
      navigate("/");
    } catch (error) {
    
      if (error.response) {
        const message =
          error.response.status === 401
            ? "Incorrect username or password."
            : error.response.status === 404
            ? "User not found."
            : "Incorrect password.";
        setAlert({ severity: "error", message: message });
      } else {
        setAlert({ severity: "error", message: "Network error." });
      }
    }
  };

  return (
    <div className="login">
      {alert && (
        <Alert severity={alert.severity} className="alert">
          {alert.message}
        </Alert>
      )}
      <div className="card">
        <h1>Login</h1>
        <form onSubmit={handleLogin} noValidate autoComplete="off">
          <FormControl fullWidth margin="normal" variant="outlined">
            <InputLabel htmlFor="username">Username</InputLabel>
            <OutlinedInput
              id="username"
              name="username"
              label="Username"
              value={inputs.username}
              onChange={handleChange}
              required
            />
          </FormControl>
          <FormControl fullWidth margin="normal" variant="outlined">
            <InputLabel htmlFor="password">Password</InputLabel>
            <OutlinedInput
              id="password"
              type={passwordShown ? "text" : "password"}
              name="password"
              label="Password"
              value={inputs.password}
              onChange={handleChange}
              endAdornment={
                <InputAdornment position="end">
                  <IconButton
                    aria-label="toggle password visibility"
                    onClick={togglePasswordVisibility}
                    edge="end"
                  >
                    {passwordShown ? <VisibilityOffIcon /> : <VisibilityIcon />}
                  </IconButton>
                </InputAdornment>
              }
              required
            />
          </FormControl>
          <Button
            type="submit"
            variant="contained"
            color="primary"
            className="login-button"
          >
            Log In
          </Button>
          <Button
            variant="contained"
            color="primary"
            className="create-account-link"
            component={Link}
            to="/register"
          >
            Create Account
          </Button>
        </form>
      </div>
    </div>
  );
};

export default Login;
