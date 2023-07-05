"use client";

import { FormEventHandler, FormEvent, useState } from "react";
import { useFormFields } from "../../lib/hooks";
import { NextPage } from "next";
import styles from "../../styles/Login.module.css";
import Loading from "./loading";
import { onError } from "../../lib/error";
import { Auth } from "aws-amplify";
import { useAppContext } from "../../lib/appContext";
import { CognitoUser } from "@aws-amplify/auth";
import { useRouter } from "next/navigation";

type SignupFields = {
  email: string;
  password: string;
  confirmPassword: string;
  confirmationCode: string;
};
type NewUser = CognitoUser | null;
const Signup: NextPage = (props: any) => {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [fields, handleFieldChanged] = useFormFields<SignupFields>({
    email: "",
    password: "",
    confirmPassword: "",
    confirmationCode: "",
  });

  const [newUser, setNewUser] = useState<NewUser>(null);

  const { isAuthenticated } = useAppContext();

  function validateForm() {
    return (
      fields.email.length! > 0 &&
      fields.password.length! > 0 &&
      fields.confirmPassword === fields.password
    );
  }

  function validateConfirmationForm() {
    return fields.confirmationCode.length > 0;
  }

  const handleSignupSubmit: FormEventHandler<HTMLFormElement> = async (
    e: FormEvent<HTMLFormElement>
  ) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      const { user } = await Auth.signUp({
        username: fields.email,
        password: fields.password,
        autoSignIn: {
          enabled: true,
        },
      });
      setNewUser(user);
    } catch (error) {
      onError(error as Error);
    }
    setIsLoading(false);
  };
  const handleConfirmationSubmit: FormEventHandler<HTMLFormElement> = async (
    e: FormEvent<HTMLFormElement>
  ) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      await Auth.confirmSignUp(fields.email, fields.confirmationCode);
      await Auth.signIn({ username: fields.email, password: fields.password });
      router.push("/");
    } catch (error) {
      onError(error as Error);
    }
    setIsLoading(false);
  };

  const renderConfirmationForm = () => {
    return (
      <form className={styles.form} onSubmit={handleConfirmationSubmit}>
        <label className={styles.formLabel} htmlFor="confirmationCode">
          Enter Code
        </label>
        <input
          autoFocus
          type="tel"
          className={styles.formInput}
          id="confirmationCode"
          onChange={handleFieldChanged}
        />
        {!isLoading ? (
          <button
            className={styles.button}
            type="submit"
            id="submit"
            disabled={!validateConfirmationForm()}
          >
            Verify
          </button>
        ) : (
          <Loading />
        )}
      </form>
    );
  };
  const renderForm = () => {
    return (
      <form className={styles.form} onSubmit={handleSignupSubmit}>
        <label className={styles.formLabel} htmlFor="email">
          e-mail
        </label>
        <input
          className={styles.formInput}
          id="email"
          type="email"
          onChange={handleFieldChanged}
          required
          autoFocus
        />
        <label className={styles.formLabel} htmlFor="password">
          Password
        </label>
        <input
          className={styles.formInput}
          id="password"
          type="password"
          onChange={handleFieldChanged}
          required
        />
        <label className={styles.formLabel} htmlFor="confirmPassword">
          Confirm Password
        </label>
        <input
          className={styles.formInput}
          id="confirmPassword"
          type="password"
          onChange={handleFieldChanged}
          required
        />

        {!isLoading ? (
          <button
            className={styles.button}
            type="submit"
            id="submit"
            disabled={!validateForm()}
          >
            Sign Up
          </button>
        ) : (
          <Loading />
        )}
      </form>
    );
  };

  return (
    <div className={styles.Login}>
      {newUser === null ? renderForm() : renderConfirmationForm()}
    </div>
  );
};
export default Signup;
