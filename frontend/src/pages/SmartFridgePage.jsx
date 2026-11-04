import React from 'react';
import { Container } from 'react-bootstrap';
import SmartFridge from '../components/smartfridge/SmartFridge';

export default function SmartFridgePage() {
  return (
    <Container className="py-4">
      <SmartFridge />
    </Container>
  );
}
