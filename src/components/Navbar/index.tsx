import {
  useMutation,
  useQuery
} from "@apollo/client";
import {
  Formik,
  Form,
  Field,
  ErrorMessage
} from "formik";
import jwt_decode from "jwt-decode";
import React, { useCallback, useState } from "react";
import { Modal } from "react-bootstrap";
import { useNavigate } from "react-router-dom";

import "./index.css";
import { CustomButton } from "components/Buttons"
import { Login } from "components/Login";
import { CREATE_POST_MUTATION,
  CREATE_TOPIC_MUTATION,
  GET_ALL_TOPIC_NAMES
} from "components/Navbar/queries";
import {
  ICreatePostResult,
  ICreateTopicResult,
  IGetAllTopicNamesResult,
  IUserInfo
} from "components/Navbar/types";
import { Signup } from "components/Signup";
import { ToastMsg } from "components/ToastMsg";

const Navbar: React.FC = (): JSX.Element => {
  const navigate = useNavigate();
  const nPostInitialValues = {
    title: "",
    content: "",
    author: "",
    parentTopic: "",
  };
  const nTopicInitialValues = {
    name: "",
    description: "",
  };

  const handleQueryError = (): void => {
    ToastMsg("Error getting topic names");
  };

  const { data } = useQuery<IGetAllTopicNamesResult>(GET_ALL_TOPIC_NAMES, {
    onError: handleQueryError,
  });

  const handleCreateTopicResult = (result: ICreateTopicResult): void => {
    if (result.createTopic.success) {
      handleClose();
      ToastMsg("Topic created successfully");
      setTimeout(() => {navigate(0)}, 2000);
    };
  };

  const handleCreateTopicError = (): void => {
    ToastMsg("Error creating topic, please try again");
  };

  const [createTopic] = useMutation(CREATE_TOPIC_MUTATION,
    {
      onCompleted: handleCreateTopicResult,
      onError: handleCreateTopicError,
    });

  const handleTopicSubmit = useCallback(
    (values: {
      name: string;
      description: string;
    }): void => {
      void createTopic({
        variables: {
          name: values.name,
          description: values.description,
        },
      });
    },
    [createTopic]
  );

  const handleCreatePostResult = (result: ICreatePostResult): void => {
    if (result.createPost.success) {
      handleClose();
      ToastMsg("Post created successfully");
      setTimeout(() => {navigate(0)}, 2000);
    };
  };

  const handleCreatePostError = (): void => {
    ToastMsg("Error creating post, please try again");
  };

  const [createPost] = useMutation(CREATE_POST_MUTATION,
    {
      onCompleted: handleCreatePostResult,
      onError: handleCreatePostError,
    });

  const handlePostSubmit = useCallback(
    (values: {
      title: string;
      content: string;
      author: string;
      parentTopic: string;
    }): void => {
      const token = localStorage.getItem("token");
      if (token) {
        const userInfo: IUserInfo = jwt_decode(token);
        void createPost({
          variables: {
            title: values.title,
            content: values.content,
            author: userInfo.username,
            parentTopic: values.parentTopic,
          },
        });
      } else {
        ToastMsg("In order to post you must log in");
      };
    },
    [createPost]
  );

  const onClickUser = () => navigate("/user");
  const onClickHome = () => navigate("/"); 
  const onClickLogout = () => {
    localStorage.clear();
    navigate(0);
  };

  const [showNPostModal, setShowNPostModal] = useState(false);
  const [showNTopicModal, setShowNTopicModal] = useState(false);

  const handleClose = () => {
    setShowNPostModal(false);
    setShowNTopicModal(false);
  };

  const handleShowNPostModal = () => setShowNPostModal(true);
  const handleShowNTopicModal = () => setShowNTopicModal(true);

  return(
    <React.Fragment>
      <div className="navbar-container">
        <a href="/" className="logo">
          <img
          src="/long-logo.svg"
          width="170"
          height="125"
          alt="Clone Logo"
          />
        </a>
        <CustomButton
          onClick={handleShowNPostModal}
          style="generic"
        >
          {"NEW POST"}
        </CustomButton>
        <Modal show={showNPostModal} onHide={handleClose}>
          <Modal.Header closeButton>
            <Modal.Title>{"NEW POST"}</Modal.Title>
          </Modal.Header>
          <Modal.Body>
          <Formik
              initialValues={nPostInitialValues}
              onSubmit={handlePostSubmit}
            >
              {({
                dirty,
              }) => (
                <Form>
                  <div>
                    <Field
                      as="select"
                      className="form-input"
                      name="parentTopic"
                    >
                      <option>{"Select a topic"}</option>
                      {data?.topics.map(topic => (
                        <option key={topic.id} value={topic.id}>
                          {topic.name}
                        </option>
                      ))}
                    </Field>
                    <br />
                    <Field
                      className="form-input"
                      name="title"
                      placeholder="title"
                    />
                    <ErrorMessage name="title" component="div" />
                    <Field
                      className="form-input"
                      component="textarea"
                      rows="10"
                      cols="40"
                      name="content"
                      placeholder="Write your post here"
                    />
                    <ErrorMessage name="content" component="div" />
                  </div>
                  <CustomButton
                    disabled={!dirty}
                    type="submit"
                  >
                    {"Submit"}
                  </CustomButton>
                </Form>
              )}
            </Formik>
          </Modal.Body>
        </Modal>
        <CustomButton
          onClick={handleShowNTopicModal}
          style="generic"
        >
          {"NEW TOPIC"}
        </CustomButton>
        <Modal show={showNTopicModal} onHide={handleClose}>
          <Modal.Header closeButton>
            <Modal.Title>{"NEW TOPIC"}</Modal.Title>
          </Modal.Header>
          <Modal.Body>
          <Formik
              initialValues={nTopicInitialValues}
              onSubmit={handleTopicSubmit}
            >
              {({
                dirty,
              }) => (
                <Form>
                  <div>
                    <Field
                      className="form-input"
                      name="name"
                      placeholder="Topic name"
                    />
                    <ErrorMessage name="name" component="div" />
                    <Field
                      className="form-input"
                      component="textarea"
                      rows="5"
                      cols="40"
                      name="description"
                      placeholder="Describe the topic"
                    />
                    <ErrorMessage name="description" component="div" />
                  </div>
                  <CustomButton
                    disabled={!dirty}
                    type="submit"
                  >
                    {"Submit"}
                  </CustomButton>
                </Form>
              )}
            </Formik>
          </Modal.Body>
        </Modal>
        <div className="navbar-buttons-container">
          {localStorage.getItem("token") ?
            <React.Fragment>
              <CustomButton 
                onClick={onClickHome}
                style="user-buttons"
              >
                <img 
                  src="/home.svg"
                  width="20"
                  height="20"
                  alt="Home Icon"
                />
              </CustomButton>
              <CustomButton
                onClick={onClickUser}
                style="user-buttons"
              >
                <img 
                  src="/userpage.svg"
                  width="20"
                  height="20"
                  alt="Home Icon"
                />
              </CustomButton>
              <CustomButton
                onClick={onClickLogout}
                style="user-buttons"
              >
                <img 
                  src="/settings.svg"
                  width="23"
                  height="23"
                  alt="Home Icon"
                />
              </CustomButton>
            </React.Fragment> :
            <React.Fragment>
              <Login /><Signup />
            </React.Fragment>}
          <CustomButton style="moon">
            <img
              src="/moon.svg"
              width="20"
              height="20"
              alt="Moon Icon"
            />
          </CustomButton>
        </div>
      </div>
    </React.Fragment>
  )
}

export { Navbar };
