import { useForm } from "react-hook-form";
import { useQuery, useMutation, useQueryClient } from "react-query";
import { client } from "../../util/client";
import { toast } from "react-toastify";

const getVisits = async () => {
  const result = await client.records.getFullList("visits", 200, {
    sort: "-date",
  });
  return result;
};

const createVisit = async (visit) => {
  await client.records.create("visits", visit);
};

function App() {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();
  const visits = useQuery("visits", getVisits);
  const queryClient = useQueryClient();
  const { isLoading, mutate: mutateVisit } = useMutation(
    (data) => createVisit({ ...data, userId: client.authStore.model.id }),
    {
      onSuccess: () => {
        queryClient.invalidateQueries(["visits"]);
        toast.success("Created");
      },
      onError: (error) => {
        console.error(error);
        toast.error(error.message);
      },
    }
  );
  const onSubmit = async (data) => {
    mutateVisit(data);
  };

  return (
    <>
      <div>
        <section id="tables">
          <form onSubmit={handleSubmit(onSubmit)}>
            <fieldset>
              <label htmlFor="title">
                Title
                <input
                  {...register("title", {
                    required: true,
                  })}
                  type="title"
                  name="title"
                  placeholder="Title"
                  aria-label="Title"
                />
              </label>
            </fieldset>
            <fieldset>
              <label htmlFor="date">
                Date
                <input
                  {...register("date")}
                  type="date"
                  name="date"
                  placeholder="Date"
                  aria-label="Date"
                  required
                />
              </label>
            </fieldset>
            <fieldset>
              <label htmlFor="country">
                Country
                <input
                  {...register("country")}
                  type="country"
                  name="country"
                  aria-label="Country"
                  required
                />
              </label>
            </fieldset>
            <fieldset>
              <label htmlFor="description">
                Description
                <input
                  {...register("description")}
                  type="description"
                  name="description"
                  placeholder="Description"
                  aria-label="Description"
                  required
                />
              </label>
            </fieldset>
            <button
              type="submit"
              className="contrast"
              disabled={isLoading}
              aria-busy={isLoading}
            >
              Create
            </button>
          </form>
          {visits.status === "error" && <p>Error fetching data</p>}
          {visits.status === "loading" && <p>Fetching data...</p>}
          {visits.status === "success" && (
            <figure>
              <table role="grid">
                <thead>
                  <tr>
                    <th scope="col">#</th>
                    <th scope="col">Date</th>
                    <th scope="col">Title</th>
                  </tr>
                </thead>
                <tbody>
                  {visits.data.map((visit, i) => (
                    <tr key={visit.id}>
                      <th scope="row">{i + 1}</th>
                      <td>{visit.date}</td>
                      <td>{visit.title}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </figure>
          )}
        </section>
      </div>
    </>
  );
}

export default App;
