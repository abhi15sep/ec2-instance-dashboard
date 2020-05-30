# EC2-Dashboard

This project was bootstrapped with [Create React App](https://github.com/facebook/create-react-app).

Simple UI for starting and stopping EC2 instances in the browser.

## IAM Action Permissions

- `ec2:StartInstances`

- `ec2:StopInstances`

- `ec2:DescribeInstances`

## Environmental Variables

Store environmental variables in a `.env` file in the root directory of the project.

- `REACT_APP_AWS_REGION`: AWS region to use.

- `REACT_APP_AWS_ACCESS_KEY_ID`: AWS Access Key Id

- `REACT_APP_AWS_SECRET_ACCESS_KEY`: AWS Secret Access Key
