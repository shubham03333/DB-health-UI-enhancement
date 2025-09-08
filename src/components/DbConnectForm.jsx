import React, { useState } from 'react';
import { TextField, Button, Grid, Card, Typography } from '@mui/material';
import api from '../services/api';


const DbConnectForm = ({ onConnect }) => {
  const [formData, setFormData] = useState({
    username: '',
    password: '',
    host: '',
    port: '',
    sid: '',
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const response = await api.post('/health/connect', formData);
      onConnect(response.data); // Pass result to parent component
    } catch (err) {
      setError(err.response?.data?.error || 'Connection failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Card style={{ padding: 20, marginBottom: 20 }}>
      <Typography variant="h6" gutterBottom>
        Connect to Oracle Database
      </Typography>
      <form onSubmit={handleSubmit}>
        <Grid container spacing={2}>
          {['username', 'password', 'host', 'port', 'sid'].map((field) => (
            <Grid item xs={12} sm={6} key={field}>
              <TextField
                label={field.toUpperCase()}
                name={field}
                type={field === 'password' ? 'password' : 'text'}
                fullWidth
                required
                value={formData[field]}
                onChange={handleChange}
              />
            </Grid>
          ))}
          <Grid item xs={12}>
            <Button type="submit" variant="contained" color="primary" disabled={loading}>
              {loading ? 'Connecting...' : 'Connect'}
            </Button>
          </Grid>
          {error && (
            <Grid item xs={12}>
              <Typography color="error">{error}</Typography>
            </Grid>
          )}
        </Grid>
      </form>
    </Card>
  );
};

export default DbConnectForm;
