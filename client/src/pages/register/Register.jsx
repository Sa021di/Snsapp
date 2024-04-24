import { useState } from "react";
import { Link } from "react-router-dom";
import "./register.scss";
import axios from "axios";
import TextField from '@mui/material/TextField';
import IconButton from '@mui/material/IconButton';
import InputAdornment from '@mui/material/InputAdornment';
import VisibilityIcon from '@mui/icons-material/Visibility';
import VisibilityOffIcon from '@mui/icons-material/VisibilityOff';
import Alert from '@mui/material/Alert';
import Button from '@mui/material/Button';

const Register = () => {
  const [inputs, setInputs] = useState({
    username: "",
    email: "",
    password: "",
    name: "",
  });
  const [error, setError] = useState(null);
  const [passwordShown, setPasswordShown] = useState(false);
  const [alert, setAlert] = useState(null);
  const handleChange = (e) => {
    setInputs((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };
  const togglePasswordVisibility = () => {
    setPasswordShown(!passwordShown);
  };
  const handleSubmit = async (e) => {
    e.preventDefault();
    setAlert(null);
    if (!inputs.username || !inputs.email || !inputs.password || !inputs.name) {
      setAlert({ severity: "error", message: "All fields are required." });
      return;
    }

    try {
      await axios.post("http://localhost:8800/api/auth/register", inputs);
      setAlert({ severity: "success", message: "Registration successful! Please continue loging..." });
    } catch (error) {
      if (error.response) {
        const message =
          error.response.status === 409
            ? "User already exists."
            : "An error occurred during registration.";
        setAlert({ severity: "error", message: message });
      } else {
        setAlert({ severity: "error", message: "Network error." });
      }
    }
  };

  return (
    <div className="register">
      {alert && (
        <Alert severity={alert.severity} className="alert">
          {alert.message}
        </Alert>
      )}
      <div className="card">
        <form onSubmit={handleSubmit}>
          <h1>Create Account</h1>
          <TextField
            variant="outlined"
            margin="normal"
            fullWidth
            label="Name"
            name="name"
            value={inputs.name}
            onChange={handleChange}
            required
          />
          <TextField
            variant="outlined"
            margin="normal"
            fullWidth
            label="Username"
            name="username"
            value={inputs.username}
            onChange={handleChange}
            required
          />
          <TextField
            variant="outlined"
            margin="normal"
            fullWidth
            label="Email"
            name="email"
            value={inputs.email}
            onChange={handleChange}
            required
          />
          <TextField
            variant="outlined"
            margin="normal"
            fullWidth
            type={passwordShown ? "text" : "password"}
            label="Password"
            name="password"
            value={inputs.password}
            onChange={handleChange}
            required
            InputProps={{
              endAdornment: (
                <InputAdornment position="end">
                  <IconButton
                    aria-label="toggle password visibility"
                    onClick={togglePasswordVisibility}
                  >
                    {passwordShown ? <VisibilityOffIcon /> : <VisibilityIcon />}
                  </IconButton>
                </InputAdornment>
              ),
            }}
          />
          <Button
            type="submit"
            variant="contained"
            color="primary"
            className="create-account-button"
          >
            Create Account
          </Button>
          <Button
            variant="contained"
            color="primary"
            className="login-button"
            component={Link}
            to="/login"
          >
            Log in
          </Button>
        </form>
      </div>
    </div>
  );
};

export default Register;
