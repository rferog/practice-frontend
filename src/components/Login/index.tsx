import {
  gql,
  useMutation
} from '@apollo/client';
import {
  Formik,
  Form,
  Field,
  ErrorMessage
} from 'formik';
import React, { useCallback, useState } from 'react';
import { Modal } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';

import { IAuthResult } from 'components/Login/types';
import './index.css';
import { CustomButton } from 'components/Buttons';
import { ToastMsg } from 'components/ToastMsg';
import { GET_USER_TOKEN } from 'components/Login/queries';

const Login: React.FC = (): JSX.Element => {
  const navigate = useNavigate();
  const initialValues = {
    username: "",
    password: "",
  };

  const handleMutationResult = (result: IAuthResult): void => {
    if (result.tokenAuth.success) {
      // It is a potential security vulnerability to store tokens in localstorage
      // but it's good enough for practice
      const token = result.tokenAuth.token;
      const refreshToken = result.tokenAuth.refreshToken;
      localStorage.setItem('token', token);
      localStorage.setItem('refreshToken', refreshToken);
      navigate(0);
      handleClose();
    } else if (result.tokenAuth.errors) {
      ToastMsg(result.tokenAuth.errors.nonFieldErrors[0].message);
    };
  };

  const handleCreateError = (): void => {
    ToastMsg("Error logging in, please try again");
  };

  const [authUser] = useMutation<IAuthResult>(GET_USER_TOKEN,
    {
      onCompleted: handleMutationResult,
      onError: handleCreateError,
    }
  );

  const handleSubmit = useCallback(
    (values: {
      username: string;
      password: string;
    }): void => {
      void authUser({
        variables: {
          username: values.username,
          password: values.password,
        },
      });
    },
    [authUser]
  );

  const [showModal, setShowModal] = useState(false);

  const handleClose = () => {
    setShowModal(false);
  };

  const handleShowModal = () => setShowModal(true);

  return(
    <React.Fragment>
      <CustomButton
        onClick={handleShowModal}
        style="generic"
      >
        {"LOG IN"}
      </CustomButton>
      <Modal show={showModal} onHide={handleClose}>
        <Modal.Header closeButton>
          <Modal.Title>{"LOGIN"}</Modal.Title>
        </Modal.Header>
        <Modal.Body>
        <Formik
            initialValues={initialValues}
            onSubmit={handleSubmit}
          >
            {({
              dirty,
            }) => (
              <Form>
                <div>
                  <Field
                    className="login-input"
                    name="username"
                    placeholder="Username"
                    type="text"
                  />
                  <ErrorMessage name="username" component="div" />
                  <Field
                    className="login-input"
                    name="password"
                    placeholder="Password"
                    type="password"
                  />
                  <ErrorMessage name="password" component="div" />
                </div>
                <CustomButton
                  disabled={!dirty}
                  onClick={handleClose}
                  type="submit"
                >
                  {"LOG IN"}
                </CustomButton>
              </Form>
            )}
          </Formik>
        </Modal.Body>
      </Modal>
    </React.Fragment>
  )
}
  
export { Login };
