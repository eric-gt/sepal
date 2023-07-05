"use client";
import { NextPage } from "next";
import { FormEvent, useState } from "react";
import { Auth } from "aws-amplify";
import styles from "../../styles/Login.module.css";
import { useAppContext } from "../../lib/appContext";
import { useRouter } from "next/navigation";
import Loading from "./loading";
import { onError } from "../../lib/error";
import { useFormFields } from "../../lib/hooks";

type LoginInfo = {
  email: string;
  password: string;
};
const Login: NextPage = (props: any) => {
  const [isLoading, setIsLoading] = useState(false);
  const [fields, handleFieldChanged] = useFormFields<LoginInfo>({
    email: "",
    password: "",
  });
  const { login } = useAppContext();
  const router = useRouter();

  function validateForm() {
    return fields.email.length > 0 && fields.password.length > 0;
  }

  async function handleSubmit(e: FormEvent<HTMLElement>): Promise<void> {
    e.preventDefault();
    setIsLoading(true);
    console.log(Auth.configure());
    try {
      await Auth.signIn(fields.email, fields.password);
      login();
      router.push("/");
    } catch (e: unknown) {
      onError(e as Error);
      setIsLoading(false);
    }
  }

  return (
    <div className={styles.Login}>
      <form
        className={styles.form}
        action="onSubmit"
        method="post"
        onSubmit={handleSubmit}
      >
        <label className={styles.formLabel} htmlFor="email">
          Email
        </label>
        <input
          className={styles.formInput}
          type="email"
          id="email"
          onChange={handleFieldChanged}
          required
        />
        <label className={styles.formLabel} htmlFor="password">
          Password
        </label>
        <input
          className={styles.formInput}
          type="password"
          id="password"
          onChange={handleFieldChanged}
          required
        />

        {!isLoading ? (
          <button
            className={styles.button}
            type="submit"
            disabled={!validateForm()}
          >
            Submit
          </button>
        ) : (
          <Loading />
        )}
      </form>
    </div>
  );
};

export default Login;
