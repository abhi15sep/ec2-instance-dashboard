import React, { Component } from 'react';
import AWS from 'aws-sdk';
import deepEqual from 'fast-deep-equal';

import { Container } from 'semantic-ui-react';
import Title from './Title';
import ErrorMessage from './ErrorMessage';
import InstanceCard from './InstanceCard';

AWS.config.update({
  region: process.env.REACT_APP_AWS_REGION,
  credentials: {
    accessKeyId: process.env.REACT_APP_AWS_ACCESS_KEY_ID,
    secretAccessKey: process.env.REACT_APP_AWS_SECRET_ACCESS_KEY
  }
});

const ec2 = new AWS.EC2({ apiVersion: '2016-11-15' });

class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
      instances: [],
      error: ''
    };
    
    console.log(process.env.REACT_APP_AWS_REGION);
    this.handleDismiss = this.handleDismiss.bind(this);
    this.startStopInstance = this.startStopInstance.bind(this);
    this.describeInstances = this.describeInstances.bind(this);
    this.startInstance = this.startInstance.bind(this);
    this.stopInstance = this.stopInstance.bind(this);
  }

  handleDismiss() {
    this.setState(state => ({
      ...state,
      error: ''
    }));
  }

  startStopInstance(e) {
    const instanceId = e.target.id;
    const buttonState = e.target.innerText;
    switch (buttonState) {
      case 'Start Server':
        return this.startInstance(instanceId);
      case 'Stop Server':
        return this.stopInstance(instanceId);
      default:
        return;
    }
  }

  async describeInstances() {
    try {
      const response = await ec2.describeInstances().promise();
      this.processInstanceData(response);
    } catch (err) {
      console.log(err, err.stack);
      this.setState(state => ({
        ...state,
        error:
          'Failed to contact server. Check your config and network connection',
        loading: false
      }));
    }
  }

  processInstanceData(response) {
    try {
      const instances = response.Reservations.reduce(
        (instances, reservation) => {
          return [...instances, ...reservation.Instances];
        },
        []
      ).map(instance => {
        const instanceState = instance.State.Name;
        switch (instanceState) {
          case 'stopped':
            return {
              id: instance.InstanceId,
              instanceTags: instance.Tags,
              instanceState,
              buttonState: 'Start Server',
              loading: false
            };
          case 'running':
            return {
              id: instance.InstanceId,
              instanceTags: instance.Tags,
              instanceState,
              buttonState: 'Stop Server',
              loading: false
            };
          case 'terminated':
            return {
              id: instance.InstanceId,
              instanceTags: instance.Tags,
              instanceState,
              buttonState: 'Terminated',
              loading: false
            };
          default:
            return {
              id: instance.InstanceId,
              instanceTags: instance.Tags,
              instanceState,
              buttonState: 'Transition',
              loading: true
            };
        }
      });

      if (!deepEqual(instances, this.state.instances)) {
        this.setState(state => ({
          ...state,
          instances: instances
        }));
      }
    } catch (err) {
      console.log(err, err.stack);
      this.setState(state => ({
        ...state,
        error:
          'Failed to contact server. Check your config and network connection',
        loading: false
      }));
    }
  }

  async startInstance(id) {
    const params = {
      InstanceIds: [id]
    };
    try {
      this.setState(state => {
        const instances = state.instances.map(instance => {
          return instance.id !== id
            ? instance
            : {
                ...instance,
                instanceState: 'pending',
                loading: true
              };
        });
        return {
          ...state,
          instances
        };
      });
      const response = await ec2.startInstances(params).promise();
      console.log(response);
    } catch (err) {
      console.log(err, err.stack);
      this.setState(state => ({
        ...state,
        error: err.message
      }));
    }
  }

  async stopInstance(id) {
    const params = {
      InstanceIds: [id]
    };
    try {
      this.setState(state => {
        const instances = state.instances.map(instance => {
          return instance.id !== id
            ? instance
            : {
                ...instance,
                instanceState: 'stopping',
                loading: true
              };
        });
        return {
          ...state,
          instances
        };
      });
      const response = await ec2.stopInstances(params).promise();
      console.log(response);
    } catch (err) {
      console.log(err, err.stack);
      this.setState(state => ({
        ...state,
        error: err.message
      }));
    }
  }

  componentDidMount() {
    this.checkingStatus = setInterval(this.describeInstances, 2000);
  }

  componentWillUnmount() {
    clearInterval(this.checkingStatus);
  }

  render() {
    const { error, instances } = this.state;

    return (
      <>
        <Title />
        <Container style={{ marginTop: '6rem' }}>
          <ErrorMessage error={error} handleDismiss={this.handleDismiss} />
          {instances.map(instance => (
            <InstanceCard
              key={instance.id}
              instance={instance}
              handleButtonClick={this.startStopInstance}
            />
          ))}
        </Container>
      </>
    );
  }
}

export default App;
