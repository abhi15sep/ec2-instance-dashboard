import React from 'react';
import { Container, Message } from 'semantic-ui-react';

const ErrorMessage = ({ error, handleDismiss }) => {
  return (
    <Container>
      {error && (
        <Message
          header="Something went wrong,"
          content={error}
          negative
          onDismiss={handleDismiss}
        />
      )}
    </Container>
  );
};

export default ErrorMessage;
