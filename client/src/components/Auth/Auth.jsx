import { useNavigate } from "react-router-dom";
import { client } from "../../util/client";
import { toast } from "react-toastify";
import { useQuery, useMutation, useQueryClient } from "react-query";
import { useForm } from "react-hook-form";

const login = async ({ email, password }) => {
  const userData = await client.users.authViaEmail(email, password);
  return userData;
};

const signup = async ({ email, password }) => {
  const userData = await client.users.create({
    email,
    password,
    passwordConfirm: password,
  });
  return userData;
};

function Auth() {
  const navigate = useNavigate();
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();
  const queryClient = useQueryClient();
  const { isLoading, mutate: mutateUser } = useMutation(
    async ({ data, type }) => {
      if (type == "login") await login(data);
      if (type == "signup") await signup(data);
    },
    {
      onSuccess: () => {
        queryClient.invalidateQueries(["visits"]);
        toast.success("logged in");
        navigate("/visits");
      },
      onError: (error) => {
        toast.error(error.message);
      },
    }
  );
  const onSubmit = async (data) => {
    const buttonType = window.event.submitter.name;
    mutateUser({ data, type: buttonType });
  };

  return (
    <>
      <section>
        <article className="grid">
          <div>
            <hgroup>
              <h1>Login / Sign Up</h1>
              <h2>Create a user or login with existing user</h2>
            </hgroup>
            <form onSubmit={handleSubmit(onSubmit)}>
              <fieldset>
                <label htmlFor="title">
                  Email
                  <input
                    type="text"
                    name="email"
                    placeholder="test@gmail.com"
                    aria-label="Email"
                    autoComplete="email"
                    {...register("email", {
                      required: true,
                    })}
                  />
                </label>
              </fieldset>
              <fieldset>
                <label htmlFor="title">
                  Password
                  <input
                    type="password"
                    name="Password"
                    aria-label="Password"
                    autoComplete="password"
                    {...register("password", {
                      required: true,
                    })}
                  />
                </label>
              </fieldset>

              <button type="submit" className="contrast" name="login">
                Login
              </button>
              <button type="submit" className="contrast" name="signup">
                Sign up
              </button>
            </form>
          </div>
        </article>
      </section>
    </>
  );
}

export default Auth;
