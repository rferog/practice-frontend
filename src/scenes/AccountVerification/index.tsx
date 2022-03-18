import { gql, useMutation } from "@apollo/client";
import React, { useEffect, useState } from "react";
import { useParams } from "react-router";

interface IVerifyAccount {
  verifyAccount: {
    success: Boolean,
    errors: {
      nonFieldErrors: [
        {
          message: String,
          code: String,
        }
      ],
    };
  };
};

const VERIFY_ACCOUNT_MUTATION = gql`
  mutation verifyAccountMutation (
    $token: String!
  ) {
    verifyAccount (
      token: $token
    ) {
      success,
      errors
    }
  }`;

const AccountVerification: React.FC = () => {
  const { verificationToken } = useParams();

  const [verifyUser, { loading }] = useMutation<IVerifyAccount>(
    VERIFY_ACCOUNT_MUTATION
  );
  const [success, setSuccess] = useState(false);

  useEffect(() => {
      verifyUser({
        variables: {
          token: verificationToken
        }
      }).then(activationResult => {
        if (activationResult.data?.verifyAccount.success) {
          setSuccess(true);
        }
      }).catch(error => {
        console.log(error);
        setSuccess(false);
      })
  }, [setSuccess, verificationToken, verifyUser]);

  if (loading) {
    return(
      <React.Fragment>
        <div className="default-post-container">
          {"Verifying..."}
        </div>
      </React.Fragment>
    )
  };
   
  return (
    <div className="default-post-container">
      {success ?
        "Account has been verified" :
        "Account could not be verified"
      }
    </div>
  );
}

export { AccountVerification };
