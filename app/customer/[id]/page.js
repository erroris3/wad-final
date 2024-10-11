export default async function Home({ params }) {
  const API_BASE = process.env.NEXT_PUBLIC_API_URL;
  const PUBLIC_URL = process.env.NEXT_PUBLIC_URL;
  // const id = params.id;
  const data = await fetch(`${PUBLIC_URL}${API_BASE}/customer/${params.id}`, {
    cache: "no-store",
  });
  const customer = await data.json();
  console.log({ customer });

  function formatTimestamp(isoTimestamp) {
    const date = new Date(isoTimestamp);

    // Format date parts
    const options = {
      day: "numeric",
      year: "numeric",
      month: "long",
    };

    return date.toLocaleString("en-US", options);
  }

  return (
    <div className="m-4">
      <h1>Customer</h1>
      <p className="text-xl font-bold text-blue-800">{customer.name}</p>{" "}
      <p>Date of birth: {formatTimestamp(customer.dof)}</p>
      <p>Member Number: {customer.memberid}</p>
      <p>Interests: {customer.interests}</p>
    </div>
  );
}
