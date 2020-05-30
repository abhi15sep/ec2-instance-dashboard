import React from 'react';
import { Container, Header, Button, Segment } from 'semantic-ui-react';
import './style.scss';

import InstanceTags from './InstanceTags.jsx';
import { getStatusColour, getButtonColour } from '../../utils/colour.js';

const InstanceCard = ({ instance, handleButtonClick }) => {
  const { id, instanceState, instanceTags, buttonState, loading } = instance;

  return (
    <Container textAlign="center" className="instance">
      <Segment padded="very" className="instance__content">
        <Header as="h1">{id}</Header>
        <InstanceTags tags={instanceTags} />
        <Header as="h2" color={getStatusColour(instanceState)}>
          {loading
            ? instanceState.toUpperCase() + '...'
            : instanceState.toUpperCase()}
        </Header>
        <Container className="instance__button--container">
          <Button
            id={id}
            className="instance__button"
            content={buttonState}
            color={getButtonColour(instanceState)}
            onClick={handleButtonClick}
            loading={loading}
            disabled={instanceState === 'terminated'}
          />
        </Container>
      </Segment>
    </Container>
  );
};

export default InstanceCard;
